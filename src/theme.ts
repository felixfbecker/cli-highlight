import { Chalk, default as _chalk, Level } from 'chalk'

// Always enable at least basic color support, even if not auto-detected
const chalk = new _chalk.Instance({ level: Math.min(_chalk.level, Level.Basic) })

/**
 * A generic interface that holds all available language tokens.
 */
export interface Tokens<T> {
    /**
     * keyword in a regular Algol-style language
     */
    keyword?: T

    /**
     * built-in or library object (constant, class, function)
     */
    built_in?: T

    /**
     * user-defined type in a language with first-class syntactically significant types, like Haskell
     */
    type?: T

    /**
     * special identifier for a built-in value ("true", "false", "null")
     */
    literal?: T

    /**
     * number, including units and modifiers, if any.
     */
    number?: T

    /**
     * literal regular expression
     */
    regexp?: T

    /**
     * literal string, character
     */
    string?: T

    /**
     * parsed section inside a literal string
     */
    subst?: T

    /**
     * symbolic constant, interned string, goto label
     */
    symbol?: T

    /**
     * class or class-level declaration (interfaces, traits, modules, etc)
     */
    class?: T

    /**
     * function or method declaration
     */
    function?: T

    /**
     * name of a class or a function at the place of declaration
     */
    title?: T

    /**
     * block of function arguments (parameters) at the place of declaration
     */
    params?: T

    /**
     * comment
     */
    comment?: T

    /**
     * documentation markup within comments
     */
    doctag?: T

    /**
     * flags, modifiers, annotations, processing instructions, preprocessor directive, etc
     */
    meta?: T

    /**
     * keyword or built-in within meta construct
     */
    'meta-keyword'?: T

    /**
     * string within meta construct
     */
    'meta-string'?: T

    /**
     * heading of a section in a config file, heading in text markup
     */
    section?: T

    /**
     * XML/HTML tag
     */
    tag?: T

    /**
     * name of an XML tag, the first word in an s-expression
     */
    name?: T

    /**
     * s-expression name from the language standard library
     */
    'builtin-name'?: T

    /**
     * name of an attribute with no language defined semantics (keys in JSON, setting names in .ini), also sub-attribute within another highlighted object, like XML tag
     */
    attr?: T

    /**
     * name of an attribute followed by a structured value part, like CSS properties
     */
    attribute?: T

    /**
     * variable in a config or a template file, environment var expansion in a script
     */
    variable?: T

    /**
     * list item bullet in text markup
     */
    bullet?: T

    /**
     * code block in text markup
     */
    code?: T

    /**
     * emphasis in text markup
     */
    emphasis?: T

    /**
     * strong emphasis in text markup
     */
    strong?: T

    /**
     * mathematical formula in text markup
     */
    formula?: T

    /**
     * hyperlink in text markup
     */
    link?: T

    /**
     * quotation in text markup
     */
    quote?: T

    /**
     * tag selector in CSS
     */
    'selector-tag'?: T

    /**
     * #id selector in CSS
     */
    'selector-id'?: T

    /**
     * .class selector in CSS
     */
    'selector-class'?: T

    /**
     * [attr] selector in CSS
     */
    'selector-attr'?: T

    /**
     * :pseudo selector in CSS
     */
    'selector-pseudo'?: T

    /**
     * tag of a template language
     */
    'template-tag'?: T

    /**
     * variable in a template language
     */
    'template-variable'?: T

    /**
     * added or changed line in a diff
     */
    addition?: T

    /**
     * deleted line in a diff
     */
    deletion?: T
}

/**
 * Possible styles that can be used on a token in a JSON theme.
 * See the [chalk](https://github.com/chalk/chalk) module for more information.
 * `plain` means no styling.
 */
export type Style =
    | 'reset'
    | 'bold'
    | 'dim'
    | 'italic'
    | 'underline'
    | 'inverse'
    | 'hidden'
    | 'strikethrough'
    | 'black'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'
    | 'gray'
    | 'bgBlack'
    | 'bgRed'
    | 'bgGreen'
    | 'bgYellow'
    | 'bgBlue'
    | 'bgMagenta'
    | 'bgCyan'
    | 'plain'

/**
 * The schema of a JSON file defining a custom scheme. The key is a language token, while the value
 * is a [chalk](https://github.com/chalk/chalk#styles) style.
 *
 * Example:
 * ```json
 * {
 *     "keyword": ["red", "bold"],
 *     "addition": "green",
 *     "deletion": ["red", "strikethrough"],
 *     "number": "plain"
 * }
 * ```
 */
export interface JsonTheme extends Tokens<Style | Style[]> {}

/**
 * Passed to [[highlight]] as the `theme` option. A theme is a map of language tokens to a function
 * that takes in string value of the token and returns a new string with colorization applied
 * (typically a [chalk](https://github.com/chalk/chalk) style), but you can also provide your own
 * formatting functions.
 *
 * Example:
 * ```ts
 * import {Theme, plain} from 'cli-highlight';
 * import chalk = require('chalk');
 *
 * const myTheme: Theme = {
 *     keyword: chalk.red.bold,
 *     addition: chalk.green,
 *     deletion: chalk.red.strikethrough,
 *     number: plain
 * };
 * ```
 */
export interface Theme extends Tokens<(codePart: string) => string> {
    /**
     * things not matched by any token
     */
    default?: (codePart: string) => string
}

/**
 * Identity function for tokens that should not be styled (returns the input string as-is).
 * See [[Theme]] for an example.
 */
export const plain = (codePart: string) => codePart

/**
 * The default theme. It is possible to override just individual keys.
 */
