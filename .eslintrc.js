module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [`eslint:recommended`, "prettier"],
    parserOptions: {
        ecmaVersion: 13,
        sourceType: `module`
    },
    rules: {
        "no-async-promise-executor": `off`,
        "function-paren-newline": `off`,
        "no-unused-vars": `off`
    }
};
