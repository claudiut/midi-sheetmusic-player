// meteor npm i --save-dev eslint eslint-config-airbnb@latest eslint@4.19.1 eslint-plugin-import@2.12.0 eslint-plugin-jsx-a11y@6.0.3 eslint-plugin-react@7.9.1

module.exports = {
    extends: ['airbnb', 'prettier'], // extending recommended config and config derived from eslint-config-prettier
    plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
    rules: {
        quotes: ['error', 'single'],
        'arrow-body-style': ['error', 'as-needed'],
        'import/no-unresolved': ['off'],
        'prettier/prettier': [
            // customizing prettier rules (unfortunately not many of them are customizable)
            'error',
            {
                // singleQuote: true,
                // trailingComma: 'all',
            },
        ],
        eqeqeq: ['error', 'always'], // adding some custom ESLint rules
    },
    env: {
        browser: true,
    },
};
