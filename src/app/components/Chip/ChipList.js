import React from 'react';
import PropTypes from 'prop-types';
import Field from "../Field/index";
import Input from "../Input/index";
import Icon from "../Icon/Icon";

import styles from './styles.scss';

class ChipList extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        addTitle: PropTypes.string,
        inputPlaceholder: PropTypes.string,
        onChange: PropTypes.func,
        onAdd: PropTypes.func,
        formatValue: PropTypes.func,
        error: PropTypes.string,
        valid: PropTypes.bool,
        value: PropTypes.string,
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        addTitle: '',
        value: '',
        inputPlaceholder: '',
        separator: ':',
        placeholder: '',
        onAdd: () => null,
    };

    state = {};

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }

    onChange = (value) => {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(value)
        } else {
            this.setState({ value });
        }
    };

    formatValue = (value = '') => {
        if (this.props.formatValue) {
            return this.props.formatValue(value)
        }
        return value
    };

    onAdd = (value) => {
        this.props.onAdd(value)
    };

    render() {
        return <div className={styles.chipListContainer}>
            <div style={{ display: 'flex', position: 'relative' }}>
                <Input
                    id={this.props.id}
                    placeholder={this.props.placeholder}
                    valid={this.props.valid}
                    errorMessage={this.props.error}
                    value={this.formatValue(this.state.value)}
                    onChange={event => this.onChange(event.target.value)}
                />
                <Icon
                    icon="addIcon"
                    onClick={() => this.onAdd(this.state.value)}
                    title={this.props.addTitle}
                />
            </div>
            {this.props.children.length > 0 && <div className={styles.chipList}>
                {this.props.children}
            </div>}
        </div>
    }
}

export default ChipList;
