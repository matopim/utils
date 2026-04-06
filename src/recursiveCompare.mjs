/** {f:'recursiveCompare.mjs', v:'1.1.6', d:'2022-01-22', du:'2024-06-24'} **/

/*

	import recursiveCompare from '/library/js/recursiveCompare.mjs'

*/


// porovna 2 zhodne objedky (polia) s roznymi udajmi a vrati objekt so zmenenymi udajmi
// vhodne pre kontrolu zmeny vo formulari

// priklad: const zmeny = recursiveCompare( {a:1,b:[1,2],c:'ahoj'}, {a:1,b:[2,3],c:'ahoj svet'} )
// => zmeny = [{ b:{f:[1,2],t:[2,3]}, c:{f:'ahoj',t:'ahoj svet'} }, {...}]

// f = from, t = to

let changeFields = [];
let UNDEFINED = 'undefined';

const recursiveCompare = (aryBefore, aryAfter, undefinedStr = 'undefined') => {
	changeFields = [];
  UNDEFINED = undefinedStr;
	recursiveCompareWork(aryBefore, aryAfter);
  return changeFields;
};


const recursiveCompareWork = (aryBefore, aryAfter, path = '') => {
  const keys = new Set([...Object.keys(aryAfter), ...Object.keys(aryBefore)]);
  // console.log( 'keys: ', keys )
  for (const key of keys) {
    const currentPath = path.length > 0 ? `${path}.${key}` : key;
    const isEmptyAfterData  = ( aryAfter[key] === null || aryAfter[key] === undefined || aryAfter[key] === '' || aryAfter[key] === UNDEFINED ) ? true : false;
    const isArrayAfterData  = Array.isArray(aryAfter[key]);
    const isObjectAfterData = ( !isEmptyAfterData && !isArrayAfterData && typeof aryAfter[key] === 'object' ) ? true : false;

    const isEmptyBeforeData  = ( aryBefore[key] === null || aryBefore[key] === undefined || aryBefore[key] === '' || aryBefore[key] === UNDEFINED ) ? true : false;
    const isArrayBeforeData  = Array.isArray(aryBefore[key]);
    const isObjectBeforeData = ( !isEmptyBeforeData && !isArrayBeforeData && typeof aryBefore[key] === 'object' ) ? true : false;

    if( (isObjectAfterData || isArrayAfterData) && (isObjectBeforeData || isArrayBeforeData) ) {
      recursiveCompareWork(aryBefore[key], aryAfter[key], currentPath);
    } else {
      if (aryAfter[key] !== aryBefore[key])
        writeToAry( currentPath, aryBefore && aryBefore[key], aryAfter[key] )
    }
  }
};


const writeToAry = ( k, f, t ) => {
  f = convertFT(f)
  t = convertFT(t)
  changeFields.push( { k, f, t } )
};

const convertFT = ( ft ) => {
  if( !ft )
    return ft;

  if( Array.isArray(ft) || typeof ft === 'object' )
    return JSON.stringify(ft)

  return ft;
};



export default recursiveCompare;