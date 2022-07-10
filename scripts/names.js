const path = require('path')
const { readTxt, readJsonSync, writeJsonSync } = require('./utils/io')

// paths
const root = path.join(__dirname, '..')
// under mpq
const dirMPQData = path.join(root, 'ax.mpq', 'data')
const dirStrings = path.join(dirMPQData, 'local', 'lng', 'strings')
const jsonItemNames = path.join(dirStrings, 'item-names.json')
// under origin
const dirOriginData = path.join(root, 'origin', 'data')
const dirExcel = path.join(dirOriginData, 'global', 'excel')
const txtArmor = path.join(dirExcel, 'armor.txt')
const txtWeapons = path.join(dirExcel, 'weapons.txt')
// item types
const itemTypes = ['tors', 'shie']

const updateItemName = (txtItemsMap) => {
  const itemNames = readJsonSync(jsonItemNames)
  if (!Array.isArray(itemNames)) return

  const length = itemNames.length
  for (let i = 0; i < length; i++) {
    const name = itemNames[i]
    const { Key: nameKey } = name
    const txtItem = txtItemsMap[nameKey]

    if (!name.zhTW || !txtItem || txtItem.quest) continue

    if (nameKey === txtItem.normcode && !name.zhTW.includes('普')) name.zhTW = `${name.zhTW}|普`
    if (nameKey === txtItem.ubercode && !name.zhTW.includes('擴')) name.zhTW = `${name.zhTW}|擴`
    if (nameKey === txtItem.ultracode && !name.zhTW.includes('精')) name.zhTW = `${name.zhTW}|精`

    if (!itemTypes.includes(txtItem.type)) continue

    const speed = txtItem.speed && parseInt(txtItem.speed, 10)
    if (speed === 0 && !name.zhTW.includes('輕')) name.zhTW = `${name.zhTW}輕`
    if (speed === 5 && !name.zhTW.includes('中')) name.zhTW = `${name.zhTW}中`
    if (speed === 10 && !name.zhTW.includes('重')) name.zhTW = `${name.zhTW}重`
  }
  writeJsonSync(jsonItemNames, itemNames)
}

readTxt(txtArmor, 'code').then(updateItemName)
readTxt(txtWeapons, 'code').then(updateItemName)
