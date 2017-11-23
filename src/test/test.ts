import c from 'chalk'
import * as fs from 'fs'
import { highlight } from '../index'

function test(language: string, code: string): void {
    it(`should color ${language} correctly`, () => {
        const highlighted = highlight(code)

        expect(highlighted).toMatchSnapshot()
    })
}

const fixtures = fs.readdirSync(`${__dirname}/__fixtures__`)

for (const fixture of fixtures) {
    const [language] = fixture.split('.')

    test(language, fs.readFileSync(`${__dirname}/__fixtures__/${fixture}`, 'utf8'))
}
