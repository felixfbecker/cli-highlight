import c from 'chalk'
import { highlight } from '../index'

function test(language: string, code: string): void {
    it(`should color ${language} correctly`, () => {
        const highlighted = highlight(code)

        expect(highlighted).toMatchSnapshot()
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
`
)
