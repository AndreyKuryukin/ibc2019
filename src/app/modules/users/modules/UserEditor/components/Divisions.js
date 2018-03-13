import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import Panel from '../../../../../components/Panel';
import TreeView from '../../../../../components/TreeView'
import ls from "i18n";
import classnames from "classnames";
import CheckedCell from "../../../../../components/Table/Cells/CheckedCell";


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
            checked:  []
        }
    }

    onCheck = (id) => {
        this.setState({
            checked: _.uniq([...this.state.checked, id])
        })
    };

    unCheck = (id) => {
        this.setState({
            checked: this.state.checked.filter(uid => uid !== id)
        })
    };

    mapData = (data) => {
        return [
            {
                id: 1,
                name: 'Expandable',
                items: [
                    {
                        id: 3,
                        name: 'osidjfoisd'
                    },
                    {
                        id: 4,
                        name: 'retertertert'
                    }
                ]
            },
            {
                id: 5,
                name: 'Expandable 2',
                items: [
                    {
                        id: 6,
                        name: 'level 1',
                        items: [
                            {
                                id: 7,
                                name: 'level 2'
                            },
                            {
                                id: 8,
                                name: 'level 2'
                            },
                            {
                                id: 9,
                                name: 'level 2'
                            }
                        ]
                    },
                    {
                        id: 10,
                        name: 'level 1',
                        items: [
                            {
                                id: 11,
                                name: 'level 2',
                                items: [
                                    {
                                        id: 12,
                                        name: 'level 2'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 2,
                name: 'Simple'
            }
        ]
    };

    headerRowRender = (column, node) => {

    };

    bodyRowRender = (column, node) => {
        return <span>
            <CheckedCell value={this.state.checked.findIndex(id => id === node.id) !== -1}
                         id={node.id}
                         onChange={checked => checked ? this.onCheck(node.id) : this.unCheck(node.id)}
            />
            {node[column.name]}
        </span>
    };

    render() {
        const {
            data,
        } = this.props;
        return <div className={classnames(styles.userEditorColumn, styles.userDivisions)}>
            <Panel
                title={ls('USER_DIVISION_PANEL_TITLE', 'Division')}
                bodyStyle={{ padding: 0 }}
            >
                <TreeView
                    data={this.mapData(data)}
                    columns={[
                        {
                            name: 'name',
                        }
                    ]}
                    headerRowRender={this.headerRowRender}
                    bodyRowRender={this.bodyRowRender}
                />
            </Panel>
        </div>
    }
}

export default Divisions;