# @pim.sk/utils

**Basic JavaScript utilities for browser-based applications.**  
*Zakladne JavaScript utility pre aplikacie bezlace v prehliadaci.*

Each module is independent and can be imported separately via subpath exports.  
*Kazdy modul je nezavisly a mozno ho importovat samostatne cez subpath exports.*

---

## Installation / Instalacia

```bash
npm install @pim.sk/utils
```

> **Peer dependency:** `vue` is required only if you use `slots-el`.  
> *`vue` je vyzadovane len pri pouziti `slots-el`.*

---

## Usage / Pouzitie

Import individual modules using subpath exports:  
*Importuj jednotlive moduly pomocou subpath exports:*

```javascript
import { sleep, to }      from '@pim.sk/utils/wait'
import { accentMap }      from '@pim.sk/utils/strings'
import sortAssoc          from '@pim.sk/utils/sort-assoc'
import jsonStorage        from '@pim.sk/utils/json-storage'
import { fulltextFilter } from '@pim.sk/utils/fulltext-filter'
import get                from '@pim.sk/utils/get'
```

---

## Modules / Moduly

### `array` – Array utilities
```javascript
import { proxyToAry, objectToAry } from '@pim.sk/utils/array'
```
| Function | Description / Popis |
|----------|---------------------|
| `proxyToAry(ary)` | Converts Vue proxy to plain JS object/array. *Prevod Vue proxy na plain JS objekt/pole.* |
| `objectToAry(obj)` | Converts associative object to array. *Prevod asociativneho objektu na pole.* |

---

### `array-extend` – Array prototype extensions
```javascript
import '@pim.sk/utils/array-extend'
```
Extends `Array.prototype` with: `.unique`, `.duplicates`, `.sum`, `.avg`, `.get()`, `.gets()`, `.clean()`, `.delete()`, `.put()`, `.move()` and more.  
*Rozsiruje `Array.prototype` o metody: `.unique`, `.duplicates`, `.sum`, `.avg`, `.get()`, `.gets()`, `.clean()`, `.delete()`, `.put()`, `.move()` a dalsie.*

---

### `boolean` – Boolean conversion
```javascript
import boolean from '@pim.sk/utils/boolean'
```
Converts any value to a strict `true`/`false`.  
*Prevod lubovolnej hodnoty na striktne `true`/`false`.*

```javascript
boolean('true')  // => true
boolean('1')     // => true
boolean('false') // => false
boolean(null)    // => false
```

---

### `class-url` – URL manipulation
```javascript
import classUrl from '@pim.sk/utils/class-url'
```
URL builder and parser based on the native `URL` API.  
*Tvorba a parsovanie URL adries zalozene na nativnom `URL` API.*

```javascript
const curl = new classUrl( window.location.href )
curl.setParam('page', 2)
curl.url  // => 'https://example.com/path?page=2'
```

---

### `date-time` – Date and time utilities
```javascript
import { toDate, now, modifyDate, durationFormat, betweenDateTime } from '@pim.sk/utils/date-time'
```
| Function | Description / Popis |
|----------|---------------------|
| `now()` | Current datetime in local timezone. *Aktualny cas v lokalnom casovom pasme.* |
| `toDate(d, type)` | Format date: `'date'`, `'datetime'`, `'month'`, `'time'`, `'number'`. |
| `modifyDate(date, value, unit)` | Add/subtract time: `y m d H i s`. *Prictanie/odoctanie casu.* |
| `durationFormat(seconds)` | Human-readable duration. *Trvanie v citatelnom formate.* |
| `betweenDateTime(d, from, to)` | Check if date is between two dates. *Test ci je datum v rozsahu.* |
| `difference(d1, d2)` | Difference in ms. *Rozdiel v ms.* |
| `firstDate(d)` / `lastDate(d)` | First/last day of month. *Prvy/posledny den mesiaca.* |

---

