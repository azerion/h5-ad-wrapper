/// <reference path='../../vendor/game-distribution.d.ts'/>

import { IProvider } from './ad-provider'
import { AdEvents, AdType, H5AdWrapper } from '../h5-ad-wrapper'

enum GameDistributionAdType {
    interstitial = 'interstitial',
    rewarded = 'rewarded',
    display = 'display'
}

export enum GameDistributionBannerSize {
    LargeRectangle, // 336x280
    MediumRectangle, // 300x250
    Billboard, // 970x250
    Leaderboard, // 728x90
    Skyscraper, // 120x600
    WideSkyscraper // 160x600
}

export enum GameDistributionAlignment {
    TopLeft,
    TopCenter,
    TopRight,
    CenterLeft,
    Center,
    CenterRight,
    BottomLeft,
    BottomCenter,
    BottomRight
}

export class GameDistributionBanner {
    public element: HTMLElement

    private resizeListener!: () => void

    private parent!: HTMLElement

    private alignment!: GameDistributionAlignment

    private width!: number

    private height!: number

    private offsetX: number = 0

    private offsetY: number = 0

    constructor() {
        this.element = document.createElement('div')
        this.element.style.position = 'absolute'
        this.element.style.top = `0px`
        this.element.style.left = `0px`
        this.element.id = `banner-${Date.now()}${(Math.random() * 10000000) | 0}`
        document.body.appendChild(this.element)
    }

    public loadBanner(): Promise<any> {
        if (typeof gdsdk === 'undefined') {
            return Promise.reject('GD Sdk not available, probably due to adblocker')
        }

        return gdsdk.showAd(GameDistributionAdType.display, {
            containerId: this.element.id
        })
    }

    public destroy(): void {
        document.body.removeChild(this.element)
        delete this.element
        delete this.parent
        delete this.alignment

        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener)
        }
    }

    public alignIn(element: HTMLElement, position: GameDistributionAlignment): void {
        this.parent = element
        this.alignment = position

        this.resizeListener = () => this.resize()

        window.addEventListener('resize', this.resizeListener)
        this.resize()
    }

    public setOffset(x: number = 0, y: number = 0): void {
        this.offsetX = x
        this.offsetY = y
        this.resize()
    }

    private resize(): void {
        const parentBoundingRect: ClientRect = this.parent.getBoundingClientRect()

        switch (this.alignment) {
            case GameDistributionAlignment.TopLeft:
                this.position(parentBoundingRect.left, parentBoundingRect.top)
                break
            case GameDistributionAlignment.TopCenter:
                this.position(
                    parentBoundingRect.left + parentBoundingRect.width / 2 - this.width / 2,
                    parentBoundingRect.top
                )
                break
            case GameDistributionAlignment.TopRight:
                this.position(
                    parentBoundingRect.left + parentBoundingRect.width - this.width,
                    parentBoundingRect.top
                )
                break
            case GameDistributionAlignment.CenterLeft:
                this.position(
                    parentBoundingRect.left,
                    parentBoundingRect.top + parentBoundingRect.height / 2 - this.height / 2
                )
                break
            case GameDistributionAlignment.Center:
                this.position(
                    parentBoundingRect.left + parentBoundingRect.width / 2 - this.width / 2,
                    parentBoundingRect.top + parentBoundingRect.height / 2 - this.height / 2
                )
                break
            case GameDistributionAlignment.CenterRight:
                this.position(
                    parentBoundingRect.left + parentBoundingRect.width - this.width,
                    parentBoundingRect.top + parentBoundingRect.height / 2 - this.height / 2
                )
                break
            case GameDistributionAlignment.BottomLeft:
                this.position(
                    parentBoundingRect.left,
                    parentBoundingRect.top + parentBoundingRect.height - this.height
                )
                break
            case GameDistributionAlignment.BottomCenter:
                this.position(
                    parentBoundingRect.left + parentBoundingRect.width / 2 - this.width / 2,
                    parentBoundingRect.top + parentBoundingRect.height - this.height
                )
                break
            case GameDistributionAlignment.BottomRight:
                this.position(
                    parentBoundingRect.left + parentBoundingRect.width - this.width,
                    parentBoundingRect.top + parentBoundingRect.height - this.height
                )
                break
        }
    }

    public setSize(size: GameDistributionBannerSize): void {
        let width: number
        let height: number
        switch (size) {
            default:
            case GameDistributionBannerSize.LargeRectangle:
                width = 336
                height = 280
                break
            case GameDistributionBannerSize.MediumRectangle:
                width = 300
                height = 250
                break
            case GameDistributionBannerSize.Billboard:
                width = 970
                height = 250
                break
            case GameDistributionBannerSize.Leaderboard:
                width = 728
                height = 90
                break
            case GameDistributionBannerSize.Skyscraper:
                width = 120
                height = 600
                break
            case GameDistributionBannerSize.WideSkyscraper:
                width = 160
                height = 600
                break
        }

        this.width = width
        this.height = height

        this.element.style.width = `${width}px`
        this.element.style.height = `${height}px`
    }

    public position(x: number, y: number): void {
        this.element.style.left = `${x + this.offsetX}px`
        this.element.style.top = `${y + this.offsetY}px`
    }
}

