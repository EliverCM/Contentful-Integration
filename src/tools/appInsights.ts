import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// tp-prototype
const connectionString = `InstrumentationKey=${process.env.VUE_APP_INSTRUMENTATION_KEY};EndpointSuffix=aicollection.ontp.io`;
const appInsights = new ApplicationInsights({
    config: {
        connectionString: connectionString,
        enableAutoRouteTracking: true,
        autoTrackPageVisitTime: true,
        /* ...Other Configuration Options... */
    } });
appInsights.loadAppInsights();

export function useAppInsights () {
    return appInsights;
}