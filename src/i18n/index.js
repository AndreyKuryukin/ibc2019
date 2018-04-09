import _ from 'lodash';

const languageMap = {
    REPORTS_STATUS_FAILED: 'Ошибка',
    REPORTS_STATUS_RUNNING: 'В процессе',
    REPORTS_STATUS_SUCCESS: 'Готово',

    REPORT_TYPE_PDF: 'PDF',
    REPORT_TYPE_XLS: 'XLS',
};

const ls = (key, defaultValue) => _.get(languageMap, key, defaultValue);

export default ls;
