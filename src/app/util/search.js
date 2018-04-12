export default (value, needle) => {
    if (typeof value !== 'string' && typeof value !== 'number') {
        console.warn(`${value} has non searchable value`);
        return false;
    }

    return value.toString().length > 0 && (value.toString().toLowerCase().indexOf(needle.toLowerCase()) !== -1);
};