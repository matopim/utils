/** {f:'sortAssoc.mjs', v:'1.5.0', d:'2018-04-06', du:'2026-04-22'} **/

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
          a = String(a);
          b = String(b);
          if( !sensitive ){
            // console.log('...a: ', a)
            a = a.toLowerCase();
            b = b.toLowerCase();
          }
          return a.localeCompare(b);
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
            return new Date(b) - new Date(a);
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

// // ------------------
// // --- CONTROLLER ---
// // ------------------
// 	let init = () => {
// 		if( this.o.clog ) { console.group(this.name+" ~ init()"); console.log("this:", this ); }
//     if( !this.o.field ) return 'field je povinna premenna;';
//     if( !this.o.type ) this.o.type = zistiType();
//     //if( this.o.type === 'json' ) return 'triedeny field nemoze byt pole (alebo objekt)';
//     this.o.by = this.o.by.toLowerCase();
// 		if( this.o.clog ) { console.groupEnd(); }
//     return zotriedAsocPole();
// 	}
// // -------------
// // --- MODEL ---
// // -------------
// 	let zistiType = ()=>{
//     let value = this.ary[0][this.o.field];
//     switch( typeof value ){
//       case 'number': return 'number'; break;
//       //case 'object': return 'json'; break;
//       default: return 'string';
//     }
//   }

//   let zotriedAsocPole = ( ary )=>{
//     // console.log( 'this.o.type: ', this.o.type )
//     switch( this.o.type ){
//       case 'number': return zotriedAsocPoleNumber();
//       case 'string': return zotriedAsocPoleString();
//       case 'date'  : return zotriedAsocPoleDate();
//     }
//   }

//   let zotriedAsocPoleNumber = ()=>{
//     let ary = this.ary,
//         by  = this.o.by,
//         field = this.o.field;
//     ary.sort(function(a, b) {
//       let numA = parseFloat(a[field]),
//           numB = parseFloat(b[field]);
//       // if( isNaN(numA) || isNaN(numB) ) console.log(numA, numB )
//       switch( by ){
//         case 'desc': // DESC
//           if( isNaN(numA) && isNaN(numB) ) return 1;
//           if( isNaN(numA) ) return 1;
//           if( isNaN(numB) ) return -1;
//           return numB - numA;
//         break;
//         default: // ASC
//           if( isNaN(numA) && isNaN(numB) ) return 1;
//           if( isNaN(numA) ) return -1;
//           if( isNaN(numB) ) return 1;
//           return numA - numB;
//         break;
//       }
//     });
//     return ary;
//   }

//   let zotriedAsocPoleString = ()=>{
//     let ary = this.ary,
//         by  = this.o.by,
//         field = this.o.field,
//         sensitive = this.o.sensitive;


//     ary.sort(function(a, b) {
//       let textA = a[field],
//           textB = b[field];
//       if( !sensitive ){
//         textA = (typeof textA === 'string') ? textA.toLowerCase() : textA;
//         textB = (typeof textB === 'string') ? textB.toLowerCase() : textB;
//       }
//       textA = (typeof textA === 'string') ? accentMap(textA) : textA;
//       textB = (typeof textB === 'string') ? accentMap(textB) : textB;

//       // if( typeof textA === 'object' || typeof textB === 'object' ) console.log(typeof textA, textA, typeof textB, textB )
//       switch( by ){
//         case 'desc': // DESC
//           if( textA === '' || textA === null ) return 1;
//           if( textB === '' || textB === null ) return -1;
//           return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
//         break;
//         default: // ASC
//           if( textA === '' || textA === null ) return -1;
//           if( textB === '' || textB === null ) return 1;
//           return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//         break;
//       }
//     });

//     return ary;
//   }

//   const zotriedAsocPoleDate = ()=>{
//     let ary = this.ary,
//         by  = this.o.by,
//         field = this.o.field;

//     ary.sort(function(a, b) {
//       let numA = toDate(a[field]),
//           numB = toDate(b[field]);
//       //console.log(numA, numB )
//       switch( by ){
//         case 'desc': // DESC
//           if( isNaN(numA) && isNaN(numB) ) return 1;
//           if( isNaN(numA) ) return 1;
//           if( isNaN(numB) ) return -1;
//           return numB - numA;
//         break;
//         default: // ASC
//           if( isNaN(numA) && isNaN(numB) ) return 1;
//           if( isNaN(numA) ) return -1;
//           if( isNaN(numB) ) return 1;
//           return numA - numB;
//         break;
//       }
//     });

//     return ary;
//   }

//   const toDate = ( d )=>{ // rType = return type    ['number', 'date', 'datetime']
//     // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
//     let date = new Date(d);
//     let dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
//     let dateNumber = Date.parse(dateString);
//     return dateNumber;
//   }


// --------------
// --- VIEWER ---
// --------------
  // ...
// --------------
// --- INIT / RETURN ---
// --------------

	return init( this.ary, this.o )
}

export default sortAssoc
