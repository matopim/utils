/** {f:'fulltext-filter.mjs', v:'2.0.1', d:'2025-01-15', du:'2026-04-22'} **/


/*
	import {fulltextFilter} from '@pim.sk/utils/fulltext-filter.mjs'

	Operatory:
	----------
	medzera = AND  (vsetky slova musia byt najdene)
	ciarka  = OR   (staci ak vyhovuje jedna skupina)

	Pouzitie:
	---------
	const menu = [
		{id: 1, kod: 'admin', nazov: 'Administracia', popis: 'Sprava systemu'},
		{id: 2, kod: 'eshop', nazov: 'E-shop', popis: 'Online obchod'},
		{id: 3, kod: 'katalog', nazov: 'Katalog', popis: 'Zoznam produktov'}
	];

	// vyhladavanie vo vsetkych poliach objektu
	const vysledok1 = fulltextFilter(menu, 'admin');
	// => [{id: 1, ...}]

	// vyhladavanie len v urcitych poliach
	const vysledok2 = fulltextFilter(menu, 'shop', {fields: ['nazov', 'popis']});
	// => [{id: 2, ...}]

	// AND operator (medzera) - vsetky slova musia byt najdene
	const vysledok3 = fulltextFilter(menu, 'online obchod');
	// => [{id: 2, ...}]

	// OR operator (ciarka) - staci jedna skupina
	const vysledok4 = fulltextFilter(menu, 'admin,katalog');
	// => [{id: 1, ...}, {id: 3, ...}]

	// kombinacia AND + OR: (online obchod) OR (zoznam)
	const vysledok5 = fulltextFilter(menu, 'online obchod,zoznam');
	// => [{id: 2, ...}, {id: 3, ...}]

	// case-insensitive, podporuje diakritiku (a = á, e = é, atd.)
	// vypnutie ignorovania diakritiky
	const vysledok6 = fulltextFilter(menu, 'zoznam', {bAccent: false});
*/


import { accentMap } from './strings.mjs'


// fulltextove filtrovanie pola objektov
// ary = pole objektov na filtrovanie
// searchText = text na vyhladavanie (case-insensitive, podporuje diakritiku)
//   medzera = AND operator (vsetky slova v skupine musia byt najdene)
//   ciarka  = OR  operator (staci ak vyhovuje aspon jedna skupina)
// options = volitelne: objekt s nastaveniami
//   options.fields         = pole nazvov poli na hladanie (null = vsetky polia)
//   options.bAccent        = ignorovat diakritiku (default: true)
//   options.minSearchLength = minimalna dlzka searchText (default: 0)
function fulltextFilter(ary, searchText, options = {}){
	const opts = Object.assign({ fields: null, bAccent: true, minSearchLength: 0 }, options);
	const { fields, bAccent, minSearchLength } = opts;

	if( !Array.isArray(ary) || !ary.length )
		return [];

	if( !searchText || typeof searchText !== 'string' )
		return ary;

	let srch = searchText.trim();
	if( !srch )
		return ary;

	if( srch.length < minSearchLength )
		return ary;

	srch = srch.toLowerCase();
	if( bAccent )
		srch = accentMap(srch);

	// ciarka = OR operator: rozdelit na skupiny
	// medzera = AND operator: kazda skupina sa rozdelit na slova
	const orGroups = srch
		.split(',')
		.map(group => group.trim().split(/\s+/).filter(w => w.length > 0))
		.filter(group => group.length > 0);

	if( !orGroups.length )
		return ary;

	// urcit polia, v ktorych sa ma hladat
	let fieldKeys = [];
	if( fields === null || fields === undefined ){
		if( ary[0] && typeof ary[0] === 'object' )
			fieldKeys = Object.keys(ary[0]);
	} else if( typeof fields === 'string' && fields.length > 0 ){
		fieldKeys = [ fields ];
	} else if( Array.isArray(fields) && fields.length > 0 ){
		fieldKeys = fields;
	} else {
		return ary;
	}

	if( !fieldKeys.length )
		return ary;

	// normalizovane hodnoty poli pre dany item
	const getVals = (item) => fieldKeys.map(key => {
		const v = item[key];
		if( v === null || v === undefined ) return '';
		let s = String(v).toLowerCase();
		if( bAccent ) s = accentMap(s);
		return s;
	});

	// vsetky AND slova skupiny musia byt najdene v aspon jednom poli
	const matchesGroup = (vals, words) =>
		words.every(word => vals.some(val => val.indexOf(word) !== -1));

	// OR logika: staci ak aspon jedna skupina plne vyhovuje
	return ary.filter(item => {
		const vals = getVals(item);
		return orGroups.some(group => matchesGroup(vals, group));
	});
}


export {
	fulltextFilter,
}
