import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import memoize from 'memoizejs';
import Grid from '../../../../../components/Grid';
import { CheckedCell } from '../../../../../components/Table/Cells'

const gridStyle = { height: 110 };
const gridCellStyle = { marginLeft: 0 };

class MultiselectGrid extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        values: PropTypes.array,
        checked: PropTypes.array,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        values: [],
        checked: [],
        onChange: () => null,
    };

    static getColumns = memoize(() => [{
        name: 'name',
    }]);

    static mapData = memoize(data => data.map(({ value, name }) => ({
        id: value,
        name,
    })));

    bodyRowRender = (column, node) => {
        const checked = this.props.checked.includes(node.id);
        return (
            <CheckedCell
                id={`${this.props.id}-grid-${node.id}`}
                onChange={(value) => this.onCheck(value, node)}
                style={gridCellStyle}
                value={checked}
                text={node[column.name]}
            />
        );
    };

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.props.checked, node.id] : _.without(this.props.checked, node.id);
        } else {
            checked = value ? this.props.values.map(v => v.value) : [];
        }

        this.props.onChange(checked);
    };

    render() {
        const { id, values } = this.props;
        const checkedPartially = values.length !== 0 && this.props.checked.length > 0 && this.props.checked.length < values.length;
        const isAllChecked = !checkedPartially && values.length !== 0 && this.props.checked.length === values.length;

        return (
            <Grid
                id={id}
                data={MultiselectGrid.mapData(values)}
                columns={MultiselectGrid.getColumns()}
                bodyRowRender={this.bodyRowRender}
                isAllChecked={isAllChecked}
                checkedPartially={checkedPartially}
                onCheckAll={this.onCheck}
                style={gridStyle}
                noSearch
            />
        );
    }
}

export default MultiselectGrid;
