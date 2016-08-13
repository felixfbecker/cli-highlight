
# `cli-highlight`

> Syntax highlighting in your terminal

[![Version](https://img.shields.io/npm/v/cli-highlight.svg?maxAge=2592000)](https://www.npmjs.com/package/cli-highlight)
[![Downloads](https://img.shields.io/npm/dt/cli-highlight.svg?maxAge=2592000)](https://www.npmjs.com/package/cli-highlight)
[![Build Status](https://travis-ci.org/felixfbecker/node-cli-highlight.svg?branch=master)](https://travis-ci.org/felixfbecker/node-cli-highlight)
![Dependencies](https://david-dm.org/felixfbecker/node-cli-highlight.svg)
![Node Version](http://img.shields.io/node/v/cli-highlight.svg)
[![License](https://img.shields.io/npm/l/cli-highlight.svg?maxAge=2592000)](https://github.com/felixfbecker/node-cli-highlight/blob/master/LICENSE.md)

## Usage
Output a file
```sh
$ highlight package.json
```

Color output of another program with piping. Example: A database migration script that logs SQL Queries
```sh
$ db-migrate --dry-run | highlight
```

Command line options:
```html

  Usage: highlight [options] [file]

  Colorizes and outputs code from a file or STDIN

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -t, --theme    Use a theme defined in a JSON file

```


## Themes
You can write your own theme in a JSON file and pass it with `--theme`.
The key must be one of the [highlight.js CSS class names](http://highlightjs.readthedocs.io/en/latest/css-classes-reference.html)
and the value must be one or an array of [Chalk styles](https://github.com/chalk/chalk#styles) to be applied to that token.

```json
{
  "keyword": "blue",
  "built_in": ["cyan", "dim"],
  "string": "red"
}
```

The theme is combined with the [default theme](src/theme.ts#L230).
The default theme is still not colored a lot or optimized for many languages, PRs welcome!

## Supported Languages
In theory, [all languages of highlight.js](https://highlightjs.org/static/demo/) are supported - I just did not adapt
the default theme and wrote tests for all languages yet. My primary use case was SQL so that is supported well.

## Programmatic Usage

You can use this module programmatically to highlight logs of your Node app. Example:

```js
const highlight = require('cli-highlight').highlight
const Sequelize = require('sequelize')

const db = new Sequelize(process.env.DB, {
  logging(log) {
    console.log(highlight(log, {language: 'sql', ignoreIllegals: true}))
  }
})
```

Detailed API documenation can be found [here](cli-highlight.surge.sh).

## Contributing
The module is written in TypeScript and can be compiled with `npm run build`.
`npm run watch` starts `tsc` in watch mode. Tests are written with mocha.

Improving language support is done by adding more colors to the tokens in the default theme and writing more tests.
