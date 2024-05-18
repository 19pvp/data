import ProgressBar  from "https://deno.land/x/progress@v1.4.9/mod.ts"
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"

const byteToHex = (byte) => byte.toString(16).padStart(2, '0')
const SHA1 = async (message) => {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(message))
  return [...new Uint8Array(digest)]
    .map(byteToHex)
    .join('')
}

const cacheDir = 'C:\\Users\\kigir\\Downloads\\.cache\\'
const fetchText = async (url) => {
  const cacheFilePath = `${cacheDir}${await SHA1(url)}`
  try {
    return await Deno.readTextFile(cacheFilePath)
  } catch {
    const text = await (await fetch(url)).text()
    await Deno.writeTextFile(cacheFilePath, text)
    return text
  }
}

const workers = 5
const each = async (data, title, fn) => {
  const total = data.length
  if (!total) return
  const progress = new ProgressBar({ display: `[:bar] :percent :time :completed/:total ${title}`, total })
  let i = -1
  const next = async () => {
    const j = ++i
    if (j >= total) return
    await progress.render(Math.min(i, total))
    return fn(data[j]).then(next)
  }
  await Promise.all([...Array(workers).keys()].map(() => next()))
  await progress.render(total)
}

const WEAPON_SUBCLASS = {
  0: "ONE_HANDED_AXE",
  1: "TWO_HANDED_AXE",
  2: "BOW",
  3: "GUN",
  4: "ONE_HANDED_MACE",
  5: "TWO_HANDED_MACE",
  6: "POLEARM",
  7: "ONE_HANDED_SWORD",
  8: "TWO_HANDED_SWORD",
  9: "WARGLAIVE",
  10: "STAFF",
  13: "FIST_WEAPON",
  14: "MISCELLANEOUS",
  15: "DAGGER",
  16: "THROWN",
  18: "CROSSBOW",
  19: "WAND",
  20: "FISHING_POLE",
}

const ARMOR_SUBCLASS = {
  0: "MISC",
  1: "CLOTH",
  2: "LEATHER",
  3: "MAIL",
  4: "PLATE",
  5: "COSMETIC",
  6: "SHIELDS",
  "-2": "RINGS",
  "-3": "AMULETS",
  "-4": "TRINKETS",
  "-5": "OFF_HAND_FRILLS",
  "-6": "CLOAKS",
  "-7": "TABARDS",
  "-8": "SHIRTS",
}

const CLASS = { 2: "WEAPON", 3: "GEM", 4: "ARMOR", 12: "QUEST" }
const QUALITY = {
  0: "POOR",
  1: "COMMON",
  2: "UNCOMMON",
  3: "RARE",
  4: "EPIC",
  5: "LEGENDARY",
  6: "ARTIFACT",
  7: "HEIRLOOM",
  8: "WOW_TOKEN",
  9: "GLYPH",
  10: "FAIL",
  13: "SET_BONUSES",
}

const INVENTORY_TYPE = {
  1: "HEAD",
  2: "NECK",
  3: "SHOULDERS",
  4: "SHIRT",
  5: "CHEST",
  6: "WAIST",
  7: "LEGS",
  8: "FEET",
  9: "WRISTS",
  10: "HANDS",
  11: "FINGER",
  12: "TRINKET",
  13: "ONE_HAND",
  14: "SHIELD",
  15: "RANGED",
  16: "BACK",
  17: "TWO_HAND",
  18: "BAG",
  19: "TABARD",
  20: "ROBE",
  21: "MAIN_HAND",
  22: "OFF_HAND",
  23: "HELD_IN_OFF_HAND",
  24: "PROJECTILE",
  25: "THROWN",
  26: "RANGED_RIGHT",
  27: "QUIVER",
  28: "RELIC",
  29: "PROFESSION_TOOL",
  30: "PROFESSION_ACCESSORY",
  31: "EQUIPABLE_SPELL_OFFENSIVE",
  32: "EQUIPABLE_SPELL_UTILITY",
  33: "EQUIPABLE_SPELL_DEFENSIVE",
  34: "EQUIPABLE_SPELL_WEAPON",
}

