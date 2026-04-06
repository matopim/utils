/** {f:'array-extend.js', v:'1.1.9', d:'2022-07-02', du:'2025-07-21'} **/
/*
 * rozsirenia pre prototyp ARRAY
 * -----------------------------
 * .unique
 * .duplicates
 * .unpaired
 * .sum
 * .avg
 * .numbers
 * .nonumbers
 * .suffle
 *
 * Pole Objektov: [ {}, {}, ... ]
 *
 * .get(key, value)     // Object
 * .gets(key, value)    // Array
 *
 * clean, delete, put, puts, putsBy, uniqueBy, move - ! menia povodne pole !
 * .clean()
 * .delete(key, value)
 * .put(key, item)
 * .puts(items)
 * .puts(items, true)
 * .putsBy(key, items)
 * .uniqueBy(key)
 * .move(from, to)
 *
 *      import '/library/js/array-extend.js'
 *
 *
 **/


// presun v ramci pola - zmena indexu
// from (z indexu) to (na index)
// efektivnejsie ako 2x splice
// AI: Len jeden cyklus na presun prvkov namiesto dvoch vnútorných prechodov v dvoch splice volaniach.
if (!Array.prototype.move) {
  Object.defineProperty(Array.prototype, 'move', {
    value: function(from, to) {
      const el = this[from];
      if (from < to) {
        for (let i = from; i < to; i++) {
          this[i] = this[i + 1];
        }
      } else {
        for (let i = from; i > to; i--) {
          this[i] = this[i - 1];
        }
      }
      this[to] = el;
      return this;
    },
    configurable: true,
    writable: true,
    enumerable: false
  });
}


if (!Array.prototype.uniqueBy) {
  Object.defineProperty(Array.prototype, 'uniqueBy', {
    value: function(key) {
      const seen = new Set();
      for (let i = this.length - 1; i >= 0; i--) {
        const val = this[i][key];
        if (seen.has(val)) {
          this.splice(i, 1);
        } else {
          seen.add(val);
        }
      }
      return this;
    },
    configurable: true,
    writable: true,
    enumerable: false
  });
}

if (!Array.prototype.put) {
  Object.defineProperty(Array.prototype, 'put', {
    value: function(key, item) {
      const idx = this.findIndex(a => a[key] === item[key]);
      if (idx !== -1)
        this.splice(idx, 1, item);
      else
        this.push(item);
      return this;
    },
    configurable: true,
    writable: true,
    enumerable: false
  });
}


if (!Array.prototype.puts) {
  Object.defineProperty(Array.prototype, 'puts', {
    value: function(items, tf = false) {
      if( tf )
        this.splice(0, this.length);
      this.splice( this.length, 1, ...items );
      return this;
    },
    configurable: true,
    writable: true,
    enumerable: false
  });
}


if (!Array.prototype.putsBy) {
  Object.defineProperty(Array.prototype, 'putsBy', {
    value: function(key, items) {
      // 1) postaviť mapu: hodnota kľúča → index
      const idxMap = this.reduce(
        (map, el, i) => map.set(el[key], i),
        new Map()
      );
      // 2) spracovať nové položky
      items.forEach(item => {
        const k = item[key];
        if (idxMap.has(k)) {
          this[idxMap.get(k)] = item;           // update
        } else {
          idxMap.set(k, this.length);
          this.push(item);                      // insert
        }
      });
      return this;
    },
    configurable: true,
    writable: true,
    enumerable: false
  });
}



if (!Array.prototype.clean) {
  Object.defineProperty(Array.prototype, 'clean', {
    value: function() {
      this.splice(0, this.length);
      return this;
    },
    configurable: true,
    writable: true,
    enumerable: false
  });
}



// [Array] upravi pole z ktoreho vymaze zaznam podla kluca a hodnoty
/*
* napr ~ vrati nove pole:
*   const ary  = [ {a:1,b:'ahoj'}, {a:2,b:'serus'} ];
*   const rows = ary.delete( 'b', 'ahoj' );
*   => [ {a:2,b:'serus'} ]
*/
if (!Array.prototype.delete) {
  Object.defineProperty(Array.prototype, 'delete', {
    value: function(key, value) {
      const idx = this.findIndex(item => item[key] === value);
      if (idx !== -1)
        this.splice(idx, 1);
      return this;
    },
    configurable: true,
    writable: true,
    enumerable: false
  });
}


// [Object] vrati hodnotu z viacrozmerneho pola podla kluca
/*
* napr:
*   const ary = [ {a:1,b:'ahoj'}, {a:2,b:'serus'} ];
*   const row = ary.get( 'b', 'serus' );
*   => {a:2,b:'serus'}
*
*/
if( Array.prototype.get === undefined )
    Object.defineProperty(Array.prototype, 'get', {
        value: function(key, value) {
            return this.find(item => item[key] === value);
        },
        writable: false,
        configurable: true
    });



// [Array] vrati hodnoty z viacrozmerneho pola podla kluca
/*
* napr:
*   const ary = [ {a:1,b:'ahoj'}, {a:2,b:'serus'}, {a:3,b:'ahoj'} ];
*   const rows = ary.gets( 'b', 'ahoj' );
*   => [ {a:1,b:'ahoj'}, {a:3,b:'ahoj'} ]
*
*/
if( Array.prototype.gets === undefined )
    Object.defineProperty(Array.prototype, 'gets', {
        value: function(key, value) {
            return this.filter(item => item[key] === value);
        },
        writable: false,
        configurable: true
    });



