const fs = require('fs')
const os = require('os')
const path = require('path')
const readline = require('readline')

// paths
const root = path.join(__dirname, '..')
// mpq
const dirMPQData = path.join(root, 'ax.mpq', 'data')
const dirStrings = path.join(dirMPQData, 'local', 'lng', 'strings')
const jsonItemNames = path.join(dirStrings, 'item-names.json')
// origin
const dirOriginData = path.join(root, 'origin', 'data')
const dirExcel = path.join(dirOriginData, 'global', 'excel')
const txtArmor = path.join(dirExcel, 'armor.txt')
const txtWeapons = path.join(dirExcel, 'weapons.txt')

const readJsonSync = (jsonFilePath) => {
  return require(jsonFilePath)
}

const writeJsonSync = (jsonFilePath, jsonData) => {
  const content = JSON.stringify(jsonData, undefined, 2)
  fs.writeFileSync(jsonFilePath, `${content}${os.EOL}`)
}

const keyValueToObject = (keys, values) => {
  const length = keys.length
  const result = {}
  for (let i = 0; i < length; i++) {
    const key = keys[i]
    const value = values[i]
    result[key] = value
  }
  return result
}

const txtToMap = async (txtFilePath) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(txtFilePath),
  })

  let isFirstLine = true
  let names
  const result = {}
  for await (const line of rl) {
    const values = line.split('\t')
    if (isFirstLine) {
      names = values
      isFirstLine = false
    } else if (names.length === values.length) {
      const obj = keyValueToObject(names, values)
      result[obj.code] = obj
    }
  }
  return result
}

const updateItemName = (itemMap) => {
  const itemNames = readJsonSync(jsonItemNames)
  if (Array.isArray(itemNames)) {
    const length = itemNames.length
    for (let i = 0; i < length; i++) {
      const item = itemNames[i]
      const mapItem = itemMap[item.Key]
      if (mapItem && !mapItem.quest.trim() && item.zhTW) {
        const speed = mapItem.speed && parseInt(mapItem.speed, 10)
        if (item.Key === mapItem.normcode) item.zhTW = `${item.zhTW}|普`
        if (item.Key === mapItem.ubercode) item.zhTW = `${item.zhTW}|擴`
        if (item.Key === mapItem.ultracode) item.zhTW = `${item.zhTW}|精`
        if (['tors', 'shie'].includes(mapItem.type)) {
          if (speed === 0) item.zhTW = `${item.zhTW}輕`
          if (speed === 5) item.zhTW = `${item.zhTW}中`
          if (speed === 10) item.zhTW = `${item.zhTW}重`
        }
      }
    }
    writeJsonSync(jsonItemNames, itemNames)
  }
}

txtToMap(txtArmor).then(updateItemName)
txtToMap(txtWeapons).then(updateItemName)

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
