const importConfig = require('eslint-plugin-import').configs.recommended;
const reactHooksConfig = require('eslint-plugin-react-hooks').configs.recommended;
const parser = require('@typescript-eslint/parser');

module.exports = [
    {
        languageOptions: {
            parser: parser,
            globals: {
                window: 'readonly',
                document: 'readonly',
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        ignores: ['dist', 'eslint.config.cjs'],
        plugins: {
            'react-refresh': require('eslint-plugin-react-refresh'),
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            import: require('eslint-plugin-import'),
            'react-hooks': require('eslint-plugin-react-hooks'),
        },
        rules: {
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                },
            ],
            ...importConfig.rules,
            ...reactHooksConfig.rules,
        },
    },
];