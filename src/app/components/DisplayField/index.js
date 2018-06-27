import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from "classnames"
import styles from './styles.scss';

class DisplayField extends React.PureComponent {
    static propTypes = {
        error: PropTypes.object,
    };

    static defaultProps = {
        error: {},
    };


    render() {
        const { error, children, className, ...props } = this.props;
        const invalid = !_.isEmpty(error);
        return <div className={classnames(styles.displayField, className, {
            [styles.errorMark]: invalid
        })}
                    {...props}
        >
            {children}
            {invalid && <div className={'fieldInvalid'} title={_.get(error, 'title')}/>}
        </div>
    }
}

export default DisplayField;
