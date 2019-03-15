import React from 'react';
import PropTypes from 'prop-types';
import Node from './Node';

const itemPT = PropTypes.shape({
    id: PropTypes.string.isRequired,
});
itemPT.children = PropTypes.arrayOf(itemPT);

class NodeTree extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(itemPT).isRequired,
        headerRenderer: PropTypes.func,
        bodyItemRenderer: PropTypes.func.isRequired,
    };

    renderHead() {
        if (typeof this.props.headerRenderer === 'function') {
            return this.props.headerRenderer();
        }
        return null;
    }
    renderItems(items) {
        if (!Array.isArray(items) || items.length === 0) return null;

        return items.map((item, i) => (
            <Node
                key={item.id}
                content={this.props.bodyItemRenderer(item)}
            >{this.renderItems(item.children)}</Node>
        ));
    }

    render() {
        return (
            <div id={this.props.id}>
                {this.renderHead()}
                {this.renderItems(this.props.data)}
            </div>
        );
    }
}

export default NodeTree;
