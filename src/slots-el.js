/** {f:'slots-el.js', v:'1.1.8', d:'2023-12-23', du:'2024-12-10'} **/


// Ulohou je regenerovat slot a odovzdat ho dalej ako premennu ako Node element(y)


/*

	import slotsEl from '/library/js/slots-el.js'

	<div id="app">
		<parent-component>
			<child-component>
				<template><i class="fa fa-check"></i> Toto je moj slot...</template>
			</child-component>
		</parent-component>
	</div>

	JS in child-component:
	const mySlot = new slotsRegenerate( this.$slots.default() )

	console.log( 'html: ', mySlot.html )
	console.log( 'node: ', mySlot.node )

*/

import { render, h } from 'vue'

class slotsEl {
	"use strict";

  constructor( slots ) {
    this.name  = this.__proto__.constructor.name
    // console.log( 'constructor( slots ): ', slots )
    this.clog = false
    this.optSlots = slots
    this.aSlots = [];
    // console.log( 'slot this: ', this )
  }

  get html(){ return this.getHtml() }
  get node(){ return this.getNode() }
  get slots(){ return this.aSlots }

  // cykle of this.slot
  cSlots( isNode = false ){
  	this.aSlots = [];
  	// console.log( 'slot...', ...this.optSlots )
  	for( const slot of this.optSlots )
			this.aSlots.push( {type:slot.type, children:slot.children, html: this.cSlot( slot, isNode )} )
  	// console.log( 'aSlot...', ...this.aSlots )
  	return this.aSlots
  }

	cSlot(slot, isNode = false) {
	  const children = slot.children;
	  const type = String(slot.type);
	  const props = slot.props;

	  let html = '';
	  let obj = undefined;

	  // Ak existuje tag
	  if (!new RegExp(/^symbol/gi).test(type)) {
	    obj = document.createElement(type, props);
	  }

	  // Ak neexistuje tag, ale je to text
	  if (!obj && typeof children === 'string') {
	    return children;
	  }

	  // Spracovanie atribútov
	  if (props && obj) {
	    for (const pKey of Object.keys(props)) {
	      obj.setAttribute(pKey, props[pKey]);
	    }
	  }

	  // Ak sú deti reťazec, pridaj ich
	  if (obj && typeof children === 'string') {
	    obj.append(children);
	  }

	  // Spracovanie pola detí
	  if (Array.isArray(children)) {
	    for (const chld of children) {
	      const childNode = this.cSlot(chld, true);
	      if (childNode instanceof Node) {
	        obj.appendChild(childNode);
	      } else {
	        // console.warn('Child is not a Node, handling as raw HTML: ', chld);
	        obj.innerHTML += childNode; // Pridaj ako HTML
	      }
	    }
	  }

	  if (isNode) {
	    return obj;
	  }

	  if (obj) {
	    html = obj.outerHTML;
	  }

	  return html;
	}


  // vrati plne html
  getHtml(){
  	const ary = this.cSlots( false )
  	const html = ary.map( a => a.html ).join('')
  	return html
  }

  // vrati plne node
  getNode(){
  	const ary = this.cSlots( true )
  	const nodes = ary.map( a => a.html )
  	return nodes
  }

}


export default slotsEl