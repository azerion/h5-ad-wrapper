declare interface IAgeGateOptions {
    shouldBlock: boolean;
    requiredAge: number;
}

declare interface IGamedockSDK  {
    on(event: string, callback: Function): void;
    initialise(withAgeGate: boolean, ageGateOptions: IAgeGateOptions, withPrivacyPolicy: boolean, environment: string, externalIds: any[]): void;

    requestInterstitial(): void
    requestRewardVideo(): void

    playInterstitial(): void;
    playRewardVideo(): void;

    isAdAvailable(adType: string): boolean;
}

declare var gamedockSDK: IGamedockSDK | undefined;
