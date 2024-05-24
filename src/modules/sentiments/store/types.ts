export interface SentimentsState {
    survey: boolean;
    scores: unknown;
    openEmotions: boolean;
    commentBox: boolean;
    phoneNumber: string;
    parameters: unknown;
    sentiments: Sentiments;
}

export interface Reasons {
    descReason: string;
    idSentimentsReason: number;
    selected?: boolean;
}

export interface Subreasons {
    descSubReason: string;
    idsentimentsSub: number;
    reason: number;
    reasonType: number;
    selected?: boolean;
}

export interface Scores {
    name: string;
    id: number;
    selected?: boolean;
}

export interface SentSurvey {
    emotion: number;
    survey: unknown[];
    subReasons: unknown[];
    emotionCtr: number;
    reason?: string;
    subReasonsTitle?: string;
    timezone: string;
}

export interface Sentiments {
    datetimecreated: string;
    descEmotion: string;
    emotion: number;
}