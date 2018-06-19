import React from 'react';
import PropTypes from 'prop-types';

class DrilldownHeadCell extends React.PureComponent {
    static propTypes = {
        column: PropTypes.shape({
            name: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        }).isRequired,
    };

    render() {
        const { column } = this.props;

        return column.title;
    }
}

export default DrilldownHeadCell;
