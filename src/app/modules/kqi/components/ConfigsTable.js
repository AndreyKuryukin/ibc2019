import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import memoize from 'memoizejs';
import search from '../../../util/search';
import Table from '../../../components/Table';
import { DefaultCell, LinkCell, IconCell } from '../../../components/Table/Cells';
import styles from './styles.scss';

class ConfigsTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onSelectConfig: PropTypes.func,
        onEditConfig: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
        onSelectConfig: () => null,
        onEditConfig: () => null,
    };

    static getColumns = memoize(() => [{
        title: ls('KQI_NAME_COLUMN_TITLE', 'Имя'),
        name: 'name',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        },
    }, {
        title: ls('KQI_COUNT_COLUMN_TITLE', 'Количество проекций'),
        name: 'projection_count',
        searchable: true,
        sortable: true,
        width: 150,
    }, {
        title: '',
        name: 'edit',
        width: 40,
    }, {
        title: '',
        name: 'delete',
        width: 25,
    }]);

    headerRowRender = (column, sort) => (
        <DefaultCell
            content={column.title}
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
            case 'edit': 
                return (
                    <div
                        className="edit-icon"
                        onClick={(event) => {
                            event.stopPropagation();
                            this.props.onEditConfig(node.id)
                        }}
                    />
                );
            case 'delete':
                return (
                    <div
                        className={styles.deleteStyle}
                        onClick={() => this.onDelete(node.id)}
                    >
                        ×
                    </div>
                );
            default:
                return (
                    <DefaultCell
                        content={node[column.name]}
                    />
                );
        }
    };

    filter = (data, columns, searchText) => {
        const searchableColumns = columns.filter(col => col.searchable);
        return data.filter(
            node => searchableColumns.find(column => search(node[column.name], searchText)))
    };

    render() {
        const { data, searchText } = this.props;
        const columns = ConfigsTable.getColumns();
        const filteredData = searchText ? this.filter(data, columns, searchText) : data;

        return (
            <Table
                data={filteredData}
                columns={columns}
                headerRowRender={this.headerRowRender}
                bodyRowRender={this.bodyRowRender}
                preloader={this.props.preloader}
                onSelectRow={this.props.onSelectConfig}
            />
        );
    }
}

export default ConfigsTable;
