/** {f:'jsonStorageSes.mjs', v:'1.1.7', d:'', du:'2026-04-22'} **/

// get a set na sessionStorage
// predvolene ako JSON hodnoty
// napr: dev.val1 = 123

/*

import jsonStorageSes from '@pim.sk/utils/jsonStorageSes.mjs'

*/

/*
	Example:

		// set
				jsonStorageSes.setItem( 'bdt', {limit:15, ord:2} )
				//  => bdt.limit = 15; bdt.ord = 2;
				jsonStorageSes.setItem( 'bdt', {ord:3} )
				//  => bdt.limit = 15; bdt.ord = 3;
		// get
				jsonStorageSes.getItem( 'bdt' )
				//	=> {limit:15, ord:3}
				jsonStorageSes.getItem( 'bdt' ).ord
				//	=> 3
		// delete ~ mazanie podla kluca
				jsonStorageSes.deleteItem( 'bdt', 'ord' )
				// => {limit:15}
		// remove
				jsonStorageSes.removeItem( 'bdt' )
				// => undefined
*/

// jsonStorageSes

export default {

	// jsonStorageSes.getItem( 'bdt' )
	// jsonStorageSes.getItem( 'bdt' ).limit
	getItem( name ){
		// console.log( 'name: ', name )
		let s = sessionStorage.getItem( name )
		// console.log( '>>> s: ', typeof s, s )
		if( !s )
			return {}
		try {
			s = JSON.parse(s)
		} catch( e ){ return {} }
		return s
	},

	// jsonStorageSes.setItem( 'bdt', {limit:15} )
	// force ~ najprv vymaze a potom vytvori storage => nedoplnuje, ale nahradi
	setItem( name, values, force = false ){
		// console.log( name, ' ~ values: ', typeof values, values )
		if( typeof name !== 'string' )
			return console.error( 'Parameter "name" musi byt string! \nname: ', name )
		if( force )
			this.removeItem( name )
		if( !values ){ // null, undefined, 0, ''
			sessionStorage.setItem( name, values )
			return;
		}
		let a = undefined;
		switch( typeof values ){
			case 'object':
				if( values instanceof Array ){
					// doplnit pole o nove hodnoty
					a = sessionStorage[name] ? this.getItem( name ) : []
					// console.log( 'array values: ' )
					// console.log( ...a )
					// console.log( ...values )
					a.push( ...values )
					sessionStorage.setItem( name, JSON.stringify(a) )
				} else {
					// skombinovat asociativne pole
					a = sessionStorage[name] ? this.getItem( name ) : {}
					Object.assign( a || {}, values )
					sessionStorage.setItem( name, JSON.stringify(a) )
				}
			break;
			default:
				sessionStorage.setItem( name, values )
		}
	},


	// vymaze z pola zvoleny kluc
	// jsonStorageSes.deleteItem( 'bdt', 'limit' )
	deleteItem( name, key ){
		let a = this.getItem( name )
		delete a[key]
		console.log( 'a: ', a )
		sessionStorage.setItem( name, JSON.stringify(a) )
	},

	// jsonStorageSes.removeItem( 'bdt' )
	removeItem( name ){
		sessionStorage.removeItem( name )
	}

}