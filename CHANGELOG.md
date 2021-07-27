# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [0.7.0] - 2021-07-27
### Changed
- Changed how gd provider checks for ad blocker

# [0.6.4] - 2020-06-03
### Fixed
- Returns a banner or null for all providers, depending on provider setup

# [0.6.3] - 2020-02-14
### Added
- Added missing 'export as' statement

# [0.6.2] - 2020-02-14
### Added
- Fixed AD_PROVIDER_LOADED event to fire after adManager is set.

# [0.6.1] - 2020-02-13
### Added
- Added AD_PROVIDER_LOADED event to every provider.

# [0.6.0] - 2020-01-30
### Added
- Gamedock cordova ad provider

## [0.5.1] - 2019-12-19
### Fixed
- Banner offset when scaling and aligning

## [0.5.0] - 2019-12-19
### Added
- Allow scaling gd banners using scale() function

## [0.4.5] - 2019-12-17
### Fixed
- Disallowed double calling of alignIn for GD banner
- Check for parent div on banner resize

## [0.4.4] - 2019-12-02
## Changed
- Removed rewarded ad preload requirement in gd

## [0.4.3] - 2019-11-29
### Fixed
- Made banner not fail when GD-SDK is not available

## [0.4.2] - 2019-11-22
### Added
- createBanner function for custom handeling bannner loading

## [0.4.1] - 2019-11-16
### Added
- GD banner alignment enum
- Possibility to align GD Banner in a given HTMLElement

## [0.4.0] - 2019-11-15
### Added
- GD banner ads support

## [0.3.4] - 2019-10-21
### Fixed
- Changed the way we call contentPaused to make sure it's actually only called when an ad gets displayed

## [0.3.3] - 2019-10-19
### Fixed
- Resume not being called after adv failure in ironsource
- Calling preload ad in gamedistribution with wrong adtype

## [0.3.2] - 2019-09-11
### Changed
- Stop using GD test url for SDK

## [0.3.1] - 2019-09-04
### Changed
- Added rewarded ad support in cordova-ironsource

## [0.3.0] - 2019-09-03
This version will bring a basic implementation of the ironsource ad mediation with cordova.
### Added
- Ironsource cordova ad provider
