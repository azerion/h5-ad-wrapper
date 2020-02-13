/// <reference path='../../vendor/cordova-heyzap.d.ts'/>

import { IProvider } from './ad-provider'
import { AdType, AdEvents, H5AdWrapper } from '../h5-ad-wrapper'

export class CordovaHeyzap implements IProvider {
    public adManager!: H5AdWrapper

    public adsEnabled: boolean = false

    constructor(publisherId: string) {
        // TODO: Add cordova check
        this.adsEnabled = true

        HeyzapAds.start(publisherId).then(
            () => {
                // Native call successful.
            },
            (e: any) => {
                // Failed to start heyzap, disabling ads
                this.adsEnabled = false
            }
        )

        this.adManager.emit(AdEvents.AD_PROVIDER_LOADED)
    }

    public setManager(manager: H5AdWrapper): void {
        this.adManager = manager
    }

    public showAd(adType: AdType, bannerAdPositions?: string): void {
        if (!this.adsEnabled) {
            this.adManager.emit(AdEvents.CONTENT_RESUMED)
        }

        switch (adType) {
            case AdType.interstitial:
                // Register event listeners
                HeyzapAds.InterstitialAd.addEventListener(
                    HeyzapAds.InterstitialAd.Events.HIDE,
                    () => {
                        this.adManager.emit(
                            AdEvents.CONTENT_RESUMED,
                            HeyzapAds.InterstitialAd.Events.HIDE
                        )
                    }
                )
                HeyzapAds.InterstitialAd.addEventListener(
                    HeyzapAds.InterstitialAd.Events.SHOW_FAILED,
                    () => {
                        this.adManager.emit(
                            AdEvents.CONTENT_RESUMED,
                            HeyzapAds.InterstitialAd.Events.SHOW_FAILED
                        )
                    }
                )
                HeyzapAds.InterstitialAd.addEventListener(
                    HeyzapAds.InterstitialAd.Events.CLICKED,
                    () => {
                        this.adManager.emit(
                            AdEvents.AD_CLICKED,
                            HeyzapAds.InterstitialAd.Events.CLICKED
                        )
                    }
                )

                HeyzapAds.InterstitialAd.show().then(
                    () => {
                        // Native call successful.
                        this.adManager.emit(AdEvents.CONTENT_PAUSED)
                    },
                    (e: any) => {
                        // Failed to show insentive ad, continue operations
                        this.adManager.emit(AdEvents.CONTENT_RESUMED)
                    }
                )
                break
            case AdType.interstitial:
                HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.HIDE, () => {
                    this.adManager.emit(AdEvents.CONTENT_RESUMED, HeyzapAds.VideoAd.Events.HIDE)
                })
                HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.SHOW_FAILED, () => {
                    this.adManager.emit(
                        AdEvents.CONTENT_RESUMED,
                        HeyzapAds.VideoAd.Events.SHOW_FAILED
                    )
                })
                HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.CLICKED, () => {
                    this.adManager.emit(AdEvents.AD_CLICKED, HeyzapAds.VideoAd.Events.CLICKED)
                })

                HeyzapAds.VideoAd.show().then(
                    () => {
                        // Native call successful.
                        this.adManager.emit(AdEvents.CONTENT_PAUSED)
                    },
                    (e: any) => {
                        // Failed to show insentive ad, continue operations
                        this.adManager.emit(AdEvents.CONTENT_RESUMED)
                    }
                )
                break
            case AdType.rewarded:
                HeyzapAds.IncentivizedAd.addEventListener(
                    HeyzapAds.IncentivizedAd.Events.HIDE,
                    () => {
                        this.adManager.emit(
                            AdEvents.CONTENT_RESUMED,
                            HeyzapAds.IncentivizedAd.Events.HIDE
                        )
                    }
                )
                HeyzapAds.IncentivizedAd.addEventListener(
                    HeyzapAds.IncentivizedAd.Events.SHOW_FAILED,
                    () => {
                        this.adManager.emit(
                            AdEvents.CONTENT_RESUMED,
                            HeyzapAds.IncentivizedAd.Events.SHOW_FAILED
                        )
                    }
                )
                HeyzapAds.IncentivizedAd.addEventListener(
                    HeyzapAds.IncentivizedAd.Events.CLICKED,
                    () => {
                        this.adManager.emit(
                            AdEvents.AD_CLICKED,
                            HeyzapAds.IncentivizedAd.Events.CLICKED
                        )
                    }
                )

                HeyzapAds.IncentivizedAd.show().then(
                    () => {
                        // Native call successful.
                        this.adManager.emit(AdEvents.CONTENT_PAUSED)
                    },
                    (e: any) => {
                        // Failed to show insentive ad, continue operations
                        this.adManager.emit(AdEvents.CONTENT_RESUMED)
                    }
                )
                break
            case AdType.banner:
                if (undefined === bannerAdPositions) {
                    return
                }

                HeyzapAds.BannerAd.show(bannerAdPositions).then(
                    () => {
                        // Native call successful.
                    },
                    (e: any) => {
                        // Handle Error
                    }
                )
                break
        }
    }

    public adAvailable(adType: AdType): boolean {
        return true
    }

    public preloadAd(adType: AdType): void {
        if (!this.adsEnabled) {
            return
        }

        if (adType === AdType.rewarded) {
            HeyzapAds.IncentivizedAd.fetch().then(
                () => {
                    // Native call successful.
                },
                (e: any) => {
                    // Handle Error
                }
            )
        }

        return
    }

    public destroyAd(adType: AdType): void {
        if (!this.adsEnabled) {
            return
        }

        if (adType === AdType.banner) {
            HeyzapAds.BannerAd.destroy().then(
                () => {
                    // Native call successful.
                },
                (e: any) => {
                    // Handle Error
                }
            )
        }

        return
    }

    public hideAd(adType: AdType): void {
        if (!this.adsEnabled) {
            return
        }

        if (adType === AdType.banner) {
            HeyzapAds.BannerAd.hide().then(
                () => {
                    // Native call successful.
                },
                (e: any) => {
                    // Handle Error
                }
            )
        }

        return
    }
}
