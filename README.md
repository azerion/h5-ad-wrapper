[![npm version](https://badge.fury.io/js/%40azerion%2Fh5-ad-wrapper.svg)](https://badge.fury.io/js/%40azerion%2Fh5-ad-wrapper) 
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/@azerion/h5-ad-wrapper/badge)](https://www.jsdelivr.com/package/npm/@azerion/h5-ad-wrapper)

# h5-ad-wrapper
This ad wrapper that allows you to leverage different ad providers whilst providing the same simple API.
Also allows you to easily integrate mobile ads (via [Cordova](https://cordova.apache.org)).
Key features:
 - Ads for your mobile web experience
 - Pluggable ad providers
   - Gamedistribution.com
   - IMA3 SDK
   - Cordova (support for AdMob/HeyZap/MoPub/Chartboost)
   - HeyZap for Cordova
   - Ironsource for Cordova
 - Integrates nicely into any HTML5 gaming framework
 - Fullscreen ad support
 - Rewarded ad support

Getting Started
---------------
First you want to get a fresh copy of the plugin. You can get it from [this repo](https://github.com/azerion/h5-ad-wrapper/releases) or from [npm](https://npmjs.com/package/@azerion/h5-ad-wrapper).
```
npm install @azerion/h5-ad-wrapper
```
Next up you'd want to add it to your list of js sources you load into your game:
```html
<script src="path/to/h5-ad-wrapper.umd.js"></script>
```
You could also opt for using the (free) jsdelivr cdn: 
```html
<script src="https://cdn.jsdelivr.net/npm/@azerion/h5-ad-wrapper@latest/build/h5-ad-wrapper.umd.js"></script>
```
And you are done!

Usage
-----
Check the API docs right [here](https://azerion.github.io/h5-ad-wrapper/)

First thing you need to do after loading the plugin is attaching a provider to the adManager. h5-ad-wrapper comes pre-compiled with multiple providers for you to choose from.

For web you can use:
 - [Gamedistribution.com](https://gamedistribution.com)
 - [IMA SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5)

If you're building an app you should use one of these:
 - [Cocoon.io ads](https://cocoon.io)
 - Cordova HeyZap
 - Cordova Ironsource

### Gamedistribution.com
If you already have an account on Gamedistribution.com you can skip this introduction if not, head on over to [gamedistribution.com](https://gamedistribution.com) and sign up for a free account.
Once you're signed up you can check out [this guide](https://gamedistribution.com/sdk) for settings up a game. This is important because this will supply you with a gameId, which you need to supply to the plugin.
So when you have your gameId you can start by registering the provider to the plugin:
```javascript
// Let's create a new provider, first argument should be the game, second should be the ad tag URL
var provider = new h5ads.GameDistribution(
   '2d77cfd4b1e5487d998465c29de195b3'           // Your gameId
);
h5ads.adWrapper.setAdProvider(provider);
```
After this it's as easy as calling:
```javascript
h5ads.adWrapper.showAd();
```

### IMA SDK
A provider can use any number of arguments configured in order to make it work, it all depends on the implementation that was made by the developer. For our IMA Provider you can create one like this:
```javascript
// Let's create a new provider, first argument should be the game, second should be the ad tag URL
var provider = new h5ads.Ima3(
   'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&correlator'
);
h5ads.adWrapper.setAdProvider(provider);
```

### Cordova Ironsource
The ironsource interstitial ads need to be preloaded before showing. The preload process might take up to two second, so its best to always have an ad preloaded after boot.
```javascript
h5ads.adWrapper.preloadAd(h5ads.AdType.interstitial);
```
Please note that only intersticial and rewarded ads are currently implemented for ironsource.

Now all you need to do is request an ad, and add an event listener that is called when the ad is completed/skipped/finished/done playing.
```javascript
h5ads.adWrapper.once('onContentResumed', function() {
    // This gets called when the ad is complete
    game.state.start('NextState');
});
// Here we request the ad
h5ads.adWrapper.showAd();
```
You can also send custom parameters by adding them as an object to the showAd function.

F.A.Q.
------
### I Don't see any ads!
This can happen, sometimes the provider does something wrong, but most of the time (and when you are testing locally) your ads get blocked from showing.
That's right, ads don't show when testing locally. The easiest way to avoid this is by testing your game on a server (online).
Another work around would be to adjust your [/etc/hosts](https://howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file).

### Why don't you support this ad provider!
The setup allows for a multitude of ad providers to work, but sadly we don't have the time and resources to add all of them.
That beeing said, this plugin is on GitHub, and you're welcome to shoot in a [PR](https://github.com/azerion/h5-ad-wrapper/compare) to add a new provider =)

Credits
=======
Created with https://github.com/alexjoverm/typescript-library-starter.git 

Disclaimer
----------
We at Azerion just love playing and creating awesome games. We aren't affiliated with Phaser.io. We just needed some awesome ads in our awesome HTML5 games. Feel free to use it for enhancing your own awesome games!
Phaser Ads is distributed under the MIT license. All 3rd party libraries and components are distributed under their
respective license terms.

