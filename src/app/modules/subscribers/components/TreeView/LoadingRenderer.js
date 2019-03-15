import React from 'react';
import PropTypes from 'prop-types';
import LoadingNode from './LoadingNode';

export default class LoadingRenderer extends React.Component {
    static propTypes = {
        data: PropTypes.array,
        isLoading: PropTypes.bool,
        checkIsCellLoading: PropTypes.func,
        itemRenderer: PropTypes.func,
        cellRenderer: PropTypes.func,
    };
    static defaultProps = {
        isLoading: false,
    };

    getLoadingRowData() {
        return {
            id: '__loading__',
            type: '__loading__',
        };
    }
    getData() {
        if (!this.props.isLoading) return this.props.data;
        return [
            ...(this.props.data || []),
            this.getLoadingRowData(),
        ];
    }

    itemRenderer = (node, options) => {
        if (node.type === '__loading__') {
            return <LoadingNode />;
        }
        if (typeof this.props.itemRenderer === 'function') {
            return this.props.itemRenderer(node, options);
        }
    };
    cellRenderer = (value, node, columnKey) => {
        const {checkIsCellLoading} = this.props;
        if (typeof checkIsCellLoading === 'function' && checkIsCellLoading(value, node, columnKey)) {
            return <LoadingNode small />;
        }
        if (typeof this.props.cellRenderer === 'function') {
            return this.props.cellRenderer(value, node, columnKey);
        }
    };

    render() {
        const {children, ...props} = this.props;
        return React.Children.map(children, child => React.cloneElement(child, {
            ...props,
            data: this.getData(),
            itemRenderer: this.itemRenderer,
            cellRenderer: this.cellRenderer,
        }));
    }
}
