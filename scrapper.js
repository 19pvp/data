import ProgressBar  from "https://deno.land/x/progress@v1.4.9/mod.ts"
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"

const log = s => console.log(JSON.parse(JSON.stringify(s)))
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

const VERBOSE = Deno.stdout.isTerminal()
const workers = 1
const each = async (data, title, fn) => {
  const total = data.length
  if (!total) return
  const progress = VERBOSE && new ProgressBar({ display: `[:bar] :percent :time :completed/:total ${title}`, total })
  let i = -1
  const next = async () => {
    const j = ++i
    if (j >= total) return
    VERBOSE && await progress.render(Math.min(i, total))
    return fn(data[j]).then(next)
  }
  await Promise.all([...Array(workers).keys()].map(() => next()))
  VERBOSE && await progress.render(total)
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

const ITEM_CLASS = {
  0: 'CONSUMABLE',
  1: 'CONTAINER',
  2: 'WEAPON',
  3: 'GEM',
  4: 'ARMOR',
  5: 'REAGENT',
  6: 'PROJECTILE',
  7: 'TRADEGOODS',
  8: 'ITEM_ENHANCEMENT',
  9: 'RECIPE',
  10: 'CURRENCY_TOKEN_OBSOLETE',
  11: 'QUIVER',
  12: 'QUEST',
  13: 'KEY',
  14: 'PERMANENT_OBSOLETE',
  15: 'MISCELLANEOUS',
  16: 'GLYPH',
  17: 'BATTLEPET',
  18: 'WOW_TOKEN',
  19: 'PROFESSION',
}

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

const CONSUMABLE_SUBCLASS = {
  0: 'GENERIC',
  1: 'POTION',
  2: 'ELIXIR',
  3: 'FLASK',
  4: 'SCROLL',
  5: 'FOOD_DRINK',
  6: 'ITEM_ENHANCEMENT',
  7: 'BANDAGES',
  8: 'OTHER',
  [-3]: 'ITEM_ENHANCEMENT_TEMPORARY',
}

const SOURCE_TYPES = { 2: 'DROP', 4: 'QUEST', 5: 'VENDOR' }
const SOURCE_MORE = {
  DROP: ['z', 'zone'],
  PVP: [],
}
const SUBCLASSES = {
  CONSUMABLE: CONSUMABLE_SUBCLASS,
  WEAPON: WEAPON_SUBCLASS,
  ARMOR: ARMOR_SUBCLASS,
}

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

const SHATTERED_SUN_OFFENSIVE = 1077 // Not accessible lvl 19

const itemBlackList = new Set([
  38916, // 2h spirit enchant, deprecated
  46026, // lvl 75 req Enchant Weapon - Blade Ward
  46098, // lvl 75 req Enchant Weapon - Blood Draining
])

const slotsNamesAliases = [
  ['TWO_HAND', '2H-WEAPON'],
  ['TWO_HAND', '2H WEAPON'],
  ['TWO_HAND', 'TWO-HANDED'],
  ['MAIN_HAND', 'WEAPON'],
  ['ONE_HAND', 'WEAPON'],
  ['HANDS', 'GLOVES'],
  ['FEET', 'BOOTS'],
  ['BACK', 'CLOAK'],
  ['WRISTS', 'BRACER'],
  ['RANGED', 'BOW OR GUN'],
  ['FISHING_POLE', 'FISHING POLE'],
  ...Object.values(INVENTORY_TYPE).map(key => [key, key]),
]
const formatItemData = async (data) => {
  const CLASS = ITEM_CLASS[data.classs]
  const SUBCLASS = SUBCLASSES[CLASS]?.[data.subclass]
  if (data.reqskillrank > 150) return
  if (itemBlackList.has(data.id)) return
  if ((CLASS === 'ARMOR' || CLASS === 'WEAPON') && data.quality < 2) return // White & Junk
  if (SUBCLASS === 'ITEM_ENHANCEMENT' && (data.level > 34 && !data.name.endsWith('Spike'))) return
  if (data.reqfaction === SHATTERED_SUN_OFFENSIVE) return
  if (data.name?.startsWith('Krom\'gar')) return // Bunch of vendor items without reqLevel but need a lvl 24 pre-quest
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
    tooltip.rest = value
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
          // ex: +(6 - 7) Fire Spell Damage 
          const [_, sign, min, qty, text] = line.trim().split(/([+-])\(([0-9]+) - ([0-9]+)\) /)
          return [text, Number(`${sign}${qty}`)]
        }
        // ex: +5 Stamina
        const [prefix, qty, suffix, extra] = line.trim().split(/ ?([+-][0-9]+) ?/)
        const text = prefix || suffix
        return [text, Number(qty)]
      })

      rand.push([
        suffixName,
        {
          id: SUFFIXES.find(s => s.name === suffixName && statsEntries.every(([k, v]) => s.effects[k] === v))?.id
          || RANDOM_SUFFIXES.find(s => s.name === suffixName)?.id, // exact stats distribution may be wrong
          chance: Number(chance.textContent.split(/\(([0-9.]+)%/)[1]),
          stats: Object.fromEntries(statsEntries),
        },
      ])
    }
  }

  const effects = ([...(tooltip['itemEffects:1'] || []), ...tooltip.rest])
    .filter(e => e.includes('href=') && !e.includes('Experience gained'))
    .map(e => {
      const eDOM = toDOM(e)
      if (!e.includes(': ')) {
        if (/<!--si([0-9]+):([0-9]+)-->/g.test(e)) {
          // TODO: add set items info !
          return
        }
        
        return ['info', eDOM.textContent.replaceAll(' ', '')]
      }
      const tt = e.split(':')[0].replace(/ ([A-Z])/ig, (_, m) => m.toUpperCase())
      const type = tt[0].toLowerCase() + tt.slice(1)
      const spell = Number(e.split(/href="\/cata\/spell=([0-9]+)/)[1])
      const text = eDOM.textContent.split(':')[1].trim().replaceAll(' ', '')
      if (text.includes('This enchantment requires the wielder is at least level 75')) {
        console.log(data.id, data.name)
      }
      return [type, { spell, text }]
    })
    .filter(Boolean)

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

  // Handle item enchants
  if (SUBCLASS === 'ITEM_ENHANCEMENT') {
    // TODO: list mats required too
    const spellTextParts = tooltip.rest.join('').split(/href="\/cata\/spell=([0-9]+)/)
    const spellId = Number(spellTextParts[1])
    const spellRes = await fetchText(`https://www.wowhead.com/cata/spell=${spellId}`)
    const spellDOM = toDOM(spellRes)
    const el = [...spellDOM.querySelectorAll('#spelldetails tr td')]
      .find(tr => tr.textContent.includes('Enchant Item: '))
    const descriptionParts = [...el.childNodes]
      .filter(child => child.tagName !== 'SMALL')
      .map(child => (child.nodeValue || child.textContent || '').trim())
      .filter(Boolean)

    const enchantDescription = spellTextParts[2].toUpperCase()
    if (enchantDescription.includes(' THREAT ')) return
    let types = slotsNamesAliases
      .filter(([k, v]) => enchantDescription.includes(v))
      .map(([k]) => k)

    if (types.includes('TWO_HAND')) {
      types = ['TWO_HAND']
    } else if (types.includes('ONE_HAND')) {
      types.push('TWO_HAND')
    }

    const description = descriptionParts.slice(1, -1).join(' ').replaceAll(' ', '')
    const enchantId = Number(descriptionParts.at(-1).trim().slice(1, -1))
    const newStats = {}
    let spell
    for (const line of description.replaceAll(/[()]/g, '').split(' and ')) {
      if (line.includes('Spike')) {
        const [_, min, max] = line.split(/([0-9]+)-([0-9]+)/)
        stats.Spike = Number(min) + Math.round((Number(max) - Number(min)) / 2)
        continue
      }
      const [prefix, qty, suffix] = line.trim().split(/ ?([+-]?[0-9]+%?) ?/)
      const text = suffix || prefix
      const qtyValue = qty?.endsWith('%') ? Number(qty.slice(0, -1)) / 100 : Number(qty)
      if (text === 'Minor Speed Increase') {
        stats['Run Speed'] = 0.5
      } else if (text === 'Counterweight') {
        stats.Haste = qtyValue
      } else if (text === 'All Stats') {
        stats.Agility = qtyValue
        stats.Strength = qtyValue
        stats.Intellect = qtyValue
        stats.Spirit = qtyValue
        stats.Stamina = qtyValue
      } else if (text.startsWith('All Resistance')) {
        stats["Fire Resistance"] = qtyValue
        stats["Frost Resistance"] = qtyValue
        stats["Holy Resistance"] = qtyValue
        stats["Shadow Resistance"] = qtyValue
        stats["Nature Resistance"] = qtyValue
        stats["Arcane Resistance"] = qtyValue
      } else {
        qtyValue ? (stats[text] = qtyValue) : (stats.enchant = text)
      }
    }
    effects.push(['enchant', { description, id: enchantId, types }])
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
    flag: data.flag,
    icon: data.icon,
    dmgMin: data.dmgmin1,
    dmgMax: data.dmgmax1,
    speed: data.speed,
    dps: Number((((data.dmgmin1+data.dmgmax1) /2) / data.speed).toFixed(2)) || undefined,
    popularity: data.popularity,
    armor: data.armor,
    side: SIDE[data.side],
    class: ITEM_CLASS[data.classs],
    quality: QUALITY[data.quality],
    subclass: SUBCLASSES[ITEM_CLASS[data.classs]]?.[data.subclass],
    type: INVENTORY_TYPE[data.slot],
    stats: Object.keys(stats).length ? stats : undefined,
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

    //// Quests
    'https://www.wowhead.com/cata/quests/min-level:2/max-level:55/max-req-level:19?filter-any=23:22;1:1;0:0',

    // Items must be after because it's more complete and we want to override quest matches

    // Drops Items
    'https://www.wowhead.com/cata/items/weapons/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;4:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/weapons/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;7:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/armor/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;4:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/armor/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;7:1:1;0:0:0',

    // Quest Items
    'https://www.wowhead.com/cata/items/weapons/min-level:1/max-level:55/max-req-level:19/quality:2:3?filter=128:161:195;6:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/armor/min-level:1/max-level:55/max-req-level:19/quality:2:3?filter=128:161:195;6:1:1;0:0:0',

    // Vendor Items
    'https://www.wowhead.com/cata/items/min-level:10/max-req-level:19/quality:2:3?filter=128:195;7:1;0:0',

    // Crafted Items
    'https://www.wowhead.com/cata/items/max-req-level:19?filter=128:195:111;3:1:4;0:0:150',

    // Heirlooms
    'https://www.wowhead.com/cata/items/min-level:1/max-level:1/max-req-level:85/quality:7?filter=128:161:195;6:1:1;0:0:0',
    'https://www.wowhead.com/cata/items/min-level:1/max-level:1/max-req-level:85/quality:7?filter=128:161:195;7:1:1;0:0:0',

    //*/// Permanent Enchants
    'https://www.wowhead.com/cata/items/consumables/item-enhancements-permanent/max-req-level:19',

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
// - fix RANDOM_SUFFIXES match to have proper stat distribution

