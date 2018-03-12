import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import Table from '../Table';
import styles from './styles.scss';


class TreeView extends React.Component {
    static propTypes = {
        data: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string
                ]),
                name: PropTypes.string,
                items: PropTypes.array
            })),
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        headerRowRender: () => null,
        bodyRowRender: () => null,
    }

    constructor(props) {
        super(props);
        this.state = {
            expanded: [5, 6]
        }
    }

    getColumns = () => ([
        {
            name: 'name',
        }
    ]);

    mapData = (data, level = 0) => {
        const result = [];
        data.forEach((node, index) => {
            const isLast = (index + 1) === data.length;
            if (!_.isEmpty(node.items)) {
                result.push({ ...node, expandable: true, isLast, level });
                if (this.isExpanded(node.id)) {
                    result.push(...this.mapData(node.items, level + 1))
                }
            } else {
                result.push({ ...node, isLast, level })
            }
        });
        return result;
    };

    triggerExpand = (id) => {
        this.setState({
            expanded: this.isExpanded(id) ? this.state.expanded.filter(nodeId => nodeId !== id) :
                _.uniq([...this.state.expanded, id])
        })
    };

    expandableCell = (column, node) => {
        return <div style={{ marginLeft: node.level * 12 }} className={styles.treeCell}>
            <div className={classnames({
                // [styles.lastCell]: node.isLast,
                // [styles.middleCell]: !node.isLast,
                [styles.collapsedCell]: !this.isExpanded(node.id),
                [styles.expandedCell]: this.isExpanded(node.id)
            })}
                 onClick={() => this.triggerExpand(node.id)}
            />
            {this.props.bodyRowRender(column, node)}
        </div>
    };

    simpleCell = (column, node) => {
        return <div style={{ marginLeft: node.level * 12 }} className={styles.treeCell}>
            <div className={classnames({
                // [styles.lastCell]: node.isLast,
                // [styles.middleCell]: !node.isLast,
            })}
            />
            {this.props.bodyRowRender(column, node)}
        </div>
    };

    isExpanded = id => this.state.expanded.findIndex(uid => uid === id) !== -1;

    bodyRowRender = (column, node) => {
        if (!_.isEmpty(node.items)) {
            return this.expandableCell(column, node)
        }
        return this.simpleCell(column, node);
    };

    render() {
        const { data, headerRowRender } = this.props;
        const newData = this.mapData(data);
        console.log(newData);
        return <Table
            columns={this.getColumns()}
            data={newData}
            headerRowRender={headerRowRender}
            bodyRowRender={this.bodyRowRender}
        />
    }
}

export default TreeView;