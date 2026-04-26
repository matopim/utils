/** {f:'filter-menu.mjs', v:'1.0.1', d:'2026-04-09', du:'2026-04-22'} **/

/*

	import filterMenu from '@pim.sk/utils/filter-menu.mjs'

	Pouzitie - atributova auto-inicializacia (bez kodu navyse):
	------------------------------------------------------------
	<input type="search" data-filter-menu="#navBar .menu-list .menu-list li" />

	Pouzitie - manualna inicializacia:
	-----------------------------------
	filterMenu({ input: inputEl, selector: '#navBar .menu-list .menu-list li' })
	filterMenu({ input: inputEl, items: [li1, li2, ...] })

	Parametre:
		input        - HTMLElement, vstupny input element
		selector     - string, CSS selector pre li elementy (alternativa k items)
		items        - NodeList|Array, priamo pole/zoznam li elementov
		debounceWait - number, oneskorenie debounce v ms (default: 250)

	Poznamky:
		- Text pre vyhladavanie sa cita z <a> tagu (innerText) vrátane <small>
		- Podporuje diakritiku cez accentMap (a = á, e = é, ...)
		- search event pokryva kliknutie na X (clear) v type="search" inpute

*/

import { accentMap } from './strings.mjs'
import debounce from './debounce.mjs'

function filterMenu({ input, selector = null, items = null, debounceWait = 250 } = {}) {

	if( !input )
		return null

	const liItems = items
		? [...items]
		: selector
			? [...document.querySelectorAll(selector)]
			: []

	if( !liItems.length )
		return null

	// indexovanie labelov z vyrenderovanych <a> tagov
	liItems.forEach(li => {
		const text = li.querySelector('a')?.innerText ?? li.innerText ?? ''
		li.dataset.filterLabel = accentMap(text).toLowerCase()
	})

	const doFilter = (query) => {
		const q = accentMap(query ?? '').toLowerCase().trim()

		// 1. pass: skry/zobraz podla zhody labelu
		liItems.forEach(li => {
			li.hidden = !!q && !li.dataset.filterLabel.includes(q)
		})

		// 2. pass: ak ma skryty li viditelneho potomka, odkry ho
		if( q ){
			liItems.forEach(li => {
				if( li.hidden ){
					const hasVisibleChild = liItems.some(child => child !== li && li.contains(child) && !child.hidden)
					if( hasVisibleChild )
						li.hidden = false
				}
			})
		}
	}

	const dFilter = debounce(doFilter, debounceWait)

	input.addEventListener('input',  e => dFilter.start(e.target.value))
	input.addEventListener('search', e => dFilter.run(e.target.value))  // clear / Enter

	return { doFilter }
}


// auto-inicializacia na zaklade atributu data-filter-menu
function autoInit() {
	document.querySelectorAll('[data-filter-menu]').forEach(input => {
		filterMenu({
			input,
			selector: input.dataset.filterMenu,
		})
	})
}

if( document.readyState === 'loading' )
	document.addEventListener('DOMContentLoaded', autoInit)
else
	autoInit()


export default filterMenu
export { filterMenu, autoInit }
