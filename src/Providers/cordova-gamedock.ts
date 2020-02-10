/// <reference path='../../vendor/cordova-gamedock.d.ts'/>

import { IProvider } from './ad-provider'
import { AdType, AdEvents, H5AdWrapper } from '../h5-ad-wrapper'

/**
 * The cordova gamedock ad provider requires the gamedock-sdk-cordova plugin to be setup within your cordova app.
 */
export class CordovaGamedock implements IProvider {
    public adManager!: H5AdWrapper
    public adsEnabled: boolean = false

    private requestedInterstitial: boolean = false

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
                    throw new Error('Not yet implemented.')
                case 'banner':
                    throw new Error('Not yet implemented.')
            }
        })

        gamedockSDK.on('AdNotAvailable', (data: any) => {
            switch (data.type) {
                case 'interstitial':
                    this.interstitalNotAvailable()
                    break
                case 'rewardVideo':
                    throw new Error('Not yet implemented.')
                case 'banner':
                    throw new Error('Not yet implemented.')
            }
        })

        const resume: () => void = () => this.resumeGameplay()
        gamedockSDK.on('AdFinished', resume)
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
                this.requestedInterstitial = true
                gamedockSDK.requestInterstitial()
                break
            case AdType.rewarded:
                if (!this.adAvailable(AdType.rewarded)) {
                    this.resumeGameplay()
                    break
                }
                this.adManager.emit(AdEvents.CONTENT_PAUSED)
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

        if (this.requestedInterstitial) {
            gamedockSDK.playInterstitial()
            this.requestedInterstitial = false
        }
    }

    private interstitalNotAvailable(): void {
        this.resumeGameplay()
    }

    private resumeGameplay(): void {
        this.adManager.emit(AdEvents.CONTENT_RESUMED)
    }

    public preloadAd(adType: AdType = AdType.interstitial): void {
        return
    }

    public destroyAd(): void {
        return
    }

    public hideAd(): void {
        return
    }

    public adAvailable(adType: AdType): boolean {
        if (typeof gamedockSDK === 'undefined') {
            return false
        }

        return gamedockSDK.isAdAvailable(
            adType === AdType.interstitial
                ? 'interstitial'
                : adType === AdType.rewarded
                ? 'rewardVideo'
                : adType === AdType.banner
                ? 'banner'
                : 'interstitial'
        )
    }
}
