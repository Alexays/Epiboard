# Epiboard [![Build Status](https://travis-ci.org/Alexays/Epiboard.svg?branch=master)](https://travis-ci.org/Alexays/Epiboard) [![Version](https://img.shields.io/github/package-json/v/Alexays/Epiboard.svg)](https://github.com/Alexays/Epiboard/releases) [![Paypal Donate](https://img.shields.io/badge/Donate-Paypal-2244dd.svg)](https://paypal.me/ARouillard) [![Licence](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A new tab page adding a touch of wow and an interface following the lines of the material design. 🆕 🎉.<br>
> You can simply and quickly access the weather, your RSS feeds, downloads, sessions, keep a look on Google Trends and much more.

> Highly inspired and full rework of [Cardboard](https://github.com/dotlouis/cardboard) by [dotlouis](https://github.com/dotlouis).<br>
> **Available on [Chrome Web Store](https://chrome.google.com/webstore/detail/epiboard/eblmkpheecdcbflbhbadgfciakhlhdnm) and [Firefox](https://addons.mozilla.org/fr/firefox/addon/epiboard/)**

![Epiboard](https://raw.githubusercontent.com/alexays/epiboard/master/screenshot-2.jpg)
![Epiboard](https://raw.githubusercontent.com/alexays/epiboard/master/screenshot.jpg)

## What is it?

Epiboard replaces the default new tab page. Where you can add cards, reorder them with drag and drop.<br>
Colors, Dark mode, Languages, Google Trends city can be customized from the settings page.<br>
Weather city, RSS, Downloads can be customized from the card settings.<br>
All settings are synchronized between browsers.

**Current cards:**
 - Weather
 - System (Chrome only)
 - Bookmarks
 - Sessions
 - Downloads
 - Quick settings
 - Quick Links
 - RSS
 - Top Sites
 - Apps (Chrome only)
 - LastFm
 - Translate
 - Epitech
 - Isefac

## Requirement

- [Node](https://nodejs.org/en/) >= 8
- [Chrome](https://www.google.com/chrome/) or [Firefox](https://www.mozilla.org/firefox/) >= 54.0

## Build Setup

> If you want the stable version take it from [Chrome Web Store](https://chrome.google.com/webstore/detail/epiboard/eblmkpheecdcbflbhbadgfciakhlhdnm) or for [Firefox](https://addons.mozilla.org/fr/firefox/addon/epiboard/)

``` bash
# install dependencies
$ npm install
# or using yarn
$ yarn install

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

## Opera

1. Install the Opera Extension that allows you to Add Chrome Extensions: [HERE](https://addons.opera.com/en/extensions/details/download-chrome-extension-9/).
2. Install Epiboard from [Chrome Web Store](https://chrome.google.com/webstore/detail/epiboard/eblmkpheecdcbflbhbadgfciakhlhdnm) or local install
3. Install the [Custom New Tab Page](https://addons.opera.com/en/extensions/details/custom-new-tab-page/) extension
4. In Custom New Tab page settings enter URL: `chrome-extension://eblmkpheecdcbflbhbadgfciakhlhdnm/index.html`

## Notes on permissions

*Some of theses permissions are not optional only due to manifest/API limitations: learn more: [chrome](https://developer.chrome.com/extensions/permissions), [firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/optional_permissions)*

- **storage**: to save user's settings such as background image
- **geolocation**: to allow weather cards to detect your location
- **management**: to display your apps **not optional due to error to access icons**
- [Optional on Chrome] **sessions**: to retreive chrome sessions linked to your account and display them in a card
- [Optional on Chrome] **browsingData**: to allow the quick-settings card to remove your cache, cookies, history and local storage
- [Optional on Chrome] **identity**: to request a connection to your external account
- [Optional] **tabs**: to show your recently closed tabs (sessions card)
- [Optional] **downloads**: to display your recent downloads
- [Optional] **downloads.open**: to open files you have downloaded from the download card
- [Optional] **system.cpu**: to collect and display your computer's cpu usage
- [Optional] **system.memory**: to collect and display your computer's memory usage
- [Optional] **system.storage**: to collect and display your computer's storage usage
- [Optional] **topSites**: to display your most visited websites
- **https://trends.google.com/trends/hottrends/visualize/internal/data**: to fetch google trends at this address
- **https://www.google.com/doodles/search**: to fetch google doodles at this address

## Wiki

Do you have any questions? Maybe the answer is in the [Wiki](https://github.com/Alexays/Epiboard/wiki)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
