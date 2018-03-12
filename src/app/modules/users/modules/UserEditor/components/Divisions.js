import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import Panel from '../../../../../components/Panel';
import TreeView from '../../../../../components/TreeView'
import ls from "i18n";
import classnames from "classnames";


class Divisions extends React.Component {

    static propTypes = {
        data: PropTypes.array,
        checked: PropTypes.array
    };

    static defaultProps = {
        data: [],
        checked: []
    };



    onCheck = () => {

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
        return node[column.name];
    };

    bodyRowRender = (column, node) => {
        return node[column.name];
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