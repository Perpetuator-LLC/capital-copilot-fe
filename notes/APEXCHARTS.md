[//]: # (Copyright © 2024 Perpetuator LLC)

# ApexCharts

## Install

Ideal install, but cannot because they don't have Angular 18 support yet:
```shell
ng add ng-apexcharts
```

However, a pull request is active that will fix this as of a 1 day ago:
https://github.com/apexcharts/ng-apexcharts/pull/332

For now, we are installing with:
```shell
yarn add apexcharts ng-apexcharts ?
npm install apexcharts ng-apexcharts --legacy-peer-deps
```

Once they merge, then we can upgrade and not use legacy:
```shell
yarn ...
npm update ng-apexcharts
```

In `angular.json`:
```json
"scripts": [
  "node_modules/apexcharts/dist/apexcharts.min.js"
]
```

and in imports:
```json
imports: [
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  NgApexchartsModule,
  ...
]
```

If we decide we want to downgrade Angular to 17:
```shell
yarn...
npm install @angular/common@17 @angular/core@17 --save
```
