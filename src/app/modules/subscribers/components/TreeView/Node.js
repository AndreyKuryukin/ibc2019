import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './tree-view.scss';

class Node extends React.Component {
    static propTypes = {
        content: PropTypes.node.isRequired,
        children: PropTypes.node,
    };

    render() {
        const {
            content,
            children,
        } = this.props;

        const finalChildren = content.props.children || children;

        return (
            <div className={cn(styles.treeViewNode)}>
                {React.cloneElement(content, {
                    children: finalChildren,
                })}
            </div>
        );
    }
}

export default Node;
