/** {f:'class-url.mjs', v:'2.0.8', d:'2018-12-13', du:'2026-04-22'} **/

// od ver. 2.0.0 (2024-12-01) je classUrl zalozene na API URL
// https://developer.mozilla.org/en-US/docs/Web/API/URL_API


/*

import classUrl from '@pim.sk/utils/class-url.mjs';

const curl = new classUrl( my_Url_Or_Empty );


*/

import { basename, dirname, cleanPath } from './strings.mjs'

class classUrl {
  "use strict";

  constructor( url, options ) {
    this.name = this.__proto__.constructor.name;
    url = url || document.location.href;


    this.options = Object.assign(
			{
				history: false,
				historyName: '',
				// pomocne premenne
				clog: false
			}, options || {} );

    this.clog = this.options.clog;

    this.url = url;

    this.location = this.newLocation( url );

    const target = { url }

    this._proxy = new Proxy( target, {
    	set: (obj, prop, value) => {
    		if( prop === 'url' ){
    			obj[prop] = value;
			  	this.location = this.newLocation( value );
					if( this.location && this.options.history )
			  		this.addHistoryPush( this.options.historyName );
    		}
    		return true; // Signalizácia úspešného nastavenia
    	}
    } );

  }






// -----------------------
// --- GETTER / SETTER ---
// -----------------------

  get aPath(){ return this.getPaths(); }
  get aQuery(){ return this.getQuerySearch(); }


  get dirname(){ return this.location.dirname }
  get basename(){ return this.location.basename }

  get pathname(){ return this.location.pathname; }
	// zmeni cestu od root (hostname) na zaklade novej hodnoty pathname (nova relativna cesta)
  set pathname( v ){ this.setPathName( v ); }

  // prida hodnoty query do location.search
  // vysledkom je rozsirereny string .search a pole query
  // na vstupe moze byt string alebo objekt:
  // 	string: 'x=1&y=2'
  //  objekt: {x:1,y:2}
  set addQuery( v ){ this.addSearch( v ); }

  // odstrani polozku(y) query zo .search
	// priklad: curl.removeSearch('x,y') -> vyhlada z povodneho search x aj y a odstrani ich
	// alternativny vstup: ['x','y']
  set removeQuery( v ){ this.removeSearch( v ); }

  get hash(){ return this.location.hash?.replace( '#', '' ) }
  set hash( v ){ this.setHash( v ) }


// --------------
// --- METHOD ---
// --------------

  // kompletne pregeneruje document.location na zaklade novej url
  newLocation( url ){
  	let dl = {};
  	dl = this.appendLocationBase( dl, url );
  	dl = this.appendLocationAdvance( dl );
  	return dl;
  }

  appendLocationBase( dl, url = null ){
  	url = url || this.url;
  	const u = new URL( url );

	// odstranit koncove '/' z pathname okrem korenoveho '/'
	const pathname = u.pathname.length > 1 ? u.pathname.replace( /\/+$/, '' ) : u.pathname;

  	Object.assign( dl, {
  		href: u.href,
  		origin: u.origin,
  		protocol: u.protocol,
  		host: u.host,
  		hostname: u.hostname,
  		port: u.port,
  		search: u.search,
  		hash: u.hash,
  		pathname,
  	} );

  	return dl;
  }


  appendLocationAdvance( dl ){

  	dl.dirname = this.getDirName( dl.pathname );

  	dl.basename = this.getBaseName( dl.pathname );

  	return dl;
  }



  // isBaseName
	getIsBaseName( pathname ){
		const patbn = '\.html$|\.htm$|\.htm$|\.php$|\.jpg|\.jpeg|\.svg$|\.gif$|\.pdf$'
		const isBaseName = ( new RegExp( patbn, 'i' ).test( pathname ) )
		return isBaseName
	}

	// BASENAME
	getBaseName( pathname ){
		const isBaseName = this.getIsBaseName( pathname );
		const bn = isBaseName ? basename( pathname ) : '';
		return bn;
	}

	// DIRNAME
	getDirName( pathname ){
		const isBaseName = this.getIsBaseName( pathname );
		const dn = isBaseName ? dirname( pathname ) : pathname;
		return dn;
	}

