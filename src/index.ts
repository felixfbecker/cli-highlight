
import * as hljs from 'highlight.js';
import {DEFAULT_THEME, Theme, plain} from './theme';
const he = require('he');

function colorize(code: string, theme: Theme = {}): string {
    return he.decode(code.replace(
        /<span class="hljs-(\w+)">([^<]+)<\/span>/g,
        (match: string, token: string, value: string) => {
            return ((<any>theme)[token] || (<any>DEFAULT_THEME)[token] || plain)(value);
        }
    ));
}

/**
 * Options passed to [[highlight]]
 */
export interface HighlightOptions {
    /**
     * Can be a name, file extension, alias etc. If omitted, tries to auto-detect language.
     */
    language?: string;

    /**
     *  When present and evaluates to a true value, forces highlighting to finish even in case of
     *  detecting illegal syntax for the language instead of throwing an exception.
     */
    ignoreIllegals?: boolean;

    /**
     * The continuation is an optional mode stack representing unfinished parsing. When present,
     * the function will restart parsing from this state instead of initializing a new one.
     *
     * See http://highlightjs.readthedocs.io/en/latest/api.html
     */
    continuation?: any;

    /**
     * Optional array of language names and aliases restricting detection to only those languages.
     */
    languageSubset?: string[];

    /**
     * Supply a custom theme where you override language tokens with own formatter functions. Every
     * token that is not overriden falls back to the [[DEFAULT_THEME]]
     */
    theme?: Theme;
}

/**
 * Apply syntax highlighting to `code` with ASCII color codes. The language is automatically
 * detected if not set.
 *
 * ```ts
 * import {highlight} from 'cli-highlight';
 * import * as fs from 'fs';
 *
 * fs.readFile('package.json', 'utf8', (err: any, json: string) => {
 *     console.log('package.json:');
 *     console.log(highlight(json));
 * });
 * ```
 *
 * @param code The code to highlight
 * @param options Optional options
 */
export function highlight(code: string, options: HighlightOptions = {}): string {
    let html: string;
    if (options.language) {
        html = hljs.highlight(options.language, code, options.ignoreIllegals, options.continuation).value;
    } else {
        html = hljs.highlightAuto(code, options.languageSubset).value;
    }
    return colorize(html, options.theme);
}

/**
 * Returns all supported languages
 */
export function listLanguages(): string[] {
    return hljs.listLanguages();
}

/**
 * Returns true if the language is supported
 * @param name A language name, alias or file extension
 */
export function supportsLanguage(name: string): boolean {
    return !!hljs.getLanguage(name);
}

export default highlight;
export * from './theme';
