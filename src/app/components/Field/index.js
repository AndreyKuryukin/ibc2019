import React from 'react';
import PropTypes from 'prop-types';

class Field extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        labelText: PropTypes.string,
        labelWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        inputWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    }

    static defaultProps = {
        id: '',
        labelText: '',
        labelWidth: '50%',
        inputWidth: '50%',
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default Field;
