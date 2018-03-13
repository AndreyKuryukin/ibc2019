import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../../Icon/Icon';

class IconCell extends React.PureComponent {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        href: PropTypes.string,
        text: PropTypes.string,
        style: PropTypes.object,
        onIconClick: PropTypes.func,
        onLinkClick: PropTypes.func,
    };

    static defaultProps = {
        href: '',
        text: '',
        style: {},
        onIconClick: () => null,
        onLinkClick: () => null,
    };

    render() {
        const { icon, href, text, style, onIconClick, onLinkClick } = this.props;
        const iconStyle = {
            marginRight: text ? 10 : 0,
            ...style,
        };

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <Icon
                    icon={icon}
                    style={iconStyle}
                    onClick={onIconClick}
                />
                {href ? (
                    <Link
                        onClick={onLinkClick}
                        to={href}
                        style={{ color: '#212529', textDecoration: 'underline' }}
                    >{text}</Link>
                ) : text}
            </div>
        );
    }
}

export default IconCell;
