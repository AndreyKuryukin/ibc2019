export const naturalSort = (array, orders, extractor) => {
    const xor = (a, b) => a ? !b : b;
    const compare = (a, b, order) => (a < b) ? order : (a > b) ? -order : 0;
    const isDigit = (chr) => {
        const charCode = ch => ch.charCodeAt(0);
        const code = charCode(chr);
        return (code >= charCode('0')) && (code <= charCode('9'));
    }
    // split str on pieces "lazy" way
    function Splitter(item, level = 0) {
        let index = 0;
        let from = 0;
        const parts = [];
        let completed = false;
        this.item = item;
        const values = (typeof (extractor) === 'function') ?
            extractor(item) :
            item;
        const key = values[level];
        this.key = key;
        if (++level < values.length){
            this.nextSplitter = new Splitter(item, level);
        }

        function Part(text, isNumber) {
            this.isNumber = isNumber;
            this.value = isNumber ? Number(text) : text;
            this.len = isNumber ? text.length : null;
        }
        function next() {
            if (index < key.length) {
                while (++index) {
                    const currentIsDigit = isDigit(key.charAt(index - 1));
                    const nextChar = key.charAt(index);
                    const currentIsLast = (index === key.length);
                    const isBorder = currentIsLast || xor(currentIsDigit, isDigit(nextChar));
                    if (isBorder) {
                        const partStr = key.slice(from, index);
                        parts.push(new Part(partStr, currentIsDigit));
                        from = index;
                        break;
                    }
                }
            } else { // end of string
                completed = true;
            }
        }
        this.count = () => parts.length;
        this.part = (i) => {
            while (parts.length <= i && !completed) {
                next();
            }
            return (i < parts.length) ? parts[i] : null;
        };
    }
    function compareSplitters(sp1, sp2, level = 0) {
        let i = 0;
        const order = orders[level] === 'desc' ? 1 : -1;
        do {
            const first = sp1.part(i);
            const second = sp2.part(i);
            if (first !== null && second !== null) {
                if (xor(first.isNumber, second.isNumber)) {
                    return first.isNumber ? order : -order;
                }
                const comp = compare(first.value, second.value, order);
                if (comp !== 0) {
                    return comp;
                } else if (first.isNumber && second.isNumber && compare(first.len, second.len, order) !== 0) { // compare length of numbers 02 and 002
                    return compare(first.len, second.len, order);
                }
            } else {
                if (sp1.nextSplitter && sp2.nextSplitter){
                    return compareSplitters(sp1.nextSplitter, sp2.nextSplitter, ++level);
                } else {
                    return compare(sp1.count(), sp2.count(), order);
                }
            }
        } while (++i);
    }
    const splitters = array.map(item => new Splitter(item));
    const sorted = splitters.sort(compareSplitters);
    return sorted.map(splitter => splitter.item);
};