### `debounce` – Debounce utility
```javascript
import debounce from '@pim.sk/utils/debounce'
```
```javascript
const db = debounce( myFunction, 300 )
input.addEventListener('input', db.start)   // delayed call / oneskorene volanie
input.addEventListener('change', db.run)    // immediate call / okamzite volanie
```
| Method | Description / Popis |
|--------|---------------------|
| `.start(...args)` | Start debounce timer. *Spusti casovac.* |
| `.stop()` | Cancel. *Zrusi.* |
| `.run(...args)` | Execute immediately. *Spusti okamzite.* |
| `.isEnd()` | Returns `true` when finished. *Vrati `true` po ukonceni.* |
| `.onEnd(fn)` | Callback after debounce ends. *Callback po ukonceni.* |

---

### `dom` – DOM utilities
```javascript
import { toDOM, zIndexMax, searchElementsAll, searchShadowsAll, getRelativeParents } from '@pim.sk/utils/dom'
```
Works through Shadow DOM.  
*Funguje aj cez Shadow DOM.*

---

### `fulltext-filter` – Fulltext filtering
```javascript
import { fulltextFilter } from '@pim.sk/utils/fulltext-filter'
```
```javascript
const result = fulltextFilter( items, 'search text', { fields: ['name', 'desc'] } )
```
- Case-insensitive, accent-insensitive (a = á, e = é, ...) by default.  
  *Predvolene bez rozlisenia velkych/malych pismen a diakritiky.*
- Multiple words = AND logic. *Viac slov = AND logika.*

---

### `get` – Fetch wrapper
```javascript
import get from '@pim.sk/utils/get'
```
Lightweight `fetch` wrapper with automatic JSON detection.  
*Odlahceny obal nad `fetch` s automatickou detekciou JSON.*

```javascript
const data = await get('/api/users', { id: 1 })         // POST + JSON
const data = await get('/api/users', { id: 1 }, 'GET')  // GET
const data = await get('/api/upload', formData, 'form') // multipart/form-data
```

---

### `inViewport` – Viewport detection
```javascript
import inViewport from '@pim.sk/utils/in-viewport'
```
Detects when elements enter the visible area (viewport).  
*Detekuje kedy element vstupuje do viditelnej casti stranky.*

```javascript
new inViewport('.my-element', { onViewport: (el) => el.classList.add('visible') })
```

---

### `is` – Type checking
```javascript
import { isDate, isJson, isArray, isObject, isDOM, isNumber, isString, isFunction } from '@pim.sk/utils/is'
```
| Function | Description / Popis |
|----------|---------------------|
| `isDate(str)` | Checks if string is a valid ISO date. *Test ci je retazec platny datum.* |
| `isJson(str)` / `isJson(str, 'parse')` | Test / parse JSON string. |
| `isArray(v)` | `Array.isArray()` with try/catch. |
| `isObject(v)` | Plain `{}` object only. *Len obyc. objekt `{}`.* |
| `isDOM(el)` | `el instanceof Element`. |

---

### `json-storage` – localStorage wrapper
```javascript
import jsonStorage from '@pim.sk/utils/json-storage'
```
Stores and retrieves JSON objects from `localStorage`. Merges objects automatically.  
*Uklada a nacitava JSON objekty z `localStorage`. Automaticky zlucuje objekty.*

```javascript
jsonStorage.setItem('settings', { limit: 25, theme: 'dark' })
jsonStorage.getItem('settings')          // => { limit: 25, theme: 'dark' }
jsonStorage.setItem('settings', { limit: 50 })  // merge => { limit: 50, theme: 'dark' }
jsonStorage.removeItem('settings')
```

---

### `json-storage-ses` – sessionStorage wrapper
```javascript
import jsonStorageSes from '@pim.sk/utils/json-storage-ses'
```
Same API as `json-storage` but uses `sessionStorage`.  
*Rovnake API ako `json-storage`, ale pouziva `sessionStorage`.*

---

### `line` – Debug helper
```javascript
import '@pim.sk/utils/line'
// Adds global __LINE__ variable
console.log(__LINE__)  // => 'myfile.js:42'
```
Returns current filename and line number for debugging.  
*Vrati nazov suboru a cislo riadku pre debugovanie.*

---

