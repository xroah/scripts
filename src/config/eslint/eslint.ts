import resolve from "../../utils/resolve.js"

export default function getESlintBaseConfig(
    react: Boolean,
    lintTS: boolean
) {
    const config: any = {
        env: {
            browser: true,
            es6: true,
            node: true
        },
        extends: [
            "eslint:recommended"
        ],
        globals: {
            Atomics: "readonly",
            SharedArrayBuffer: "readonly"
        },
        parserOptions: {
            ecmaFeatures: {
                jsx: true
            },
            ecmaVersion: 2018,
            sourceType: "module"
        },
        plugins: [],
        rules: {
            // require or disallow semicolons instead of ASI
            "semi": [2, "never"],
            // enforce consistent brace style for blocks, default 1tbs
            "brace-style": 2,
            // enforce the consistent use of either backticks, double, or single quotes
            "quotes": [2, "double"],
            // disallow the use of `console`
            "no-console": 1,
            // enforce consistent brace style for all control statements
            "curly": 2,
            // require the use of `===` and `!==`
            "eqeqeq": 2,
            // disallow `new` operators with the `Function` object
            "no-new-func": 2,
            // disallow initializing variables to `undefined`
            "no-undef-init": 2,
            // disallow unused variables
            "no-unused-vars": [2, {"args": "none"}],
            // disallow async functions which have no `await` expression
            "require-await": 2,
            // disallow variable declarations from shadowing variables declared in the outer scope
            "no-shadow": 1,
            // enforce camelcase naming convention
            "camelcase": 2,
            // require function names to match the name of the variable or property to which they are assigned
            "func-name-matching": 2,
            // require constructor names to begin with a capital letter
            "new-cap": 2,
            // require `let` or `const` instead of `var`
            "no-var": 2,
            // disallow unnecessary nested blocks
            "no-lone-blocks": 2,
            // enforce consistent line breaks inside braces
            "object-curly-newline": [2, {
                "ImportDeclaration": {
                    "multiline": true,
                    "minProperties": 3
                },
                "ExportDeclaration": {
                    "multiline": true,
                    "minProperties": 3
                }
            }],
            // enforce consistent spacing inside braces, default never
            "object-curly-spacing": 2,
            // enforce consistent line breaks inside braces
            "object-property-newline": 2,
            // disallow or enforce spaces inside of blocks after opening block and before closing block, default always
            "block-spacing": 2,
            // disallow `Object` constructors
            "no-new-object": 2,
            //disallow the use of `eval()`
            "no-eval": 2,
            // disallow labeled statements
            "no-labels": 2,
            // disallow the use of the `__proto__` property
            "no-proto": 2,
            // disallow multiple spaces
            "no-multi-spaces": 2,
            // require spread operators instead of `.apply()`
            "prefer-spread": 0,
            // enforce consistent indentation
            "indent": [2, 4],
            // equire rest parameters instead of `arguments`
            "prefer-rest-params": 0,
            // require `const` declarations for variables that are never reassigned after declared
            "prefer-const": 0,
            // require or disallow trailing commas
            "comma-dangle": 2,
            // enforce consistent spacing before and after commas
            "comma-spacing": 2,
            // enforce default clauses in switch statements to be last
            "default-case-last": 2,
            // enforce default parameters to be last
            "default-param-last": 1,
            // enforce a maximum number of classes per file
            "max-classes-per-file": [2, 1],
            // disallow the use of `alert`, `confirm`, and `prompt`
            "no-alert": 2,
            // disallow the use of `arguments.caller` or `arguments.callee`
            "no-caller": 2,
            // disallow extending native types
            "no-extend-native": 2,
            // disallow declarations in the global scope
            "no-implicit-globals": 2,
            // disallow function declarations that contain unsafe references inside loop statements
            "no-loop-func": 2,
            // disallow `new` operators with the `String`, `Number`, and `Boolean` objects
            "no-new-wrappers": 2,
            // enforce consistent comma style, default last
            "comma-style": 2,
            // require or disallow spacing between function identifiers and their invocations, default never
            "func-call-spacing": 2,
            // enforce consistent spacing between keys and values in object literal properties
            // default before colon: false, afterColon: true
            "key-spacing": 2,
            // enforce the consistent use of either double or single quotes in JSX attributes, default prefer-double
            "jsx-quotes": 2,
            // enforce or disallow parentheses when invoking a constructor with no arguments, default always
            "new-parens": 2,
            // disallow trailing whitespace at the end of lines
            "no-trailing-spaces": 2,
            // disallow specified syntax
            "no-restricted-syntax": [2, "WithStatement"]
        },
        "settings": {}
    }
    const noUseRule = [2, {functions: false}]

    if (lintTS) {
        config.parser = resolve("@typescript-eslint/parser")

        config.extends.push("plugin:@typescript-eslint/eslint-recommended")
        config.plugins.push("@typescript-eslint")
        // no-use-before-define may cause: 'React' was used before it was defined
        config.rules["@typescript-eslint/no-use-before-define"] = noUseRule
    } else {
        // disallow the use of variables before they are defined
        config.rules["no-use-before-define"] = noUseRule
    }

    if (react) {
        config.settings.react = {
            "version": "detect"
        }

        config.extends.push("plugin:react/recommended")
        config.plugins.push("react")
    }

    return config
}