import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import memoize from 'memoizejs';
import search from '../../../util/search';
import Table from '../../../components/Table';
import { DefaultCell, LinkCell } from '../../../components/Table/Cells';
import styles from './styles.scss';

class ConfigsTable extends React.PureComponent {
    static contextTypes = {
        hasAccess: PropTypes.func.isRequired,
    };

    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        selected: PropTypes.string,
        preloader: PropTypes.bool,
        onSelectConfig: PropTypes.func,
        onEditConfig: PropTypes.func,
        onDeleteConfig: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        selected: '',
        preloader: false,
        onSelectConfig: () => null,
        onEditConfig: () => null,
        onDeleteConfig: () => null,
    };

    static getColumns = memoize(hasEditAccess => [{
        getTitle: () => ls('KQI_NAME_COLUMN_TITLE', 'Название'),
        name: 'name',
        resizable: true,
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        },
    }, {
        title: () => ls('KQI_COUNT_COLUMN_TITLE', 'Количество проекций'),
        name: 'projection_count',
        resizable: true,
        searchable: true,
        sortable: true,
        width: 150,
    }, {
        name: 'view',
        width: 40,
    }]);

    onSelectConfig = (node) => {
        this.props.onSelectConfig(node.id);
    };

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.getTitle ? column.getTitle() : ''}
            sortDirection={sort.by === column.name ? sort.direction : null}
        />
    );

    bodyRowRender = (column, node) => {
        switch (column.name) {
            case 'name':
                return (
                    <LinkCell
                        href={`/kqi`}
                        content={node[column.name]}
                    />
                );
            case 'view':
                return (
                    node.predefined ? '' : <div
                        className="view-icon"
                        style={{cursor: 'pointer'}}
                        title={ls('KQI_CONFIG_VIEW_TITLE', 'Просмотр')}
                        onClick={(event) => {
                            event.stopPropagation();
                            this.props.onEditConfig(node.id);
                        }}
                    />
                );
            // case 'delete': {
            //     const onDeleteConfig = this.onDelete.bind(this, node.id);
            //     return (
            //         !node.predefined && <div
            //             className={styles.deleteStyle}
            //             onClick={onDeleteConfig}
            //         >
            //             ×
            //         </div>
            //     );
            // }
            default:
                return (
                    <DefaultCell
                        content={node[column.name]}
                    />
                );
        }
    };
    //
    // onDelete = (id, e) => {
    //     e.stopPropagation();
    //     this.props.onDeleteConfig(id);
    // };

    filter = (data, columns, searchText) => {
        const searchableColumns = columns.filter(col => col.searchable);
        return data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText)))
    };

    render() {
        const { data, searchText, selected } = this.props;
        const hasEditAccess = this.context.hasAccess('KQI', 'EDIT');
        const columns = ConfigsTable.getColumns(hasEditAccess);
        const filteredData = searchText ? this.filter(data, columns, searchText) : data;
        return (
            <Table
                id="kqi-configs-table"
                data={filteredData}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={this.props.preloader}
                onSelectRow={this.onSelectConfig}
                selected={String(selected)}
            />
        );
    }
}

export default ConfigsTable;
