export function formatMAC(mac) {
    let result = mac.substr(0, 2);
    for (let i = 2; i < mac.length; i += 2) {
        result += ':' + mac.substr(i, 2);
    }
    return result;
}
