import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../../Icon/Icon';

class IconCell extends React.PureComponent {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        iconTitle: PropTypes.string,
        href: PropTypes.string,
        text: PropTypes.string,
        style: PropTypes.object,
        cellStyle: PropTypes.object,
        onIconClick: PropTypes.func,
        onLinkClick: PropTypes.func,
    };

    static defaultProps = {
        href: '',
        text: '',
        style: {},
        iconProps: {},
        cellStyle: {},
        onIconClick: () => null,
        onLinkClick: () => null,
    };

    render() {
        const { icon, iconTitle, href, text, style, cellStyle, iconProps, onIconClick, onLinkClick } = this.props;
        const iconStyle = {
            marginRight: text ? 10 : 0,
            ...style,
        };

        return (
            <div className="table-cell-content" style={cellStyle} title={text}>
                <Icon
                    icon={icon}
                    title={iconTitle}
                    style={iconStyle}
                    onClick={onIconClick}
                    {...iconProps}
                />
                <span className="truncated">
                    {href ? (
                        <Link
                            onClick={onLinkClick}
                            to={href}
                            style={{ color: '#212529', textDecoration: 'underline' }}
                        >{text}</Link>
                    ) : text}
                </span>
            </div>
        );
    }
}

export default IconCell;
