import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from '../../../components/Table';
import { DefaultCell, CheckedCell, LinkCell } from '../../../components/Table/Cells';
import MailLink from "../../../components/MailLink/index";

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
        title: 'Логин',
        name: 'login',
    }, {
        title: 'Имя',
        name: 'name',
    }, {
        title: 'Email',
        name: 'email',
    }, {
        title: 'Номер телефона',
        name: 'phone',
    }, {
        title: 'Активен',
        name: 'active',
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
    };

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
    };

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
            case 'email' : {
                return <MailLink href={node.email}>{node.email}</MailLink>
            }
            case 'login':
                return (
                    <LinkCell
                        href={`/users/edit/${node.id}`}
                        content={text}
                    />
                );
            default:
                return (
                    <DefaultCell
                        content={text}
                    />
                );
        }
    };

    render() {
        const columns = this.getColumns();

        return (
            <Table
                selectable
                data={this.props.data}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
            />
        );
    }
}

export default UsersTable;