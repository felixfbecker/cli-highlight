
import program = require('commander');
import * as path from 'path';
import {supportsLanguage, highlight, HighlightOptions} from '../index';
import * as fs from 'mz/fs';
import * as tty from 'tty';
import {parse} from '../theme';

let file: string;

(program
    .version(require('../../package.json').version)
    .description('Outputs a file or STDIN input with syntax highlighting')
    .option('-t, --theme <file>', 'Use a theme defined in a JSON file') as any)
    .arguments('[file]')
    .action((f: string) => file = f)
    .parse(process.argv);

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
} else {
    // Read file
    codePromise = fs.readFile(file, 'utf-8');
}

Promise.all([
    codePromise,
    (<any>program).theme ? fs.readFile((<any>program).theme, 'utf8') : Promise.resolve()
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
    process.stdout.write(highlight(code, options));
}).then(() => {
    process.exit(0);
}).catch((err: any) => {
    console.error(err);
    process.exit(1);
});
