/// <reference path='../../vendor/cordova-heyzap.d.ts'/>

import { IProvider } from './IProvider'
import { AdEvents, AdWrapper } from '../ad-wrapper'

export enum HeyzapAdTypes {
    Interstitial,
    Video,
    Rewarded,
    Banner
}

export class CordovaHeyzap implements IProvider {
    public adManager!: AdWrapper

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
    }

    public setManager(manager: AdWrapper): void {
        this.adManager = manager
    }

    public showAd(adType: HeyzapAdTypes, bannerAdPositions?: string): void {
        if (!this.adsEnabled) {
            this.adManager.unMuteAfterAd()
            this.adManager.emit(AdEvents.CONTENT_RESUMED)
        }

        switch (adType) {
            case HeyzapAdTypes.Interstitial:
                // Register event listeners
                HeyzapAds.InterstitialAd.addEventListener(
                    HeyzapAds.InterstitialAd.Events.HIDE,
                    () => {
                        this.adManager.unMuteAfterAd()
                        this.adManager.emit(
                            AdEvents.CONTENT_RESUMED,
                            HeyzapAds.InterstitialAd.Events.HIDE
                        )
                    }
                )
                HeyzapAds.InterstitialAd.addEventListener(
                    HeyzapAds.InterstitialAd.Events.SHOW_FAILED,
                    () => {
                        this.adManager.unMuteAfterAd()
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
                        this.adManager.unMuteAfterAd()
                        // Failed to show insentive ad, continue operations
                        this.adManager.emit(AdEvents.CONTENT_RESUMED)
                    }
                )
                break
            case HeyzapAdTypes.Video:
                HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.HIDE, () => {
                    this.adManager.unMuteAfterAd()
                    this.adManager.emit(AdEvents.CONTENT_RESUMED, HeyzapAds.VideoAd.Events.HIDE)
                })
                HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.SHOW_FAILED, () => {
                    this.adManager.unMuteAfterAd()
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
                        this.adManager.unMuteAfterAd()
                        // Failed to show insentive ad, continue operations
                        this.adManager.emit(AdEvents.CONTENT_RESUMED)
                    }
                )
                break
            case HeyzapAdTypes.Rewarded:
                HeyzapAds.IncentivizedAd.addEventListener(
                    HeyzapAds.IncentivizedAd.Events.HIDE,
                    () => {
                        this.adManager.unMuteAfterAd()
                        this.adManager.emit(
                            AdEvents.CONTENT_RESUMED,
                            HeyzapAds.IncentivizedAd.Events.HIDE
                        )
                    }
                )
                HeyzapAds.IncentivizedAd.addEventListener(
                    HeyzapAds.IncentivizedAd.Events.SHOW_FAILED,
                    () => {
                        this.adManager.unMuteAfterAd()
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
                        this.adManager.unMuteAfterAd()
                        // Failed to show insentive ad, continue operations
                        this.adManager.emit(AdEvents.CONTENT_RESUMED)
                    }
                )
                break
            case HeyzapAdTypes.Banner:
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

    public preloadAd(adType: HeyzapAdTypes): void {
        if (!this.adsEnabled) {
            return
        }

        if (adType === HeyzapAdTypes.Rewarded) {
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

    public destroyAd(adType: HeyzapAdTypes): void {
        if (!this.adsEnabled) {
            return
        }

        if (adType === HeyzapAdTypes.Banner) {
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

    public hideAd(adType: HeyzapAdTypes): void {
        if (!this.adsEnabled) {
            return
        }

        if (adType === HeyzapAdTypes.Banner) {
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
