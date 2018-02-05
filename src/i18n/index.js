import _ from 'lodash';


const languageMap = [];

const ls = (key, defaultValue) => {
    return _.get(languageMap, key, defaultValue);
};

export default ls;
