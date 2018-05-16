import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import { naturalSort } from '../../util/sort';
import Table from '../Table';
import styles from './styles.scss';


class TreeView extends React.Component {
    static propTypes = {
        data: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string
                ]).isRequired,
                name: PropTypes.string,
                children: PropTypes.array
            })),
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
        expanded: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])),
    };

    static defaultProps = {
        data: [],
        expanded: [],
        headerRowRender: null,
        bodyRowRender: () => null,
    };

    static getDefaultSortBy(columns) {
        const defaultSortColumn = columns.find(column => column.sortable);

        return defaultSortColumn ? defaultSortColumn.name : null;
    }

    constructor(props) {
        super(props);

        const sortBy = TreeView.getDefaultSortBy(props.columns);

        this.state = {
            expanded: props.expanded || [],
            sort: {
                columnName: sortBy,
                direction: 'asc',
            },
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.expanded, this.props.expanded)) {
            this.setState({ expanded: nextProps.expanded });
        }
    }

    sort = (data, columnName, direction) => naturalSort(data, [direction], node => [_.get(node, `${columnName}`, '')]);

    mapData = (data, parents = []) => {
        const result = [];
        const sortedData = this.sort(data, this.state.sort.columnName, this.state.sort.direction);
        sortedData.forEach((originNode, index) => {
            const node = {...originNode};
            node.isLast = (index + 1) === data.length;
            if (!_.isEmpty(node.children)) {
                result.push({ ...node, expandable: true, parents });
                if (this.isExpanded(node.id)) {
                    result.push(...this.mapData(node.children, [...parents, node]));
                }
            } else {
                result.push({ ...node, parents });
            }
        });
        return result;
    };

    triggerExpand = (id) => {
        this.setState({
            expanded: this.isExpanded(id) ? this.state.expanded.filter(nodeId => nodeId !== id) :
                _.uniq([...this.state.expanded, id])
        });
    };

    expandableCell = (column, node) => (
        <div className={styles.cellContainer}>
            {this.transitCells(node.parents)}
            <div className={classnames({
                [styles.lastExpandableCell]: node.isLast,
                [styles.middleExpandableCell]: !node.isLast,
                [styles.collapsedCell]: !this.isExpanded(node.id),
                [styles.expandedCell]: this.isExpanded(node.id)
            })}
                 onClick={() => this.triggerExpand(node.id)}
            />
            {this.props.bodyRowRender(column, node)}
        </div>
    );

    simpleCell = (column, node) => (
        <div className={styles.cellContainer}>
            {this.isColumnFirst(column) && this.transitCells(node.parents)}
            {this.isColumnFirst(column) && <div className={classnames({
                [styles.lastCell]: node.isLast,
                [styles.middleCell]: !node.isLast,
            })}
            />}
            {this.props.bodyRowRender(column, node)}
        </div>
    );

    transitCells = (parents) =>
        parents.map((parent, index) => (
            <div className={classnames({
                [styles.transitCell]: !parent.isLast,
                [styles.emptyCell]: parent.isLast
            })} key={index}/>
        ));

    isColumnFirst = column => column.name === this.props.columns[0].name;
    isExpanded = id => this.state.expanded.findIndex(uid => uid === id) !== -1;

    bodyRowRender = (column, node) => {
        if (!_.isEmpty(node.children) && this.isColumnFirst(column)) {
            return this.expandableCell(column, node)
        }
        return this.simpleCell(column, node);
    };

    render() {
        const { data, ...rest } = this.props;
        const newData = this.mapData(data);
        return <Table
            {...rest}
            data={newData}
            bodyRowRender={this.bodyRowRender}
            customSortFunction={(columnName, direction) => { this.setState({ sort: { columnName, direction }}) }}
        />
    }
}

export default TreeView;