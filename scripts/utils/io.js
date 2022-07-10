const fs = require('fs')
const os = require('os')
const readline = require('readline')
const _ = require('../libs/lodash')

// txt
async function* zip(rl) {
  let isFirstLine = true
  let keys
  for await (const line of rl) {
    const values = line.split('\t')
    if (isFirstLine) {
      keys = values
      isFirstLine = false
    } else if ((keys.length = values.length)) {
      yield _.zipObject(keys, values)
    }
  }
}

async function readTxt(txtPath, uniqueId) {
  const rl = readline.createInterface({
    input: fs.createReadStream(txtPath),
  })

  const result = {}
  for await (const line of zip(rl)) {
    const name = uniqueId && line[uniqueId]
    if (name) result[name] = line
  }
  return result
}

// json
function readJsonSync(jsonPath) {
  return require(jsonPath)
}

function writeJsonSync(jsonPath, jsonData) {
  const content = JSON.stringify(jsonData, undefined, 2)
  fs.writeFileSync(jsonPath, `${content}${os.EOL}`)
}

module.exports = { readTxt, readJsonSync, writeJsonSync }
