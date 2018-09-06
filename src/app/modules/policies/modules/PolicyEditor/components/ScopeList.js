import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import _ from 'lodash';
import ChipList from '../../../../../components/Chip/ChipList';
import Chip from '../../../../../components/Chip/Chip';

class ScopeList extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        itemId: PropTypes.string,
        placeholder: PropTypes.string,
        options: PropTypes.array,
        values: PropTypes.array,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        itemId: '',
        placeholder: '',
        options: [],
        values: [],
        onChange: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };
    }

    getItemTitle = (value) => {
        const item = this.props.options.find(option => option.value === value);

        return item ? item.title : '';
    };

    filterOptions = (options) => options.filter(option => !this.props.values.includes(option.value));

    onAdd = (value) => {
        const values = [...this.props.values, value];

        this.setState({ value: '' }, () => {
            this.props.onChange(values);
        });
    };

    onChange = (value) => {
        this.setState({ value });
    };

    onRemove = (value) => {
        const values = _.without(this.props.values, value);

        this.props.onChange(values);
    };

    render() {
        const { id, placeholder, options, values, itemId } = this.props;
        const { value } = this.state;

        return (
            <ChipList
                itemId={itemId}
                id={id}
                options={this.filterOptions(options)}
                onChange={this.onChange}
                onAdd={this.onAdd}
                value={value}
                addTitle={ls('POLICY_ADD_SCOPE_TYPE_TITLE', 'Добавить область применения')}
                placeholder={placeholder}
            />
        );
    }
}

export default ScopeList;
