/** {f:'strings.mjs', v:'1.2.1', d:'2022-10-24', du:'2025-07-02'} **/

/*

import {} from '/library/js/strings.mjs';


	accentMap( str, addPatterns = [ ['ß','S'] ] ) // zmeni diakritiku na zakladne znaky a-z|A-Z
	emptyMap( str, replaceStr )  // nahradi prazdne alebo nepovolene znaky a nahradi ich spojkou
	compareMatch( s1, s2, ...options ) // vypocita % zhodu 2 stringov
	cleanPath
	cleanPattern
	random( ...options ) // [n, prefix, suffix] vytvori nahodny kod (cislo ako string) o max. "n" dlzke s moznostou pridat prefix a suffix
	basename
	dirname
	extname
	telExpand
	telColapse
	strip_tags // ako v PHP - odstrani html tagy
	shortString // skratit text
*/

// zmeni diakritiku na zakladne znaky a-z|A-Z
// addPatterns = pridane pole objektov na replace - napr: [ ['ß','S'], ... ]
function accentMap( str, addPatterns = [ ['ß','S'] ] ){
	if( !str )
		return str
	if( typeof str !== 'string' )
		return str
	// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
	// WiKi ~ https://stackoverflow.com/questions/20690499/concrete-javascript-regular-expression-for-accented-characters-diacritics
	str = str.normalize("NFD").replaceAll(/[\u0300-\u036f]/g, "");
	for( const ap of addPatterns )
		str = str.replaceAll( ap[0], ap[1] )
	return str
}

// nahradi prazdne alebo nepovolene znaky a nahradi ich spojkou
function emptyMap( str, replaceStr='-' ){
	if( !str )
		return str
	let patLast = `^${replaceStr}|${replaceStr}(${replaceStr}*?)${replaceStr}|${replaceStr}$`;
	if( typeof str !== 'string' ){
		console.group('strings.mjs ~ emptyMap()')
		console.warn('str nie je typu string')
		console.log(str)
		console.groupEnd()
		return str
	}
	str = str.trim();
	str = str
      // nepovolene znaky
      .replace( new RegExp(/\ |\.|\,|\<|\>|\(|\)|\{|\}|\'|\"|\*|\+|\=|\\|\!|\?|\#\$|\%|\^|\&|\//gi), ' ' )
      // zluci prazdne miesta
      .replace( new RegExp(/\s+/g), replaceStr )
      // osetri zaciatky a konce
      .replace( new RegExp(patLast, 'g'), '' );
   return str;
}

// vypocita % zhodu 2 stringov
// vrati % s 2 desatinnymi miestami
function compareMatch( s1, s2, ...options ){
	let sep = ' ', // separator
	    dec = 2,   // pocet desatinnych miest
	    a1 = [],
	    a2 = [],
	    zaklad = 0,
	    perc = 0;
	if( !s1 || !s2 )
		return false;
	s1 = s1.toString();
	s2 = s2.toString();
	for( const opt of options )
		switch( typeof opt ){
			case 'string': sep = opt; break;
			case 'number': dec = opt; break;
		}

	a1 = s1.split(sep);
	zaklad = a1.length;
	a1 = a1.filter( s => { return s2.search(s) === -1 ? false : true } );
	perc = parseFloat((( a1.length / zaklad ) * 100).toFixed(dec));
	return perc;
}

// odstrani v relativnej ceste lomitka pred a za (povodne globalna funkcia FuncGetCleanPath(path))
function cleanPath(path){
	if(!path) return path;
	path = path.replace(/\.\.\/|^\.\.\/|^\.\/|^\/\/|^\//g,'').replace(/\/\/$|\/$/,'');
	return path;
}

// vycisti pattern pred pouzitim premennej v regexp
// pat_search = '[me'
// str = 'Ahoj [meno] + [cislo * cislo]'
// if( new RegExp( cleanPattern(pat_search), 'g' ).test( str ) ){ ... }
function cleanPattern( str ){
	str = str.replace('[','\\[')
	str = str.replace(']','\\]')
	str = str.replace('.','\\.')
	str = str.replace('*','\\*')
	str = str.replace('+','\\+')
	str = str.replace('?','\\?')
	str = str.replace('!','\\!')
	str = str.replace('^','\\^')
	str = str.replace('$','\\$')
	str = str.replace('\\','\\\\')
	return str
}

// vytvori nahodny kod (cislo ako string) o max. "n" dlzke s moznostou pridat prefix a suffix
function random( ...options ){ // n=4, prefix='', suffix=''
	let n = 4,
			prefix = null,
			suffix = null;
	for(const o of options)
		switch( typeof o ){
			case 'number': n = o; break;
			case 'string':
				if( prefix === null ) prefix = o;
				else if( prefix !== null ) suffix = o;
			break;
		}

	n = parseInt('1' + '0'.repeat(n)) -1
	if(prefix === null) prefix = ''
	if(suffix === null) suffix = ''
	return prefix + (Math.floor(Math.random()*n)).toString() + suffix;
}

function basename(PATH){
	if(!PATH) return PATH;
	PATH = PATH.replace(/^.*[\\/\\\\]/g, '');
	return PATH;
}

function extname(PATH){
	// ary = basename(PATH).split('.');
	// ext = ary[ ary.length-1 ];
	if( !PATH )
		return '';
	let ext = PATH.substr( (PATH.lastIndexOf('.') +1) );
	return ext;
}

function dirname(PATH){
	return PATH.replace(/\\/g,'/').replace(/\/[^\/]*\/?$/,'');
}


function telExpand( tel ){
	if( !tel )
		return tel;
  tel = telColapse( tel );
  let vystup = '';
  let pocet = 0;
  for (let i = tel.length - 1; i >= 0; i--) {
      if (pocet > 0 && pocet % 3 === 0) {
          vystup = ' ' + vystup;
      }
      vystup = tel.charAt(i) + vystup;
      pocet++;
  }
  vystup = vystup.replace('+ ', '+');
  return vystup;
}

function telColapse( tel ){
	if( !tel )
		return tel;
	tel = tel
		.replace(/ |\/|-/g,'')
		.replace(/^00/, '+')
		.replace(/^0/, '+421')
		.trim();
	return tel;
}


function strip_tags( str ){
	if( !str )
		return str;
	str = str.toString();
	str = str.replace(/(<([^>]+)>)/g, '');
	return str;
}

function shortString( str, n = 10, dots = '...' ){
	return str.length > n ? str.slice(0, n) + dots : str;
}

export {
	accentMap,
	emptyMap,
	compareMatch,
	cleanPath,
	cleanPattern,
	random,
	basename,
	dirname,
	extname,
	telExpand,
	telColapse,
	strip_tags,
	shortString,
}