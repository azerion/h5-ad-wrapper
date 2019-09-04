declare var IronSourceAds: any | undefined

import { IProvider } from './ad-provider'
import { AdType, AdEvents, H5AdWrapper } from '../h5-ad-wrapper'

/**
 * The cordova Ironsource ad provider requires the cordova-plugin-ironsource-ads plugin to be setup within your cordova app.
 *
 * TODO:
 * - Look at better ironsource plugin
 */
export class CordovaIronSource implements IProvider {
    public adManager!: H5AdWrapper
    public adsEnabled: boolean = false

    private interstitialLoaded: boolean = false
    private rewardedLoaded: boolean = false

    constructor(appKey: string) {
        if (typeof IronSourceAds === 'undefined') {
            return
        }

        IronSourceAds.init({
            appKey: appKey
        })

        // Listen for interstitial
        window.addEventListener('interstitialClosed', () => {
            this.resumeGameplay()
        })
        window.addEventListener('interstitialLoaded', () => this.interstitialChanged(true))

        // Listen for rewarded
        window.addEventListener('rewardedVideoClosed', () => {
            this.resumeGameplay()
        })
        IronSourceAds.hasRewardedVideo({
            onSuccess: this.rewardedChanged.bind(this)
        })
        window.addEventListener('rewardedVideoAvailabilityChanged', (event: any) =>
            this.rewardedChanged(event.available)
        )
    }

    public setManager(manager: H5AdWrapper): void {
        this.adManager = manager
    }

    public showAd(adType: AdType = AdType.interstitial): void {
        switch (adType) {
            case AdType.interstitial:
                if (!this.interstitialLoaded) {
                    this.resumeGameplay()
                    break
                }
                this.interstitialChanged(false)
                this.adManager.emit(AdEvents.CONTENT_PAUSED)
                IronSourceAds.showInterstitial()
                break
            case AdType.rewarded:
                if (!this.rewardedLoaded) {
                    this.resumeGameplay()
                    break
                }
                this.adManager.emit(AdEvents.CONTENT_PAUSED)
                IronSourceAds.showRewardedVideo()
                break
            default:
                this.resumeGameplay()
                break
        }
    }

    private resumeGameplay(): void {
        this.adManager.emit(AdEvents.CONTENT_RESUMED)
    }

    public preloadAd(adType: AdType = AdType.interstitial): void {
        if (adType === AdType.interstitial) {
            IronSourceAds.loadInterstitial()
        }
    }

    public destroyAd(): void {
        return
    }

    public hideAd(): void {
        return
    }

    public adAvailable(adType: AdType): boolean {
        switch (adType) {
            case AdType.interstitial:
                return this.interstitialLoaded
            case AdType.rewarded:
                return this.rewardedLoaded
        }
        return false
    }

    private interstitialChanged(available: boolean): void {
        this.interstitialLoaded = available
    }

    private rewardedChanged(available: boolean): void {
        this.rewardedLoaded = available
    }
}
