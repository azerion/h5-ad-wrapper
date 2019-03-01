import { AdType, AdWrapper } from '../ad-wrapper'

export interface IProvider {
    adManager: AdWrapper
    adsEnabled: boolean

    setManager(manager: AdWrapper): void
    preloadAd(adType: AdType, ...args: any[]): void
    destroyAd(adType: AdType, ...args: any[]): void
    hideAd(adType: AdType, ...args: any[]): void
    showAd(adType: AdType, ...args: any[]): void
    adAvailable(adType: AdType, ...args: any[]): boolean
    /*setLayout(...args: any[]): void;
     setPosition(...args: any[]): void;*/
}
