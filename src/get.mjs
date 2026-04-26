/** {f:'get.mjs', v:'1.2.2', d:'2022-08-01', du:'2026-04-22'} **/

/*

  import get from '@pim.sk/utils/get.mjs'

*/

import { isJson } from './is.mjs'

async function get(url, ...options){
  // DEFAULT OPTIONS
  let vstup =  'data', // [data,form]
      vystup = 'json', // [json,text,object]
      method = 'POST', // [POST,GET]
      data = {},
      body = null,
      formData = new FormData();

// console.log('%c options', 'color:red', options)

  // PRIRADENIE OPTIONS NA ZAKLADE ...options
  for( const opt of options ){
    switch( typeof opt ){
      case 'string':
        if( opt === 'form' )
          vstup = opt;
        if( opt === 'text' || opt === 'object' )
          vystup = opt;
        if( new RegExp(/^GET$|^POST$|^PUT$/, 'i').test(opt) === true )
          method = opt;
// console.log('%c method', 'color:red', method, opt, new RegExp(/^GET$|^POST$|^PUT$/, 'i').test(opt))
      break;
      case 'object':
        data = opt;
      break;
    }
  }


  // automaticky doplnit mpws token (mpws_token) do odosielanych dat
  //console.log('get data:', data)
  if( !data ) data = {};
  const mpws_token = document.head.querySelector('meta[name=token]') || '';
  if( mpws_token )
    data.mpws_token = mpws_token.getAttribute('content');

  // NASTAV BODY ~ odovzdavanie udajov
  if( vstup === 'data' )
    body = JSON.stringify(data);
  else if( vstup === 'form' ){
    for (let [key, value] of Object.entries(data)) {
      // console.log(key, value, typeof value);
      formData.append(key,value);
    }
    // console.log( 'get formData k: ', formData.keys() )
    // console.log( 'get formData v: ', formData.values() )
    body = formData;
  }


  // nastav options pre fetch ...napr. 'GET' nemoze mat body
  let fetchOptions = {}
  fetchOptions.method = method
  if( method !== 'GET' )
    fetchOptions.body = body
  if( vstup !== 'form' )
    fetchOptions.headers = { 'Content-Type': 'application/json' }
  if( method === 'GET' )
    fetchOptions.headers = { 'Content-Type': 'text/plain' }

  // if( method === 'PUT' )


  // console.log( '%c fetchOptions: ', 'color:red', fetchOptions )


  // SPRACUJ VOLANIE
  let ax;
  try{
    ax = await fetch(url, fetchOptions);
    // console.log( 'ax: ', ax )
    //console.log(ax);
    if( vystup === 'object' )
      return ax;
    let str = await ax.text();
    // console.log( 'vystup: ', vystup )

    // z .json suboru odstranit komentare ~ vhodne ak mas json s poznamkami
    if( new RegExp(/\.json$/).test(ax.url) )
      str = cleanFromJsonFile( str )

    // console.log( 'str: ', str )
    let bJson = ( vystup === 'json' ) ? isJson( str ) : false;
    // console.log( 'bJson: ', bJson )
    if( bJson )
      return JSON.parse(str);
    else
      return str;
  } catch(error) {
    console.group('Chyba ~ get.mjs / get(...)');
    console.error(error);
    console.log('url:',url);
    console.log('data:',data);
    console.log('ax',ax);
    console.groupEnd();
    return false;
  }
}


function cleanFromJsonFile( str ){
  str = str.replace( new RegExp(/^\s+/gm), '' ) // vsetky odsadenia na zaciatku (medzedy, tabulatory)
  str = str.replace( new RegExp(/^\/\/(.*)/gm), '' ) // na zaciatku riadku komentare typu //
  // str = str.replace( new RegExp(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm), '' ) // vsetky ostatne komentare mimo http(s):// formatu
  str = str.replace( new RegExp(/\/\*[\s\S]*?\*\//gm), '' ) // komentare typu /*...*/
  return str
}

export default get
