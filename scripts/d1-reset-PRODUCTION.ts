import { $, fs } from 'zx'

//  Reset the production d1 database violently, run migrations and seed.
//  pnpm -F app script scripts/d1-reset-PRODUCTION.ts
// TODO: Archive d1-reset-PRODUCTION.ts after go-live.

const database_name = 'rr-cf-sandbox1-d1-production'
const appWranglerPath = './wrangler.toml'

try {
  await $`pnpm wrangler d1 delete ${database_name} --skip-confirmation`
} catch (p) {
  console.error(`Ignoring execption: ${p}`)
}

const processOutput = await $`pnpm wrangler d1 create ${database_name}`

const databaseIdRegex = /database_id\s*=\s*"([a-f0-9-]+)"/
const match = processOutput.stdout.match(databaseIdRegex)
if (!match) throw new Error('database_id not matched in output')
const database_id = match[1]
console.log(`database_id: ${database_id}`)

async function patchWranglerToml(wranglerPath: string) {
  const wranglerToml = await fs.readFile(wranglerPath, 'utf8')
  const replaceDatabaseIdRegex = new RegExp(
    `(database_name = "${database_name}"\\s+database_id = ")[^"]+"`
  )
  const wranglerTomlEdited = wranglerToml.replace(
    replaceDatabaseIdRegex,
    `$1${database_id}"`
  )
  await fs.writeFile(wranglerPath, wranglerTomlEdited, 'utf8')
}

await patchWranglerToml(appWranglerPath)

await $`pnpm d1:migrate:apply:PRODUCTION`
// await $`pnpm d1:seed:PRODUCTION`
