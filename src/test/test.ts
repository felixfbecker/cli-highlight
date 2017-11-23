import * as assert from 'assert'
import c from 'chalk'
import { highlight } from '../index'

class HighlightAssertionError extends assert.AssertionError {
    constructor(actual: string, expected: string) {
        super({ actual, expected })
        this.message = ''
        this.name = ''
    }
}

function test(language: string, code: string, expected: string): void {
    it(`should color ${language} correctly`, () => {
        const highlighted = highlight(code)
        if (highlighted.trim() !== expected.trim()) {
            throw new HighlightAssertionError(highlighted, expected)
        } else {
            console.log(highlighted + '\n')
        }
    })
}

test(
    'SQL',
    `
    -- Create a table
    CREATE TABLE "topic" (
        "id" serial NOT NULL PRIMARY KEY,
        "forum_id" integer NOT NULL,
        "subject" varchar(255) NOT NULL
    );
`,
    `
    ${c.green('-- Create a table')}
    ${c.blue('CREATE')} ${c.blue('TABLE')} ${c.red('"topic"')} (
        ${c.red('"id"')} ${c.cyan('serial')} ${c.blue('NOT')} ${c.blue('NULL')} PRIMARY ${c.blue('KEY')},
        ${c.red('"forum_id"')} ${c.cyan('integer')} ${c.blue('NOT')} ${c.blue('NULL')},
        ${c.red('"subject"')} ${c.cyan('varchar')}(${c.green('255')}) ${c.blue('NOT')} ${c.blue('NULL')}
    );
`
)

test(
    'JSON',
    `
    [
        {
            "title": "apples",
            "count": [12000, 20000],
            "description": {"text": "...", "sensitive": false}
        }
    ]
`,
    `
    [
        {
            ${c.cyan('"title"')}: ${c.red('"apples"')},
            ${c.cyan('"count"')}: [${c.green('12000')}, ${c.green('20000')}],
            ${c.cyan('"description"')}: {${c.cyan('"text"')}: ${c.red('"..."')}, ${c.cyan('"sensitive"')}: ${c.blue(
        'false'
    )}}
        }
    ]
`
)

test(
    'HTML',
    `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Hello World!</title>
        </head>
        <body>
            <h1>Foo</h1>
            <div>Bar</div>
        </body>
    </html>
`,
    `
    ${c.grey('<!DOCTYPE html>')}
    ${c.grey(`<${c.blue('html')}>`)}
        ${c.grey(`<${c.blue('head')}>`)}
            ${c.grey(`<${c.blue('title')}>`)}Hello World!${c.grey(`</${c.blue('title')}>`)}
        ${c.grey(`</${c.blue('head')}>`)}
        ${c.grey(`<${c.blue('body')}>`)}
            ${c.grey(`<${c.blue('h1')}>`)}Foo${c.grey(`</${c.blue('h1')}>`)}
            ${c.grey(`<${c.blue('div')}>`)}Bar${c.grey(`</${c.blue('div')}>`)}
        ${c.grey(`</${c.blue('body')}>`)}
    ${c.grey(`</${c.blue('html')}>`)}
`
)
