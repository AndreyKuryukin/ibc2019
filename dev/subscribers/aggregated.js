const stbData = require('./stbData');

const vidDecodeErrors = stbData.vidDecodeErrors;
const bufUnderruns = stbData.bufUnderruns;
const linkFaults = stbData.linkFaults;

const lastVidDecodeErrors = vidDecodeErrors[Object.keys(vidDecodeErrors)[0]];
const lastBufUnderruns = bufUnderruns[Object.keys(bufUnderruns)[0]];
const lastLinkFaults = linkFaults[Object.keys(linkFaults)[0]];

module.exports = [{
    ...lastVidDecodeErrors,
    "LAST": lastVidDecodeErrors.AVG,
    "name": "vidDecodeErrors"
}, {
    ...lastBufUnderruns,
    "LAST": lastBufUnderruns.AVG,
    "name": "bufUnderruns"
}, {
    ...lastLinkFaults,
    "LAST": lastLinkFaults.AVG,
    "name": "linkFaults"
}];