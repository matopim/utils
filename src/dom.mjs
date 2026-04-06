/** {f:'dom.mjs', v:'1.1.3', d:'2022-11.27', du:'2024-06-24'} **/


/*

  import {toDOM,zIndexMax,searchElementsAll,searchShadowsAll,getRelativeParents} from '/library/js/dom.mjs'

    toDOM
    zIndexMax
    searchElementsAll
    searchShadowsAll
    getRelativeParents

*/

function toDOM( html ){ // prerobi klasicke HTML na NODE elementy
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.firstChild;
}

function zIndexMax( start_obj = document, search_selector = 'div,span' ){
  const elements = searchElementsAll( search_selector, start_obj )
  let zIndex = 0
  for( const obj of elements ){
    const cs = window.getComputedStyle(obj)
    let zIndexAct = parseInt(cs.getPropertyValue('z-index'))
    if( !zIndexAct )
      continue
    if( zIndex < zIndexAct )
      zIndex = zIndexAct
  }
  zIndex++;
  // console.log( 'zIndex: ', zIndex )
  return zIndex;
}


// najde vsetky elementy na zaklade selectora - !!! aj v shadow root
function searchElementsAll( selector = 'div', start_obj = document ){
  let elements = [],
      shadows  = [];

  // prejde klasicke elementy
  for( const el of start_obj.querySelectorAll(selector) )
    elements.push( el )

  // prejde shadowRoot elementy
  for( const shr of searchShadowsAll(start_obj) )
    for( const el of shr.shadowRoot.querySelectorAll(selector) )
      elements.push( el )

  return elements;
}


// najde vsetky objekty, ktore obsahuju shadowRoot
function searchShadowsAll( start_obj = document ){
  let shadows = searchShadowsAllRecursive( [], start_obj )
  return shadows
}

function searchShadowsAllRecursive( shadows, start_obj ){
  for( const el of start_obj.querySelectorAll('\*') ){
    if( !el.shadowRoot )
      continue;
    // console.log( 'el', el )
    shadows.push( el )
    shadows = searchShadowsAllRecursive( shadows, el )
  }
  return shadows
}



function getRelativeParents( el ){
    let counter = 0
    const arp = []
    const grpRecursive = ( el ) => {
      // console.log( 'grpRecursive( el ): ', el )
      let pn = el.parentNode || undefined

      // rodic ( parentNode ) pre ShadowRoot
      if( !(pn instanceof Element) ){
        const shadowRoot = el.getRootNode()
        if (!(shadowRoot instanceof ShadowRoot))
          return;
        pn = shadowRoot.host
      }

      const cstl = getComputedStyle(pn)
      const position = cstl.getPropertyValue('position')
      const isRelative = ( position === 'relative' ) ? true : false
      // console.log( 'el/pn: ', '\n', el, '\n', pn, pn instanceof Element, isRelative )

      if( isRelative )
        arp.push( pn )

      counter++;
      if( counter > 1000 )
        return false;

      grpRecursive( pn )
    }

    if( el instanceof Element )
      grpRecursive( el )

    return arp
  }








export{
	toDOM,
  zIndexMax,
  searchElementsAll,
  searchShadowsAll,
  getRelativeParents,
}