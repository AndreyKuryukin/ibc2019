import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

class Collapser extends React.Component {
    static propTypes = {
        initialCollapsed: PropTypes.bool,
        children: PropTypes.node,
    };
    static defaultProps = {
        initialCollapsed: true,
    };

    state = {
        collapsed: Immutable.Set(),
    };

    toggle = id => this.setState(({collapsed}) => ({
        collapsed: this.state.collapsed.has(id) ? collapsed.delete(id) : collapsed.add(id),
    }));
    isCollapsed = id => Boolean(this.state.collapsed.has(id) ^ this.props.initialCollapsed);

    render() {
        const {children, ...props} = this.props;
        return React.Children.map(children, child => React.cloneElement(child, {
            ...props,
            toggleCollapsed: this.toggle,
            checkIsCollapsed: this.isCollapsed,
        }));
    }
}

export default Collapser;
