# Epiboard [![Build Status](https://travis-ci.org/Alexays/Epiboard.svg?branch=master)](https://travis-ci.org/Alexays/Epiboard) [![Version](https://img.shields.io/github/package-json/v/Alexays/Epiboard.svg)](https://github.com/Alexays/Epiboard/releases) [![Paypal Donate](https://img.shields.io/badge/Donate-Paypal-2244dd.svg)](https://paypal.me/ARouillard) [![Licence](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A new tab page adding a touch of wow and an interface following the lines of the material design. 🆕 🎉.<br>
> Highly inspired and full rework of [Cardboard](https://github.com/dotlouis/cardboard) by [dotlouis](https://github.com/dotlouis).

![Epiboard](https://raw.githubusercontent.com/alexays/epiboard/master/screenshot.png)

## Requirement

- [Node](https://nodejs.org/en/) >= 8
- [Chrome](https://www.google.com/chrome/) or [Firefox](https://www.mozilla.org/firefox/) >= 54.0

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

# build for production with the bundle analyzer report
$ npm run build:chrome -- --report

# in your browser extension page
# load unpacked extension from dist folder.
```

## Notes on permissions

*Some of theses permissions are not optional only due to manifest/API limitations: [learn more](https://developer.chrome.com/extensions/permissions)*

- **storage**: to save user's settings such as background image
- **geolocation**: to allow weather cards to detect your location
- [Optional] **sessions**: to retreive chrome sessions linked to your account and display them in a card
- [Optional] **tabs**: to show your recently closed tabs (sessions card)
- [Optional] **browsingData**: to allow the quick-settings card to remove your cache, cookies, history and local storage
- [Optional] **downloads**: to display your recent downloads
- [Optional] **downloads.open**: to open files you have downloaded from the download card
- [Optional] **system.cpu**: to collect and display your computer's cpu usage
- [Optional] **system.memory**: to collect and display your computer's memory usage
- [Optional] **system.storage**: to collect and display your computer's storage usage
- [Optional] **management**: to display your apps
- [Optional] **topSites**: to display your most visited websites
- [Optional] **identity**: to request a connection to your external account
- **https://trends.google.com/trends/hottrends/visualize/internal/data**: to fetch google trends at this address
- **https://www.google.com/doodles/search**: to fetch google doodles at this address

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
