import EventEmitter from 'eventemitter3'

export { CocoonAds } from './Providers/cocoon'
export { CordovaGamedistribution } from './Providers/cordova-gamedistribution'
export { CordovaHeyzap } from './Providers/cordova-heyzap'
export { GameDistribution } from './Providers/gamedistribution'
export { Ima3 } from './Providers/ima3'
export { IProvider } from './Providers/ad-provider'

export enum AdEvents {
    CONTENT_PAUSED = 'onContentPaused',
    CONTENT_RESUMED = 'onContentResumed',
    AD_PROGRESSION = 'onAdProgression',
    AD_DISABLED = 'onAdsDisabled',
    AD_CLICKED = 'onAdClicked',
    AD_REWARDED = 'onAdRewardGranted',
    BANNER_SHOWN = 'onBannerShown',
    BANNER_HIDDEN = 'onBannerHidden',
    AD_LOADED = 'onAdLoaded',
    AD_PROVIDER_LOADED = 'onAdProviderLoaded'
}

export enum AdType {
    interstitial,
    rewarded,
    banner
}

export class AdWrapper extends EventEmitter {
    public bannerActive: boolean = false

    private provider: any = null

    /**
     * Here we set an adprovider, any can be given as long as it implements the IProvider interface
     *
     * @param provider
     */
    public setAdProvider(provider: any): void {
        this.provider = provider
        this.provider.setManager(this)
    }

    /**
     * Here we request an ad, the arguments passed depend on the provider used!
     * @param args
     */
    public showAd(adType: AdType, ...args: any[]): void {
        if (null === this.provider) {
            throw new Error(
                'Can not request an ad without an provider, please attach an ad provider!'
            )
        }

        args.unshift(adType)
        this.provider.showAd.apply(this.provider, args)
    }

    /**
     * Some providers might require you to preload an ad before showing it, that can be done here
     *
     * @param args
     */
    public preloadAd(adType: AdType, ...args: any[]): void {
        if (null === this.provider) {
            throw new Error(
                'Can not preload an ad without an provider, please attach an ad provider!'
            )
        }

        args.unshift(adType)
        this.provider.preloadAd.apply(this.provider, args)
    }

    /**
     * Some providers require you to destroy an add after it was shown, that can be done here.
     *
     * @param args
     */
    public destroyAd(adType: AdType, ...args: any[]): void {
        if (null === this.provider) {
            throw new Error(
                'Can not destroy an ad without an provider, please attach an ad provider!'
            )
        }

        args.unshift(adType)
        this.provider.destroyAd.apply(this.provider, args)
    }

    /**
     * Some providers allow you to hide an ad, you might think of an banner ad that is shown in show cases
     *
     * @param args
     */
    public hideAd(adType: AdType, ...args: any[]): void {
        if (null === this.provider) {
            throw new Error('Can not hide an ad without an provider, please attach an ad provider!')
        }
        args.unshift(adType)
        this.provider.hideAd.apply(this.provider, args)
    }

    /**
     * Checks if ads are enabled or blocked
     *
     * @param args
     */
    public adsEnabled(): boolean {
        if (null === this.provider) {
            throw new Error('Can not hide an ad without an provider, please attach an ad provider!')
        }
        return this.provider.adsEnabled
    }

    /**
     * Checks if ads are enabled or blocked
     *
     * @param args
     */
    public adAvailable(adType: AdType, ...args: any[]): boolean {
        if (null === this.provider) {
            throw new Error('Can not hide an ad without an provider, please attach an ad provider!')
        }
        args.unshift(adType)
        return this.provider.adAvailable.apply(this.provider, args)
    }
}

export const ads: AdWrapper = new AdWrapper()
