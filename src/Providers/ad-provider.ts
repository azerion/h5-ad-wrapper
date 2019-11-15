import { AdType, H5AdWrapper } from '../h5-ad-wrapper'

export interface IProvider {
    adManager: H5AdWrapper
    adsEnabled: boolean

    setManager(manager: H5AdWrapper): void
    preloadAd(adType: AdType, ...args: any[]): void
    destroyAd(adType: AdType, ...args: any[]): void
    hideAd(adType: AdType, ...args: any[]): void
    showAd(adType: AdType, ...args: any[]): void
    adAvailable(adType: AdType, ...args: any[]): boolean
    loadBanner?(...args: any[]): any
    /*setLayout(...args: any[]): void;
     setPosition(...args: any[]): void;*/
}
