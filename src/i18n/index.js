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


    ALARMS_ID_COLUMN: 'ID',
    ALARMS_POLICY_NAME_COLUMN: 'Имя политики',
    ALARMS_STATUS_COLUMN: 'Статус отправки во внешнюю систему',
    ALARMS_EXTERNAL_ID_COLUMN: 'ID во внешней системе',
    ALARMS_RAISE_TIME_COLUMN: 'Время возникновения',
    ALARMS_DURATION_COLUMN: 'Длительность',
    ALARMS_OBJECT_COLUMN: 'Объект',

    ALARMS_STATUS_SUCCESS: 'Успешно',
    ALARMS_STATUS_FAILED: 'Сбой',
    ALARMS_STATUS_BYZERROR: 'Бизнес ошибка',
    ALARMS_STATUS_SYSERROR: 'Системная ошибка',
    ALARMS_STATUS_WAITING: 'В процессе',

    ALARMS_GROUP_POLICIES_DURATION_DAYS_UNIT: 'д ',
    ALARMS_GROUP_POLICIES_DURATION_HOURS_UNIT: ':',
    ALARMS_GROUP_POLICIES_DURATION_MINUTES_UNIT: ':',
    ALARMS_GROUP_POLICIES_ALARMS_VIEWER_RAISE_TIME: 'Время возникновения',
    ALARMS_GROUP_POLICIES_ALARMS_VIEWER_POLICY_NAME: 'Название политики по каталогу',
    ALARMS_GROUP_POLICIES_ALARMS_VIEWER_DURATION: 'Длительность',
    ALARMS_GROUP_POLICIES_ALARMS_VIEWER_NOTIFICATION_TEXT: 'Текст сообщения',
    ALARMS_GROUP_POLICIES_ALARMS_VIEWER_NOTIFIED: 'Выполненные нотификации по открытию',
    ALARMS_GROUP_POLICIES_ALARMS_VIEWER_ATTRIBUTES: 'Все сохраняемые атрибуты аварии: (Значения макроподстановок)',
    ALARMS_GROUP_POLICIES_NOTIFICATION_STATUS_SUCCESS: 'Готово',
    ALARMS_GROUP_POLICIES_NOTIFICATION_STATUS_RUNNING: 'В процессе',
    ALARMS_GROUP_POLICIES_NOTIFICATION_STATUS_FAILED: 'Ошибка',
    ALARMS_GROUP_POLICIES_NOTIFICATION_STATUS_UNKNOWN: 'Неизвестно',

    ALARMS_GP_PAGE_TITLE: 'Групповые политики',
    ALARMS_CI_PAGE_TITLE: 'Клиентские инциденты',
    ALARMS_KQI_PAGE_TITLE: 'Сообщения по KQI',

    ALARMS_KQI_HISTORY_DETAIL_PERIOD_DAY: 'ежесуточный',
    ALARMS_KQI_HISTORY_DETAIL_PERIOD_WEEK: 'еженедельный',
    ALARMS_KQI_HISTORY_DETAIL_PERIOD_MONTH: 'ежемесячный',
    ALARMS_TAB_TITLE_GP: 'ГП',
    ALARMS_TAB_TITLE_CI: 'КИ',
    ALARMS_TAB_TITLE_KQI: 'KQI',


    PAGE_NOT_FOUND: 'Страница не найдена',

};

const ls = (key, defaultValue) => _.get(languageMap, key, defaultValue);

export default ls;
