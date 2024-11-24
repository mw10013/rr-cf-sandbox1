import { $, fs } from 'zx'

//  Reset the preview d1 database violently, run migrations and seed.
//  pnpm -F app script scripts/d1-reset-preview.ts

const database_name = 'langapp-d1-preview'
const appWranglerPath = './wrangler.toml'
const workerWranglerPath = './../worker/wrangler.toml'

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
await patchWranglerToml(workerWranglerPath)

await $`pnpm d1:migrate:apply:preview`
await $`pnpm d1:seed:preview`