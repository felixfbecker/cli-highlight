import c from 'chalk'
import * as fs from 'fs'
import { highlight } from '../index'

function test(language: string, code: string): void {
    it(`should color ${language} correctly`, () => {
        const highlighted = highlight(code)

        if (process.env.OUTPUT_CODE_SAMPLES) {
            console.log(language + ':\n\n' + highlighted)
        }

        expect(highlighted).toMatchSnapshot()
    })
}

const fixtures = fs.readdirSync(`${__dirname}/__fixtures__`)

for (const fixture of fixtures) {
    const fixturePath = `${__dirname}/__fixtures__/${fixture}`

    if (fs.statSync(fixturePath).isFile()) {
        const [language] = fixture.split('.')

        test(language, fs.readFileSync(fixturePath, 'utf8'))
    }
}
