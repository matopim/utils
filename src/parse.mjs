/** {f:'parse.mjs', v:'1.1.7', d:'2023-05-07', du:'2025-05-27'} **/

/*

import parse from '/library/js/parse.mjs';

*/

import boolean from './boolean.mjs'

const parse = ( inp, ignore = '', booleans = '' ) => parseInit( inp, ignore, booleans )

export default parse


let ignoreFields = [];
let booleanFields = [];


function parseInit( inp, ignore, booleans ){
	ignoreFields  = ignore.split(',');
	booleanFields = booleans.split(',');
	return parseInput( inp );
}


function parseInput( inp ){

	if( inp instanceof Array )
		return parseArray( inp );

	if( inp instanceof Object )
		return parseObject( inp );

	if( inp === null || new RegExp(/^null$/i).test( inp ) )
		return null;

	if( inp === undefined || new RegExp(/^undefined$/i).test( inp ) )
		return undefined;

	if( inp === true || new RegExp(/^true/i).test( inp ) )
		return true;

	if( inp === false || new RegExp(/^false/i).test( inp ) )
		return false;

	if( new RegExp(/^NaN/).test( inp ) )
		return NaN
	if( typeof inp === 'number' )
		if( isSafeNumber( inp ) )
			return inp
		else
			inp = inp.toString()

	if( !new RegExp(/\D/).test( inp ) )
		if( isSafeNumber( inp ) )
			return Number( inp )
		else
			return inp

	if( typeof inp === 'string' ){
		try{
			// test na json
			if( new RegExp('^/[|^/{').test( inp ) )
				inp = JSON.parse( inp )
			else
				inp = parseString( inp )
		} catch(e){
			// ak zlyhal test, ide o string
			inp = parseString( inp )
		}
	}

	return inp
}

function parseString( str ){
	// console.log('parseString...')
	if( str.trim() === '' ) return str;
	// if( new RegExp(/true/, 'i').test( str ) ) return true;
	// if( new RegExp(/false/, 'i').test( str ) ) return false;
	// if( new RegExp(/null/, 'i').test( str ) ) return null;
	// if( new RegExp(/undefined/, 'i').test( str ) ) return undefined;
	if( new RegExp(/[a-z]|\/|\\|\:|^\+/i).test( str ) ) return str; // ^+ napr. tel. cislo
	if( new RegExp(/^[0-9]|[0-9]$/).test( str ) ){
		if( new RegExp(/\,|\.|\-/).test( str ) ){
			if(countChar(/-/g, str) >= 2) // datum v SQL formate
				return str;
			if(countChar(/-/g, str) === 1) // skrateny datum v SQL formate | dalsi test na znamienko minus
				if( str.indexOf('-') > 0 ) // ak je '-' na zaciatku, ide o znamieno minus
					return str;
			if(countChar(/\./g, str) >= 2) // datum v SK formate, alebo gps suradnice, alebo seriove cisla
				return str;
			if(countChar(/,/g, str) > 1) // nieco ine
				return str;
			}
	}
	str = str.replace( ' ', '', str );  // dlhe cislo s oddelovacom typu medzera
	str = str.replace( ',', '.', str ); // cislo v SK formate na EN format

	if( !isSafeNumber( str ) )
		return str

	// cislo
	str = Number( str ) || str
	return str;
}

function countChar( pat, str ){
	const ary = [...str.matchAll( pat )]
	return ary.length
}


function parseArray(inp) {
	const ary = inp.map(item => parseInput(item));
	return ary;
}


function parseObject(inp){
	for (let k in inp) {
		if (ignoreFields.includes(k))
			inp[k] = inp[k];
		else if (booleanFields.includes(k))
			inp[k] = boolean(inp[k]);
		else
			inp[k] = parseInput(inp[k]);
	}
	return inp;
}

// cislo - test na MAX INT pre JS = 9007199254740999  => Number('9007199254740999') = 9007199254741000
// moze sa vyskytnut napr. ako currenttimestamp() z SQL dotazu
function isSafeNumber( str ){
	const c = Number( str )
	// console.log( str, c, c.toString() )
	return c.toString() === str
}