# Angular Material Custom Theme

```shell
$  ng generate @angular/material:m3-theme
? What HEX color should be used to generate the M3 theme? It will represent your primary color palette. (ex. #ffffff) #944eff
? What HEX color should be used represent the secondary color palette? (Leave blank to use generated colors from Material) #ff7700
? What HEX color should be used represent the tertiary color palette? (Leave blank to use generated colors from Material) #cccccc
? What HEX color should be used represent the neutral color palette? (Leave blank to use generated colors from Material) 404040
? What is the directory you want to place the generated theme file in? (Enter the relative path such as 'src/app/styles/' or leave blank to generate at your project root) 
? Do you want to use system-level variables in the theme? System-level variables make dynamic theming easier through CSS custom properties, but increase the bundle size. Yes
? Choose light, dark, or both to generate the corresponding themes both
CREATE m3-theme.scss (2975 bytes)
```

Copy thr file...
```shell
mkdir -p src/assets/themes/dark
cp node_modules/igniteui-webcomponents/themes/dark/material.css src/assets/themes/dark/material.css
```

# Angular Material Setup

```shell
$ ng add @angular/material
Skipping installation: Package already installed
? Choose a prebuilt theme name, or "custom" for a custom theme: Custom
? Set up global Angular Material typography styles? Yes
? Include the Angular animations module? Include and enable animations
UPDATE package.json (1788 bytes)
✔ Packages installed successfully.
UPDATE src/app/app.config.ts (745 bytes)
UPDATE src/styles.scss (1546 bytes)
UPDATE src/index.html (524 bytes)
```

# Angular Material Custom Theme

- https://material-foundation.github.io/material-theme-builder/

Exported to: `notes/invest-theme.json`
Also see: http://material-foundation.github.io?primary=%230F0096&secondary=%235900D0&tertiary=%23EE6200&neutral=%23424245&neutralVariant=%236D6C76&custom%3ACustom+Color+1=%23008F47&custom%3ACustom+Color+2=%2393000E&bodyFont=Ubuntu&displayFont=Gilda+Display&colorMatch=true

The CSS files in `src/assets` were generated from this tool. The JSON file is used to import the colors back into that tool to make modifications.

# Angular Material Install

To install Angular Material, use the following command:

```shell
yarn ...
npm install @angular/material @angular/cdk @angular/animations --legacy-peer-deps
```

TODO: To install the Material Design icons, use the following command:

```shell
yarn ...
npm install material-design-icons --legacy-peer-deps
```

TODO: To install the HammerJS library, use the following command:

```shell
npm install hammerjs --legacy-peer-deps
```

NOTE: HammerJS is a library that enables touch gestures. It is required by Angular Material.
