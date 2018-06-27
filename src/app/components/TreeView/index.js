import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { naturalSort } from '../../util/sort';
import Table from '../Table';
import styles from './styles.scss';


class TreeView extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
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

    constructor(props) {
        super(props);

        this.state = {
            expanded: props.expanded || [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.expanded, this.props.expanded)) {
            this.setState({ expanded: nextProps.expanded });
        }
    }

    sort = (data, columnName, direction, parents = []) =>
        naturalSort(data, [direction], node => [_.get(node, `${columnName}`, '')])
            .reduce((result, nextNode, index, array) => {
                    const node = {
                        ...nextNode,
                        parents,
                        isLast: (index + 1) === array.length,
                    };

                    return !_.isEmpty(node.children) && this.isExpanded(node.id)
                        ? [...result, node].concat(this.sort(node.children, columnName, direction, [...parents, node]))
                        : [...result, node];
                },
                []);

    mapData = (data, parents = []) =>
        data.map((originNode, index) => ({
            ...originNode,
            parents,
            expandable: !_.isEmpty(originNode.children),
            children: !_.isEmpty(originNode.children) && this.isExpanded(originNode.id)
                ? this.mapData(originNode.children, [...parents, originNode])
                : _.get(originNode, 'children', []),
        }));

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

    transitCells = (parents = []) =>
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
        const mappedData = this.mapData(data);
        return <Table
            {...rest}
            data={mappedData}
            bodyRowRender={this.bodyRowRender}
            customSortFunction={this.sort}
        />
    }
}

export default TreeView;