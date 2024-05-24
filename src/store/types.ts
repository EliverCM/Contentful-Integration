import {UserState} from '@/modules/user/store/types';
import {ApplicationInsights} from '@microsoft/applicationinsights-web';

export interface RootState {
    initialized: boolean;
    allowed: boolean;
    appInsights?: ApplicationInsights;
    UserState?: UserState;
}
