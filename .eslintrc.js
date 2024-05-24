module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        // 'plugin:vue/vue3-recommended',
        // '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'space-before-function-paren': [
            'error',
            'always'
        ],
        'newline-per-chained-call': [
            'error',
            {'ignoreChainWithDepth': 2}
        ],
        'brace-style': [
            'error',
            '1tbs',
            {'allowSingleLine': true}
        ],
        'indent': [
            'error',
            4,
            {'SwitchCase': 1}
        ],
        'semi': [
            'error',
            'always'
        ],
        'quotes': [
            'error',
            'single',
            {'avoidEscape': true}
        ],
        'max-len': [
            'warn',
            {'code': 160, 'ignoreComments': true}
        ],
    }
};
