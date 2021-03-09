// module.exports = {
//     globals: { __PATH_PREFIX__: true },
//     env: {
//         es6: true,
//         browser: true,
//         node: true
//     },
//     parser: '@typescript-eslint/parser',
//     parserOptions: {
//         ecmaVersion: 2018,
//         sourceType: 'module'
//     },
//     extends: [
//         'airbnb-base',
//         'airbnb-base/whitespace',
//         'plugin:@typescript-eslint/eslint-recommended',
//         'plugin:unicorn/recommended',
//         'plugin:aerisweather/recommended'
//     ],
//     plugins: ['@typescript-eslint', 'import', 'aerisweather'],
//     rules: {
//         'indent': ['error', 4, { SwitchCase: 1 }],
//         'max-len': [
//             'error',
//             {
//                 code: 120,
//                 ignoreUrls: true
//             }
//         ],
//         'no-alert': 'error',
//         'no-console': ['error', { allow: ['warn', 'error'] }],
//         'no-param-reassign': 'off',
//         'no-underscore-dangle': 'off',
//         'no-use-before-define': 'off',
//         'no-undef': 'off',

//         // style
//         'comma-dangle': ['error', 'never'],
//         'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
//         'padded-blocks': [
//             'error',
//             {
//                 blocks: 'never',
//                 classes: 'never',
//                 switches: 'never'
//             }
//         ],
//         'padding-line-between-statements': [
//             'error',
//             {
//                 blankLine: 'always',
//                 prev: '*',
//                 next: ['return', 'if', 'switch', 'export', 'for']
//             }
//         ],
//         'quote-props': ['error', 'consistent'],
//         'arrow-body-style': ['error', 'as-needed'],
//         'array-bracket-newline': ['error', 'consistent'],
//         'array-element-newline': ['error', 'consistent'],
//         'object-curly-spacing': ['error', 'always'],
//         'object-curly-newline': [
//             'error',
//             {
//                 ObjectExpression: {
//                     multiline: true,
//                     minProperties: 3,
//                     consistent: true
//                 },
//                 ObjectPattern: {
//                     multiline: true,
//                     minProperties: 3,
//                     consistent: true
//                 },
//                 ImportDeclaration: 'never',
//                 ExportDeclaration: {
//                     multiline: true,
//                     minProperties: 3
//                 }
//             }
//         ],
//         'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
//         'class-methods-use-this': 'off',
//         'consistent-return': ['off', { treatUndefinedAsUnspecified: true }],
//         'import/prefer-default-export': 'off',
//         'import/no-default-export': 'off',

//         // unicorn
//         // https://github.com/sindresorhus/eslint-plugin-unicorn
//         'unicorn/no-array-for-each': 'off',
//         'unicorn/no-array-reduce': 'off',
//         'unicorn/filename-case': 'off',
//         'unicorn/prevent-abbreviations': ['error', { checkVariables: false }],

//         // aerisweather
//         'aerisweather/multiple-properties-destructuring': ['error', { minProperties: 5 }],

//         // typescript
//         '@typescript-eslint/no-explicit-any': 'off',
//         '@typescript-eslint/explicit-module-boundary-types': 'off',

//         'import/extensions': [
//             'error',
//             'ignorePackages',
//             {
//                 js: 'never',
//                 jsx: 'never',
//                 ts: 'never',
//                 tsx: 'never'
//             }
//         ]
//     },
//     settings: { 'import/resolver': { node: { extensions: ['.js', '.ts'] } } }
// };

module.exports = {
    globals: { __PATH_PREFIX__: true },
    env: {
        es6: true,
        browser: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    extends: ['plugin:@aerisweather/recommended'],
    plugins: ['@aerisweather']
};
