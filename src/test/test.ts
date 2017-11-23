import c from 'chalk'
import * as fs from 'fs'
import { highlight } from '../index'

function test(language: string, code: string): void {
    it(`should color ${language} correctly`, () => {
        const highlighted = highlight(code)

        expect(highlighted).toMatchSnapshot()
    })
}

test('SQL', fs.readFileSync(`${__dirname}/__fixtures__/SQL.sql`, 'utf8'))

test('JSON', fs.readFileSync(`${__dirname}/__fixtures__/JSON.json`, 'utf8'))

test('HTML', fs.readFileSync(`${__dirname}/__fixtures__/HTML.html`, 'utf8'))
