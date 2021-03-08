module.exports = {
    globals: {
        __PATH_PREFIX__: true
    },
    env: {
        es6: true,
        browser: true,
        node: true
    },
    extends: [
        'airbnb/base',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint',
        'babel',
        'import',
        'prettier'
    ],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/no-unused-vars': [2, { args: 'none' }]
            }
        }
    ],
    rules: {
        'indent': ['error', 4],
        'no-alert': 'error',
        'no-param-reassign': 'off',
        'no-underscore-dangle': 'off',
        // 'no-tabs': ['error', { allowIndentationTabs: true }],
        'no-tabs': 'off',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'comma-dangle': ['error', 'never'],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'padded-blocks': ['off', { classes: 'always', switches: 'never' }],
        'prefer-destructuring': 'off',
        'object-curly-newline': [
            'off',
            {
                ObjectExpression: {
                    multiline: true,
                    minProperties: 3,
                    consistent: true
                },
                ObjectPattern: {
                    multiline: true,
                    minProperties: 3,
                    consistent: true
                },
                ImportDeclaration: 'never'
            }
        ],
        'class-methods-use-this': 'off',
        'arrow-body-style': ['error', 'as-needed'],
        'no-useless-escape': 'off',
        'typescript/no-unused-vars': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never'
            }
        ]
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts']
            }
        }
    }
};
