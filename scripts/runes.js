const path = require('path')
const { readTxt, readJsonSync, writeJsonSync } = require('./utils/io')

// paths
const root = path.join(__dirname, '..')
// mpq
const dirMPQData = path.join(root, 'ax.mpq', 'data')
const dirStrings = path.join(dirMPQData, 'local', 'lng', 'strings')
const jsonItemRunes = path.join(dirStrings, 'item-runes.json')
// origin
const dirOriginData = path.join(root, 'origin', 'data')
const dirExcel = path.join(dirOriginData, 'global', 'excel')
const txtRunes = path.join(dirExcel, 'runes.txt')

// const getCompletedRunes = async (txtFilePath) => {
//   const rl = readline.createInterface({
//     input: fs.createReadStream(txtFilePath),
//   })

//   let isFirstLine = true
//   let length
//   const completedRunes = []
//   for await (const line of rl) {
//     const values = line.trim().split('\t')
//     if (isFirstLine) {
//       length = values.length
//       isFirstLine = false
//     } else if (length === values.length && values[2]) {
//       completedRunes.push(values[0])
//     }
//   }
//   return completedRunes
// }

// getCompletedRunes(txtRunes).then((completedRunes) => {
//   const itemRunes = readJsonSync(jsonItemRunes)
//   if (Array.isArray(itemRunes)) {
//     const length = itemRunes.length
//     for (let index = 0; index < length; index++) {
//       const item = itemRunes[index]
//       if (!item.Key.startsWith('Runeword') || !completedRunes.includes(item.Key)) continue
//       item.zhTW = `${item.zhTW} ${item.enUS}`
//     }
//   }
//   writeJsonSync(jsonItemRunes, itemRunes)
// })

const updateItemRune = (txtRunesMap) => {
  const itemRunes = readJsonSync(jsonItemRunes)
  if (!Array.isArray(itemRunes)) return

  const length = itemRunes.length
  for (let i = 0; i < length; i++) {
    const rune = itemRunes[i]
    const { Key: runeKey } = rune
    if (!runeKey.startsWith('Runeword') || !txtRunesMap[runeKey]?.complete) continue
    if (!rune.zhTW.includes(rune.enUS)) rune.zhTW = `${rune.zhTW} ${rune.enUS}`
  }
  writeJsonSync(jsonItemRunes, itemRunes)
}

readTxt(txtRunes, 'Name').then(updateItemRune)
