import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import memoize from 'memoizejs';
import TreeView from '../../../../../components/TreeView';
import { DefaultCell } from '../../../../../components/Table/Cells';
import * as _ from "lodash";
import CheckedCell from "../../../../../components/Table/Cells/CheckedCell";
import search from '../../../../../util/search';

const checkedCellStyle = { marginLeft: 0 };

class ResultsTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        locations: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        expandAll: PropTypes.bool,
        onCheck: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        locations: [],
        searchText: '',
        preloader: false,
        onCheck: () => null,
    };

    hierarchy = [
        'mrf',
        'rf',
        'last_mile_technology',
        'last_inch_technology',
        'manufacture',
        'equipment_type',
        'sw_version',
        'abonent_group',
        'date_time',
        'value'
    ];

    constructor(props) {
        super(props);
        const locationmap = this.mapLocations(props.locations);
        this.state = {
            checked: [],
            checkedNodes: [],
            valueMap: {
                rf: locationmap,
                mrf: locationmap
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.data, this.state.data)) {
            const mapedData = this.mapData(nextProps.data);
            this.setState({ data: mapedData })
        }
        if (!_.isEqual(nextProps.expandAll, this.state.expandAll)) {
            this.setState({ expandAll: nextProps.expandAll })
        }
        if (!_.isEqual(nextProps.locations, this.props.locations)) {
            const locationmap = this.mapLocations(nextProps.locations);
            this.setState({
                valueMap: {
                    rf: locationmap,
                    mrf: locationmap
                }
            });
        }
    }

    mapLocations = (locations) => _.reduce(locations, (result, location) => {
        result[location.id] = location.name;
        if (_.isArray(location.rf)) {
            result = _.merge(result, this.mapLocations(location.rf));
        }
        return result;
    }, {});

    getMapedValueWithDefault = (result, fieldName) => {
        return _.get(this.state.valueMap, `${fieldName}.${result[fieldName]}`, result[fieldName]);
    };

    composeResultId = (result, index) => `${JSON.stringify(result)}-${index}`;

    mapData = data => {
        const nodeIds = [];
        const mapedData = _.reduce(data, (final, result) => {
            const deepSeries = _.reduce(this.hierarchy, (res, fieldName) => {
                if (result[fieldName]) {
                    res.push(fieldName)
                }
                return res;
            }, []);
            const recursiveAdd = (children, index = 0) => {
                const name = deepSeries[index];
                const nextName = deepSeries[index + 1];
                const existingNode = _.find(children, { name: result[name] });

                if (existingNode) {
                    existingNode.children = recursiveAdd(existingNode.children, index + 1);
                    return children;
                }

                const id = this.composeResultId(result, index);
                nodeIds.push(id);
                if (nextName === 'value' || !nextName) {
                    const displayName = this.getMapedValueWithDefault(result, name);
                    children.push({
                        name: displayName,
                        id,
                        result: `${result.value * 100}%`,
                        weight: result.weight,
                        originalResultNode: result
                    })
                } else {
                    const displayName = this.getMapedValueWithDefault(result, name);
                    children.push({
                        name: displayName,
                        id,
                        children: recursiveAdd([], index + 1)
                    });
                }
                return children;
            };
            return recursiveAdd(final);
        }, []);
        this.setState({ nodeIds });
        return mapedData;
    };

    static getColumns = memoize(() => [{
        title: ls('KQI_NAME_COLUMN_TITLE', 'Имя'),
        name: 'name',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_RESULT_COLUMN_TITLE', 'Результат'),
        name: 'result',
        searchable: true,
        sortable: true,
    }, {
        title: ls('KQI_WEIGHT_COLUMN_TITLE', 'Вносимый вес'),
        name: 'weight',
        searchable: true,
        sortable: true,
    }]);

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.title}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    onCheck = (value, node) => {
        const checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id);
        const checkedNodes = value ? [...this.state.checkedNodes, node] : this.state.checkedNodes.filter(checked => checked.id !== node.id);
        this.props.onCheck(checkedNodes.map(checked => checked.originalResultNode));
        this.setState({
            checked,
            checkedNodes
        });
    };


    bodyRowRender = (column, node) => {
        switch (column.name) {
            case 'name': {
                if (!_.isUndefined(node.result)) {
                    const isRowChecked = this.state.checked.includes(node.id);
                    return <CheckedCell id={node.id}
                                        text={node.name}
                                        onChange={(value) => this.onCheck(value, node)}
                                        value={isRowChecked}
                                        style={checkedCellStyle}
                    />
                }
                return <DefaultCell
                    content={node[column.name]}
                />
            }
            default: {
                return <DefaultCell
                    content={node[column.name]}
                />
            }
        }
    };

    filter = (data, searchableColumns, searchText) =>
        data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText))
                || (node.children && this.filter(node.children, searchableColumns, searchText).length > 0)
        );

    render() {
        const { searchText } = this.props;
        const { data = [], expandAll, nodeIds } = this.state;
        const columns = ResultsTable.getColumns();
        const filteredData = searchText ? this.filter(data, columns, searchText) : data;
        return (
            <TreeView
                data={filteredData}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={this.props.preloader}
                expanded={expandAll ? nodeIds : []}
            />
        );
    }
}

export default ResultsTable;
