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

    CRASHES_GROUP_POLICIES_DURATION_DAYS_UNIT: 'д ',
    CRASHES_GROUP_POLICIES_DURATION_HOURS_UNIT: ':',
    CRASHES_GROUP_POLICIES_CRASHES_VIEWER_RAISE_TIME: 'Время возникновения',
    CRASHES_GROUP_POLICIES_CRASHES_VIEWER_POLICY_NAME: 'Название политики по каталогу',
    CRASHES_GROUP_POLICIES_CRASHES_VIEWER_DURATION: 'Длительность',
    CRASHES_GROUP_POLICIES_CRASHES_VIEWER_NOTIFICATION_TEXT: 'Текст сообщения',
    CRASHES_GROUP_POLICIES_CRASHES_VIEWER_NOTIFIED: 'Выполненные нотификации по открытию',
    CRASHES_GROUP_POLICIES_CRASHES_VIEWER_ATTRIBUTES: 'Все сохраняемые атрибуты аварии: (Значения макроподстановок)',
};

const ls = (key, defaultValue) => _.get(languageMap, key, defaultValue);

export default ls;
