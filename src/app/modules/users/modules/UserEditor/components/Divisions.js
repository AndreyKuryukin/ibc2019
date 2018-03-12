import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Panel from '../../../../../components/Panel';
import Grid from '../../../../../components/Grid'
import { CheckedCell } from '../../../../../components/Table/Cells';
import ls from "i18n";

const treeData = [
    {
        id: 1,
        name: 'All',
        items: [
            {
                id: 3,
                name: 'Russia',
                items: [
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
                items: [
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
                    }
                ]
            }
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
        let ids = [parentNode.id];
        parentNode.items.forEach((node) => {
            if (node.items && node.items.length > 0) {
                ids = ids.concat(this.getChildrenIds(node));
            } else {
                ids.push(node.id);
            }
        });

        return ids;
    };

    onCheckAll = (value) => {
        this.setState({
            checked: value ? Immutable.Set(this.getChildrenIds(treeData[0])) : Immutable.Set([]),
        });
    };

    onCheck = (value, node) => {
        let checked = this.state.checked;

        if (node.expandable) {
            checked = value
                ? this.state.checked.union(this.getChildrenIds(node))
                : this.state.checked.subtract(this.getChildrenIds(node));
        } else {
            checked = value ? this.state.checked.add(node.id) : this.state.checked.delete(node.id);
        }

        this.setState({
            checked,
        });
    };

    bodyRowRender = (column, node) => {
        let checkedPartially = false;
        let checked = false;
        if (node.items && node.items.length > 0) {
            checked = node.items.every(child => this.state.checked.has(child.id));
            checkedPartially = !checked && node.items.some(child => this.state.checked.has(child.id));
        } else {
            checked = this.state.checked.has(node.id);
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

        const checkedPartially = this.state.checked.size > 0 && this.state.checked.size < treeData.length;

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
                    onCheckAll={this.onCheckAll}
                    tree
                />
            </Panel>
        );
    }
}

export default Divisions;