### `numbers` – Number utilities
```javascript
import { cislo, percento, percPodiel, formatBytes, ratio } from '@pim.sk/utils/numbers'
```
| Function | Description / Popis |
|----------|---------------------|
| `cislo(n, decimals)` | Rounds to N decimal places. *Zaokruhli na N desatinnych miest.* |
| `percento(base, part)` | Calculates percentage. *Vypocet percenta.* |
| `percPodiel(base, perc)` | Calculates percentage share. *Vypocet percentualneho podielu.* |
| `formatBytes(bytes)` | `1048576` → `'1 MB'`. |
| `ratio` | Class for recalculating proportional values. *Trieda pre proporcionalny prepocet cisel.* |

---

### `parse` – Value parser
```javascript
import parse from '@pim.sk/utils/parse'
```
Converts string values to their natural JS types (number, boolean, null, ...).  
*Prevedie retazcove hodnoty na prirodzene JS typy (cislo, boolean, null, ...).*

```
parse( input, ignore?, booleans? )
```

| Parameter | Type | Description / Popis |
|-----------|------|---------------------|
| `input` | any | Value, object or array to parse. *Hodnota, objekt alebo pole na parsovanie.* |
| `ignore` | string | Comma-separated field names to skip (keep as string). *Polia ktore sa nemaju konvertovat – oddelene ciarkou.* |
| `booleans` | string | Comma-separated field names to force as boolean. *Polia ktore sa maju konvertovat na striktne boolean.* |

Recursively handles primitives, objects, arrays and **arrays of objects**.  
*Rekurzivne spracuje primitiva, objekty, polia aj **polia objektov**.*

**Basic usage / Zakladne pouzitie:**
```javascript
// primitives / primitiva
parse('123')          // => 123
parse('true')         // => true
parse('null')         // => null
parse('abc')          // => 'abc'
parse('3.14')         // => 3.14

// object / objekt
parse({ a: '1', b: 'false', c: 'hello' })
// => { a: 1, b: false, c: 'hello' }

// array of objects / pole objektov
parse([
    { id: '1', name: 'Adam', active: 'true'  },
    { id: '2', name: 'Eva',  active: 'false' },
])
// => [
//   { id: 1, name: 'Adam', active: true  },
//   { id: 2, name: 'Eva',  active: false },
// ]

// nested object / vnoreny objekt
parse({ user: { id: '5', score: '9.8' } })
// => { user: { id: 5, score: 9.8 } }
```

**`ignore` – skip specific fields / vynechat specificke polia:**  
*Useful for fields like phone numbers, zip codes, serial numbers that look like numbers but must stay as strings.*  
*Vhodne pre polia ako telefonne cislo, PSC, seriove cislo – vyzera ako cislo ale musi ostat string.*
```javascript
parse({ tel: '0905123456', age: '30' }, 'tel')
// => { tel: '0905123456', age: 30 }
//      ↑ kept as string    ↑ converted to number

parse({ zip: '01001', code: '007', count: '5' }, 'zip,code')
// => { zip: '01001', code: '007', count: 5 }
```

**`booleans` – force boolean conversion / vynucene boolean konvertovanie:**  
*Useful for DB fields stored as `0`/`1` that must be treated as `true`/`false`.*  
*Vhodne pre DB polia ulozene ako `0`/`1` ktore maju byt `true`/`false`.*
```javascript
parse({ active: '1', deleted: '0', name: 'John' }, '', 'active,deleted')
// => { active: true, deleted: false, name: 'John' }

parse({ is_admin: '1', score: '1' }, '', 'is_admin')
// => { is_admin: true, score: 1 }
```

**Combined / Kombinovane:**
```javascript
parse({ tel: '0905123456', active: '1', age: '25' }, 'tel', 'active')
// => { tel: '0905123456', active: true, age: 25 }
```

---

### `position` – Element position
```javascript
import position from '@pim.sk/utils/position'
```
Returns element position relative to page and viewport. Works through Shadow DOM.  
*Vrati poziciu elementu relativne k stranke a viewportu. Funguje cez Shadow DOM.*

