import {IProvider} from './Providers/IProvider';
import {CocoonAdType} from './Providers/Cocoon';
import {EventEmitter} from 'eventemitter3';

export {CocoonAds} from './Providers/Cocoon';
export {CordovaGameDistribution} from './Providers/CordovaGameDistribution';
export {CordovaHeyzap} from './Providers/CordovaHeyzap';
export {GameDistributionAds} from './Providers/GameDistributionAds';
export {Ima3} from './Providers/Ima3';
export {IProvider} from './Providers/IProvider';

export enum AdEvents {
    CONTENT_PAUSED = 'onContentPaused',
    CONTENT_RESUMED = 'onContentResumed',
    AD_PROGRESSION = 'onAdProgression',
    AD_DISABLED = 'onAdsDisabled',
    AD_CLICKED = 'onAdClicked',
    AD_REWARDED = 'onAdRewardGranted',
    BANNER_SHOWN = 'onBannerShown',
    BANNER_HIDDEN = 'onBannerHidden'
}

export class AdWrapper extends EventEmitter {


    public bannerActive: boolean = false;

    private provider: IProvider = null;


    /**
     * Here we set an adprovider, any can be given as long as it implements the IProvider interface
     *
     * @param provider
     */
    public setAdProvider(provider: IProvider): void {
        this.provider = provider;
        this.provider.setManager(this);
    }

    /**
     * Here we request an ad, the arguments passed depend on the provider used!
     * @param args
     */
    public showAd(...args: any[]): void {
        if (null === this.provider) {
            throw new Error('Can not request an ad without an provider, please attach an ad provider!');
        }

        //Let's not do this for banner's
        if (args[0] !== CocoonAdType.banner) {
            //first we check if the sound was already muted before we requested an add
            //Let's mute audio for the game, we can resume the audi playback once the add has played
        }

        this.provider.showAd.apply(this.provider, args);
    }

    /**
     * Some providers might require you to preload an ad before showing it, that can be done here
     *
     * @param args
     */
    public preloadAd(...args: any[]): void {
        if (null === this.provider) {
            throw new Error('Can not preload an ad without an provider, please attach an ad provider!');
        }

        this.provider.preloadAd.apply(this.provider, args);
    }

    /**
     * Some providers require you to destroy an add after it was shown, that can be done here.
     *
     * @param args
     */
    public destroyAd(...args: any[]): void {
        if (null === this.provider) {
            throw new Error('Can not destroy an ad without an provider, please attach an ad provider!');
        }

        this.provider.destroyAd.apply(this.provider, args);
    }

    /**
     * Some providers allow you to hide an ad, you might think of an banner ad that is shown in show cases
     *
     * @param args
     */
    public hideAd(...args: any[]): void {
        if (null === this.provider) {
            throw new Error('Can not hide an ad without an provider, please attach an ad provider!');
        }

        this.unMuteAfterAd();

        this.provider.hideAd.apply(this.provider, args);
    }

    /**
     * Checks if ads are enabled or blocked
     *
     * @param args
     */
    public adsEnabled(): boolean {
        return this.provider.adsEnabled;
    }

    /**
     * Should be called after ad was(n't) shown, demutes the game so we can peacefully continue
     */
    public unMuteAfterAd(): void {
        //Here we unmute audio, but only if it wasn't muted before requesting an add
    }
}

export let adWrapper = new AdWrapper();
