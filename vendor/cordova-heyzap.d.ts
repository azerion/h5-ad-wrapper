

declare module HeyzapAds {
    export function start(publisherId: string): Promise<any>;

	export module InterstitialAd {
        export var Events: {
            SHOW_FAILED: string;
            SHOW: string;
            CLICKED: string;
            HIDE: string;
        };
        export function show(): Promise<any>;
        export function addEventListener(target: string, call: () => void): void;
    }
    export module VideoAd {
        export var Events: {
            SHOW_FAILED: string;
            SHOW: string;
            CLICKED: string;
            HIDE: string;
        };
        export function show(): Promise<any>;
        export function fetch(): Promise<any>;
        export function addEventListener(target: string, call: () => void): void;
    }
    export module IncentivizedAd {
        export var Events: {
            SHOW_FAILED: string;
            SHOW: string;
            CLICKED: string;
            HIDE: string;
        };
        export function show(): Promise<any>;
        export function fetch(): Promise<any>;
        export function addEventListener(target: string, call: () => void): void;
    }
    export module BannerAd {
        export var POSITION_TOP: string;
        export var POSITION_BOTTOM: string;
        export var Events: {
            SHOW_FAILED: string;
            SHOW: string;
            CLICKED: string;
        };
        export function show(position: string): Promise<any>;
        export function hide(): Promise<any>;
        export function destroy(): Promise<any>;
        export function addEventListener(target: string, call: () => void): void;
    }
}
