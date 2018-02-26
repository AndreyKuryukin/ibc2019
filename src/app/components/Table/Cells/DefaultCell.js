import React from 'react';
import PropTypes from 'prop-types';

class DefaultCell extends React.PureComponent {
    static propTypes = {
        content: PropTypes.node,
        sortDirection: PropTypes.string,
        onClick: PropTypes.func,
    }

    static defaultProps = {
        content: null,
        sortDirection: '',
        onClick: () => null,
    }

    render() {
        const {
            content,
            onClick,
            sortDirection,
        } = this.props;

        return (
            <div onClick={onClick}>
                {/*{sortDirection && iconBySortDirection}*/}
                {content}
            </div>
        );
    }
}

export default DefaultCell;
