import React from 'react';
import Collapser from './Collapser';
import LoadingRenderer from './LoadingRenderer';
import TreeView from './TreeView';

class CollapsibleTreeView extends React.Component {
    render() {
        const {
            initialCollapsed,
            data,
            isLoading,
            checkIsCellLoading,
            itemRenderer,
            cellRenderer,
            ...props,
        } = this.props;

        return (
            <Collapser initialCollapsed={initialCollapsed}>
                <LoadingRenderer
                    data={data}
                    isLoading={isLoading}
                    checkIsCellLoading={checkIsCellLoading}
                    itemRenderer={itemRenderer}
                    cellRenderer={cellRenderer}
                >
                    <TreeView
                        data={data}
                        itemRenderer={itemRenderer}
                        cellRenderer={cellRenderer}
                        {...props}
                    />
                </LoadingRenderer>
            </Collapser>
        );
    }
}

export default CollapsibleTreeView;
