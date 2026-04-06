/** {f:'fulltext-filter.mjs', v:'1.0.0', d:'2025-01-15', du:'2025-01-15'} **/


/*
	import {fulltextFilter} from '/library/js/fulltext-filter.mjs'

	Pouzitie:
	---------
	const menu = [
		{id: 1, kod: 'admin', nazov: 'Administracia', popis: 'Sprava systemu'},
		{id: 2, kod: 'eshop', nazov: 'E-shop', popis: 'Online obchod'},
		{id: 3, kod: 'katalog', nazov: 'Katalog', popis: 'Zoznam produktov'}
	];

	// vyhladavanie vo vsetkych poliach objektu
	const vysledok1 = fulltextFilter(menu, 'admin');
	// => [{id: 1, kod: 'admin', nazov: 'Administracia', popis: 'Sprava systemu'}]

	// vyhladavanie len v urcitych poliach
	const vysledok2 = fulltextFilter(menu, 'shop', {fields: ['nazov', 'popis']});
	// => [{id: 2, kod: 'eshop', nazov: 'E-shop', popis: 'Online obchod'}]

	// vyhladavanie viacerych slov (AND - vsetky slova musia byt najdene)
	const vysledok3 = fulltextFilter(menu, 'online obchod', {fields: ['nazov', 'popis']});
	// => [{id: 2, kod: 'eshop', nazov: 'E-shop', popis: 'Online obchod'}]

	// case-insensitive, podporuje diakritiku (a = á, e = é, atd.)
	const vysledok4 = fulltextFilter(menu, 'zoznam produktov');
	// => [{id: 3, kod: 'katalog', nazov: 'Katalog', popis: 'Zoznam produktov'}]

	// vypnutie ignorovania diakritiky
	const vysledok5 = fulltextFilter(menu, 'zoznam', {bAccent: false});
	// => filtrovanie s rozlisovanim diakritiky
*/


import { accentMap } from './strings.mjs'


// fulltextove filtrovanie pola objektov
// ary = pole objektov na filtrovanie
// searchText = text na vyhladavanie (case-insensitive, podporuje diakritiku)
// options = volitelne: objekt s nastaveniami
//   options.fields = pole nazvov poli, v ktorych sa ma hladat (ak nie je zadane, hladaju sa vo vsetkych poliach)
//   options.bAccent = ci ignorovat diakritiku (default: true = ignoruje)
//   options.minSearchLength = minimalna dlzka vyhladavacieho textu (default: 0)
function fulltextFilter(ary, searchText, options = {}){
	// default options
	const defaultOptions = {
		fields: null,
		bAccent: true,
		minSearchLength: 0,
	};

	// spojenie default options so vstupnymi uzivatelskymi
	const opts = Object.assign({}, defaultOptions, options);

	// vybrat hodnoty z options do jednotlivych premennych
	const fields = opts.fields;
	const bAccent = opts.bAccent;
	const minSearchLength = opts.minSearchLength;

	if( !Array.isArray(ary) || !ary.length )
		return [];

	if( !searchText || typeof searchText !== 'string' )
		return ary;

	// normalizacia vyhladavacieho textu
	let srch = searchText.trim();
	if( !srch )
		return ary;

	// kontrola minimalnej dlzky vyhladavacieho textu
	if( srch.length < minSearchLength )
		return ary;

	// normalizacia na lowercase
	srch = srch.toLowerCase();

	// odstranenie diakritiky ak je povolene
	if( bAccent )
		srch = accentMap(srch);

	// rozdelit na jednotlive slova (medzera = AND operator)
	const searchWords = srch.split(/\s+/).filter(w => w.length > 0);

	if( !searchWords.length )
		return ary;

	// urcit polia, v ktorych sa ma hladat
	let fieldKeys = [];
	if( fields === null || fields === undefined ){
		// hladat vo vsetkych poliach prveho objektu
		if( ary[0] && typeof ary[0] === 'object' )
			fieldKeys = Object.keys(ary[0]);
	} else if( Array.isArray(fields) && fields.length > 0 ){
		fieldKeys = fields;
	} else {
		return ary;
	}

	if( !fieldKeys.length )
		return ary;

	// filtrovanie
	return ary.filter( item => {
		// prechadzat vsetky vyhladavacie slova (AND logika)
		for( const word of searchWords ){
			let found = false;

			// prechadzat vsetky urcene polia objektu
			for( const fieldKey of fieldKeys ){
				const fieldValue = item[fieldKey];

				// preskocit ak hodnota nie je string alebo number
				if( fieldValue === null || fieldValue === undefined )
					continue;

				// konverzia na string
				let val = String(fieldValue);
				if( !val )
					continue;

				// normalizacia
				val = val.toLowerCase();
				if( bAccent )
					val = accentMap(val);

				// kontrola zhody (obsahuje vyhladavacie slovo)
				if( val.indexOf(word) !== -1 ){
					found = true;
					break; // naslo sa v jednom poli, staci
				}
			}

			// ak jedno slovo sa nenaslo, objekt nevyhovuje (AND logika)
			if( !found )
				return false;
		}

		// vsetky slova sa nasli
		return true;
	} );
}


export {
	fulltextFilter,
}
