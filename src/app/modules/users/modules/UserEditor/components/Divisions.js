import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import _ from 'lodash';
import ls from "i18n";
import Panel from '../../../../../components/Panel';
import Grid from '../../../../../components/Grid'
import { CheckedCell } from '../../../../../components/Table/Cells';
import { getChildrenIds, checkNodeAndGetCheckedIds } from '../../../../../util/tree';

const treeData = [
    {
        id: 1,
        name: 'All',
        children: [
            {
                id: 3,
                name: 'Russia',
                children: [
                    {
                        id: 5,
                        name: 'Moscow',
                    }, {
                        id: 6,
                        name: 'Far east',
                    }, {
                        id: 7,
                        name: 'West',
                    }, {
                        id: 8,
                        name: 'Ural',
                    }, {
                        id: 9,
                        name: 'South',
                    }, {
                        id: 10,
                        name: 'North',
                    }, {
                        id: 11,
                        name: 'St. Petersburg',
                    },
                ]
            },
            {
                id: 4,
                name: 'USA',
                children: [
                    {
                        id: 12,
                        name: 'Alaska',
                    }, {
                        id: 13,
                        name: 'California',
                    }, {
                        id: 14,
                        name: 'Oklahoma',
                    }, {
                        id: 15,
                        name: 'Texas',
                        children: [{
                            id: 16,
                            name: 'Texas City',
                        }],
                    }
                ]
            },
        ]
    }
];

class Divisions extends React.Component {

    static propTypes = {
        data: PropTypes.array,
        checked: PropTypes.array
    };

    static defaultProps = {
        data: [],
        checked: []
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: props.checked ? props.checked : [],
        };
    }

    onCheckAll = (value) => {
        const allIds = treeData.reduce((result, next) => result.concat([next.id, ...getChildrenIds(next)]), []);
        this.setState({
            checked: value ? allIds : [],
        });
    };

    onCheck = (value, node) => {
        this.setState({
            checked: checkNodeAndGetCheckedIds(this.state.checked, node, value),
        });
    };

    bodyRowRender = (column, node) => {
        let checkedPartially = false;
        let checked = this.state.checked.includes(node.id);
        if (node.children && node.children.length > 0) {
            checkedPartially = !checked && getChildrenIds(node).some(id => this.state.checked.includes(id));
        }

        return (
            <CheckedCell
                id={`user-editor-divisions-grid-${node.id}`}
                onChange={(value) => this.onCheck(value, node)}
                style={{ marginLeft: 0 }}
                value={checked}
                checkedPartially={checkedPartially}
                text={node[column.name]}
            />
        );
    };

    render() {
        const {
            data,
        } = this.props;

        const isAllChecked = treeData.every(node => this.state.checked.includes(node.id));
        const checkedPartially = !isAllChecked && this.state.checked.length > 0;

        return (
            <Panel
                title={ls('USER_DIVISION_PANEL_TITLE', 'Division')}
                bodyStyle={{ padding: 0 }}
            >
                <Grid
                    id="user-editor-divisions-grid"
                    data={treeData}
                    columns={[
                        {
                            name: 'name',
                        }
                    ]}
                    bodyRowRender={this.bodyRowRender}
                    checkedPartially={checkedPartially}
                    isAllChecked={isAllChecked}
                    onCheckAll={this.onCheckAll}
                    tree
                />
            </Panel>
        );
    }
}

export default Divisions;