/** {f:'boolean.mjs', v:'1.1.2', d:'2023-06-07', du:'2024-06-24'} **/

/*

	import boolean from '/library/js/boolean.mjs'


	boolean(true)      => true
	boolean(false)     => false
	boolean('true')    => true
	boolean('false')   => false
	boolean('1')       => true
	boolean('0')       => false
	boolean(1)         => true
	boolean(0)         => false

	boolean('')        => false
	boolean(NaN)       => false
	boolean(null)      => false
	boolean(undefined) => false
	boolean([...])     => false
	boolean({...})     => false

*/


const boolean = function( v ){

	switch( typeof v ){
		case 'boolean': return v; break;
		case 'number' : return v ? true : false; break;
		case 'string' : return ( new RegExp(/^true$|^1$/i).test(v) ) ? true : false; break;
		default       : return false;
	}

}

export default boolean