export class GameDistribution implements IProvider {
    public adManager!: H5AdWrapper

    public adsEnabled: boolean = false
    public hasRewarded: boolean = false
    public adShowing: boolean = false

    constructor(gameId: string) {
        this.areAdsEnabled()
        ;(window as any).GD_OPTIONS = {
            gameId: gameId,
            advertisementSettings: {
                autoplay: false
            },
            onEvent: (event: any) => {
                switch (event.name as string) {
                    case 'SDK_GAME_PAUSE':
                        // pause game logic / mute audio
                        this.adManager.emit(AdEvents.CONTENT_PAUSED)
                        break
                    case 'SDK_READY':
                        this.sdkLoaded()
                        break
                    default:
                        break
                }
            }
        } as IGameDistributionSettings

        //Include script. even when adblock is enabled, this script also allows us to track our users;
        ;(function(d: Document, s: string, id: string): void {
            let js: HTMLScriptElement
            let fjs: HTMLScriptElement = <HTMLScriptElement>d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) {
                return
            }
            js = <HTMLScriptElement>d.createElement(s)
            js.id = id
            js.src = '//html5.api.gamedistribution.com/main.min.js'
            if (fjs.parentNode) {
                fjs.parentNode.insertBefore(js, fjs)
            }
        })(document, 'script', 'gamedistribution-jssdk')
    }

    public setManager(manager: H5AdWrapper): void {
        this.adManager = manager
    }

    private sdkLoaded(): void {
        this.areAdsEnabled().then((enabled: boolean) => {
            if (enabled) {
                this.adsEnabled = true
                this.adManager.emit(AdEvents.AD_PROVIDER_LOADED)
            }
        })
    }

    public showAd(adType: AdType): void {
        if (!this.adsEnabled) {
            this.adManager.emit(AdEvents.CONTENT_RESUMED)
        } else {
            if (typeof gdsdk === 'undefined' || (gdsdk && typeof gdsdk.showAd === 'undefined')) {
                //So gdsdk isn't available OR
                //gdsdk is available, but showBanner is not there (weird but can happen)
                this.adsEnabled = false

                this.adManager.emit(AdEvents.CONTENT_RESUMED)

                return
            }

            gdsdk
                .showAd(
                    adType === AdType.rewarded
                        ? GameDistributionAdType.rewarded
                        : GameDistributionAdType.interstitial
                )
                .then(() => {
                    if (adType === AdType.rewarded) {
                        this.adManager.emit(AdEvents.AD_REWARDED)
                        this.hasRewarded = false
                    }

                    this.adManager.emit(AdEvents.CONTENT_RESUMED)
                })
                .catch(() => {
                    if (adType === AdType.rewarded && this.hasRewarded) {
                        this.hasRewarded = false
                    }

                    this.adManager.emit(AdEvents.CONTENT_RESUMED)
                })
        }
    }

    public createBanner(size: GameDistributionBannerSize): GameDistributionBanner | undefined {
        if (!this.adsEnabled) {
            return
        }

        const banner: GameDistributionBanner = new GameDistributionBanner()
        banner.setSize(size)
        return banner
    }

    public loadBanner(size: GameDistributionBannerSize): GameDistributionBanner | undefined {
        if (!this.adsEnabled) {
            return
        }

        const banner: GameDistributionBanner = new GameDistributionBanner()
        banner.setSize(size)
        banner.loadBanner()
        return banner
    }

    //Does nothing, but needed for Provider interface
    public preloadAd(adType: AdType): void {
        if (this.hasRewarded || !this.adsEnabled || adType !== AdType.rewarded) {
            return
        }
        console.log('preloading ad')
        gdsdk.preloadAd(GameDistributionAdType.rewarded).then(() => {
            this.hasRewarded = true
            this.adManager.emit(AdEvents.AD_LOADED, adType)
        })
    }

    public adAvailable(adType: AdType): boolean {
        if (adType === AdType.rewarded) {
            return this.hasRewarded
        }

        return true
    }

    //Does nothing, but needed for Provider interface
    public destroyAd(): void {
        return
    }

    //Does nothing, but needed for Provider interface
    public hideAd(): void {
        return
    }

    /**
     * Checks if the ads are enabled (e.g; adblock is enabled or not)
     * @returns {boolean}
     */
    private areAdsEnabled(): Promise<boolean> {
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

        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve(isEnabled())
            }, 100)
        })
    }
}
