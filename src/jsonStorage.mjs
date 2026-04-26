/** {f:'jsonStorage.mjs', v:'1.1.6', d:'', du:'2026-04-22'} **/

// get a set na localStorage
// predvolene ako JSON hodnoty
// napr: dev.val1 = 123

/*

	import jsonStorage from '@pim.sk/utils/jsonStorage.mjs'

*/

/*
	Example:

		// set
				jsonStorage.setItem( 'bdt', {limit:15, ord:2} )
				//  => bdt.limit = 15; bdt.ord = 2;
				jsonStorage.setItem( 'bdt', {ord:3} )
				//  => bdt.limit = 15; bdt.ord = 3;
		// get
				jsonStorage.getItem( 'bdt' )
				//	=> {limit:15, ord:3}
				jsonStorage.getItem( 'bdt' ).ord
				//	=> 3
		// delete ~ mazanie podla kluca
				jsonStorage.deleteItem( 'bdt', 'ord' )
				// => {limit:15}
		// remove
				jsonStorage.removeItem( 'bdt' )
				// => undefined
*/

// jsonStorage

export default {

	// jsonStorage.getItem( 'bdt' )
	// jsonStorage.getItem( 'bdt' ).limit
	getItem( name ){
		// console.log( 'name: ', name )
		let s = localStorage.getItem( name )
		// console.log( 's: ', typeof s, s )
		if( !s )
			return {}
		try {
			s = JSON.parse(s)
		} catch( e ){ return {} }
		return s
	},

	// jsonStorage.setItem( 'bdt', {limit:15} )
	// force ~ najprv vymaze a potom vytvori storage => nedoplnuje, ale nahradi
	setItem( name, values, force = false ){
		// console.log( name, ' ~ values: ', typeof values, values )
		if( typeof name !== 'string' )
			return console.error( 'Parameter "name" musi byt string! \nname: ', name )
		if( force )
			this.removeItem( name )
		if( !values ){ // null, undefined, 0, ''
			localStorage.setItem( name, values )
			return;
		}
		let a = undefined;
		switch( typeof values ){
			case 'object':
				if( values instanceof Array ){
					// doplnit pole o nove hodnoty
					a = localStorage[name] ? this.getItem( name ) : []
					// console.log( 'array values: ' )
					// console.log( ...a )
					// console.log( ...values )
					a.push( ...values )
					localStorage.setItem( name, JSON.stringify(a) )
				} else {
					// skombinovat asociativne pole
					a = localStorage[name] ? this.getItem( name ) : {}
					Object.assign( a || {}, values )
					localStorage.setItem( name, JSON.stringify(a) )
				}
			break;
			default:
				localStorage.setItem( name, values )
		}
	},


	// vymaze z pola zvoleny kluc
	// jsonStorage.deleteItem( 'bdt', 'limit' )
	deleteItem( name, key ){
		let a = this.getItem( name )
		delete a[key]
		console.log( 'a: ', a )
		localStorage.setItem( name, JSON.stringify(a) )
	},

	// jsonStorage.removeItem( 'bdt' )
	removeItem( name ){
		localStorage.removeItem( name )
	}

}