const STATS = {
  0: "Mana",
  1: "Health",
  2: "Endurance",
  3: "Agility",
  4: "Strength",
  5: "Intellect",
  6: "Spirit",
  7: "Stamina",
  8: "Energy",
  9: "Rage",
  10: "Focus",
  11: "Weapon Skill",
  12: "Defense Skill",
  13: "Dodge Rating",
  14: "Parry Rating",
  15: "Block Rating",
  16: "Hit Melee",
  17: "Hit Ranged",
  18: "Hit Spell",
  19: "Critical Strike Melee",
  20: "Critical Strike Ranged",
  21: "Critical Strike Spell",
  23: "Corruption Resistance",
  24: "Crafting Stat 1",
  25: "Crafting Stat 2",
  28: "Haste Melee",
  29: "Haste Ranged",
  30: "Haste Spell",
  31: "Hit Rating",
  32: "Critical Strike Rating",
  35: "Resilience",
  36: "Haste Rating",
  37: "Expertise Rating",
  38: "Attack Power",
  39: "Ranged Attack Power",
  40: "Versatility",
  41: "Spell Healing Done",
  42: "Spell Damage Done",
  43: "Mana Regeneration",
  44: "Armor Penetration",
  45: "Spell Power",
  46: "Health Regeneration",
  47: "Spell Penetration",
  48: "Block Value",
  49: "Mastery",
  50: "Armor",
  51: "Fire Resistance",
  52: "Frost Resistance",
  53: "Holy Resistance",
  54: "Shadow Resistance",
  55: "Nature Resistance",
  56: "Arcane Resistance",
  61: "Speed",
  62: "Leech",
  63: "Avoidance",
  71: "Agi Str Int",
  72: "Agi Str",
  73: "Agi Int",
  74: "Str Int",
}

const SIDE = { 1: "ALLIANCE", 2: "HORDE" }
const WH_TYPES = {
  1: "NPC",
  2: "OBJECT",
  3: "ITEM",
  4: "ITEM_SET",
  5: "QUEST",
  6: "SPELL",
  7: "ZONE",
  8: "FACTION",
  9: "HUNTER_PET",
  10: "ACHIEVEMENT",
  11: "TITLE",
  12: "EVENT",
  13: "PLAYER_CLASS",
  14: "RACE",
  15: "SKILL",
  17: "CURRENCY",
  18: "PROJECT",
  19: "SOUND",
  20: "BUILDING",
  21: "FOLLOWER",
  22: "MISSION_ABILITY",
  23: "MISSION",
  25: "SHIP",
  26: "THREAT",
  27: "RESOURCE",
  28: "CHAMPION",
  29: "ICON",
}
const SOURCE_TYPES = { 2: 'DROP', 4: 'QUEST', 5: 'VENDOR' }
const SOURCE_MORE = {
  DROP: ['z', 'zone'],
  PVP: [],
}
const subclasses = { WEAPON: WEAPON_SUBCLASS, ARMOR: ARMOR_SUBCLASS }

const toDOM = text => new DOMParser().parseFromString(text, 'text/html')
const ratingRates = {
  Dodge: 12,
  Block: 5,
  'Critical Hit': 14,
}

const parseSuffixEffect = (line) => {
  const [prefix, qty, suffix, extra] = line.trim().split(/ ?([+-][0-9]+%|[0-9]+%|[+-][0-9]+) ?/)
  const text = prefix || suffix
  if (text === 'Healing Spells') return ['Spell Power', Math.round(Number(qty) * 0.53)]
  if (text === 'Defense') return ['Dodge Rating', Number(qty)]
  if (!qty.endsWith('%')) return [text, Number(qty)]
  const rate = ratingRates[text]
  return [`${text} Rating`, Number(qty.slice(0, -1)) * (rate || 10)]
}

const suffixDOM = toDOM(await fetchText('https://wowpedia.fandom.com/wiki/SuffixId'))
const SUFFIXES = suffixDOM.getElementsByTagName('h3').flatMap(h3 => {
  const [titleElem] = h3.getElementsByClassName('mw-headline')
  const content = h3.nextElementSibling
  if (!titleElem || !content) return []
  const name = titleElem.textContent
  return [...content.querySelectorAll('table table tr')]
    .map(tr => {
      const code = tr.getElementsByTagName('code')[0]
      const font = tr.getElementsByTagName('font')[0]
      if (!code || !font) return
      return {
        name,
        id: Number(code.textContent),
        effects: Object.fromEntries(font.innerHTML.split('<br>').map(parseSuffixEffect)),
      }
    })
    .filter(Boolean)
})

const randomSuffixDOM = toDOM(await fetchText('https://wowpedia.fandom.com/wiki/ItemRandomSuffix'))
const RANDOM_SUFFIXES = randomSuffixDOM.getElementsByTagName('h3').flatMap(h3 => {
  const [titleElem] = h3.getElementsByClassName('mw-headline')
  const content = h3.nextElementSibling?.getElementsByTagName('p')[0]
  if (!titleElem || !content) return []
  const [_, id, name] = titleElem.textContent.split(/Suffix ([0-9]+): ?/)
  // 'Enchant 2822: +(<b>suffixFactor</b> * 0.5259) Critical Strike Rating'
  
  return {
    id: -Number(id),
    name,
    effects: Object.fromEntries(content.innerHTML.trim().split('<br>\n').map(line => {
      const [_, id, factor, name] = line.split(/Enchant ([0-9]+): \+\(<b>suffixFactor<\/b> \* ([0-9.]+)\) /)
      return [name, { id: Number(id), factor: Number(factor)}]
    })),
  }
})

