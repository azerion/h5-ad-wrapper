/// <reference path='../../vendor/game-distribution.d.ts'/>

import { IProvider } from './IProvider'
import { AdEvents, AdWrapper } from '../ad-wrapper'

export class GameDistributionAds implements IProvider {
    public adManager!: AdWrapper

    public adsEnabled: boolean = true

    constructor(gameId: string, userId: string) {
        this.areAdsEnabled()

        ;(window as any).GD_OPTIONS = {
            gameId: gameId,
            userId: userId,
            advertisementSettings: {
                autoplay: false
            },
            onEvent: (event: any): void => {
                switch (event.name) {
                    case 'SDK_GAME_START':
                        if (typeof gdApi !== 'undefined') {
                            gdApi.play()
                        }
                        this.adManager.unMuteAfterAd()
                        this.adManager.emit(AdEvents.CONTENT_RESUMED)
                        break
                    case 'SDK_GAME_PAUSE':
                        this.adManager.emit(AdEvents.CONTENT_PAUSED)
                        break
                    case 'SDK_READY':
                        // add something here
                        break
                    case 'SDK_ERROR':
                        break
                }
            }
        }

        // Include script. even when adblock is enabled, this script also allows us to track our users;
        ;(function(d: Document, s: string, id: string): void {
            let js: HTMLScriptElement
            let fjs: HTMLScriptElement = d.getElementsByTagName(s)[0] as HTMLScriptElement
            if (d.getElementById(id)) {
                return
            }
            js = d.createElement(s) as HTMLScriptElement
            js.id = id
            js.src = '//html5.api.gamedistribution.com/main.min.js'
            if (fjs.parentNode) {
                fjs.parentNode.insertBefore(js, fjs)
            }
        })(document, 'script', 'gamedistribution-jssdk')
    }

    public setManager(manager: AdWrapper): void {
        this.adManager = manager
    }

    public showAd(): void {
        if (!this.adsEnabled) {
            this.adManager.unMuteAfterAd()
            this.adManager.emit(AdEvents.CONTENT_RESUMED)
        } else {
            if (
                typeof gdApi === 'undefined' ||
                (gdApi && typeof gdApi.showBanner === 'undefined')
            ) {
                // So gdApi isn't available OR
                // gdApi is available, but showBanner is not there (weird but can happen)
                this.adsEnabled = false

                this.adManager.unMuteAfterAd()
                this.adManager.emit(AdEvents.CONTENT_RESUMED)

                return
            }
            gdApi.showBanner()
        }
    }

    // Does nothing, but needed for Provider interface
    public preloadAd(): void {
        return
    }

    // Does nothing, but needed for Provider interface
    public destroyAd(): void {
        return
    }

    // Does nothing, but needed for Provider interface
    public hideAd(): void {
        return
    }

    /**
     * Checks if the ads are enabled (e.g; adblock is enabled or not)
     * @returns {boolean}
     */
    private areAdsEnabled(): void {
        let test: HTMLElement = document.createElement('div')
        test.innerHTML = '&nbsp;'
        test.className = 'adsbox'
        test.style.position = 'absolute'
        test.style.fontSize = '10px'
        document.body.appendChild(test)

        // let adsEnabled: boolean;
        let isEnabled: () => boolean = () => {
            let enabled: boolean = true
            if (test.offsetHeight === 0) {
                enabled = false
            }
            if (test.parentNode) {
                test.parentNode.removeChild(test)
            }

            return enabled
        }

        window.setTimeout(() => {
            this.adsEnabled = isEnabled()
        }, 100)
    }
}
