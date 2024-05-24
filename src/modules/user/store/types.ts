export interface AccessTokens {
    msGraph?: string;
    mytpAzure?: string;
    mytp?: string;
}

export interface Menu {
    ident: number;
    description: string;
}


export interface UserState {
    obtainedAccessTokens: boolean;
    accessTokens: AccessTokens;
    tpId: string;
    me: unknown;
    userImg: unknown;
    identityProfile: unknown;
    identityProfilePlatform: unknown;
    parameters: unknown;
    permissions: unknown;
    sentiments: unknown;
    extraInfo: unknown;
    expandMenu: boolean;
    loadingData: boolean;
    menu: unknown;
    idProfileHost: string;
    canhost: boolean;
    sidebarstatus: boolean;
    hasAccessEWS: boolean;
    hasAccessRaf: boolean;
}

export interface UserExtraInfo {
    fullname: string;
    timezone: string;
}

// --- Por ahora
export interface PipeMoment {
    isRelative?: boolean;
    hideRelativeSufix?: boolean;
    isUtc?: boolean;
}