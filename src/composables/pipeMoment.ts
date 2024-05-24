import { PipeMoment } from '@/modules/user/store/types';
import { useStore } from 'vuex';
import moment from 'moment';
import { CONSTANTS } from '@/constants/constants';
import { computed } from 'vue';

const usePipeMoment = () => {
    const store = useStore();
    const userData = computed(() => store.getters['user/getIdentityProfile']);

    const transformDates = (stringDate: string, outputFormat = CONSTANTS.dateFormat,
        config: PipeMoment = { isRelative: false, hideRelativeSufix: false, isUtc: true }): string => {
        let date: Date;
        const value = new Date(stringDate);
        if (config.isUtc) {
            date = value;
        } else {
            date = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate(),
                value.getHours(), value.getMinutes(), value.getSeconds()));
        }
        const LocaleValue = moment(date.toLocaleString('ja', { timeZone: userData.value.ccms[0].location.timezone }), 'YYYY/M/D H:mm:ss');

        let result;
        if (config.isRelative) {
            result = LocaleValue.fromNow(config.hideRelativeSufix);
        } else {
            result = LocaleValue.format(outputFormat);
        }

        return result;
    };

    const formatTimezoneToUtc = (dateConvert: string): string => {
        // const dateBase = `${dateConvert}T23:59:00`;
        const dateTimezone = transformDates(dateConvert, '', { isUtc: false });
        const dateLocal = new Date(dateConvert);
        const diff = moment(dateTimezone).diff(dateLocal, 'hours');
        const hoursToAdd = diff * 2;

        if (hoursToAdd < 0) {
            return moment(dateTimezone).add(hoursToAdd * -1, 'hours')
                .format('YYYY-MM-DDTHH:mm:ss');
        } else {
            return moment(dateTimezone).subtract(hoursToAdd, 'hours')
                .format('YYYY-MM-DDTHH:mm:ss');
        }
    };

    return { transformDates, formatTimezoneToUtc };
};

export default usePipeMoment;