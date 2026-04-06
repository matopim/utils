/** {f:'inViewport.mjs', v:'1.1.2', d:'2022-09-15', du:'2025-05-26'} **/

/**
 * vrati / nastavi v dataset inViewport
 *  viewport - len test
 *  let myVp = new inViewport().test( myObject )){}
 * */

/*

import inViewport from '/library/js/inViewport.mjs';

*/

import { isDOM } from './is.mjs'

function inViewport( ...options ) {
  this.name = this.__proto__.constructor.name;

  // default options
  this.o = {
  	// element moze byt len jeden - ma prednost pred selectorom
  	// jeden z:
  	selector: undefined,
  	element: undefined, // samostatny element (vyuziva to napr. inViewportAnim.mjs)
  	// ---
		once: true, 	// spustat onViewport() len raz, alebo zakazdym
		full: false, 	// true  = vypocet tak, aby sa respektoval cely viditelny objekt na stranke
									// false = vypocet tak, aby stacila len cast objektu
		onViewport: ( obj )=>{}, // uzivatelska funkcia
		clog: false
  };

  // spracuj ...options
  (( options )=>{
		//console.log('options: ', options);
  	for( const o of options ){
  		switch( typeof o ){
  			case 'string': this.o.selector = o; break;
  			case 'object':
  				if( isDOM(o) ){
  					this.o.element = o;
  				} else {
  					this.o = Object.assign( {}, this.o, o );
  				}
  			break;
  		}
  	}
  })( options );

	// aktualne hodnoty
	this.a = [];

// ------------------
// --- CONTROLLER ---
// ------------------
	let init = () => {
		if( this.o.clog ) { console.group(this.name+" ~ init()"); console.log("this:", this ); }
		mNastavObjektyIVP();
		mPocuvajNaScroll();
		onViewportTest( true );
		if( this.o.clog ) { console.groupEnd(); }
	}

	// funkcia testuje viditelnost - ak splna podmienky, spusti uzivatelsky js
	let onViewportTest = ( isFirstTest = false ) => {
		for( const actKey in this.a ){
			let act = this.a[actKey];
			// test na viditelnost pre vsetky viewporty vrati
			let isOnViewport = mTestujViewport( act );
			// zmena dataset
			let isChange = act.inViewport !== act.ls ? true : false;
			this.a[actKey].ls = act.inViewport;
			this.a[actKey].inViewport = isOnViewport;
			//console.log(isOnViewport, isChange);
			// spustenie uzivatelskej onViewport() funkcie
			if( isOnViewport && (isChange || isFirstTest) ){
				if( this.o.once ){
					let isFnRunning = act.isFnRunning;
					if( !isFnRunning ) this.o.onViewport( act.obj );
				} else {
					this.o.onViewport( act.obj );
				}
				this.a[actKey].isFnRunning = true;
			}
		}
	}

	// testuje viditelnost objektu na stranke
	// vrati [true,false]
	// opt moze byt:
	// 	1/	string (selector)
	//	2/  objekt (DOM)
	//	3/	undefined (nezadane) => vezme prvy objekt v poradi => this.a[0].obj
	//	4/	number => index z this.a[index].obj
	// moze byt dotaz len na jeden objekt
	// objekt musel byt predtym spracovany funkciou inViewport
	let testujViewportObject = ( opt = undefined ) => {
		if( this.o.clog ) { console.group(this.name+" ~ testujViewportObject ~ isView( opt )"); console.log("opt:", opt ); }
		let obj;
		switch( typeof opt ){
			case 'undefined': obj = this.a[0].obj; break;
			case 'string'   : obj = document.querySelector(opt); break;
			case 'object'   : obj = opt; break;
			case 'number'   : obj = this.a[opt].obj; break;
		}
		// najdi index objektu
		let actKey = obj.dataset.inViewportIndex;
		let isOnViewport = mTestujViewport( this.a[actKey] );
		if( this.o.clog ) { console.groupEnd(); }
		return isOnViewport;
	}

// -------------
// --- MODEL ---
// -------------


	let mPocuvajNaScroll = () => {
		window.addEventListener('scroll', (event) => {
      requestAnimationFrame( ()=>{ onViewportTest(); } );
    });
	}


	let mNastavObjektyIVP = () => {
		if( this.o.clog ) { console.group(this.name+" ~ mNastavObjektyIVP()"); }
		let i = 0;

		if( isDOM( this.o.element ) )
			mNastavObjektyIVPzCyklu( this.o.element );
		else
			for( const ivp of document.querySelectorAll(this.o.selector) )
				mNastavObjektyIVPzCyklu( ivp, i++ );

		if( this.o.clog ) { console.groupEnd(); }
	}

	let mNastavObjektyIVPzCyklu = ( ivp, i = 0 ) => {
		ivp.dataset.inViewport = false; // predvolena hodnota, ci sa objekt nachadza vo viewporte
		ivp.dataset.inViewportIndex = i;
		let parents = mGetParents(ivp);
		ivp.dataset.ivpX = mGetX( ivp, parents ); // x suradnica umiestnenia objektu na stranke
		ivp.dataset.ivpY = mGetY( ivp, parents ); // y suradnica umiestnenia objektu na stranke
		ivp.dataset.ivpW = ivp.offsetWidth;
		ivp.dataset.ivpH = ivp.offsetHeight;
		// nastav this.a
		this.a[ivp.dataset.inViewportIndex] = {
			obj: ivp,
			inViewport: ivp.dataset.inViewport,
			x: parseInt(ivp.dataset.ivpX),
			y: parseInt(ivp.dataset.ivpY),
			w: parseInt(ivp.dataset.ivpW),
			h: parseInt(ivp.dataset.ivpH),
			yh: parseInt(ivp.dataset.ivpY) + parseInt(ivp.dataset.ivpH),
			xw: parseInt(ivp.dataset.ivpX) + parseInt(ivp.dataset.ivpW),
			ls: false, // Last Status
			isFnRunning: false, // kontrola, ci uz bola spustena uzivatelska funkcia onViewport
		}
	}

	let mTestujViewport = ( act ) => {
			let xOd = window.pageXOffset,
					xDo = window.pageXOffset + window.innerWidth,

					yOd = window.pageYOffset,
					yDo = window.pageYOffset + window.innerHeight,

					shy = false, // zakladny predpoklad viditelnosti na vysku
					shx = false, // zakladny predpoklad viditelnosti na sirku
					sh  = false; // zakladny celkovy predpoklad viditelnosti v x a y


						// console.clear();
						// console.table({
						// 	//'window.outer...'   : 'celkova sirka a vyska celej stranky + ovladacie prvky (url adresa, ikony, scroll, ... )',
						// 	//'window.outerWidth' : window.outerWidth,
						// 	//'window.outerHeight': window.outerHeight,
						// 	'window.inner...'   : 'sirka a vyska viditelnej casti',
						// 	//'window.innerWidth' : window.innerWidth,
						// 	'window.innerHeight': window.innerHeight,
						// 	'window.page...'    : 'posun stranky v X/Y smere',
						// 	//'px: window.pageXOffset': window.pageXOffset,
						// 	'py: window.pageYOffset': window.pageYOffset,
						// 	//'act.x': act.x,
						// 	'act.y': act.y, // vrchna cast objektu vo window.inner
						// 	'act.yh': act.yh, // spodna cast objektu vo window.inner
						// 	//'act.w': act.w,
						// 	'act.h': act.h,
						// 	'viditelna casst Y od: ': window.pageYOffset,
						// 	'viditelna casst Y do: ': window.pageYOffset + window.innerHeight,
						// 	'viditelna casst X od: ': window.pageXOffset,
						// 	'viditelna casst X do: ': window.pageXOffset + window.innerWidth,
						// });

			if( this.o.full ){ // cely viditelny objekt
				// scroll X
				if( act.x > xOd && act.xw < xDo )
					shx = true;
				// scroll Y
				if( act.y > yOd && act.yh < yDo )
					shy = true;
			} else { // len zaciatok objektu (lava horna cast)
				// scroll X
				if( act.x > xOd && act.x < xDo )
					shx = true;
				// scroll Y
				if( act.y > yOd && act.y < yDo )
					shy = true;
			}

			// show
			sh = ( shy && shx ) ? true : false;
			//console.log('show: ',sh);


			return sh;
	}

	// vrati X suradnicu na stranke
	let mGetX = ( ivp, parents ) => {
		if( this.o.clog ) { console.group(this.name+" ~ mGetX( ivp, parents )"); }
		let x = ivp.offsetLeft;
		for( const parent of parents || mGetParents(ivp) )
			x += parent.offsetLeft;
		if( this.o.clog ) { console.log('x = ',x); console.groupEnd(); }
		return x;
	}

	// vrati Y suradnicu na stranke
	let mGetY = ( ivp, parents=[] ) => {
		if( this.o.clog ) { console.group(this.name+" ~ mGetY( ivp, parents )"); }
		let y = ivp.offsetTop;
		for( const parent of parents || mGetParents(ivp) )
			y += parent.offsetTop;
		if( this.o.clog ) { console.log('y = ',y); console.groupEnd(); }
		return y;
	}

	// vrati pole rodicov z obj
	let mGetParents = ( obj ) => {
		let ary = [];
		while (obj) {
	    obj = obj.offsetParent;
	    if( obj ) ary.push(obj);
		}
		return ary;
	}

// --------------
// --- VIEWER ---
// --------------

// --------------
// --- RETURN ---
// --------------
	init();
	return {
		isView: testujViewportObject,
		o: this.o,
	}
}


export default inViewport
