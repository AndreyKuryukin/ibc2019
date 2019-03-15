import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './tree-view.scss';
import defaultTheme from './themes/default.scss';
import NodeTree from './NodeTree';
import ColumnResizer from './ColumnResizer';
import Row from './Row';
import rowStyles from './row.scss';

class TreeView extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        columns: PropTypes.arrayOf(PropTypes.shape({
            getTitle: PropTypes.func,
            name: PropTypes.string.isRequired,
            // resizable: PropTypes.bool,
            // sortable: PropTypes.bool,
            // searchable: PropTypes.bool,
            width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            extractor: PropTypes.func,
        })).isRequired,
        theme: PropTypes.string,
        itemRenderer: PropTypes.func,
        cellRenderer: PropTypes.func,
        toggleCollapsed: PropTypes.func,
        checkIsCollapsed: PropTypes.func,
        onItemClick: PropTypes.func,
    };
    static defaultProps = {
        theme: defaultTheme.treeViewThemeDefault,
    };

    renderHeadRow = () => {
        const titles = this.props.columns.map(
            column => {
                if (typeof column.getTitle !== 'function') return null;
                const title = column.getTitle();

                if (typeof title === 'string') return title;
                return title;
            }
        );

        if (titles.every(title => title === null)) return null;

        return (
            <Row
                className={rowStyles.head}
                columns={this.props.columns.map(c => c.name)}
                data={this.props.columns.reduce((data, c, i) => ({
                    ...data,
                    [c.name]: titles[i],
                }), {})}
            />
        );
    };
    renderRow = (itemData) => {
        const collapsed = typeof this.props.checkIsCollapsed === 'function'
            ? this.props.checkIsCollapsed(itemData.id)
            : undefined;
        const onCollapse = this.props.toggleCollapsed;
        if (typeof this.props.itemRenderer === 'function') {
            const item = this.props.itemRenderer(itemData, {
                collapsed,
                onCollapse,
                onClick: this.props.onItemClick,
            });
            if (item !== undefined) return item;
        }

        return (
            <Row
                columns={this.props.columns.map(c => c.name)}
                data={itemData}
                cellRenderer={this.props.cellRenderer}
                collapsed={collapsed}
                onCollapse={onCollapse}
                onClick={this.props.onItemClick}
            />
        );
    };

    render() {
        const treeViewId = `tree-view-${this.props.id}`;

        return (
            <div
                id={this.props.id}
                className={cn(styles.treeView, defaultTheme.treeViewThemeDefault)}
            >
                <ColumnResizer
                    wrapperId={treeViewId}
                    columns={this.props.columns}
                >
                    <NodeTree
                        id={treeViewId}
                        data={this.props.data}
                        headerRenderer={this.renderHeadRow}
                        bodyItemRenderer={this.renderRow}
                    />
                </ColumnResizer>
            </div>
        );
    }
}

export default TreeView;
