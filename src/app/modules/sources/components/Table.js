import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import ls from 'i18n';
import memoize from 'memoizejs';
import { createSelector } from 'reselect';
import TreeView from '../../../components/TreeView';
import { DefaultCell, IconCell } from '../../../components/Table/Cells';
import { DATE_TIME } from "../../../costants/date";

class SourcesTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
    };

    static getColumns = memoize(() => [{
        title: ls('SOURCE_NAME_COLUMN_TITLE', 'Источники'),
        name: 'name',
        sortable: true,
        searchable: true,
        width: 500
    }, {
        title: ls('SOURCE_STATUS_COLUMN_TITLE', 'Статус'),
        name: 'status',
        sortable: true,
        searchable: true,
        width: 70
    }, {
        title: ls('SOURCE_LAST_DATA_COLUMN_TITLE', 'Дата последнего получения данных'),
        name: 'last_data_received',
        sortable: false,
        searchable: false,
        width: 200
    }]);

    mapSources = sources => sources;

    mapData = createSelector(
        props => props.data,
        data => data.map(this.mapSources)
    );

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.title}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    bodyRowRender = (column, node) => {
        switch (column.name) {
            case 'name': {
                return (
                    <DefaultCell
                        content={node[column.name]}
                    />
                );
            }
            case 'status': {
                const status = node[column.name] ? node[column.name].toLowerCase(): '';
                return <IconCell icon={`source-${status}`}/>
            }
            case 'last_data_received': {
                return <DefaultCell
                    content={moment(node[column.name]).format(DATE_TIME)}
                />;
            }
            default: {
                return <DefaultCell
                    content={node[column.name]}
                />;
            }
        }
    };

    render() {
        const mappedData = this.mapData(this.props);

        return (
            <TreeView
                data={mappedData}
                columns={SourcesTable.getColumns()}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
            />
        );
    }
}

export default SourcesTable;
