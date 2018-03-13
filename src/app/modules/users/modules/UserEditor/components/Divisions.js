import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import _ from 'lodash';
import Panel from '../../../../../components/Panel';
import Grid from '../../../../../components/Grid'
import { CheckedCell } from '../../../../../components/Table/Cells';
import ls from "i18n";

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
            checked: Immutable.Set(props.checked),
        };
    }

    getChildrenIds = (parentNode) => {
        let ids = [];
        parentNode.children.forEach((node) => {
            if (node.children && node.children.length > 0) {
                ids = ids.concat([node.id, ...this.getChildrenIds(node)]);
            } else {
                ids.push(node.id);
            }
        });

        return ids;
    };

    onCheckAll = (value) => {
        const allIds = treeData.reduce((result, next) => result.concat([next.id, ...this.getChildrenIds(next)]), []);
        this.setState({
            checked: value ? Immutable.Set(allIds) : Immutable.Set([]),
        });
    };

    onCheck = (value, node) => {
        let checked = this.state.checked;

        if (node.expandable) {                                              // If node has children
            const childrenIds = this.getChildrenIds(node);
            checked = value
                ? this.state.checked.union([node.id, ...childrenIds])       // Check all children
                : this.state.checked.subtract([node.id, ...childrenIds]);   // Uncheck all children
        } else {
            checked = value ? this.state.checked.add(node.id) : this.state.checked.delete(node.id);
        }

        const parents = node.parents;
        _.forEachRight(parents, (parent) => {                                // Iterate over all parents of node to check/uncheck them
            if (this.getChildrenIds(parent).every(id => checked.has(id))) {  // If every children of parent is checked
                if (checked.has(parent.id)) {                                // If parent is already checked
                    return false;
                } else {
                    checked = checked.add(parent.id);                        // Check such parent
                }
            } else {
                if (!checked.has(parent.id)) {                               // If parent is still not checked
                    return false;
                } else {
                    checked = checked.delete(parent.id);                     // Uncheck such parent
                }
            }});

        this.setState({
            checked,
        });
    };

    bodyRowRender = (column, node) => {
        let checkedPartially = false;
        let checked = this.state.checked.has(node.id);
        if (node.children && node.children.length > 0) {
            checkedPartially = !checked && this.getChildrenIds(node).some(id => this.state.checked.has(id));
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

        const isAllChecked = treeData.every(node => this.state.checked.has(node.id));
        const checkedPartially = !isAllChecked && this.state.checked.size > 0;

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
                    headerRowRender={this.headerRowRender}
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