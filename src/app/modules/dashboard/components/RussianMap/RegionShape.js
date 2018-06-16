import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import styles from './styles.scss';

class RegionShape extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        href: PropTypes.string,
        isActive: PropTypes.bool,
        onMouseEnter: PropTypes.func.isRequired,
        onMouseLeave: PropTypes.func.isRequired,
    };

    onMouseEnter = () => this.props.onMouseEnter(this.props.id);
    onMouseLeave = () => this.props.onMouseLeave(this.props.id);

    renderPath() {
        return (
            <path
                className={cn({ [styles.active]: this.props.isActive })}
                d={this.props.path}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            />
        );
    }

    render() {
        if (this.props.href === undefined) {
            return this.renderPath();
        }

        return (
            <Link to={this.props.href}>{this.renderPath()}</Link>
        );
    }
}

export default RegionShape;
