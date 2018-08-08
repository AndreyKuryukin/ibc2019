const _ = require("lodash");
const fs = require("fs");
const colors = require('colors');
const path = require('path');
const loaderUtils = require("loader-utils");

const CounterClass = require('../util/Counter');

const LS_FUNC_CALL_REGEXP = /[^A-Za-z0-9а-яА-Я]ls\((.|\n|\r)*?\)/g;
const SUB_STRINGS_REGEXP = /('|")(.*?)('|")/g;
const QUOTES_REGEXP = /'|"/g;

const counter = new CounterClass();

let I18N_MAP = {};
let translator;

let defaultsLoaded = {};

const loadDefaults = (() => {
    let loaded = false;
    return (defaultValuesPath, locales) => {
        if (!loaded) {
            locales.forEach((locale) => {
                let defaults = {};
                const defaultsFile = path.resolve(defaultValuesPath, `${locale}.json`);
                try {
                    defaults = JSON.parse(fs.readFileSync(defaultsFile));
                    defaultsLoaded[locale] = true;
                    console.log(`i18n:  Defaults loaded from ${defaultsFile}`.green);
                } catch (e) {
                    console.log(`i18n:  Error loading defaults (file: ${defaultsFile}) Composing new language map`.cyan);
                }
                I18N_MAP[locale] = defaults || {};
            });
        }
        loaded = true;
    }
})();

const init = (() => {
    let inited = false;
    return (apiKey) => {
        if (!inited) {
            translator = require('yandex-translate-api')(apiKey);
        }
        inited = true;
    }
})();

const translate = (value, locale) => {
    if (locale !== 'ru') {
        return new Promise((resolve, reject) => {
            translator.translate(value, { from: 'ru', to: locale }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.text)
                }
            })
        })
            .then(res => {
                return res[0];
            })
            .catch(err => {
                console.error(err);
            });
    }
    return Promise.resolve(value)
};

const afterComplete = (() => {
    let subscribed = false;
    return (Compilation, output, locales) => {
        if (!subscribed) {
            Compilation.hooks.finishModules.tap('Saving translations', () => {
                counter.callback(() => {
                    console.log('i18n:          Saving translations'.yellow);
                    locales.forEach(locale => {
                        try {
                            const json = JSON.stringify(I18N_MAP[locale], undefined, 4);
                            console.log(`i18n:          Emitting ${output}/${locale}.json`.cyan);
                            fs.writeFileSync(`${output}/${locale}.json`, json)
                        } catch (e) {
                            console.error(e);
                        }
                    });
                })
            });
            subscribed = true;
        }
    }
})();

const spreadTranslations = (locale, key, value, fileName) => {
    const targetKey = `${locale}.${key}`;
    const targetValue = _.get(I18N_MAP, `${targetKey}`, false);
    if (targetValue) {
        if (!defaultsLoaded[locale]) {
            console.log(`i18n:  ${key}          already has value for ${locale.toUpperCase()} locale   (${fileName})`.yellow)
        }
    } else {
        if (locale !== 'ru' && defaultsLoaded[locale]) {
            console.log(`i18n:          No translation for ${key} ${locale.toUpperCase()} (${fileName})      applying yandex translation`.yellow)
        }
        translate(value, locale)
            .then((translatedValue) => {
                _.set(I18N_MAP, `${targetKey}`, translatedValue);
                counter.decrease();
            })
            .catch((e) => {
                console.error(e);
                counter.decrease();
            });
        counter.increase()
    }
};

const findStringLiterals = str => str.match(SUB_STRINGS_REGEXP);

const setTranslation = (pair, fileName, locales = []) => {
    const key = pair[0];
    const value = pair[1];
    if (_.isEmpty(key) || _.isEmpty(value)) {
        console.log(`i18n:          Suspicious ls() call in        ${fileName}         ${key}:${value}`.yellow)
    } else {
        locales.forEach(locale => {
            spreadTranslations(locale, key, value, fileName);
        });
    }
};

module.exports = function (content) {
    const { resourcePath: fileName } = this;
    const options = loaderUtils.getOptions(this) || {};
    const { defaultValuesPath, outputPath, locales, apiKey } = options;
    init(apiKey);
    loadDefaults(defaultValuesPath, locales);
    afterComplete(this._compilation, outputPath, locales);

    const matches = content.match(LS_FUNC_CALL_REGEXP);
    if (matches) {
        const keyValuesPairs = matches.map(findStringLiterals);
        keyValuesPairs.forEach((keyValue = []) => {
                if (keyValue) {
                    const pair = keyValue.map(val => val.replace(QUOTES_REGEXP, ''));
                    setTranslation(pair, fileName, locales)
                }
            }
        );
    }
    return content;
};