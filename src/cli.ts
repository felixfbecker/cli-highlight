import * as fs from 'mz/fs'
import * as path from 'path'
import * as tty from 'tty'
import yargs from 'yargs'
import { highlight, HighlightOptions, supportsLanguage } from '.'
import { parse } from './theme'

yargs
    .option('theme', {
        alias: 't',
        nargs: 1,
        description: 'Use a theme defined in a JSON file',
    })
    .usage(
        ['', 'Usage: highlight [options] [file]', '', 'Outputs a file or STDIN input with syntax highlighting'].join(
            '\n'
        )
    )
    .option('language', {
        alias: 'l',
        nargs: 1,
        description: 'Set the langugage explicitely\nIf omitted will try to auto-detect',
    })
    .version()
    .help('help')
    .alias('help', 'h')
    .alias('version', 'v')

interface Arguments extends yargs.Arguments {
    theme?: string
    language?: string
}

const argv: Arguments = yargs.argv

const file = argv._[0]

let codePromise: Promise<string>
if (!file && !(process.stdin as tty.ReadStream).isTTY) {
    // Input from STDIN
    process.stdin.setEncoding('utf8')
    let code = ''
    process.stdin.on('readable', () => {
        const chunk = process.stdin.read()
        if (chunk !== null) {
            code += chunk
        }
    })
    codePromise = new Promise(resolve => {
        process.stdin.on('end', () => {
            const chunk = process.stdin.read()
            if (chunk !== null) {
                code += chunk
            }
            resolve(code)
        })
    })
} else if (file) {
    // Read file
    codePromise = fs.readFile(file, 'utf-8')
} else {
    yargs.showHelp()
    process.exit(1)
}

Promise.all<string, string | undefined>([codePromise, argv.theme ? fs.readFile(argv.theme, 'utf8') : undefined])
    .then(([code, theme]) => {
        const options: HighlightOptions = {
            ignoreIllegals: true,
            theme: (theme && parse(theme)) || undefined,
        }
        if (file) {
            const extension = path.extname(file).slice(1)
            if (extension && supportsLanguage(extension)) {
                options.language = extension
            }
        }
        options.language = argv.language
        return new Promise<void>((resolve, reject) =>
            process.stdout.write(highlight(code, options), (error: any) => (error ? reject(error) : resolve()))
        )
    })
    .then(() => {
        process.exit(0)
    })
    .catch((error: any) => {
        console.error(error)
        process.exit(1)
    })