console.log(SUFFIXES.find(s => s.name.toLowerCase().includes('healing')))
const formatItemData = async (data) => {
  if (data.reqskillrank > 150) return
  if (data.quality < 2) return // White & Junk
  const tooltipRes = await fetchText(`https://nether.wowhead.com/tooltip/item/${data.id}?dataEnv=11&locale=0&lvl=19`)
  const tooltipDOM = toDOM(JSON.parse(tooltipRes).tooltip)
  const tooltip = {}
  for (const td of tooltipDOM.getElementsByTagName('td')) {
    let value = []
    for (const child of td.childNodes) {
      if (child.nodeName === '#comment') {
        tooltip[child.nodeValue] = [...(tooltip[child.nodeValue] || []), ...value].filter(Boolean)
        value = []
        tooltip[child.nodeValue].length === 0 && (tooltip[child.nodeValue] = undefined)
        continue
      }
      value.push(child.nodeValue || child.value || child.innerHTML)
    }
  }

  // Handle random enchants
  const rand = []
  if ((tooltip.ebstats?.[0] || '').includes('Random enchantment')) {
    const detailRes = await fetchText(`https://www.wowhead.com/cata/item=${data.id}`)
    const detailDOM = toDOM(detailRes)
    for (const div of detailDOM.querySelectorAll('li > div')) {
      const [_1,name,_2,chance,_3,statsText] = div.childNodes
      if (!name || name.tagName !== 'SPAN' || !name.className.startsWith('q')) break
      if (!chance || chance.tagName !== 'SMALL' || chance.className !== 'q0') break
      const suffixName = name.textContent.trim().replace('...', '')
      const statsEntries = statsText.nodeValue.split(',').map(line => {
        if (line.includes(' - ')) {
          const [_, sign, min, qty, text] = line.trim().split(/([+-])\(([0-9]+%|[0-9]+) - ([0-9]+%|[0-9]+)\) /)
          return [text, Number(`${sign}${qty}`)]
        }
        const [prefix, qty, suffix, extra] = line.trim().split(/ ?([+-][0-9]+%|[0-9]+%|[+-][0-9]+) ?/)
        const text = prefix || suffix
        return [text, qty.endsWith('%') ? Number(qty.slice(0, -1)) / 100 : Number(qty)]
      })
      
      rand.push([
        suffixName,
        {
          id: SUFFIXES.find(s => s.name === suffixName && statsEntries.every(([k, v]) => s.effects[k] === v))?.id
          || RANDOM_SUFFIXES
              .filter(s => s.name === suffixName)
              .sort((a, b) => statsEntries.reduce((score, [k]) => score + (k in a.effects) - (k in b.effects)).length)
              .at(0)?.id,
          chance: Number(chance.textContent.split(/\(([0-9.]+)%/)[1]),
          stats: Object.fromEntries(statsEntries),
        },
      ])
    }
  }

  const effects = (tooltip['itemEffects:1'] || [])
    .filter(e => e.includes('href=') && !e.includes('Experience gained'))
    .map(e => {
      const tt = e.split(':')[0].replace(/ ([A-Z])/ig, (_, m) => m.toUpperCase())
      const type = tt[0].toLowerCase() + tt.slice(1)
      const spell = Number(e.split(/href="\/cata\/spell=([0-9]+)/)[1])
      const text = toDOM(e).textContent.split(': ')[1].replaceAll(' ', '')
      return [type, {spell, text }]
    })  

  const stats = {
    // Parse ratings from tooltip
    ...Object.fromEntries(
      (tooltip['itemEffects:1'] || []).flatMap(e => {
        const parseEffect = e.split(/<!--rtg([0-9]+)-->([0-9]+)/)
        if (!parseEffect[1]) return []
        return [[STATS[parseEffect[1]], Number(parseEffect[2])]]
      })
    ),

    // Parse stats from tooltip
    ...Object.fromEntries(
      (tooltip.ebstats||[]).flatMap(e => {
        const parseStat = e.split(/<!--stat([0-9]+)-->([+-][0-9]+)/)
        if (!parseStat[1]) return []
        return [[STATS[parseStat[1]], Number(parseStat[2])]]
      })
    ),

    // Add stats from object data
    ...Object.fromEntries(Object.entries(data.statsInfo || {}).map(([stat, {qty}]) => [STATS[stat], qty])),
  }

  // Wands & Heirloom fix
  if (data.speed && !data.dmgmin1 && tooltip.dps) {
    const dmgLine = tooltip.dps.join('\n').split('\n').find(l => l.includes('<!--dmg-->')) || ''
    const [_, min, max] = dmgLine.split(/<!--dmg-->([0-9]+) - ([0-9]+)/)
    const rate = QUALITY[data.quality] === 'HEIRLOOM' ? 8 : 1
    data.dmgmin1 = Math.round(Number(min) / rate)
    data.dmgmax1 = Math.round(Number(max) / rate)
  }

  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    dmgMin: data.dmgmin1,
    dmgMax: data.dmgmax1,
    speed: data.speed,
    dps: Number((((data.dmgmin1+data.dmgmax1) /2) / data.speed).toFixed(2)) || undefined,
    popularity: data.popularity,
    armor: data.armor,
    side: SIDE[data.side],
    class: CLASS[data.classs],
    quality: QUALITY[data.quality],
    subclass: subclasses[CLASS[data.classs]]?.[data.subclass],
    type: INVENTORY_TYPE[data.slot],
    stats,
    rand: rand.length ? Object.fromEntries(rand) : undefined,
    source: SOURCE_TYPES[data.source?.[0]],
    sourceId: data.sourcemore?.[0]?.ti,
    sourceName: data.sourcemore?.[0]?.n,
    sourceZone: data.sourcemore?.[0]?.z,
    sourceType: WH_TYPES[data.sourcemore?.[0]?.t],
    ...Object.fromEntries(effects),
  }
}

const scrapWH = async () => {
  const items = {}
  const quests = {}
  await each([
    'https://www.wowhead.com/cata/quests/min-level:2/max-level:55/max-req-level:19?filter-any=23:22;1:1;0:0',

    // Items must be after because it's more complete and we want to override quest matches
    'https://www.wowhead.com/cata/items/weapons/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;4:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/weapons/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;7:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/armor/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;4:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/armor/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;7:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/weapons/min-level:1/max-level:55/max-req-level:19/quality:2:3?filter=128:161:195;6:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/armor/min-level:1/max-level:55/max-req-level:19/quality:2:3?filter=128:161:195;6:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/min-level:1/max-level:1/max-req-level:85/quality:7?filter=128:161:195;6:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/min-level:1/max-level:1/max-req-level:85/quality:7?filter=128:161:195;7:1:1;0:0:0',
  ], 'scrapping wowhead search results', async url => {
    const body = await fetchText(url)
    const lines = body.split('\n')
    const itemview = lines.find(line => line.startsWith('var listviewitems = '))
    const questview = lines.find(line => line.startsWith('new Listview('))
    const { WHData, itemList, listData } = (new Function(`
      const WHData = []
      class Listview { constructor(data) { this.listData = data; this.WHData = WHData } }
      const WH = { Gatherer: { addData: (...args) => WHData.push(args) }}
      ${lines.filter(line => line.startsWith('WH.Gatherer.addData')).join('\n')}
      ${itemview
        ? `${itemview}\nreturn { itemList: listviewitems, WHData }`
        : `return ${lines.find(line => line.startsWith('new Listview('))}`}
    `))()

    for (const item of (itemList || [])) {
      items[item.id] = item
    }

    if (listData?.id === 'quests') {
      for (const quest of listData.data) {
        quests[quest.id] = quest
      }
    }

    const isItemData = entry => entry[0] === 3 && entry[1] === 11
    const itemEntries = Object.entries(WHData.find(isItemData)[2])
    for (const [id, item] of itemEntries) {

      const { name_enus, jsonequip, ...rest } = item
      Object.assign(items[id] || (items[id] = { id }), jsonequip, rest)
    }
  })

  const log = s => console.log(JSON.parse(JSON.stringify(s)))
  // log(await formatItemData(items[51964]))
  // log(await formatItemData(items[15331]))
  // log(await formatItemData(items[15512]))
  await each(Object.values(quests), 'saving quests with tooltips', async (quest) => {
    const text = await fetchText(`https://nether.wowhead.com/tooltip/quest/${quest.id}?dataEnv=11&locale=0&lvl=19`)
    const { tooltip } = JSON.parse(text)
    await Deno.writeTextFile(`quests/${quest.id}.json`, JSON.stringify({ ...quest, tooltip }))
  })

  await each(Object.values(items), 'saving items with tooltips', async (item) => {
    if (!item.id) return console.log(item)
    const data = await formatItemData(item)
    if (!data) return
    await Deno.writeTextFile(`items/${item.id}.json`, JSON.stringify(data))
  })
}

await scrapWH()
// biome format --write items quests

// TODO:
// - items from dungeons where req level > 19

