import _ from 'lodash';
import ls from '../../i18n';

const validators = {
    required: (value, testValue) => {
        const pureValue = _.isString(value) ? value.trim() : value;

        return testValue ? (value === '0' || value === 0 || !!pureValue === testValue) : !testValue;
    },
    min: (value, testValue) => value >= testValue,
    max: (value, testValue) => value <= testValue,
    notEmpty: (value, testValue) => !_.isEmpty(value) === testValue,
    match: (value, pattern) => _.isRegExp(pattern) && (new RegExp(pattern)).test(value),
};

const defaultMessages = {
    required: ls('REQUIRED_ERROR_MESSAGE', 'Это поле обязательно для заполнения'),
    min: ls('MIN_ERROR_MESSAGE', 'Значение меньше минимального'),
    max: ls('MAX_ERROR_MESSAGE', 'Значение больше максимального'),
    notEmpty: ls('NOT_EMPTY_ERROR_MESSAGE', 'Значение не должно быть пустым'),
    match: ls('MATCH_ERROR_MESSAGE', 'Проверьте правильность введённого значения'),
};

const validateValue = (value, config, customValidators) =>
    _.reduce(config, (result, testValue, validatorName) => {
        const validator = _.get(validators, validatorName, customValidators[validatorName]);
        const res = { ...result };
        if (_.isFunction(validator)) {
            const isValid = validator(value, testValue);
            if (!isValid) {
                res[validatorName] = isValid;
            }
        }
        return res;
    }, {});

const mapErrors = (valueResult, messages) =>
    _.reduce(valueResult, (result, isValid, validatorName) => {
        if (!isValid) {
            const title = _.get(messages, validatorName, '');
            const severity = 'CRITICAL';
            const type = 'VALIDATION';
            return { type, title, severity };
        }
        return result;
    }, {});

export const validateForm = (form, config, messages = {}, customValidators = {}, prefix) =>
    _.reduce(config, (result, valueConfig, fieldName) => {
        const value = _.get(form, fieldName);
        const res = { ...result };
        if (_.isFunction(valueConfig)) {
            const cfg = valueConfig();
            const subForm = _.get(form, fieldName);
            const formPrefix = [prefix, fieldName].join('.');
            const subFormResult = validateForm(subForm, cfg, messages, customValidators, formPrefix);
            if (!_.isEmpty(subFormResult)) {
                res[fieldName] = subFormResult;
            }
            return res;
        }

        if (_.isArray(valueConfig)) {
            const [selfConfig, elemConfig] = valueConfig;
            const selfResult = validateValue(value, selfConfig, { ...validators, ...customValidators });
            if (!_.isEmpty(selfResult)) {
                res[fieldName] = mapErrors(selfResult, { ...defaultMessages, ...messages });
            } else {
                const subFormsResult = value.reduce((subforms, subForm, index) => {
                    const subformErrors = validateForm(subForm, elemConfig, messages, customValidators);
                    const subformsRes = [...subforms];

                    if (!_.isEmpty(subformErrors)) {
                        subformsRes[index] = subformErrors;
                    }

                    return subformsRes;
                }, []);

                if (!_.isEmpty(subFormsResult)) {
                    res[fieldName] = subFormsResult;
                }
            }

            return res;
        }

        const valueResult = validateValue(value, valueConfig, { ...validators, ...customValidators });
        const errorMessages = mapErrors(valueResult, { ...defaultMessages, ...messages });
        if (!_.isEmpty(errorMessages)) {
            res[fieldName] = errorMessages;
        }
        return res;
    }, {});

export const handleErrors = (errorConfig, errors = []) => _.reduce(errors, (result, error = {}) => {
    const { code, type } = error;
    const errorCfg = _.get(errorConfig, code, {});
    const { title, path, severity } = errorCfg;
    const err = {};
    if (path) {
        _.set(err, path, { title, severity, type });
    }
    return _.merge(result, err);
}, {});
