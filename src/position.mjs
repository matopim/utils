/** {f:'position.mjs', v:'1.1.3', d:'2023-04-06', du:'2024-06-24'} **/


/*

	import position from '/library/js/position.mjs'


	vrati poziciu prvku na obrazovke - prechadza aj cez shadowRoot

	priklad:

		const p = new position(selector)

		let top = p.top,
				top_of_page = p.topp

*/



// obj.getBoundingClientRect()   https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

class position {

	constructor( selector ){
		// definovat pos
		this.pos = {}
		// identifikovat objekt
		this.el = selector
		if( !(this.el instanceof Element) )
			this.el = this.searchElement( selector )
		if( !(this.el instanceof Element) )
			return console.log('class position: Object not exist. (selector): ', selector)

		this.pos = this.getAllPositions()

	}

	get get()     { return this }
	get top()     { return this.pos.top }
	get topp()    { return this.pos.topp }
	get bottom()  { return this.pos.bottom }
	get left()    { return this.pos.left }
	get leftp()   { return this.pos.leftp }
	get right()   { return this.pos.right }
	get width()   { return this.pos.width }
	get height()  { return this.pos.height }
	get x()       { return this.pos.x }
	get y()       { return this.pos.y }
	get xp()      { return this.pos.xp }
	get yp()      { return this.pos.yp }
	get padtop()     { return this.pos.padtop }
	get padbottom()  { return this.pos.padbottom }
	get padleft()    { return this.pos.padleft }
	get padright()   { return this.pos.padright }






	searchElement( selector ){
		// sel - search element
		let sel = document.querySelector( selector )
		if( sel instanceof Element )
			return sel
		// pokracuj v hladani aj do shadow root
		const aS = []
		for( const obj of document.body.querySelectorAll('\*') ){
			if( obj.shadowRoot ){
				aS.push( obj )
			}
		}
		// console.log( 'aS: ', aS )
		// prehladaj shadowRoot na selector
		for( const obj of aS ){
			sel = obj.shadowRoot.querySelector(selector)
			if( sel )
				return sel
		}
		return null
	}


	getAllPositions(){
		let pos  = this.el.getBoundingClientRect(),
				cstl = getComputedStyle(this.el),
				html = document.body

		// console.log( pos )
		pos.xp = pos.x + Math.abs(html.scrollLeft)
		pos.yp = pos.y + Math.abs(html.scrollTop)
		pos.leftp = pos.left + Math.abs(html.scrollLeft)
		pos.topp  = pos.top  + Math.abs(html.scrollTop)
		pos.padtop = this.px2num(cstl.getPropertyValue('padding-top'))
		pos.padbottom = this.px2num(cstl.getPropertyValue('padding-bottom'))
		pos.padleft = this.px2num(cstl.getPropertyValue('padding-left'))
		pos.padright = this.px2num(cstl.getPropertyValue('padding-right'))
		pos.zIndex = cstl.getPropertyValue('z-index')
		// pos.witdhCalc = cstl.getPropertyValue('width')
		// pos.heightCalc = cstl.getPropertyValue('height')
		pos.html = {
			scrollTop: html.scrollTop,
			scrollLeft: html.scrollLeft,
			scrollWidth: html.scrollWidth,
			scrollHeight: html.scrollHeight,
			clientTop: html.clientTop,
			clientLeft: html.clientLeft,
			clientWidth: html.clientWidth,
			clientHeight: html.clientHeight,
			offsetTop: html.offsetTop,
			offsetLeft: html.offsetLeft,
			offsetWidth: html.offsetWidth,
			offsetHeight: html.offsetHeight
		}
		// prilis vela vlastnosti cca 369
		// pos.cstl = []
		// for( const c of cstl ){
		// 	const v = cstl.getPropertyValue(c)
		// 	if( v )
		// 		pos.cstl.push( { c, v } )
		// }

		return pos
	}

	px2num( px ){
		if( !new RegExp(/px$/).test(px) )
			return px
		return parseFloat(px.replace('px'))
	}

}


export default position