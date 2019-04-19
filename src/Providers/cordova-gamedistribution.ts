/// <reference path='../../vendor/cordova-gamedistribution.d.ts'/>

import { IProvider } from './ad-provider'
import { AdType, AdEvents, H5AdWrapper } from '../h5-ad-wrapper'

export class CordovaGamedistribution implements IProvider {
    public adManager!: H5AdWrapper

    public adsEnabled: boolean = false

    constructor(gameId: string, userId: string, debug: boolean = false) {
        if (
            cordova.plugins === undefined ||
            (cordova.plugins !== undefined && cordova.plugins.gdApi === undefined)
        ) {
            console.log('gdApi not available!')
            return
        }

        if (debug) {
            cordova.plugins.gdApi.enableTestAds()
        }

        this.setAdListeners()
        ;(cordova.plugins.gdApi as CordovaPluginGdApi).init(
            [gameId, userId],
            (data: any) => {
                console.log('API init success!', data)
            },
            (error: any) => {
                console.log('API init error!', error)
            }
        )
    }

    private setAdListeners(): void {
        ;(cordova.plugins.gdApi as CordovaPluginGdApi).setAdListener(
            (data: any) => {
                console.log('banner reply, data.event', data.event, data)
                switch (data.event) {
                    case 'BANNER_STARTED':
                        this.adManager.emit(AdEvents.CONTENT_PAUSED)
                        break
                    case 'API_IS_READY':
                        // Send post init
                        this.adsEnabled = true
                        break
                    case 'API_ALREADY_INITIALIZED':
                        break
                    case 'BANNER_CLOSED':
                    case 'API_NOT_READY':
                    case 'BANNER_FAILED':
                        this.adManager.emit(AdEvents.CONTENT_RESUMED)
                        break
                }
            },
            (error: any) => {
                console.log('Set listener error:', error)
                this.adsEnabled = false
            }
        )
    }

    public setManager(manager: H5AdWrapper): void {
        this.adManager = manager
    }

    public showAd(adType: AdType): void {
        if (this.adsEnabled) {
            console.log('show banner called')
            ;(cordova.plugins.gdApi as CordovaPluginGdApi).showBanner(
                (data: any) => {
                    console.log('Show banner worked', data)
                },
                (data: any) => {
                    console.log('Could not show banner:', data)
                    this.adManager.emit(AdEvents.CONTENT_RESUMED)
                }
            )
        } else {
            console.log('Ads not enabled, resuming')
            this.adManager.emit(AdEvents.CONTENT_RESUMED)
        }
    }

    public adAvailable(adType: AdType): boolean {
        return true
    }

    // Does nothing, but needed for Provider interface
    public preloadAd(adType: AdType): void {
        return
    }

    // Does nothing, but needed for Provider interface
    public destroyAd(adType: AdType): void {
        return
    }

    // Does nothing, but needed for Provider interface
    public hideAd(adType: AdType): void {
        return
    }
}
