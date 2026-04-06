/** {f:'debounce.mjs', v:'1.1.2', d:'2023-04-04', du:'2024-06-24'} **/

/*

	import debounce from '/library/js/debounce.mjs'


		deklaracia:
			const myDeboune = debounce( vypisText, 1200 )

		pouzitie:
			el.addEventListener( 'input',  myDeboune.start  )
			el.addEventListener( 'change', myDebounce.run )

		-- // -- // --

		VUE:
		...
		data(){return{ myDebounce: debounce( this.vypisText, 1200 ) })
		...
		watch:{ myParam(){ this.myDebounce.start() } }
		...
		methods:{ vypisText(){...} }


*/

import { to } from './wait.mjs'

const debounce = ( func, wait = 300 )=>{
	// console.log( 'debounce()' )
	let timer,
			isWorking = false;

	// return (...args)=>{
	// 	clearTimeout(timer);
  //   timer = setTimeout( func, wait );
	// }

	const checkArgs = ( args )=>{
		// console.log( 'typeof args: ', typeof args )
		// console.log( 'args: ', args )
		// console.log( Object.keys(args[0])[0] )
		if( typeof args === 'object' ){
			if( args === null )
				return null
			if( Array.isArray(args) )
				return args
			if( Object.keys(args[0])[0] === 'isTrusted' )
				return null
		}
		return args
	}

	const start = ( ...args ) => {
		stop()
		isWorking = true
		args = checkArgs( args )
		timer = setTimeout( ()=>{ runOk( args ) } , wait );
	}

	const stop = () => {
		clearTimeout(timer);
		isWorking = false
	}

	const run = ( ...args ) => {
		stop()
		isWorking = true
		args = checkArgs( args )
		runOk( args )
	}

	const runOk = ( args ) => {
		// console.log( args )
		if( !args )
			func()
		else
			func(...args)
		isWorking = false
	}

	const isEnd = ()=>{
		return !isWorking
	}

	const onEnd = async ( fn, ...options )=>{
		await to( ()=>{ return isEnd() } )
		fn( ...options )
	}

	return {
		start,	// aktivuje (spusti) debounce
		stop,		// zastavi debounce
		run,		// zastavi debounce a spusti funkciu bez cakania
		isEnd,  // [true,false] status ukoncenia cakania
		onEnd,  // po ukonceni spusti uzivatelsku funkciu
	}

}

export default debounce