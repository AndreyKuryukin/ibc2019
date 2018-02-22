import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from '../../../../../components/Table';
import { DefaultCell, CheckedCell } from '../../../../../components/Table/Cells';

class UsersTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
    };

    static defaultProps = {
        data: [],
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: [],
        };
    }

    getColumns = () => [{
        name: 'checked',
    }, {
        title: 'Роль',
        name: 'name',
    }];

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id)
        } else {
            checked = value ? this.props.data.map(node => node.id) : [];
        }

        this.setState({
            checked,
        });
    }

    headerRowRender = (column) => {
        switch (column.name) {
            case 'checked': {
                const isAllChecked = this.props.data.length !== 0 && this.state.checked.length === this.props.data.length;
                return (
                    <CheckedCell
                        onChange={this.onCheck}
                        style={{ marginLeft: 0 }}
                        value={isAllChecked}
                    />
                );
            }
            default:
                return (
                    <DefaultCell
                        content={column.title}
                    />
                );
        }
    }

    bodyRowRender = (column, node) => {
        const text = node[column.name];
        switch (column.name) {
            case 'checked': {
                const isRowChecked = this.state.checked.includes(node.id);
                return (
                    <CheckedCell
                        onChange={(value) => this.onCheck(value, node)}
                        style={{ marginLeft: 0 }}
                        value={isRowChecked}
                    />
                );
            }
            default:
                return (
                    <DefaultCell
                        content={text}
                    />
                );
        }
    }

    render() {
        const columns = this.getColumns();

        return (
            <Table
                data={this.props.data}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
            />
        );
    }
}

export default UsersTable;
