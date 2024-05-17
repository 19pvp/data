import ProgressBar  from "https://deno.land/x/progress@v1.4.9/mod.ts";

const each = async (data, title, fn) => {
	const total = data.length
	if (!total) return
	const progress = new ProgressBar({ display: `[:bar] :percent :time :completed/:total ${title}`, total })
	let i = -1
	while (++i < total) {
		await progress.render(i)
		await fn(data[i])
	}
	await progress.render(total)
}

const items = {}
const quests = {}
await each([
	'https://www.wowhead.com/cata/quests/min-level:2/max-level:55/max-req-level:19?filter-any=23:22;1:1;0:0',

	// Items must be after because it's more complete and we want to override quest matches
	'https://www.wowhead.com/cata/items/weapons/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;4:1:1;0:0:0',
	'https://www.wowhead.com/cata/items/weapons/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;7:1:1;0:0:0',
	'https://www.wowhead.com/cata/items/armor/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;4:1:1;0:0:0',
	'https://www.wowhead.com/cata/items/armor/min-level:1/max-level:25/max-req-level:19/quality:2:3?filter=128:161:195;7:1:1;0:0:0',
	'https://www.wowhead.com/cata/items/weapons/min-level:1/max-level:45/max-req-level:19/quality:2:3?filter=128:161:195;6:1:1;0:0:0',
	'https://www.wowhead.com/cata/items/armor/min-level:1/max-level:45/max-req-level:19/quality:2:3?filter=128:161:195;6:1:1;0:0:0',
	'https://www.wowhead.com/cata/items/min-level:1/max-level:1/max-req-level:85/quality:7?filter=128:161:195;6:1:1;0:0:0',
	'https://www.wowhead.com/cata/items/min-level:1/max-level:1/max-req-level:85/quality:7?filter=128:161:195;7:1:1;0:0:0',
], 'scrapping wowhead search results', async url => {
	const body = await (await fetch(url)).text()
	const lines = body.split('\n')
	const itemview = lines.find(line => line.startsWith('var listviewitems = '))
	const questview = lines.find(line => line.startsWith('new Listview('))
	const { WHData, itemList, listData } = (new Function('', `
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
	const res = await fetch(`https://nether.wowhead.com/tooltip/quest/${quest.id}?dataEnv=11&locale=0`)
	const { tooltip } = await res.json()
	await Deno.writeTextFile(`quests/${quest.id}.json`, JSON.stringify({ ...quest, tooltip }))
})

await each(Object.values(items), 'saving items with tooltips', async (item) => {
	if (!item.id) return console.log(item)
	const res = await fetch(`https://nether.wowhead.com/tooltip/item/${item.id}?dataEnv=11&locale=0`)
	const { tooltip } = await res.json()
	await Deno.writeTextFile(`items/${item.id}.json`, JSON.stringify({ ...item, tooltip }))
})
