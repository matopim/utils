/** {f:'inViewportAnim.mjs', v:'1.1.3', d:'2022-09-15', du:'2026-04-22'} **/

/**
 *
 * import inViewportAnim from '@pim.sk/utils/inViewportAnim.mjs'
 *
 * pouzitelne atributy:
 *  data-anim   [ class_name_animationa ]
 *  data-once   [ true, false ] - opakujuca sa animacia
 *  data-delay  [ ms, s] ( 500ms, 5s ) - opozdenie
 *  data-duration [ ms, s ] ( 500ms, 5s ) - dlzka trvania
 *    ---
 * PRIKLADY:
 *
 * viewport + animacie
 *  const myVP = new inViewportAnim({ selector:'.myTest', anim: 'zoomIn', once:false });
 *
 * viewport + animacie + konkretny prvok s inymi hodnotami ako definovane
 *  const myVP = new inViewportAnim({ selector:'.myTest', anim: 'zoomIn', once:false });
 *  HTML:   <h1 class="myTest" data-anim="fadeIn" data-once="true" data-delay="1800ms" data-duration="4s">Nadpis 1</h1>
 *
 * viewport + vykonanie funkcii ...
 *  const myVP = new inViewportAnim({ selector:'.myTest', anim: 'zoomIn', once:false,
 *    onViewport: ( obj ) => {...}
 *    onAnimationStart: ( obj ) => {...}
 *    onAnimationEnd: ( obj ) => {...}
 *    onAnimationCancel: ( obj ) => {...}
 * });
 *
 * viewport - len test
 *  let myVP = new inViewport().test( myObject );
 **/

import inViewport from '@pim.sk/utils/inViewport.mjs';
import boolean from '@pim.sk/utils/boolean.mjs'


