module.exports = [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2025,
            sourceType: 'script',
            globals: {
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly',
                alert: 'readonly',
                Blob: 'readonly',
                URL: 'readonly'
            }
        },
        rules: {
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-unused-vars': 'warn',
            'no-var': 'warn',
            'prefer-const': 'warn',
            'eqeqeq': ['error', 'always'],
            'complexity': ['warn', 10],
            'max-lines-per-function': ['warn', {max: 50}]
        }
    }
];
