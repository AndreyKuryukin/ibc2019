import React from 'react';

const indexStyle = {
    display: 'inline-flex'
};
const arrowStyle = {
    lineHeight: 'normal',
    marginLeft: 8,
    marginTop: -5,
};

const ARROW_DOWN = <span style={{ color: 'red', ...arrowStyle }}>↓</span>;
const ARROW_UP = <span style={{ color: 'green', ...arrowStyle }}>↑</span>;

export function createKRenderer(k) {
    return (current, previous) => {
        if (current === null || current === undefined) return '―';

        let arrow = null;
        if (current > previous) {
            arrow = ARROW_UP;
        } else if (current < previous) {
            arrow = ARROW_DOWN;
        }

        let color;
        if (current > k) {
            color = 'green';
        } else if (current < k) {
            color = 'red';
        }

        const formattedCurrent = Math.round(current * 100) / 100;

        if (isNaN(formattedCurrent)) return '―';

        return <span style={{ color, ...indexStyle }}>{formattedCurrent.toFixed(2)}% {current !== previous && arrow}</span>;
    };
}
