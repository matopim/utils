## 1.1.0 - 2026-04-26

### Added
- Added new `copy-code` utility module and package export.
- Added `filter-menu` utility module to package exports.
- Added dedicated tutorials portal for utils:
  - https://www.pim.sk/@pim-sk/utils/

### Changed
- Migrated source naming to `.mjs` across the package for clearer ES module semantics.
- Updated package exports and README module overview to match current published modules.
- Improved docs and examples for browser/importmap usage and module imports.

### Fixed
- Applied multiple small internal fixes across utility modules.
- Synchronized tutorial examples with current module behavior.

### Notes
- Recommended import style remains via package exports:
  - `@pim.sk/utils/<module>`
- Direct file-path imports into legacy `.js` source filenames are not recommended.
