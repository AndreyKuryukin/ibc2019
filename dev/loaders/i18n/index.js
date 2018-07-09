const _ = require("lodash");
const fs = require("fs");
const colors = require('colors');
const loaderUtils = require("loader-utils");


const LS_FUNC_CALL_REGEXP = /[^A-Za-z0-9а-яА-Я]ls\(.*?\)/g;
const SUB_STRINGS_REGEXP = /('|")(.*?)('|")/g;
const QUOTES_REGEXP = /'|"/g;

let I18N_MAP = {};

const loadDefaults = (() => {
    let loaded = false;
    return (fileName) => {
        if (!loaded) {
            let defaults = {};
            try {
                defaults = JSON.parse(fs.readFileSync(fileName));
                loaded = true;
                console.log(`i18n:  Defaults loaded from ${fileName}`.green);
            } catch (e) {
                console.log(`i18n:  Error loading defaults (file: ${fileName}) Composing new language map`.cyan);
                loaded = true;
            }
            I18N_MAP = defaults;
        }
    }
})();

const translate = (locale = 'ru', I18N_MAP) => {
    return I18N_MAP
};

const afterComplete = (() => {
    let subscribed = false;
    return (Compilation, output, locales) => {
        if (!subscribed) {
            Compilation.hooks.finishModules.tap('Saving translations', () => {
                console.log('i18n:  Saving translations'.yellow);
                locales.forEach(locale => {
                    try {
                        const json = JSON.stringify(translate(locale, I18N_MAP), undefined, 4);
                        console.log(`i18n:  Emitting ${output}/${locale}.json`.cyan);
                        fs.writeFileSync(`${output}/${locale}.json`, json)
                    } catch (e) {
                        console.error(e);
                    }
                });
            });
            subscribed = true;
        }
    }
})();


const findStringLiterals = str => str.match(SUB_STRINGS_REGEXP);

module.exports = function (content) {
    const { resourcePath: fileName } = this;
    const options = loaderUtils.getOptions(this) || {};

    loadDefaults(options.defaultValues);
    afterComplete(this._compilation, options.output, options.locales);
    const matches = content.match(LS_FUNC_CALL_REGEXP);
    if (matches) {
        const keyValuesPairs = matches.map(findStringLiterals);
        keyValuesPairs.forEach(keyValue => {
            if (keyValue) {
                const pair = keyValue.map(val => val.replace(QUOTES_REGEXP, ''));
                const key = pair[0];
                const value = pair[1];
                if (_.isEmpty(key) || _.isEmpty(value)) {
                    console.log(`i18n:  Suspicious ls() call in        ${fileName}         ${key}:${value}`.yellow)
                } else {
                    if (I18N_MAP[key] && I18N_MAP[key] !== value) {
                        console.log(`i18n:  ${key} has different value in     ${fileName}`.yellow)
                    } else {
                        I18N_MAP[key] = value;

                    }
                }
            }
        });
    }
    return content;
};