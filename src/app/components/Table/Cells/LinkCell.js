import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import HighlightedText from '../../HighlightedText';

class LinkCell extends React.PureComponent {
    static propTypes = {
        href: PropTypes.string.isRequired,
        content: PropTypes.string,
        highlightedText: PropTypes.string,
        onClick: PropTypes.func,
    }

    static defaultProps = {
        onClick: () => null,
        highlightedText: '',
    }

    render() {
        const {
            href,
            content,
            onClick,
            highlightedText,
        } = this.props;

        return (
            <div className="table-cell-content" title={content}>
                <span className="truncated">
                    <Link
                        onClick={onClick}
                        to={href}
                        style={{ color: '#212529', textDecoration: 'underline' }}
                    >
                        {content && highlightedText ? (
                            <HighlightedText
                                text={content}
                                highlightedText={highlightedText}
                            />
                        ) : content}
                    </Link>
                </span>
            </div>
        );
    }
}

export default LinkCell;
