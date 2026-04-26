/** {f:'copy-code.mjs', v:'1.1.3', d:'2026-04-11', du:'2026-04-26'} **/

/*
	Prida tlacidlo na kopirovanie obsahu elementu oznaceneho data-copy-code do clipboardu.
	Button sa vlozi ako predchadzajuci surodenec - bez obalenia wrapperom.

	Hodnota atributu data-copy-code:
	  - prazdna / chybajuca hodnota  → obsah kopiruje zo samotneho elementu
	  - selektor napr. "code"        → obsah kopiruje z prveho child elementu zodpovedajuceho selektoru

	Pouzitie:
	  import copyCode from '@pim.sk/utils/copy-code.mjs'
	  copyCode()

	  alebo automaticka inicializacia po nacitani DOM:
	  import '@pim.sk/utils/copy-code.mjs'

	Priklady HTML:
	  <pre data-copy-code>...</pre>
	  <pre data-copy-code="code"><code>...</code></pre>
	  <div data-copy-code="textarea.my-area"><textarea class="my-area">...</textarea></div>
*/

import flashMessage from '@pim.sk/utils/flash-message/flash-message.mjs'

const CSS = `
.copy-code-btn {
	position: fixed;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.2s ease;
	cursor: pointer;
	z-index: 1050;
	padding: 0.2rem 0.5rem;
	font-size: 0.8rem;
	line-height: 1;
	border-radius: 4px;
}
.copy-code-btn.is-visible {
	opacity: 1;
	pointer-events: auto;
}
.copy-code-btn:active {
	transform: scale(0.92);
}
`

function injectStyles() {
	if ( document.getElementById('copy-code-styles') ) return
	const style = document.createElement('style')
	style.id = 'copy-code-styles'
	style.textContent = CSS
	document.head.appendChild(style)
}

function decodeHtmlEntities(html) {
	const el = document.createElement('textarea')
	el.innerHTML = html
	return el.value
}

const DEFAULT_BTN_CLASS = 'button is-small is-light btn btn-sm btn-outline-secondary'

function buildButton() {
	const btn = document.createElement('button')
	btn.type = 'button'
	btn.className = 'copy-code-btn'
	btn.title = 'Copy code'
	btn.innerHTML = '<i class="fa fa-clipboard" aria-hidden="true"></i>'
	return btn
}

function resolveSource(el) {
	const selector = ( el.getAttribute('data-copy-code') ?? '' ).trim()
	if ( !selector ) return el
	const child = el.querySelector(selector)
	if ( !child ) {
		console.warn('[copy-code] selektor "' + selector + '" nenasiel ziadny element v:', el)
		return el
	}
	return child
}

function getContent(sourceEl) {
	// textarea / input → .value, ostatne → innerHTML
	if ( sourceEl instanceof HTMLTextAreaElement || sourceEl instanceof HTMLInputElement )
		return sourceEl.value
	return decodeHtmlEntities(sourceEl.innerHTML)
}

function bindElement(el) {
	if ( el.dataset.copyCodeBound ) return
	el.dataset.copyCodeBound = '1'

	const btn = buildButton()
	// vlozit button PRED element - bez obalenia wrapperom
	el.insertAdjacentElement('beforebegin', btn)

	let hideTimer = null

	function placeBtn() {
		const rect = el.getBoundingClientRect()
		btn.style.top  = (rect.top  + 6) + 'px'
		btn.style.right = (window.innerWidth - rect.right + 6) + 'px'
	}

	function showBtn() {
		clearTimeout(hideTimer)
		placeBtn()
		// trieda sa cita lazy — zachyti aj zmeny atributu po inicializacii
		const customClass = el.getAttribute('data-copy-code-class')
		btn.className = 'copy-code-btn is-visible ' + ( customClass ?? DEFAULT_BTN_CLASS )
	}

	function scheduleHide() {
		hideTimer = setTimeout(() => btn.classList.remove('is-visible'), 120)
	}

	el.addEventListener('mouseenter', showBtn)
	el.addEventListener('mouseleave', scheduleHide)
	btn.addEventListener('mouseenter', () => clearTimeout(hideTimer))
	btn.addEventListener('mouseleave', scheduleHide)

	btn.addEventListener('click', async () => {
		const sourceEl = resolveSource(el)
		const text = getContent(sourceEl)
		try {
			await navigator.clipboard.writeText(text)
			flashMessage('Kod skopirowany do schranky.', 'is-success', 'fa fa-check fa-2x')
		} catch (err) {
			flashMessage('Kopirovanie zlyhalo: ' + err.message, 'is-danger', 'fa fa-times fa-2x')
		}
	})
}

function copyCode(input = '[data-copy-code]') {
	injectStyles()
	let els
	if ( typeof input === 'string' ) {
		els = document.querySelectorAll(input)
	} else if ( input instanceof Element ) {
		els = [ input ]
	} else if ( input?.[Symbol.iterator] ) {
		els = Array.from(input)
	} else {
		els = []
	}
	els.forEach(bindElement)
}

// automaticka inicializacia
if ( document.readyState === 'loading' ) {
	document.addEventListener('DOMContentLoaded', () => copyCode())
} else {
	copyCode()
}

export default copyCode