  getQuery( s ){ // vrati asociativne pole zo stringu napr: 1/ "?a=1&x=2"		2/ "#a=1&b=2"
		if(!s) return {};
		s = s.replace( new RegExp(/\?|#/), '' );
		var as = s.split('&'),
				aso = {};
		as.forEach(function(v){ // [a=1,x=2]
			var ary = v.split('=');
			aso[ary[0]] = ary[1];
		});
		return aso; // {a:1,x:2}
	}

  getQuerySearch(){ // vrati asociativne pole z aktivneho .search
		return this.getQuery( this.location.search );
	}


	getPaths(){
		const paths = cleanPath(this.location.pathname).split('/')
		return paths
	}

  vypis(){
		console.log("classUrl:",this);
	}



// ------------------
// DYNAMICKE ZMENY //
// ------------------

	// zmeni cestu od root (hostname) na zaklade novej hodnoty pathname:
	// ak href = http://localhost/crm/faktury/... ;
	// s = 'crm/faktury/new/';
	//     'e-shop/?basket'
	// =>  href = http://localhost/crm/faktury/new
	setPathName( s ){
		s = cleanPath(s);

		// aktualizovat url a location
  	this._proxy.url = this.urlBy( 'pathname', s );
	}

	setHash( s ){
		s = s.trim().replace( new RegExp(/^\#/), '' );
		// aktualizovat url a location
  	this._proxy.url = this.urlBy( 'hash', s );
	}

  // prida string do location.search - priklad: curl.addSearch('x=1&y=2')
  // mozno vlozit aj asociativne pole - napr: {a:"ahoj",b:"svet"}
  addSearch( v ){
  	let s   = '';
  	let vo  = {}; // vstupna hodnota 'v' ako objekt
  	// ziskat povodne hodnoty
  	const aq = this.aQuery;
  	// ak string, parsovat hodnoty do objektu
  	if( typeof v === 'string' ){
  		vo = Object.fromEntries(
	  			v.split('&').map( a => {
	  			return a.split('=');
  			})
  		);
  	} else {
  		// 'v' ako objekt
  		vo = v;
  	}


  	// doplnit / zmenit hodnotu
  	Object.assign( aq, vo );

  	// aktualizovat url a location
  	this._proxy.url = this.urlBy( 'query', aq );
	}

	// zrekonstruuje url adresu po zmene hodnot
	// vrati url zmenenu o pozadovany typ (search, query, pathname, ...)
	urlBy( type, v ){
		const dl = this.location;
		let url = dl.origin;
		let {pathname,search,hash} = dl;

		switch( type ){
			case 'pathname':
				pathname = '/' + cleanPath(v);
				break;
			// .search ako pole
			case 'query':
				if( Object.keys(v).length )
					search = '?' + Object.entries(v).map(([key, value]) => `${key}=${value}`).join('&');
				else
					search = ''
				break;
			case 'search':
				search = v ? `?${v}` : '';
				break;
			case 'hash':
				hash = v ? `#${v}` : '';
				break;
		}
		url += pathname + search + hash;
		return url;
	}

	// odstrani polozku(y) query z location.search
	// priklad: curl.removeSearch('x,y') -> vyhlada z povodneho search x aj y a odstrani ich
	removeSearch( s ){
		const keys = typeof s === 'string' ? s.replaceAll(' ','').split(',') : s;
		const aq   = this.aQuery;
		for( const key of keys )
			delete aq[key];

  	// aktualizovat url a location
  	this._proxy.url = this.urlBy( 'query', aq );

	}

// -----------
// HISTORIA //
// -----------

	// podobne ako push zmeni url ale nezapise do historie
	addHistoryReplace( name='PageName', values=null, path=null ){
		if( path )
  		this.pathname = path;
  	values = values || {...this.aQuery}
  	const origin = cleanPath(this.location.origin)
  	const pathname = cleanPath(this.location.pathname)
  	const search = this.location.search
  	const hash = this.location.hash
		const isBaseName = this.getIsBaseName( pathname )
		// let href = [origin, pathname].join('/')
		let href = pathname;
		// if( !isBaseName )
		// 	href += '/'
		href += `${search}${hash}`
		if( values instanceof Object )
  		if( !Object.keys(values).length )
  			values = null
		window.history.replaceState(values, name, href);
	}

  // prepise url adresu prehliadaca a zapise historiu
  // tejto funkcii predchadza this.setPathName
  // alebo dodat 3. parameter 'path'
  addHistoryPush( name='PageName', values=null, path=null ){
  	if( path )
  		this.pathname = path;
  	values = values || {...this.aQuery}
  	const origin = cleanPath(this.location.origin)
  	const pathname = cleanPath(this.location.pathname)
  	const search = this.location.search
  	const hash = this.location.hash
		const isBaseName = this.getIsBaseName( pathname )
		// let href = [origin, pathname].join('/')
		let href = pathname;
		// if( !isBaseName )
		// 	href += '/'
		href += `${search}${hash}`
  	// const href = [ cleanPath(this.location.origin), pathname, `${this.location.search}${this.location.hash}` ].join('/')
  	if(this.clog){
	  	console.group('addHistoryPush')
	  	console.log( 'name', name )
	  	console.log( 'values', values )
	  	console.log( 'href', href )
	  	console.log( 'this', this )
	  	console.groupEnd()
  	}

  	if( values instanceof Object )
  		if( !Object.keys(values).length )
  			values = null

  	try{
	  	window.history.pushState(
	  		values,
	  		name,
	  		href
	  	);
  	} catch ( error ){
			console.group( 'curl / addHistoryPush - chyba pushState' )
  		console.log( 'name: ', name );
  		console.log( 'values: ', values );
  		console.log( 'href: ', this.location.href );
  		console.log( 'this: ', this )
  		console.log( 'history: ', window.history )
  		console.error( 'error: ', error );
  		console.groupEnd()
  	}
  }



  // tato funkcia sa pouziva v kombinacii this.addHistoryPush
  // nastavi udalost na sledovanie back() a spusti uzivatelsku funkciu
  // values nie je povinna premenna, ale moze sluzit na blizsiu identifikaciu prvku historie
  // navratova hodnota event.state nesie asociativne pole prvkov this.location.search
  addHistoryBack( userFunction, ...values ){
  	window.onpopstate = function(event){
			userFunction( event.state, values, event )
		}
  }


}


export default classUrl