```javascript
const p = new position('#my-element')
p.top   // distance from top of viewport / vzdialenost od vrchu viewportu
p.topp  // distance from top of page / vzdialenost od vrchu stranky
```

---

### `recursive-compare` – Deep object comparison
```javascript
import recursiveCompare from '@pim.sk/utils/recursive-compare'
```
Compares two objects recursively and returns changed fields.  
*Porovnanie 2 objektov a navrat zoznam zmeneneych poli.*

```javascript
const changes = recursiveCompare(
  { a: 1, b: 'hello' },
  { a: 1, b: 'world' }
)
// => [{ k: 'b', f: 'hello', t: 'world' }]
```

---

### `slots-el` – Vue slot renderer
```javascript
import slotsEl from '@pim.sk/utils/slots-el'
```
> **Requires:** `vue` peer dependency.  
> *Vyzaduje: `vue` peer dependency.*

Renders Vue slot content to HTML string or DOM nodes.  
*Vykresli obsah Vue slotu na HTML retazec alebo DOM uzly.*

```javascript
const slot = new slotsEl( this.$slots.default() )
slot.html  // => '<i class="fa fa-check"></i> Text'
slot.node  // => [Node, ...]
```

---

### `sort-assoc` – Array sorting
```javascript
import sortAssoc from '@pim.sk/utils/sort-assoc'
```
Sorts an array of objects by one or more fields with type awareness.  
*Triedenie pola objektov podla jedneho alebo viacerych poli s ohladom na datovy typ.*

```javascript
const sorted = new sortAssoc( items, 'name', 'asc', String )
const sorted = new sortAssoc( items, 'price', 'desc', Number )
const sorted = new sortAssoc( items, [
  { field: 'category', by: 'asc', type: String },
  { field: 'price',    by: 'desc', type: Number },
])
```

---

### `string-extend` – String prototype extensions
```javascript
import '@pim.sk/utils/string-extend'
```
Extends `String.prototype`. Use with caution in shared environments.  
*Rozsiruje `String.prototype`. Pouzivat opatrne v zdielanom prostredi.*

---

### `strings` – String utilities
```javascript
import { accentMap, emptyMap, compareMatch, random, basename, dirname, extname, strip_tags, shortString } from '@pim.sk/utils/strings'
```
| Function | Description / Popis |
|----------|---------------------|
| `accentMap(str)` | Removes diacritics (á→a, č→c, ...). *Odstrani diakritiku.* |
| `emptyMap(str, sep)` | Replaces invalid characters with separator. *Nahradi nepovolene znaky oddelovacom.* |
| `random(n, prefix, suffix)` | Random string of N digits. *Nahodny retazec N cislic.* |
| `strip_tags(str)` | Removes HTML tags. *Odstrani HTML tagy.* |
| `shortString(str, n)` | Truncates to N chars. *Skrati na N znakov.* |
| `basename/dirname/extname` | Path utilities. *Funkcie pre pracu s cestami.* |

---

### `wait` – Async waiting utilities
```javascript
import { sleep, to } from '@pim.sk/utils/wait'
```
| Function | Description / Popis |
|----------|---------------------|
| `sleep(ms)` | Async pause. *Asynchronna pauza.* `await sleep(500)` |
| `to(condition, max?, wait?)` | Wait until condition is true. *Caka kym podmienka je `true`.* |

```javascript
await sleep(500)                                   // pause 500ms
await to( () => typeof myVar !== 'undefined' )     // wait for variable
await to( '#my-element' )                          // wait for DOM element
await to( myFunction, { max: 50, wait: 20 } )      // custom timeout
```

---

## Dependencies / Zavislosti

Internal dependencies (within this package):  
*Interne zavislosti (v ramci tohto balicka):*

```
strings  ← sortAssoc, fulltext-filter, class-url
is       ← get, inViewport
wait     ← debounce
boolean  ← parse
parse    ← string-extend
vue      ← slots-el  (peer dependency)
```

No external runtime dependencies other than `vue` (optional peer).  
*Ziadne externe zavislosti okrem `vue` (volitelna peer zavislost).*

---

## License / Licencia

MIT © [matopim](https://github.com/matopim)
