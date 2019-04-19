/// <reference path='../../vendor/cocoon.d.ts'/>

import { IProvider } from './ad-provider'
import { AdType, AdEvents, H5AdWrapper } from '../h5-ad-wrapper'

export enum CocoonProvider {
    AdMob,
    MoPub,
    Chartboost,
    Heyzap
}

export class CocoonAds implements IProvider {
    public adManager!: H5AdWrapper

    public adsEnabled: boolean = false

    private cocoonProvider!: Cocoon.Ad.IAdProvider

    private banner!: Cocoon.Ad.IBanner | null

    private bannerShowable: boolean = false

    private interstitial!: Cocoon.Ad.IBanner | null

    private interstitialShowable: boolean = false

    private insentive!: Cocoon.Ad.IBanner | null

    private insentiveShowable: boolean = false

    constructor(provider: CocoonProvider, config?: any) {
        // TODO: Add cordova check
        if (Cocoon && Cocoon.Ad) {
            this.adsEnabled = true
        } else {
            return
        }

        switch (provider) {
            default:
            case CocoonProvider.AdMob:
                this.cocoonProvider = Cocoon.Ad.AdMob
                break
            case CocoonProvider.Chartboost:
                this.cocoonProvider = Cocoon.Ad.Chartboost
                break
            case CocoonProvider.Heyzap:
                this.cocoonProvider = Cocoon.Ad.Heyzap
                break
            case CocoonProvider.MoPub:
                this.cocoonProvider = Cocoon.Ad.MoPub
                break
        }

        this.cocoonProvider.configure(config)
    }

    public setManager(manager: H5AdWrapper): void {
        this.adManager = manager
    }

    public showAd(adType: AdType): void {
        if (!this.adsEnabled) {
            if (!(adType === AdType.banner)) {
                this.adManager.emit(AdEvents.CONTENT_RESUMED)
            }
            return
        }

        if (adType === AdType.banner) {
            if (!this.bannerShowable || null === this.banner) {
                // No banner ad available, skipping
                // this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
                return
            }
            this.adManager.emit(AdEvents.BANNER_SHOWN, this.banner.width, this.banner.height)

            this.adManager.bannerActive = true
            this.banner.show()
        }

        if (adType === AdType.interstitial) {
            if (!this.interstitialShowable || null === this.interstitial) {
                // No banner ad available, skipping
                this.adManager.emit(AdEvents.CONTENT_RESUMED, AdType.interstitial)
                return
            }

            this.interstitial.show()
        }

        if (adType === AdType.rewarded) {
            if (!this.insentiveShowable || null === this.insentive) {
                // No banner ad available, skipping
                this.adManager.emit(AdEvents.CONTENT_RESUMED, AdType.rewarded)

                return
            }

            this.insentive.show()
        }
    }

    public adAvailable(adType: AdType): boolean {
        return true
    }

    public preloadAd(adType: AdType, adId?: string, bannerPosition?: string): void {
        if (!this.adsEnabled) {
            return
        }

        // Some cleanup before preloading a new ad
        this.destroyAd(adType)

        if (adType === AdType.banner) {
            this.banner = this.cocoonProvider.createBanner(adId)
            if (bannerPosition) {
                this.banner.setLayout(bannerPosition)
            }
            this.banner.on('load', () => {
                this.bannerShowable = true
            })
            this.banner.on('fail', () => {
                this.bannerShowable = false
                this.banner = null
            })
            this.banner.on('click', () => {
                this.adManager.emit(AdEvents.AD_CLICKED, AdType.banner)
            })

            // Banner don't pause or resume content
            this.banner.on('show', () => {
                /*this.adManager.onBannerShown.dispatch(this.banner.width, this.banner.height);
                 this.adManager.bannerActive = true;*/
                // this.adManager.onContentPaused.dispatch(CocoonAdType.banner);
            })

            this.banner.on('dismiss', () => {
                /*this.adManager.bannerActive = false;
                 this.adManager.onBannerHidden.dispatch(this.banner.width, this.banner.height);*/
                // this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
                // this.bannerShowable = false;
                // this.banner = null;
            })
            this.banner.load()
        }

        if (adType === AdType.interstitial) {
            this.interstitial = this.cocoonProvider.createInterstitial(adId)
            this.interstitial.on('load', () => {
                this.interstitialShowable = true
            })
            this.interstitial.on('fail', () => {
                this.interstitialShowable = false
                this.interstitial = null
            })
            this.interstitial.on('click', () => {
                this.adManager.emit(AdEvents.AD_CLICKED, AdType.interstitial)
            })

            this.interstitial.on('show', () => {
                this.adManager.emit(AdEvents.CONTENT_PAUSED, AdType.interstitial)
            })

            this.interstitial.on('dismiss', () => {
                this.adManager.emit(AdEvents.CONTENT_RESUMED, AdType.interstitial)

                this.interstitialShowable = false
                this.interstitial = null
            })
            this.interstitial.load()
        }

        if (adType === AdType.rewarded) {
            this.insentive = this.cocoonProvider.createRewardedVideo(adId)
            this.insentive.on('load', () => {
                this.insentiveShowable = true
            })
            this.insentive.on('fail', () => {
                this.insentiveShowable = false
                this.insentive = null
            })
            this.insentive.on('click', () => {
                this.adManager.emit(AdEvents.AD_CLICKED, AdType.rewarded)
            })

            this.insentive.on('show', () => {
                this.adManager.emit(AdEvents.CONTENT_PAUSED, AdType.rewarded)
            })

            this.insentive.on('dismiss', () => {
                this.adManager.emit(AdEvents.CONTENT_RESUMED, AdType.rewarded)
                this.insentiveShowable = false
                this.insentive = null
            })

            this.insentive.on('reward', () => {
                this.adManager.emit(AdEvents.AD_REWARDED, AdType.rewarded)
                this.insentiveShowable = false
                this.insentive = null
            })
            this.insentive.load()
        }
    }

    public destroyAd(adType: AdType): void {
        if (!this.adsEnabled) {
            return
        }

        if (adType === AdType.banner && null !== this.banner) {
            // Releasing banners will fail on cocoon due to:
            // https://github.com/ludei/atomic-plugins-ads/pull/12
            try {
                this.cocoonProvider.releaseBanner(this.banner)
            } catch (e) {
                // silently ignore
            }
            this.banner = null
            this.bannerShowable = false
        }

        if (adType === AdType.interstitial && null !== this.interstitial) {
            this.cocoonProvider.releaseInterstitial(this.interstitial)
            this.interstitial = null
            this.interstitialShowable = false
        }
    }

    public hideAd(adType: AdType): void {
        if (!this.adsEnabled) {
            return
        }

        if (adType === AdType.interstitial && null !== this.interstitial) {
            this.interstitial.hide()

            // this.adManager.onContentResumed.dispatch(CocoonAdType.interstitial);
        }

        if (adType === AdType.banner && null !== this.banner) {
            if (this.adManager.bannerActive) {
                this.adManager.bannerActive = false
                this.adManager.emit(AdEvents.BANNER_HIDDEN, this.banner.width, this.banner.height)
            }
            this.banner.hide()

            // this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
        }

        if (adType === AdType.rewarded && null !== this.insentive) {
            this.insentive.hide()

            // this.adManager.onContentResumed.dispatch(CocoonAdType.insentive);
        }
    }
}
