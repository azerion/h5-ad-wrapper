/// <reference path='../../vendor/cordova-gamedock.d.ts'/>

import { IProvider } from './ad-provider'
import { AdType, AdEvents, H5AdWrapper } from '../h5-ad-wrapper'

/**
 * The cordova gamedock ad provider requires the gamedock-sdk-cordova plugin to be setup within your cordova app.
 */
export class CordovaGamedock implements IProvider {
    public adManager!: H5AdWrapper
    public adsEnabled: boolean = false

    private rewardedLoaded: boolean = false

    constructor() {
        if (typeof gamedockSDK === 'undefined') {
            return
        }

        let withAgeGate: boolean = false
        let ageGateOptions: IAgeGateOptions = { shouldBlock: true, requiredAge: 12 }
        let withPrivacyPolicy: boolean = true
        let environment: string = 'PRODUCTION'
        let externalIds: any[] = []

        gamedockSDK.on('PrivacyPolicyStatus', (data: any) => {
            if (data.accepted) {
                this.adManager.emit(AdEvents.AD_PROVIDER_LOADED)
            }
        })

        gamedockSDK.initialise(
            withAgeGate,
            ageGateOptions,
            withPrivacyPolicy,
            environment,
            externalIds
        )

        gamedockSDK.on('AdAvailable', (data: any) => {
            switch (data.type) {
                case 'interstitial':
                    this.interstitalAvailable()
                    break
                case 'rewardVideo':
                    this.rewardedChanged(true)
                    break
                case 'banner':
                    throw new Error('Not yet implemented.')
            }
        })

        gamedockSDK.on('AdNotAvailable', (data: any) => {
            switch (data.type) {
                case 'interstitial':
                    this.resumeGameplay()
                    break
                case 'rewardVideo':
                    this.resumeGameplay()
                    break
                case 'banner':
                    throw new Error('Not yet implemented.')
            }
        })

        gamedockSDK.on('AdFinished', (data: any) => {
            switch (data.type) {
                case 'interstitial':
                    this.resumeGameplay()
                    break
                case 'rewardVideo':
                    this.rewardVideoFinished(data.reason)
                    break
                case 'banner':
                    throw new Error('Not yet implemented.')
            }
        })
    }

    public setManager(manager: H5AdWrapper): void {
        this.adManager = manager
    }

    public showAd(adType: AdType = AdType.interstitial): void {
        if (typeof gamedockSDK === 'undefined') {
            return
        }

        switch (adType) {
            case AdType.interstitial:
                this.adManager.emit(AdEvents.CONTENT_PAUSED)
                gamedockSDK.requestInterstitial()
                break
            case AdType.rewarded:
                if (!this.adAvailable(AdType.rewarded)) {
                    this.resumeGameplay()
                    break
                }
                this.adManager.emit(AdEvents.CONTENT_PAUSED)
                this.rewardedChanged(false)
                gamedockSDK.playRewardVideo()
                break
            default:
                this.resumeGameplay()
                break
        }
    }

    private interstitalAvailable(): void {
        if (typeof gamedockSDK === 'undefined') {
            return
        }

        gamedockSDK.playInterstitial()
    }

    private rewardVideoFinished(reason: string): void {
        switch (reason) {
            case 'dismiss':
                this.resumeGameplay()
                break
            case 'close':
                this.adManager.emit(AdEvents.AD_REWARDED)
                break
        }
    }

    private resumeGameplay(): void {
        this.adManager.emit(AdEvents.CONTENT_RESUMED)
    }

    public preloadAd(adType: AdType = AdType.interstitial): void {
        if (typeof gamedockSDK === 'undefined') {
            return
        }

        switch (adType) {
            case AdType.rewarded:
                if (this.rewardedLoaded) {
                    return
                }
                gamedockSDK.requestRewardVideo()
                break
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
            case AdType.rewarded:
                return this.rewardedLoaded
        }
        return false
    }

    private rewardedChanged(available: boolean): void {
        this.rewardedLoaded = available
    }
}
