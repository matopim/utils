/** {f:'array.mjs', v:'1.1.3', d:'2023-01-15', du:'2025-01-07'} **/


/*

	import {proxyToAry,objectToAry} from '/library/js/array.mjs'


*/

// zmeni asociativne pole na klasicke pole
// = Object.values(...)
function objectToAry(ary){
	return Object.values(ary)
}


// zmeni proxy pole (...po asynchronnom nacitani) na klasicky objekt (alebo pole)
function proxyToAry(ary){
	return JSON.parse(JSON.stringify(ary));
	// let pta = JSON.parse(JSON.stringify(ary));
	// // console.log('pta: ', pta)
	// if( Array.isArray(pta) )
	// 	pta = [...pta];
	// return pta;
}


export {
	objectToAry,
	proxyToAry,
}