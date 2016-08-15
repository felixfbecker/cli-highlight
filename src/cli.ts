
import * as path from 'path';
import {supportsLanguage, highlight, HighlightOptions} from './index';
import * as fs from 'mz/fs';
import * as tty from 'tty';
import {parse} from './theme';
import yargs = require('yargs');

yargs
    .option('theme', {
        alias: 't',
        nargs: 1,
        description: 'Use a theme defined in a JSON file'
    })
    .usage([
        '',
        'Usage: highlight [options] [file]',
        '',
        'Outputs a file or STDIN input with syntax highlighting'
    ].join('\n'))
    .option('language', {
        alias: 'l',
        nargs: 1,
        description: 'Set the langugage explicitely\nIf omitted will try to auto-detect'
    })
    .version(() => require('../../package.json').version)
    .help('help')
    .alias('help', 'h')
    .alias('version', 'v');

interface Argv extends yargs.Argv {
    theme?: string;
    language?: string;
}

const argv: Argv = yargs.argv;

const file = argv._[0];

let codePromise: Promise<string>;
if (!file && !(<tty.ReadStream>process.stdin).isTTY) {
    // Input from STDIN
    process.stdin.setEncoding('utf8');
    let code = '';
    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            code += chunk;
        }
    });
    codePromise = new Promise(resolve => {
        process.stdin.on('end', () => {
            resolve(code);
        });
    });
} else if (file) {
    // Read file
    codePromise = fs.readFile(file, 'utf-8');
} else {
    yargs.showHelp();
    process.exit(1);
}

Promise.all([
    codePromise,
    argv.theme ? fs.readFile(argv.theme, 'utf8') : Promise.resolve()
]).then(([code, theme]) => {
    const options: HighlightOptions = {
        ignoreIllegals: true,
        theme: theme && parse(theme)
    };
    if (file) {
        const ext = path.extname(file).substr(1);
        if (ext && supportsLanguage(ext)) {
            options.language = ext;
        }
    }
    options.language = argv.language;
    process.stdout.write(highlight(code, options));
}).then(() => {
    process.exit(0);
}).catch((err: any) => {
    console.error(err);
    process.exit(1);
});
