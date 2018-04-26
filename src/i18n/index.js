import _ from 'lodash';

const languageMap = {
    REPORTS_STATUS_FAILED: 'Ошибка',
    REPORTS_STATUS_RUNNING: 'В процессе',
    REPORTS_STATUS_SUCCESS: 'Готово',

    KQI_STATUS_FAILED: 'Ошибка',
    KQI_STATUS_RUNNING: 'В процессе',
    KQI_STATUS_SUCCESS: 'Готово',

    REPORT_TYPE_PDF: 'PDF',
    REPORT_TYPE_XLS: 'XLS',

    CRASHES_KQI_HISTORY_DETAIL_PERIOD_DAY: 'ежесуточный',
    CRASHES_KQI_HISTORY_DETAIL_PERIOD_WEEK: 'еженедельный',
    CRASHES_KQI_HISTORY_DETAIL_PERIOD_MONTH: 'ежемесячный',
};

const ls = (key, defaultValue) => _.get(languageMap, key, defaultValue);

export default ls;
