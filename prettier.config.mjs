// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  singleQuote: true,
  bracketSameLine: true,
  bracketSpacing: true,
  arrowParens: 'always',
  trailingComma: 'es5',

  // https://github.com/IanVS/prettier-plugin-sort-imports
  importOrder: [
    '<TYPES>^(node:)',
    '<TYPES>',
    '<TYPES>^[.]',
    '^(react/(.*)$)|^(react$)',
    '<THIRD_PARTY_MODULES>',
    '^~/(.*)$',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.3.3',

  // https://github.com/prettier/prettier-vscode/issues/3248: "prettier.documentSelectors": ["**/*.sql"]
  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss
  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/59
  tailwindConfig: 'tailwind.config.ts',
  plugins: [
    'prettier-plugin-sql',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  overrides: [
    {
      files: ['*.sql'],
      // https://github.com/un-ts/prettier/tree/master/packages/sql#parser-options
      // https://github.com/sql-formatter-org/sql-formatter/tree/master/docs
      options: {
        // https://github.com/sql-formatter-org/sql-formatter/blob/master/docs/language.md#impact-on-bundle-size
        language: 'sqlite',
        // dialect: "sqlite",
        keywordCase: 'lower',
      },
    },
  ],
}

export default config
