/** {f:'is.mjs', v:'1.1.5', d:'2022-09-24', du:'2025-04-10'} **/

/*

import {isDev,isDate,isDOM,isJson,isNumber,isString,isNull,isBoolean,isArray,isObject,isClass,isFunction,isNavigator} from '/library/js/is.mjs'


*/



function isNull( v ){ return typeof v === null }

function isBoolean( v ){ return typeof v === 'boolean' }

function isNumber( v ){ return typeof v === 'number' }

function isString( v ){ return typeof v === 'string' }

function isArray( v ){ try{ return Array.isArray(v); } catch(e) { return false } }

function isObject( v ){ try{ return typeof v === 'object' && v.constructor.name === 'Object' } catch(e) { return false } }

function isFunction( v ){ try{ return typeof v === 'object' && v.constructor.name === 'Function' } catch(e) { return false } }

function isClass( v ){ try{ return v.constructor.name && !isArray(v) && !isFunction(v) && !isObject(v) } catch(e) { return false } }



/*
  Date.parse() zle vyhodnoti SK format (napr. 24.01.2023 != 2023-01-24)
  => Only the ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
*/

function isDate( str ){
  if( typeof str !== 'string' )
    return false;
  if( new RegExp('[a-z]|[A-S]|[U-Y]|\`|\'|\"', '').test(str) )
    return false;
  if( !new RegExp('\-', '').test(str) )
    return false;
  if( (str.match(/\./g) || []).length > 1 )
    return false;
  return Date.parse(str) ? true : false;
}

function isDOM(el) { // vtrati true ak je objekt DOM
   return el instanceof Element;
}

/**
 *  isJson( str, ...options )
 *  kontroluje vstupny string na format json
 *  vrati [true,false], alebo spracovany json (pole)
 *
 * priklady:
 *    let strJson     = '[1,2,3,{"asoc":4}]';
 *    let strJsonFail = '<b>Chyba...</b> [1,2,3,{"asoc":4}]';
 *    isJson( strJson );  // =>  true
 *    isJson( strJsonFil );  // =>  false
 *
 *    isJson( strJson, 'parse' );  // =>  [1,2,3,{"asoc":4}]
 *
 *    // casty priklad pouzitia v js ak testujem navratovu hodnotu z ajaxu
 *    res = isJson(res, 'parse') || res;
 *
 **/
function isJson( str, ...options ){ // vrati true, ak je string vo formate json
	let isJson = false; // zakladny predpoklad navratovej hodnoty
  let opt = {
      bParse: false
  }

  for( const inOpt of options )
    if( inOpt === 'parse' )
       opt.bParse = true;

  try {
    let o = JSON.parse(str);
    if (o && typeof o === "object") {
       isJson = true;
    }
  }
  catch (e) {
    isJson = false;
  }

  if( isJson && opt.bParse )
    return JSON.parse(str);

  return isJson;
}



// detekcia operacneho systemu na klientovi
const isNavigator = {
    android: false,
    ios: false,
    mac: false,
    windows: false,
    linux: false,
    chrome: false,
    other: false,
    mobile: null, // ak prehliadac nepodporuje userAgentData, vrati null - inak [true/false]
};

(()=>{
  const ua  = navigator.userAgent;
  const uad = navigator.userAgentData || null;
  // nove prehliadace
  if( uad ){
    const up = uad.platform;
    if(/Android/i.test(up)){
      isNavigator.android = true;
    } else if (/iOS/i.test(up)) {
      isNavigator.ios = true;
    } else if (/Windows/i.test(up)) {
      isNavigator.windows = true;
    } else if (/Linux/i.test(up)) {
      isNavigator.linux = true;
    } else if (/macOS/i.test(up)) {
      isNavigator.mac = true;
    } else if (/Chrome OS/i.test(up)) {
      isNavigator.chrome = true;
    } else {
      isNavigator.other = true;
    }
    isNavigator.mobile = uad.mobile;
    return;
  }
  // starsie prehliadace
  if (/Android/i.test(ua)) {
    isNavigator.android = true;
  } else if (/iPad|iPhone|iPod/i.test(ua)) {
    isNavigator.ios = true;
  } else if (/Windows/i.test(ua)) {
    isNavigator.windows = true;
  } else if (/Macintosh/i.test(ua)) {
    isNavigator.mac = true;
  } else if (/Chrome OS/i.test(ua)) {
    isNavigator.chrome = true;
  } else {
    isNavigator.other = true;
  }
})();



/*
  vrati [tru,false]
  true  - existuje develop a je zapnuty
  false - neexistuje developo alebo je vypnuty
  ---
  vhodne pre pouzitie aplikovania *.min.* suborov
*/
const isDev = window._MINJSDEV ? window._MINJSDEV.o.show : false






export{
	isDev,
  isDate,
  isDOM,
  isJson,
  isNumber,
  isString,
  isNull,
  isArray,
  isObject,
  isClass,
  isFunction,
  isBoolean,
  isNavigator,
}