export const DEFAULT_THEME: Theme = {
    /**
     * keyword in a regular Algol-style language
     */
    keyword: chalk.blue,

    /**
     * built-in or library object (constant, class, function)
     */
    built_in: chalk.cyan,

    /**
     * user-defined type in a language with first-class syntactically significant types, like
     * Haskell
     */
    type: chalk.cyan.dim,

    /**
     * special identifier for a built-in value ("true", "false", "null")
     */
    literal: chalk.blue,

    /**
     * number, including units and modifiers, if any.
     */
    number: chalk.green,

    /**
     * literal regular expression
     */
    regexp: chalk.red,

    /**
     * literal string, character
     */
    string: chalk.red,

    /**
     * parsed section inside a literal string
     */
    subst: plain,

    /**
     * symbolic constant, interned string, goto label
     */
    symbol: plain,

    /**
     * class or class-level declaration (interfaces, traits, modules, etc)
     */
    class: chalk.blue,

    /**
     * function or method declaration
     */
    function: chalk.yellow,

    /**
     * name of a class or a function at the place of declaration
     */
    title: plain,

    /**
     * block of function arguments (parameters) at the place of declaration
     */
    params: plain,

    /**
     * comment
     */
    comment: chalk.green,

    /**
     * documentation markup within comments
     */
    doctag: chalk.green,

    /**
     * flags, modifiers, annotations, processing instructions, preprocessor directive, etc
     */
    meta: chalk.grey,

    /**
     * keyword or built-in within meta construct
     */
    'meta-keyword': plain,

    /**
     * string within meta construct
     */
    'meta-string': plain,

    /**
     * heading of a section in a config file, heading in text markup
     */
    section: plain,

    /**
     * XML/HTML tag
     */
    tag: chalk.grey,

    /**
     * name of an XML tag, the first word in an s-expression
     */
    name: chalk.blue,

    /**
     * s-expression name from the language standard library
     */
    'builtin-name': plain,

    /**
     * name of an attribute with no language defined semantics (keys in JSON, setting names in
     * .ini), also sub-attribute within another highlighted object, like XML tag
     */
    attr: chalk.cyan,

    /**
     * name of an attribute followed by a structured value part, like CSS properties
     */
    attribute: plain,

    /**
     * variable in a config or a template file, environment var expansion in a script
     */
    variable: plain,

    /**
     * list item bullet in text markup
     */
    bullet: plain,

    /**
     * code block in text markup
     */
    code: plain,

    /**
     * emphasis in text markup
     */
    emphasis: chalk.italic,

    /**
     * strong emphasis in text markup
     */
    strong: chalk.bold,

    /**
     * mathematical formula in text markup
     */
    formula: plain,

    /**
     * hyperlink in text markup
     */
    link: chalk.underline,

    /**
     * quotation in text markup
     */
    quote: plain,

    /**
     * tag selector in CSS
     */
    'selector-tag': plain,

    /**
     * #id selector in CSS
     */
    'selector-id': plain,

    /**
     * .class selector in CSS
     */
    'selector-class': plain,

    /**
     * [attr] selector in CSS
     */
    'selector-attr': plain,

    /**
     * :pseudo selector in CSS
     */
    'selector-pseudo': plain,

    /**
     * tag of a template language
     */
    'template-tag': plain,

    /**
     * variable in a template language
     */
    'template-variable': plain,

    /**
     * added or changed line in a diff
     */
    addition: chalk.green,

    /**
     * deleted line in a diff
     */
    deletion: chalk.red,

    /**
     * things not matched by any token
     */
    default: plain,
}

/**
 * Converts a [[JsonTheme]] with string values to a [[Theme]] with formatter functions. Used by [[parse]].
 */
export function fromJson(json: JsonTheme): Theme {
    const theme: Theme = {}
    for (const key of Object.keys(json)) {
        const style: string | string[] = (json as any)[key]
        if (Array.isArray(style)) {
            ;(theme as any)[key] = style.reduce(
                (prev: typeof chalk, curr: string) => (curr === 'plain' ? plain : (prev as any)[curr]),
                chalk
            )
        } else {
            ;(theme as any)[key] = (chalk as any)[style]
        }
    }
    return theme
}

/**
 * Converts a [[Theme]] with formatter functions to a [[JsonTheme]] with string values. Used by [[stringify]].
 */
export function toJson(theme: Theme): JsonTheme {
    const jsonTheme: any = {}
    for (const key of Object.keys(jsonTheme)) {
        const style: Chalk & { _styles: string[] } = (jsonTheme as any)[key]
        jsonTheme[key] = style._styles
    }
    return jsonTheme
}

/**
 * Stringifies a [[Theme]] with formatter functions to a JSON string.
 *
 * ```ts
 * import chalk = require('chalk');
 * import {stringify} from 'cli-highlight';
 * import * as fs from 'fs';
 *
 * const myTheme: Theme = {
 *     keyword: chalk.red.bold,
 *     addition: chalk.green,
 *     deletion: chalk.red.strikethrough,
 *     number: plain
 * }
 * const json = stringify(myTheme);
 * fs.writeFile('mytheme.json', json, (err: any) => {
 *     if (err) throw err;
 *     console.log('Theme saved');
 * });
 * ```
 */
export function stringify(theme: Theme): string {
    return JSON.stringify(toJson(theme))
}

/**
 * Parses a JSON string into a [[Theme]] with formatter functions.
 *
 * ```ts
 * import * as fs from 'fs';
 * import {parse, highlight} from 'cli-highlight';
 *
 * fs.readFile('mytheme.json', 'utf8', (err: any, json: string)  => {
 *     if (err) throw err;
 *     const code = highlight('SELECT * FROM table', {theme: parse(json)});
 *     console.log(code);
 * });
 * ```
 */
export function parse(json: string): Theme {
    return fromJson(JSON.parse(json))
}
