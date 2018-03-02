export default (value, needle) => {
    if (typeof value !== 'string') {
        console.warn(`${value} has non searchable value`);
        return false;
    }

    return value.length > 0 && (value.toLowerCase().indexOf(needle.toLowerCase()) !== -1);
};