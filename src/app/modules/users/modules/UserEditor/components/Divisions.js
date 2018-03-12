import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import Panel from '../../../../../components/Panel';
import Grid from '../../../../../components/Grid'
import { CheckedCell } from '../../../../../components/Table/Cells';
import ls from "i18n";


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
            checked: [],
        };
    }

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            console.log(node);
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id);
        } else {
            checked = value ? this.props.data.map(node => node.id) : [];
        }

        this.setState({
            checked,
        });
    };

    mapData = (data) => {
        return [
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
        ]
    };

    bodyRowRender = (column, node) => {
        return (
            <CheckedCell
                id={`user-editor-divisions-grid-${node.id}`}
                onChange={(value) => this.onCheck(value, node)}
                style={{ marginLeft: 0 }}
                value={this.state.checked.includes(node.id)}
                checkedPartially={false}
                text={node[column.name]}
            />
        );
    };

    render() {
        const {
            data,
        } = this.props;

        const checkedPartially = this.state.checked.length > 0 && this.state.checked.length < this.props.data.length;

        return (
            <Panel
                title={ls('USER_DIVISION_PANEL_TITLE', 'Division')}
                bodyStyle={{ padding: 0 }}
            >
                <Grid
                    id="user-editor-divisions-grid"
                    data={this.mapData(data)}
                    bodyRowRender={this.bodyRowRender}
                    checkedPartially={checkedPartially}
                    onCheckAll={this.onCheck}
                    tree
                />
            </Panel>
        );
    }
}

export default Divisions;