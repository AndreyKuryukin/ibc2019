import moment from 'moment';
import momentTz from 'moment-timezone';

export const setGlobalTimezone = momentTz.tz.setDefault;
export const convertUTC0ToLocal = date => moment.utc(date).utcOffset(moment().utcOffset());
export const convertDateToUTC0 = date => moment(date).utcOffset(0);
