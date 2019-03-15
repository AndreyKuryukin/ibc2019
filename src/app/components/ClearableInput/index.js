import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input from '../Input';
import styles from './styles.scss';

class ClearableInput extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        value: PropTypes.string,
        placeholder: PropTypes.string,
        maxLength: PropTypes.number,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        className: '',
        value: '',
        placeholder: '',
        onChange: () => null,
    };

    onClear = () => {
        this.props.onChange('');
    };

    render() {
        return (
            <div className={classNames(this.props.className, styles.clearableInputBlock)}>
                <Input
                    className={styles.clearableInput}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    maxLength={this.props.maxLength}
                    onChange={this.props.onChange}
                />
                <button type="button" className={styles.clearBtn} onClick={this.onClear} />
            </div>
        );
    }
}

export default ClearableInput;
