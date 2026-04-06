/** {f:'library/js/wait.mjs', v:1.000, d:'2022-11-01'}
 *
 * asynchronne cakanie ~ spanok:
 *     await sleep(500);
 *
 * aynchronne nacakanie na objekt, funkciu, ... ~ v podstate asynchronne isOK
 *     await to( names, ...options )
 *
 **/

/*

  import {} from '/library/js/wait.mjs'

*/

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function to(names, ...options){
// VARIABLE
  let t0 = performance.now(),
      t1 = 0,
      status = false, // celkovy status ~ zakladny predpoklad
      o  = // options
          {
            max: 100,  // max pocet intervalov
            wait: 10,  // doba cakania na dalsi interval [ms]
            progress:(perc)=>{}, // fupnckia nadobudajuca % ukoncenia
            js: false, // false|function   - funkcia po uspesnom cakani ~ vhodne pri pouzite volania to bez await (napr. vykreslenie obrazkov)
                       // druhy sposob pouzitia je:   to( fn ).then( (data)=>{ scriptPoUkonceni } )
            bErr:  true, // [true,false] - zobrazit/nezobrazit chybove hlasenie
          },
      a  = []; // active data

// CONSTRUCTOR
  if( names === null ){
    checkFalse();
    return getReturn();
  }
  switch( typeof names ){
    case "string":   names = names.split(','); break;
    default:
      names = [names]; break;
  }
  for( const opt of options )
    switch( typeof opt ){
      case 'number': o.max = opt; break;
      case 'object':
        for( const key in opt )
          o[key] = opt[key];
      break;
      case 'function':
        o.js = opt;
      break;
      case 'boolean':
        o.bErr = opt;
        break;
    }
  // otestuj vsetky names
  for( const name of names ){
    let return_test = await testName( name );
    a.push(return_test);
  }
  // nastav celkove hodnotenie [true,false]
  status = (typeof a.find( aV => aV.status === false ) === 'undefined') ? true : false;

// PUBLIC FUNCTION
  function getStatus(){
    let time = Math.floor(performance.now() - t0); // ms
    return { status, names, time, o, a }
  };

// PRIVATE FUNCTION
  async function testName(name) {
    let intervals = 1,
        status, time,
        time0 = performance.now(),
        astat = {};
    do{
      status = true;
      // zistit aky typ vlastne testujem [ existencia funkcie, DOM objekt, existujuca lubovolna premenna [=>!undefined], funkcia vracajuca true/false ]
      if( typeof name === 'string' ){ // test stringov
        // DOM objekt ~ selector
        if( document.querySelector(name) instanceof Element )
          break;
        // !undefined (aj DOM, funkcia, aj ine premenne)
        else {
          try{
            if( eval(`typeof ${name} !== 'undefined'`) )
              break;
          } catch(e){}
        }
      } else if( typeof name === 'function' ){ // funkcia vracajuca true/false
        //console.log('fn test: ', name());
        status = ( name() ) ? true : false;
        if( status )
          break;
      } else if( name instanceof Element ){ // DOM objekt
        break;
      } else if( name !== undefined ){ // existujuca lubovolna premenna
        break;
      }
      status = false; // ak nedoslo k preruseniu cyklu (break), nastav status na false
      o.progress( calcPerc(intervals) );
      // console.log('intervals: ', intervals, 'perf: ', Math.floor(performance.now() - t0), 'ms' );
      intervals++;
      await sleep(o.wait);
    } while( intervals < o.max );



    time = Math.floor(performance.now() - time0); // ms
    astat = { name, status, intervals, time };

    if( !status && o.bErr ) {// vypis do konzoly chybu
      console.group( `await to('${name}') ~ error status` );
      console.warn( astat );
      console.warn( 'options: ', o );
      console.groupEnd();
    }
    o.progress( 100 );
    if( typeof o.js === 'function' )
      o.js();
    return astat;
  }

  function calcPerc( num ){ // vypocet percenta
    return parseFloat((( num / o.max ) * 100).toFixed(0));
  }

  function checkFalse(){ // neznama hodnota, alebo zla vstupna hodnota (z globalneho hladiska)
    console.group( 'await to() ~ error status' );
    console.warn( getStatus() );
    console.groupEnd();
    return false;
  }

  function getReturn(){ // vrati standardne hodnoty ptre navrat
    return {
      status,
      getStatus
    }
  }

// RETURN
  return getReturn();
}

export { sleep, to }