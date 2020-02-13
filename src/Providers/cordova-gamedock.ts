/// <reference path='../../vendor/cordova-gamedock.d.ts'/>

import { IProvider } from './ad-provider'
import { AdType, AdEvents, H5AdWrapper } from '../h5-ad-wrapper'

/**
 * The cordova gamedock ad provider requires the gamedock-sdk-cordova plugin to be setup within your cordova app.
 */
export class CordovaGamedock implements IProvider {
    public adManager!: H5AdWrapper
    public adsEnabled: boolean = false

    /**
     * Flag for if an rewarded ad is loaded or not.
     */
    private rewardedLoaded: boolean = false

    /**
     * Creates an instance of CordovaGamedock.
     * Initializes the gamedockSDK and adds listeners for events.
     */
    constructor() {
        if (typeof gamedockSDK === 'undefined') {
            this.adManager.emit(AdEvents.AD_PROVIDER_LOADED)
            return
        }

        // Variables the gamedockSDK requires to be initialized.
        let withAgeGate: boolean = false
        let ageGateOptions: IAgeGateOptions = { shouldBlock: true, requiredAge: 12 }
        let withPrivacyPolicy: boolean = true
        let environment: string = 'PRODUCTION'
        let externalIds: any[] = []

        // Calls AD_PROVIDER_LOADED on PrivacyPolicyStatus with flag accepted.
        gamedockSDK.on('PrivacyPolicyStatus', (data: any) => {
            this.adManager.emit(AdEvents.AD_PROVIDER_LOADED)
        })

        // Initialize the gamedockSDK.
        gamedockSDK.initialise(
            withAgeGate,
            ageGateOptions,
            withPrivacyPolicy,
            environment,
            externalIds
        )

        // Called whenever there is an ad available via the requestInterstitial and reqeuestRewardVideo methods.
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

        // Called whenever there is no ad available (for now just resumes gameplay).
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

        // Called whenever the shown ad is finished or closed for given reason.
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

    /**
     * Show ad of type AdType
     * @param {AdType} [adType=AdType.interstitial]
     */
    public showAd(adType: AdType = AdType.interstitial): void {
        if (typeof gamedockSDK === 'undefined') {
            return
        }

        switch (adType) {
            case AdType.interstitial:
                this.adManager.emit(AdEvents.CONTENT_PAUSED)
                // requestInterstitial is called because playInstestitial will not check ad timeout.
                // playInstestitial will be called on AdAvailable.
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

    /**
     * Called when the gamedockSDK event AdAvailable is called with typeof interstitial.
     */
    private interstitalAvailable(): void {
        if (typeof gamedockSDK === 'undefined') {
            return
        }

        gamedockSDK.playInterstitial()
    }

    /**
     * Called when the gamedockSDK event AdFinished is called with typeof rewardVideo.
     * Will handle dismiss and close reason.
     * @param {string} reason
     */
    private rewardVideoFinished(reason: string): void {
        switch (reason) {
            case 'dismiss':
                // If rewardVideo is dismissed (closed before finished), resume the gameplay.
                this.resumeGameplay()
                break
            case 'close':
                // If rewardVideo is closed (player saw video until end), emit AD_REWARDED event.
                this.adManager.emit(AdEvents.AD_REWARDED)
                break
        }
    }

    /**
     * Emits event CONTENT_RESUMED
     */
    private resumeGameplay(): void {
        this.adManager.emit(AdEvents.CONTENT_RESUMED)
    }

    /**
     * Preloads ad of type AdType
     * @param {AdType} [adType=AdType.interstitial]
     */
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

    /**
     * Returns if ad is available of type AdType
     * @param {AdType} adType
     * @returns {boolean}
     */
    public adAvailable(adType: AdType): boolean {
        switch (adType) {
            case AdType.rewarded:
                return this.rewardedLoaded
        }
        return false
    }

    /**
     * Sets the rewardedLoaded flag to given boolean "available".
     * @param {boolean} available
     */
    private rewardedChanged(available: boolean): void {
        this.rewardedLoaded = available
    }
}
