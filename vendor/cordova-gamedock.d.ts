declare interface IAgeGateOptions {
    shouldBlock: boolean;
    requiredAge: number;
}

declare enum GamedockAdType {
    "banner",
    "interstitial",
    "rewardVideo"
}

declare interface IGamedockSDK  {
    on(event: string, callback: Function): void;
    initialise(withAgeGate: boolean, ageGateOptions: IAgeGateOptions, withPrivacyPolicy: boolean, environment: string, externalIds: any[]): void;

    requestInterstitial(): void
    requestRewardVideo(): void

    playInterstitial(): void;
    playRewardVideo(): void;

    isAdAvailable(adType: GamedockAdType): boolean;
}

declare var gamedockSDK: IGamedockSDK | undefined;
