# @pim.sk/utils

> Basic JavaScript utility collection for browser-based applications.

[![npm](https://img.shields.io/npm/v/@pim.sk/utils)](https://www.npmjs.com/package/@pim.sk/utils)
[![license](https://img.shields.io/npm/l/@pim.sk/utils)](https://github.com/matopim/utils/blob/main/LICENSE)

---

## Tutorials

```html
[Documentation & interactive tutorials → www.pim.sk/api-support/@pim-sk-utils/](https://www.pim.sk/api-support/@pim-sk-utils/)
```

---

## Installation

```bash
npm install @pim.sk/utils
```

Every module is a standalone ES module — import only what you need.  
With a bundler, package exports resolve the file automatically (no extension needed):

```js
import { sleep, to } from '@pim.sk/utils/wait'
import sortAssoc     from '@pim.sk/utils/sortAssoc'
import { isNull }    from '@pim.sk/utils/is'
```

## Browser — importmap

No install needed. An importmap maps the `@pim.sk/utils/` prefix to a directory — either local or CDN. The full filename including extension is required in the browser.

```html
<script type="importmap">
{
  "imports": {
    "@pim.sk/utils/": "https://cdn.jsdelivr.net/npm/@pim.sk/utils@1.1.0/src/"
  }
}
</script>

<script type="module">
  import { sleep, to } from '@pim.sk/utils/wait.mjs'
  import sortAssoc     from '@pim.sk/utils/sortAssoc.mjs'
  import '@pim.sk/utils/array-extend.mjs'  // side-effect only — no exports
</script>
```

> Pin the version (`@1.1.0`) in production to avoid breaking changes.  
> Use `.min.mjs` / `.min.js` builds for production.

The same importmap pattern works for a local directory:

```json
"@pim.sk/utils/": "/library/js/"
```

Both resolve identically — only the source differs.


---

## Modules

### Async & Network

| Module | Description |
|---|---|
| [get](https://www.pim.sk/@pim.sk/utils/tutorial/get/) | Fetch wrapper with `async/await` support. Configurable method, output type (`json`, `text`, `object`) and data payload. |
| [wait](https://www.pim.sk/@pim.sk/utils/tutorial/wait/) | `sleep(ms)` — async pause. `to(fn\|selector)` — polls until a condition, CSS selector or variable becomes truthy. |

### Data & Type

| Module | Description |
|---|---|
| [parse](https://www.pim.sk/@pim.sk/utils/tutorial/parse/) | Recursively converts string values in objects/arrays to native JS types. Safe number detection preserves phone numbers and leading-zero codes. |
| [is](https://www.pim.sk/@pim.sk/utils/tutorial/is/) | Type-checking predicates: `isString`, `isNumber`, `isBoolean`, `isNull`, `isUndefined`, `isNil`, `isArray`, `isObject`, `isJson`, `isDate`, `isDOM`, `isFunction`, `isClass`. |
| [boolean](https://www.pim.sk/@pim.sk/utils/tutorial/boolean/) | Converts loose truthy strings (`"1"`, `"yes"`, `"true"`, `"on"`) to a native boolean. |
| [recursiveCompare](https://www.pim.sk/@pim.sk/utils/tutorial/recursiveCompare/) | Deep diff of two objects or arrays. Returns change records `{ k, f, t }` — path, from-value, to-value. |

### Collections

| Module | Description |
|---|---|
| [sortAssoc](https://www.pim.sk/@pim.sk/utils/tutorial/sortAssoc/) | Sorts an array of objects by one or more fields. Supports `String`, `Number`, `Date`, `Boolean`, `asc`/`desc` and multi-field sorting. |
| [array-extend](https://www.pim.sk/@pim.sk/utils/tutorial/array-extend/) ⚡ | **Side-effect only** — no exports. Extends `Array.prototype` with: `.sum`, `.avg`, `.min`, `.max`, `.unique`, `.pluck`, `.sortBy` and more. Import without destructuring: `import '@pim.sk/utils/array-extend.mjs'` |
| [fulltext-filter](https://www.pim.sk/@pim.sk/utils/tutorial/fulltext-filter/) | Client-side full-text search over an array of objects. Returns results ranked by match score. |

### Strings & Numbers

| Module | Description |
|---|---|
| [strings](https://www.pim.sk/@pim.sk/utils/tutorial/strings/) | `accentMap` (diacritics→ASCII), `emptyMap` (slugify), `compareMatch` (% word overlap), `telColapse`/`telExpand` (phone formatting), `basename`, `dirname`, `extname`, `cleanPath`, `strip_tags`, `shortString`, `random`. |
| [numbers](https://www.pim.sk/@pim.sk/utils/tutorial/numbers/) | `cislo` (locale-aware string→number), `formatBytes`, `cenaNa5Centov` (price rounding), `ratio` (percentage of total). |

### DOM & Browser

| Module | Description |
|---|---|
| [dom](https://www.pim.sk/@pim.sk/utils/tutorial/dom/) | `toDOM(html)` — converts an HTML string to a live DOM Node. |
| [copy-code](https://www.pim.sk/@pim.sk/utils/tutorial/copy-code/) | Clipboard helper for code snippets. Auto-init via `data-copy-code` attribute (hover button), or manual init with selector/element input. |
| [filter-menu](https://www.pim.sk/@pim.sk/utils/tutorial/filter-menu/) | Live search/filter for navigation `<li>` lists. Auto-init via `data-filter-menu` attribute; or manual call with `{ input, selector?, items?, debounceWait? }`. |
| [position](https://www.pim.sk/@pim.sk/utils/tutorial/position/) | Element layout: viewport coords (`top`, `left`), page coords (`topp`, `leftp`), dimensions and computed padding. |
| [inViewport](https://www.pim.sk/@pim.sk/utils/tutorial/inViewport/) | Detects when elements enter/leave the viewport. Configurable threshold, `once` mode, callbacks, `destroy()`. |
| [inViewportAnim](https://www.pim.sk/@pim.sk/utils/tutorial/inViewportAnim/) | Triggers Animate.css animations on viewport entry. Per-element `data-ivpa-*` overrides, lifecycle callbacks, `destroy()`. |

### Storage

| Module | Description |
|---|---|
| [jsonStorage](https://www.pim.sk/@pim.sk/utils/tutorial/jsonStorage/) | `localStorage` wrapper with automatic JSON serialisation. `setItem` supports merge mode. |
| [jsonStorageSes](https://www.pim.sk/@pim.sk/utils/tutorial/jsonStorageSes/) | Same API as `jsonStorage`, backed by `sessionStorage` — cleared on tab close. |

### Utilities

| Module | Description |
|---|---|
| [line](https://www.pim.sk/@pim.sk/utils/tutorial/line/) | Global `__LINE__` getter — returns current source file name and line number at the call site. |
| [debounce](https://www.pim.sk/@pim.sk/utils/tutorial/debounce/) | Delays function execution until a quiet period has passed. |
| [class-url](https://www.pim.sk/@pim.sk/utils/tutorial/class-url/) | Parses and manipulates the current page URL — path segments, query params, hash. |
| [date-time](https://www.pim.sk/@pim.sk/utils/tutorial/date-time/) | Date formatting and manipulation helpers with Slovak locale defaults. |

### Vue 3

| Module | Description |
|---|---|
| [slots-el](https://www.pim.sk/@pim.sk/utils/tutorial/slots-el/) | Converts Vue 3 slot VNodes to an HTML string (`.html`) or DOM Node array (`.node`). Requires Vue 3 peer dependency. |

---

## Peer dependencies

Vue 3 is an **optional** peer dependency, required only by `slots-el`:

```bash
npm install vue@^3
```

---

## License

[MIT](https://github.com/matopim/utils/blob/main/LICENSE) © pim.sk
