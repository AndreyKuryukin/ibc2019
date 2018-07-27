import React from 'react';
import PropTypes from 'prop-types';

class DrilldownHeadCell extends React.PureComponent {
    static propTypes = {
        column: PropTypes.shape({
            name: PropTypes.string.isRequired,
            getTitle: PropTypes.func.isRequired,
        }).isRequired,
    };

    render() {
        const { column } = this.props;

        return column.getTitle();
    }
}

export default DrilldownHeadCell;
