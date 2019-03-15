import React from 'react';
import PropTypes from 'prop-types';
import styles from './row.scss';

class ColumnResizer extends React.Component {
    static propTypes = {
        wrapperId: PropTypes.string.isRequired,
        columns: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        })),
        children: PropTypes.node,
    };

    render() {
        const {wrapperId} = this.props;

        return (
            <div>
                {this.props.children}
                <style>
                    {this.props.columns.map((column) => {
                        const selector = `#${wrapperId} .${styles.cell}[data-column=${column.name}]`;
                        const basis = typeof column.width === 'number' ? `${column.width}px` : (column.width || 0);

                        return `${selector} { flex-basis: ${basis}; }`;
                    })}
                </style>
            </div>
        );
    }
}

export default ColumnResizer;
