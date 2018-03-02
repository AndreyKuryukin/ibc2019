import React from 'react';
import PropTypes from 'prop-types';

import { DefaultCell, LinkCell,CheckedCell } from '../../../../../../components/Table/Cells';

import Table from '../../../../../../components/Table';
import ls from "i18n";

class RolesListGrid extends React.PureComponent {
    static propTypes = {
        subjectsData: PropTypes.array,
        onCheck: PropTypes.func,
        checked: PropTypes.array,
    };

    static defaultProps = {
        subjectsData: [],
        onCheck: () => null
    };

    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked || [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.checked !== nextProps.checked) {
            this.setState({
                checked: nextProps.checked
            });
        }
    }


    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id)
        } else {
            checked = value ? this.props.subjectsData.map(node => node.id) : [];
        }

         this.props.onCheck(checked);

        this.setState({
            checked,
        });
    }

    headerRowRender = (column) => {
        switch (column.name) {
            case 'checked': {
                const isAllChecked = this.props.subjectsData.length !== 0 && this.state.checked.length === this.props.subjectsData.length;
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
                const isRowChecked = this.state.checked.findIndex(id => node.id === id) !== -1;
                return (
                    <CheckedCell
                        onChange={(value) => this.onCheck(value, node)}
                        style={{ marginLeft: 0 }}
                        value={isRowChecked}
                    />
                );
            }
            case 'name':
                return (
                    <DefaultCell
                        content={text}
                    />
                );
        }
    };

    getColumns = () => ([{
        name: 'checked',
    }, {
        title: 'Название',
        name: 'name'
    }
    ]);

    render() {
        const { subjectsData } = this.props;
        return (
            <div>
                <h6>{ls('ROLE_EDITOR_SUBJECTS_TITLE', 'Разрешения')}</h6>
                <Table headerRowRender={this.headerRowRender}
                       bodyRowRender={this.bodyRowRender}
                       data={subjectsData}
                       columns={this.getColumns()}
                       size="sm"
                />
            </div>
        );
    }
}

export default RolesListGrid;
