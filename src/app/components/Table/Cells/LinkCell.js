import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class LinkCell extends React.PureComponent {
    static propTypes = {
        href: PropTypes.string.isRequired,
        content: PropTypes.string,
        onClick: PropTypes.func,
    }

    static defaultProps = {
        onClick: () => null,
    }

    render() {
        const {
            href,
            content,
            onClick,
        } = this.props;

        return (
            <div className="table-cell-content" title={content}>
                <span className="truncated">
                    <Link
                        onClick={onClick}
                        to={href}
                        style={{ color: '#212529', textDecoration: 'underline' }}
                    >{content}</Link>
                </span>
            </div>
        );
    }
}

export default LinkCell;
