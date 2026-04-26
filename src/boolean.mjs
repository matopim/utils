/** {f:'boolean.mjs', v:'1.1.3', d:'2023-06-07', du:'2026-04-22'} **/

/*

	import boolean from '@pim.sk/utils/boolean.mjs'


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