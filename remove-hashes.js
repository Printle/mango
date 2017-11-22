const fs = require('fs')
const path = require('path')

const css = fs
  .readdirSync('./build/static/css')
  .map(p => `./build/static/css/${p}`)
const js = fs
  .readdirSync('./build/static/js')
  .map(p => `./build/static/js/${p}`)

const files = css.concat(js)

const hashes = files.map(p => /[^.]+(\.[^.]+)\.[^.]+/.exec(p)[1])

for (let file of files) {
  const content = fs.readFileSync(file, 'utf8')
  const newContent = hashes.reduce((p, hash) => p.replace(hash, ''), content)
  const newFile = hashes.reduce((p, hash) => p.replace(hash, ''), file)

  fs.writeFileSync(newFile, newContent)
}
