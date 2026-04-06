/** {f:'string-extend.js', v:'1.1.1', d:'2023-05-14', du:'2024-06-24'} **/

/*
 * rozsirenia pre prototyp STRING
 * -----------------------------
 * .parse
 *
 *
 *      import '/library/js/string-extend.js'
 *
 *
 **/

import parse from './parse.mjs'

if( String.prototype.parse === undefined )
    Object.defineProperty(String.prototype, 'parse', {
        get(){
          return parse(this)
        }
    });