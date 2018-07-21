/**
 * / Include parentheses around a sole arrow function parameter
  "prettier.arrowParens": "avoid",

  // Controls the printing of spaces inside object literals
  "prettier.bracketSpacing": true,

  // A list of languages IDs to disable this extension on
  "prettier.disableLanguages": [
    "vue"
  ],

  // Use 'prettier-eslint' instead of 'prettier'. Other settings will only be fallbacks in case they could not be inferred from eslint rules.
  "prettier.eslintIntegration": false,

  // Path to a .prettierignore or similar file
  "prettier.ignorePath": ".prettierignore",

  // If true, puts the `>` of a multi-line jsx element at the end of the last line instead of being alone on the next line
  "prettier.jsxBracketSameLine": false,

  // Override the parser. You shouldn't have to change this setting.
  "prettier.parser": "babylon",

  // Fit code within this line limit
  "prettier.printWidth": 80,

  // (Markdown) wrap prose over multiple lines
  "prettier.proseWrap": "preserve",

  // Require a 'prettierconfig' to format
  "prettier.requireConfig": false,

  // Whether to add a semicolon at the end of every line
  "prettier.semi": true,

  // If true, will use single instead of double quotes
  "prettier.singleQuote": false,

  // Use 'prettier-stylelint' instead of 'prettier'. Other settings will only be fallbacks in case they could not be inferred from stylelint rules.
  "prettier.stylelintIntegration": false,

  // Number of spaces it should use per tab
  "prettier.tabWidth": 2,

  // Controls the printing of trailing commas wherever possible.
  //  Valid options:
  //     'none' - No trailing commas
  //     'es5' - Trailing commas where valid in ES5 (objects, arrays, etc)
  //     'all' - Trailing commas wherever possible (function arguments)
  "prettier.trailingComma": "none",

  // Indent lines with tabs
  "prettier.useTabs": false

 */

module.exports = {
    tabWidth: 4,
    eslintIntegration: true,
    ignorePath: '.prettierignore',
    singleQuote: true,
    printWidth: 80,
    trailingComma: 'all',
    // parser: "flow"
};
