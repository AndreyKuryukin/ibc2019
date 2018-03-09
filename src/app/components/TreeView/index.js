import React from 'react';
import PropTypes from 'prop-types';

import Table from '../Table';


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

    getColumns = () => ([
        {
            name: 'name',
        }
    ]);

    mapData = (data) => {

    };

    bodyRowRender = (column, node) => {

    };

    render() {
        const { data, headerRowRender } = this.props;
        return <Table
            columns={this.getColumns()}
            data={this.mapData(data)}
            headerRowRender={headerRowRender}
            bodyRowRender={this.bodyRowRender}
        />
    }
}