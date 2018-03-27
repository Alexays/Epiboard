# Epiboard

> A new tab page extension with material design.<br />
> Highly inspired and full rework of [Cardboard](https://github.com/dotlouis/cardboard) by [dotlouis](https://github.com/dotlouis).

![Epiboard](https://raw.githubusercontent.com/alexays/epiboard/master/screenshot.jpg)

## Requirement

> Chromium based browser >= 54.0<br />
> Firefox >= 54.0

## Build Setup

> If you want the stable version take it on [Chrome store](https://chrome.google.com/webstore/detail/epiboard/eblmkpheecdcbflbhbadgfciakhlhdnm)

``` bash
# install dependencies
npm install

# build for production with minification for Chrome
npm run build

# or for Firfox
BUILD_TARGET=firefox npm run build

# build for production and view the bundle analyzer report
npm run build --report

# in your browser extension page
Load unpacked extension from dist folder.

# or generate zip
npm run build-zip
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
