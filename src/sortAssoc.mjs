/** {f:'sortAssoc.mjs', v:'1.5.1', d:'2018-04-06', du:'2026-04-28'} **/

/*

import sortAssoc from '@pim.sk/utils/sortAssoc.mjs'

new sortAssoc( ary, [ {field:'key', by:'asc,desc', type:String,Number,Date,Boolean , sensitive:true,false }, {...} ] )
new sortAssoc( ary, 'key', 'asc', String )
new sortAssoc( ary, 'key' )
new sortAssoc( ary, 'key', 'asc', 'string' )

*/


/**
 *
 *
 * triedenie s jednou, alebo viacerymi podmienkami triedenia
 *
 *
 *
 * Triedenie asociativneho pola v obycajnom poli
 * options:  {'field':'value', 'by':'ASC', 'type':'string' }
 * priklad vstupneho pola: ary = [{n:5,t:'adam'},{n:2,t:'ivan'},...]
 * ----- 
 * Ukazka pouzitia funkcie:
 * sortAssoc( ary, {'field':'a', 'by':'asc', 'type':'number'} );
 * 	...skrateny zapis:
 * 	sortAssoc( ary, 'a', 'desc', 'number' );
 * 	...skrateny zapis s vynechanim defaultnych a vypocitatelnych hodnot:
 * 	sortAssoc( ary, 'a' );
*/

import { accentMap } from './strings.mjs'

function sortAssoc( ary, ...options ) {
// ------------------
// --- CONSTRUCT  ---
// ------------------
  if( typeof this === 'undefined' ){
    console.warn('function sortAssoc musi byt volana s "new" - napr.:\n   ary = new sortAssoc(ary, \'key_to_sort\')');
    return false;
  }

  this.name = this.__proto__.constructor.name;

  this.name = 'sortAssoc';

  // premenne
  this.ary = ary;

  // default options
  const defo = {
      field: null, // musi byt zadany
      type : String, // [string, number, date] - bude sa urcovat, ak nie je striktne zadany
      by   : 'asc',
      sensitive: false, // case sensitive
      clog : false
    };

  this.o = [];

  // spracuj ...options
  (( options )=>{
		//console.log('options: ', options);
  	for( const o of options ){
  		//console.log( typeof o, o.name )
      switch( typeof o ){
        case 'function':
          switch( o.name ){
            case 'Date':
            case 'Number':
            case 'String':
            case 'Boolean':
              defo.type = o.name.toLowerCase();
          }
        break;
  			case 'string':
  				switch( o.toLowerCase() ){
  					case 'asc':
  					case 'desc':
  						defo.by = o;
  					break;
  					default:
  						defo.field = o;
  					break;
  				}
  			break;
        case 'boolean':
          defo.sensitive = o; // case sensitive
        break;
  			case 'object': 
  				if( Array.isArray(o) ){
  					this.o = o.map( a => Object.assign( {}, defo, a ) )
          } else {
            this.o.push( Object.assign( {}, defo, o ) )
          }
  			break;
  		}
  	}
  })( options );

  if( !this.o.length )
    this.o.push( defo )

// console.log('this.o:',this.o);


  const init = (ary, options) => {
    // Skontrolujme, ci mame platne vstupne pole a inštrukcie
    if (!Array.isArray(ary) || !Array.isArray(options)) {
        throw new Error('Both arguments must be arrays.');
    }

    // Pomocná funkcia na porovnanie hodnôt podľa typu
    function compareValues(a, b, type, sensitive) {
      // console.log( 'compareValues: ', a, b, type, sensitive )
        if (type === String || type === 'string') {
          a = a || '';
          b = b || '';
          a = accentMap(String(a));
          b = accentMap(String(b));
          if( !sensitive ){
            a = a.toLowerCase();
            b = b.toLowerCase();
          }
          if( a < b ) return -1;
          if( a > b ) return 1;
          return 0;
        } else if (type === Number || type === 'number') {
            a = Number(a) || 0;
            b = Number(b) || 0;
            return a - b;
        } else if (type === Boolean || type === 'boolean') {
            a = Boolean(a) || false;
            b = Boolean(b) || false;
            a = a ? 1 : 0;
            b = b ? 1 : 0;
            return a - b;
        } else if (type === Date || type === 'date') {
            return new Date(a) - new Date(b);
        }
        return 0;
    }

    // Zotriedime pole podľa inštrukcií
    ary.sort((obj1, obj2) => {
        for (const instruction of options) {
            const { field, type, by, sensitive } = instruction;
            const value1 = obj1[field];
            const value2 = obj2[field];
            const comparison = compareValues(value1, value2, type, sensitive);

            if (comparison !== 0) {
                return by === 'asc' ? comparison : -comparison;
            }
        }
        return 0; // Ak sú hodnoty rovnaké, ponecháme pôvodný poriadok
    });

    return ary;
  }

	return init( this.ary, this.o )
}

export default sortAssoc