// .unique - ponecha len jedinecne hodnoty (aj v pripade vnoreneho pola/objektu)
/*
* napr:  
*  const aCisla  = [1,2,5,2,3,4,1,5];
*  const aUnique = aCisla.unique();
*  => [1,2,5,3,4]
* -----------------------------------
* const ary = [ {a:1}, {a:2}, {a:1} ].unique
* => [ {a:1}, {a:2} ]
**/
if( Array.prototype.unique === undefined )
    Object.defineProperty(Array.prototype, 'unique', {
        get(){
            // return this.filter( (value, index, self) => { return self.indexOf(value) === index} )
            const ary = this.filter( (value, index, self) => {
                if( !value || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
                    return self.indexOf(value) === index

                // porovna vnorene pole alebo objekt
                const shadow = self.map( a => JSON.stringify(a) )
                return shadow.indexOf(JSON.stringify( value )) === index
            } )

            return ary
        }
    });


// .duplicates - ponecha len duplicitne hodnoty
/*
* napr:
*  const aCisla  = [1,2,5,2,3,4,1,5];
*  const aDuplicates = aCisla.duplicates();
*  => [1,2,5]
* -----------------------------------
* const ary = [ {a:1}, {a:2}, {a:1} ].duplicates
* => [ {a:1} ]
**/
if (Array.prototype.duplicates === undefined)
    Object.defineProperty(Array.prototype, 'duplicates', {
        get() {
            const seen = new Set();
            const duplicates = new Set();
            const serializedItems = this.map(item =>
                (item && typeof item === 'object')
                    ? JSON.stringify(item)
                    : item
            );
            serializedItems.forEach((item, index) => {
                if (seen.has(item)) {
                    duplicates.add(item);
                } else {
                    seen.add(item);
                }
            });
            // vráti späť reálne hodnoty (nie stringy)
            const result = [];
            duplicates.forEach(d => {
                const idx = serializedItems.indexOf(d);
                result.push(this[idx]);
            });
            return result;
        }
    });



// .unpaired - vrati len hodnoty, ktore nemaju par
/*
* napr:
*  const a = [1,2,3,4,5];
*  const b = [1,2,  4,5];
*  const c = a.concat(b);
*  const c.unpaired();
*  => [3]
* -----------------------------------
* const ary = [ {a:1}, {a:2}, {a:1} ].unpaired
* => [ {a:2} ]
**/
if (Array.prototype.unpaired === undefined)
  Object.defineProperty(Array.prototype, 'unpaired', {
      get() {
          const counts = new Map();
          const originals = [];

          this.forEach(item => {
              const key = (item && typeof item === 'object')
                  ? JSON.stringify(item)
                  : item;

              if (!counts.has(key)) {
                  counts.set(key, 1);
                  originals.push({ key, value: item });
              } else {
                  counts.set(key, counts.get(key) + 1);
              }
          });

          return originals
              .filter(entry => counts.get(entry.key) === 1)
              .map(entry => entry.value);
      }
  });


// .sum - spocita hodnoty pola (sucet)
if( Array.prototype.sum === undefined )
    Object.defineProperty(Array.prototype, 'sum', {
        // value: function() { return this.reduce((accumulator, currentValue) => accumulator + Number(currentValue)) },
        get(){
            // return this.reduce((accumulator, currentValue) => {
            //     if( currentValue === null )
            //         currentValue = 0
            //     return accumulator + Number(currentValue)
            // })

            // !! reduce nemoze byt pouzite na pazdne pole
            if( !this.length )
                return 0;
            return this.reduce((accumulator, currentValue) => accumulator + Number(currentValue))
        }
    });





// .avg - vrati priemer
if( Array.prototype.avg === undefined )
    Object.defineProperty(Array.prototype, 'avg', {
        get(){
            const lng = this.length
            if( !lng )
                return 0
            return this.sum / lng
        }
    });





// .numbers - zredukuje pole tak, ze bude obsahovat len cisla
// => odstrani hodnoty NULL, '', 'string'
// ... v podstate vsetko, co sa neda prekonvertovat na cislo
if( Array.prototype.numbers === undefined )
    Object.defineProperty(Array.prototype, 'numbers', {
        get(){
            const ary = this.filter( (value) =>
                {
                    if( value === null )
                        return false
                    if( String(value).trim() === '' )
                        return false
                    return !isNaN(Number(value))
                }
            )
            return ary.map( (value) => parseFloat(value) )
        }
    });





// .nonumbers - inverzna funkcia k .numbers
if( Array.prototype.nonumbers === undefined )
    Object.defineProperty(Array.prototype, 'nonumbers', {
        get(){
            return this.filter( (value) =>
                {
                    if( value === null )
                        return true
                    return isNaN(Number(value))
                }
            )
        }
    });


// .shuffle - nahodne premiešanie pola
if( Array.prototype.shuffle === undefined )
    Object.defineProperty(Array.prototype, 'shuffle', {
        get(){
            return this.sort(() => Math.random() - 0.5);
        }
    });