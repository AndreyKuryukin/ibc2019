import _ from 'lodash';
import ls from "i18n";

const validators = {
    required: (value, testValue) => value == '0' || !!value === testValue,
    min: (value, testValue) => value >= testValue,
    max: (value, testValue) => value <= testValue,
    notEmpty: (value, testValue) => !_.isEmpty(value) === testValue,
};

const defaultMessages = {
    required: ls('REQUIRED_ERROR_MESSAGE', 'Это поле обязательно для заполнения'),
    min: ls('MIN_ERROR_MESSAGE', 'Значение меньше минимального'),
    max: ls('MAX_ERROR_MESSAGE', 'Значение больше максимального'),
    notEmpty: ls('NOT_EMPTY_ERROR_MESSAGE', 'Значение не должно быть пустым'),
};

const validateValue = (value, config, customValidators) =>
    _.reduce(config, (result, testValue, validatorName) => {
        const validator = _.get(validators, validatorName, customValidators[validatorName]);
        if (_.isFunction(validator)) {
            const isValid = validator(value, testValue);
            if (!isValid) {
                result[validatorName] = isValid;
            }
        }
        return result;
    }, {});

const mapErrors = (valueResult, messages) =>
    _.reduce(valueResult, (result, isValid, validatorName) => {
        const title = _.get(messages, validatorName, '');
        const severity = 'CRITICAL';
        const type = 'VALIDATION';
        result.push({ type, title, severity });
        return result;
    }, []);

export const validateForm = (form, config, messages = defaultMessages, customValidators = {}, prefix) =>
    _.reduce(config, (result, valueConfig, fieldName) => {
        const value = _.get(form, fieldName);
        if (_.isFunction(valueConfig)) {
            const cfg = valueConfig();
            const subForm = _.get(form, fieldName);
            const formPrefix = [prefix, fieldName].join('.');
            const subFormResult = validateForm(subForm, cfg, messages, customValidators, formPrefix);
            if (!_.isEmpty(subFormResult)) {
                result[fieldName] = subFormResult;
            }
            return result;
        }

        if (_.isArray(valueConfig)) {
            const [selfConfig, elemConfig] = valueConfig;
            const selfResult = validateValue(value, selfConfig, customValidators);
            if (!_.isEmpty(selfResult)) {
                result[fieldName] = mapErrors(selfResult, messages);
            } else {
                const subFormsResult = value.reduce((subforms, subForm, index) => {
                    const subformErrors = validateForm(subForm, elemConfig, messages, customValidators);
                    if (!_.isEmpty(subformErrors)) {
                        subforms[index] = subformErrors;
                    }

                    return subforms;
                }, []);

                if (!_.isEmpty(subFormsResult)) {
                    result[fieldName] = subFormsResult;
                }
            }

            return result;
        }

        const valueResult = validateValue(value, valueConfig, customValidators);
        const errorMessages = mapErrors(valueResult, messages);
        if (!_.isEmpty(errorMessages)) {
            result[fieldName] = errorMessages;
        }
        return result;
    }, {});
