export const extractRegionName = (name) => {
    const matched = name.match(/Макрорегиональный филиал «(.*)»/);
    if (matched !== null) {
        return matched[1];
    }
    return name;
};