function inViewportAnim( ...options ) {
  this.name = this.__proto__.constructor.name;
 	let opt = {};

  // spracuj options a priprav this.o
  (( options )=>{
		// console.log('options: ', options);
  	for( const o of options ){
  		switch( typeof o ){
  			case 'string': opt.selector = o; break;
  			case 'object': opt = Object.assign( {}, opt, o ); break;
  		}
  	}
  })( options );

  // default hodnoty + uzivatelske
	this.o = Object.assign(
		{
			selector: '.inViewportAnim',
      anim: 'fadeInLeft',
      animBefore: 'zoomOut',
      once: true,
      onViewport:        ( obj ) => {},
      onAnimationStart:  ( obj ) => {},
      onAnimationEnd:    ( obj ) => {},
      onAnimationCancel: ( obj ) => {},
			clog: false
		},
		opt
	);
	//console.log('this: ', this);

// ------------------
// --- CONTROLLER ---
// ------------------
	let init = () => {
		if( this.o.clog ) { console.group(this.name+" ~ init()"); console.log("this:", this ); }
		mSetProp();
    //mSetSelector();
		if( this.o.clog ) { console.groupEnd(); }
	}

  let testujObjektVOblastiViewport = ( obj ) => { // vrati TRUE/FALSE na dopyt akehokolvek objektu, ci sa nachadza vo viewporte
    if( this.o.clog ) { console.group(this.name+" ~ test( obj )", obj); console.groupEnd(); }
		return mIsInVP( obj );
  }


// -------------
// --- MODEL ---
// -------------

  let _instances = []; // inViewport instances for destroy

  let mSetProp = () => {
    document.querySelectorAll(this.o.selector).forEach( ivp => {

      // console.log( 'ivp: ', ivp )

      ivp.ivp = false; // zobrazeny objekt vo viewporte
      ivp.ivpHis = false; // historicky uz zobrazeny objekt

      // zakladny nazov animacie
      let anim = ivp.dataset.anim || (this.o.anim || 'fadeIn');

      // once
      let once = this.o.once;
      if( ivp.dataset.once )
        once = boolean( ivp.dataset.once );

      // nastavit delay ak definovany data-delay (napr; 500ms  alebo  11s)
      let delay = ivp.dataset.delay || false;
      if( delay ) ivp.style.setProperty('animation-delay', delay);

      // nastavit duration (dlzka prehravania animacie)
      let duration = ivp.dataset.duration || false;
      if( duration ) ivp.style.setProperty('animation-duration', duration);

      //ivp.classList.add('inViewport','o0');

      // odstran predchadzajuce listenery ak uz existuju (napr. pri re-inicializacii)
      if( ivp._ivpaListeners ){
        ivp.removeEventListener('animationstart',  ivp._ivpaListeners.start);
        ivp.removeEventListener('animationend',    ivp._ivpaListeners.end);
        ivp.removeEventListener('animationcancel', ivp._ivpaListeners.cancel);
      }

      const onStart = () => {
        ivp.classList.remove('o0');
        this.o.onAnimationStart( ivp );
      };
      const onEnd = () => {
        ivp.ivp = true;
        ivp.ivpHis = true;
        ivp.classList.remove('animated', anim);
        this.o.onAnimationEnd( ivp );
      };
      const onCancel = () => {
        ivp.ivp = true;
        ivp.ivpHis = true;
        ivp.classList.remove('animated', anim);
        this.o.onAnimationCancel( ivp );
      };

      ivp._ivpaListeners = { start: onStart, end: onEnd, cancel: onCancel };

      ivp.addEventListener('animationstart',  onStart);
      ivp.addEventListener('animationend',    onEnd);
      ivp.addEventListener('animationcancel', onCancel);

      // nastav akcie na onViewport
      const ivpInst = new inViewport({
        element: ivp,
        once,
        clog: false,
        onViewport: ( obj )=>{
          // console.log( 'onViewport obj: ', obj );
          ivp.classList.add('animated', anim);
          this.o.onViewport( ivp );
        }
      });
      ivp.inViewpor = ivpInst;
      _instances.push( ivpInst );
    });
  }

  let destroy = () => {
    _instances.forEach( inst => inst.destroy() );
    _instances = [];
    document.querySelectorAll(this.o.selector).forEach( ivp => {
      if( ivp._ivpaListeners ){
        ivp.removeEventListener('animationstart',  ivp._ivpaListeners.start);
        ivp.removeEventListener('animationend',    ivp._ivpaListeners.end);
        ivp.removeEventListener('animationcancel', ivp._ivpaListeners.cancel);
        delete ivp._ivpaListeners;
      }
    });
  }

  /*let mSetSelector = () => {
    document.querySelectorAll(this.o.selector).forEach( ivp => {
      if( mIsInVP(ivp) ) {
        console.log('mSetSelector: ', ivp);
        if( ivp.ivp === false ) mActionVP(ivp);
      } else {
        ivp.ivp = false;
      }
    });
  }*/

  /*let mActionVP = ( ivp ) => {
    let once = ivp.dataset.once || this.o.once,
        anim = ivp.dataset.anim || this.o.anim,
        dfn  = ivp.dataset.fn || false,
        fn   = ( dfn ) ? window[dfn] : ()=>{};

    // neviem co je ivpHis:     if( once && ivp.ivpHis ) return false;
    ivp.classList.add('animated', anim);


  }*/

// --------------
// --- VIEWER ---
// --------------

// ---------------------
// --- INIT / RETURN ---
// ---------------------
	init();
	return {
		init,
		destroy,
		test: testujObjektVOblastiViewport, // vrati TRUE/FALSE na dopyt akehokolvek objektu, ci sa nachadza vo viewporte
	}

}

//let __inViewport = new inViewport().init();

/**
 * v pripade, ze je script nacitany klasicky v hlavicke, je potrebne nacitat onload
 **/
/*
window.addEventListener('load', (event) => {
  __inViewport = new inViewport().init();
});
*/


export default inViewportAnim
