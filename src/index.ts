import * as hljs from 'highlight.js'
import * as parse5 from 'parse5'
import htmlparser2Adapter from 'parse5-htmlparser2-tree-adapter'
import * as HtmlParser2 from 'parse5-htmlparser2-tree-adapter'
import { DEFAULT_THEME, plain, Theme } from './theme'

function colorizeNode(node: HtmlParser2.Node, theme: Theme = {}, context?: string): string {
    switch (node.type) {
        case 'text': {
            const text = (node as HtmlParser2.TextNode).data
            if (context === undefined) {
                return (theme.default || DEFAULT_THEME.default || plain)(text)
            } else {
                return text
            }
        }
        case 'tag': {
            const hljsClass = /hljs-(\w+)/.exec((node as HtmlParser2.Element).attribs.class)
            if (hljsClass) {
                const token = hljsClass[1]
                const nodeData = (node as HtmlParser2.Element).childNodes
                    .map(node => colorizeNode(node, theme, token))
                    .join('')
                return ((theme as any)[token] || (DEFAULT_THEME as any)[token] || plain)(nodeData)
            }

            // Return the data itself when the class name isn't prefixed with a highlight.js token prefix.
            // This is common in instances of sublanguages (JSX, Markdown Code Blocks, etc.)
            return (node as HtmlParser2.Element).childNodes.map(node => colorizeNode(node, theme)).join('')
        }
    }
    throw new Error('Invalid node type ' + node.type)
}

function colorize(code: string, theme: Theme = {}): string {
    const fragment = parse5.parseFragment(code, {
        treeAdapter: htmlparser2Adapter,
    }) as HtmlParser2.DocumentFragment
    return fragment.childNodes.map(node => colorizeNode(node, theme)).join('')
}

/**
 * Options passed to [[highlight]]
 */
export interface HighlightOptions {
    /**
     * Can be a name, file extension, alias etc. If omitted, tries to auto-detect language.
     */
    language?: string

    /**
     *  When present and evaluates to a true value, forces highlighting to finish even in case of
     *  detecting illegal syntax for the language instead of throwing an exception.
     */
    ignoreIllegals?: boolean

    /**
     * The continuation is an optional mode stack representing unfinished parsing. When present,
     * the function will restart parsing from this state instead of initializing a new one.
     *
     * See http://highlightjs.readthedocs.io/en/latest/api.html
     */
    continuation?: any

    /**
     * Optional array of language names and aliases restricting detection to only those languages.
     */
    languageSubset?: string[]

    /**
     * Supply a custom theme where you override language tokens with own formatter functions. Every
     * token that is not overriden falls back to the [[DEFAULT_THEME]]
     */
    theme?: Theme
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
    let html: string
    if (options.language) {
        html = hljs.highlight(options.language, code, options.ignoreIllegals, options.continuation).value
    } else {
        html = hljs.highlightAuto(code, options.languageSubset).value
    }
    return colorize(html, options.theme)
}

/**
 * Returns all supported languages
 */
export function listLanguages(): string[] {
    return hljs.listLanguages()
}

/**
 * Returns true if the language is supported
 * @param name A language name, alias or file extension
 */
export function supportsLanguage(name: string): boolean {
    return !!hljs.getLanguage(name)
}

export default highlight
export * from './theme'
