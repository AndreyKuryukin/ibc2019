import * as _ from "lodash";
import ls from "i18n";

const validators = {
    required: (value, testValue) => !!value === testValue,
};

const defaultMessages = {
    required: ls('REQUIRED_ERROR_MESSAGE', 'Это поле обязательно для заполнения')
};

const validateValue = (value, config, customValidators) =>
    _.reduce(config, (result, testValue, validatorName) => {
        const validator = _.get(validators, validatorName, customValidators[validatorName]);
        if (_.isFunction(validator)) {
            result[validatorName] = validator(value, testValue);
        }
        return result
    }, {});

const mapErrors = (valueResult, messages) =>
    _.reduce(valueResult, (result, isValid, validatorName) => {
        if (!isValid) {
            const title = _.get(messages, validatorName, '');
            const severity = 'CRITICAL';
            const type = 'VALIDATION';
            result.push({ type, title, severity });
        }
        return result;
    }, []);

export const validateForm = (form, config, messages = defaultMessages, customValidators = {}, prefix) =>
    _.reduce(form, (result, value, fieldName) => {
        const valueConfig = _.get(config, fieldName);
        if (_.isFunction(valueConfig)) {
            const cfg = valueConfig();
            const subForm = form[key];
            const formPrefix = [prefix, key].join('.');
            result[fieldName] = validateForm(subForm, cfg, messages, customValidators, formPrefix);
            return result;
        }
        const valueResult = validateValue(value, valueConfig, customValidators);
        const errorMessages = mapErrors(valueResult, messages);
        if (!_.isEmpty(errorMessages)) {
            result[fieldName] = errorMessages
        }
        return result;
    }, {});
