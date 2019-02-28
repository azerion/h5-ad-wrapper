import { AdWrapper } from '../ad-wrapper'

export interface IProvider {
    adManager: AdWrapper
    adsEnabled: boolean

    setManager(manager: AdWrapper): void
    preloadAd(...args: any[]): void
    destroyAd(...args: any[]): void
    hideAd(...args: any[]): void
    showAd(...args: any[]): void
    /*setLayout(...args: any[]): void;
     setPosition(...args: any[]): void;*/
}
