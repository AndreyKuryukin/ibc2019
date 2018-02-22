import React from 'react';
import PropTypes from 'prop-types';

class DefaultCell extends React.PureComponent {
    static propTypes = {
        content: PropTypes.node,
        onClick: PropTypes.func,
    }

    static defaultProps = {
        content: null,
        onClick: () => null,
    }

    render() {
        const {
            content,
            onClick,
        } = this.props;

        return (
            <div onClick={onClick}>{content}</div>
        );
    }
}

export default DefaultCell;
