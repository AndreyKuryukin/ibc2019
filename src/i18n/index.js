import _ from 'lodash';

const languageMap = {
    REPORTS_STATUS_FAILED: 'Ошибка',
    REPORTS_STATUS_RUNNING: 'В процессе',
    REPORTS_STATUS_SUCCESS: 'Готово',
};

const ls = (key, defaultValue) => _.get(languageMap, key, defaultValue);

export default ls;
