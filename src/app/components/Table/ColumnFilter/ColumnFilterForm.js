import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Immutable from 'immutable';
import styles from './form.scss';
import Input from '../../Input';

class ColumnFilterForm extends React.PureComponent {
    static propTypes = {
        active: PropTypes.bool,
        onColumnFilterChange: PropTypes.func,
    }

    static defaultProps = {
        active: false,
        onColumnFilterChange: () => null,
    }

    constructor(props) {
        super(props);

        this.state = {
            values: Immutable.OrderedMap([[0, '']]),
        };
    }

    setFilterValue = (key, value) => {
        const values = value.length > 0 ? this.state.values.set(key, value) : this.state.values.delete(key);
        this.setState({
            values,
        }, () => {
            this.props.onColumnFilterChange(values);
            const lastKey = values.keySeq().last();
            if (values.get(lastKey).length > 0) {
                this.setState({
                    values: values.set(lastKey + 1, ''),
                });
            }
        });
    }

    deleteFilterValue = (key) => {
        const { values: oldValues } = this.state;

        this.setState({
            values: oldValues.keySeq().last() !== key ? oldValues.delete(key) : oldValues.set(key),
        }, () => { this.props.onColumnFilterChange(this.state.values) });
    }

    onClick = (e) => {
        e.stopPropagation();
    }

    onBlurInput = (e, key) => {
        if (!e.target.value) {
            this.deleteFilterValue(key);
        }
    };

    render() {
        return (
            this.props.active && <div className={styles.columnFilterForm} onClick={this.onClick}>
                {Array.from(this.state.values).map(([key, value]) => (
                    <div
                        key={key}
                        className={styles.formItem}
                    >
                        <Input
                            key={key}
                            value={value}
                            onChange={event => this.setFilterValue(key, _.get(event, 'target.value'))}
                            onBlur={event => this.onBlurInput(event, key)}
                            style={{ width: '90%' }}
                        />
                        {value && <div className={styles.delete} onClick={() => this.deleteFilterValue(key)}>X</div>}
                    </div>
                ))}
            </div>
        );
    }
}

export default ColumnFilterForm;
