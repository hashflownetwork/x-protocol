module.exports = {
    singleQuote: true,
    plugins: ['prettier-plugin-solidity'],
    overrides: [
        {
            files: '*.sol',
            options: {
                parser: 'solidity-parse',
                printWidth: 80,
                tabWidth: 4,
                useTabs: false,
                singleQuote: true,
                bracketSpacing: false,
            },
        },
    ],
};