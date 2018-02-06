import _ from 'lodash';


const languageMap = [];

const ls = (key, defaultValue) => _.get(languageMap, key, defaultValue);

export default ls;
