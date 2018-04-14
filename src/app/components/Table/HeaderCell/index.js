import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class HeaderCell extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node,
        filterable: PropTypes.bool,
        width: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        onClick: PropTypes.func,
        onColumnFilterChange: PropTypes.func,
        isLast: PropTypes.bool,
    };

    static defaultProps = {
        children: null,
        filterable: false,
        width: null,
        onClick: () => null,
        onColumnFilterChange: () => null,
        isLast: false,
    };

    render() {
        const { children, width, onClick, isLast } = this.props;
        const style = { width };

        return (
            <div className={styles.headerCell} style={style} onClick={onClick}>
                {children}
            </div>
        )
    }
}

export default HeaderCell;
