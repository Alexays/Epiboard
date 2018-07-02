# Epiboard [![Build Status](https://travis-ci.org/Alexays/Epiboard.svg?branch=master)](https://travis-ci.org/Alexays/Epiboard)

<h4 align="center">
  A new tab page extension with material design.<br />
  Highly inspired and full rework of <a href="https://github.com/dotlouis/cardboard">Cardboard</a> by <a href="https://github.com/dotlouis">dotlouis</a>.
</h4>

<p align="center">
  <img src="https://raw.githubusercontent.com/alexays/epiboard/master/screenshot.png" alt="Epibaord"/>
</p>

## Requirement

- [Chrome](https://www.google.com/chrome/) >= 54.0<br />
- [Firefox](https://www.mozilla.org/firefox/) >= 54.0

## Build Setup

> If you want the stable version take it from [Chrome Web Store](https://chrome.google.com/webstore/detail/epiboard/eblmkpheecdcbflbhbadgfciakhlhdnm) or for [Firefox](https://addons.mozilla.org/fr/firefox/addon/epiboard/)

``` bash
# install dependencies
$ npm install

# build for production with minification and generate zip
# For Chromium browser
$ npm run build:chrome
# For Firefox
$ npm run build:firefox

# build for production and view the bundle analyzer report
$ npm run build:chrome --report

# in your browser extension page
# load unpacked extension from dist folder.
```

## Notes on permissions

*Theses permissions are not optional only due to limitations of [webextension-polyfill](https://github.com/mozilla/webextension-polyfill)*

- **storage**: to save user's settings such as background image
- **sessions**: to retreive chrome sessions linked to your account and display them in a card
- **tabs**: to show your recently closed tabs (sessions card)
- **browsingData**: to allow the quick-settings card to remove your cache, cookies, history and local storage
- **downloads**: to display your recent downloads
- **downloads.open**: to open files you have downloaded from the download card
- **system.cpu**: to collect and display your computer's cpu usage
- **system.memory**: to collect and display your computer's memory usage
- **system.storage**: to collect and display your computer's storage usage
- **management**: to display your apps
- **topSites**: to display your most visited websites
- **geolocation**: to allow weather cards to detect your location
- **identity**: to request a connection to your external account
- **https://trends.google.com/trends/hottrends/visualize/internal/data**: to fetch google trends at this address
- **https://www.google.com/doodles/search**: to fetch google doodles at this address

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
