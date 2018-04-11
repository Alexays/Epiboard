# Epiboard [![Build Status](https://travis-ci.org/Alexays/Epiboard.svg?branch=master)](https://travis-ci.org/Alexays/Epiboard)

<h4 align="center">
  A new tab page extension with material design.<br />
  Highly inspired and full rework of <a href="https://github.com/dotlouis/cardboard">Cardboard</a> by <a href="https://github.com/dotlouis">dotlouis</a>.
</h4>

<p align="center">
  <img src="https://raw.githubusercontent.com/alexays/epiboard/master/screenshot.jpg" alt="Epibaord"/>
</p>

## Requirement

- [Chromium](https://www.google.com/chrome/) >= 54.0<br />
- [Firefox](https://www.mozilla.org/firefox/) >= 54.0

## Build Setup

> If you want the stable version take it on [Chrome](https://chrome.google.com/webstore/detail/epiboard/eblmkpheecdcbflbhbadgfciakhlhdnm) or [Firefox](https://addons.mozilla.org/fr/firefox/addon/epiboard/)

``` bash
# install dependencies
$ npm install

# build for production with minification
# For Chromium browser
$ npm run build:chrome
# For Firefox
$ npm run build:firefox

# build for production and view the bundle analyzer report
$ npm run build:chrome --report

# in your browser extension page
# load unpacked extension from dist folder.

# or generate zip
$ npm run build:zip
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
