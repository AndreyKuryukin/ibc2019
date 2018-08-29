import React from 'react';
import PropTypes from 'prop-types';
import HighlightedText from '../../HighlightedText';

class DefaultCell extends React.PureComponent {
    static propTypes = {
        content: PropTypes.node,
        sortDirection: PropTypes.string,
        highlightedText: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        content: null,
        sortDirection: '',
        highlightedText: '',
        onClick: () => null,
    };

    render() {
        const {
            content,
            onClick,
            sortDirection,
            highlightedText,
        } = this.props;
        return (
            <div onClick={onClick} className="table-cell-content" title={content}>
                {sortDirection && <span>{sortDirection === 'asc' ? '\u2B07' : '\u2B06'}</span>}
                <span className="truncated">
                    {content && highlightedText ? (
                        <HighlightedText
                            text={content}
                            highlightedText={highlightedText}
                        />
                    ) : content}
                </span>
            </div>
        );
    }
}

export default DefaultCell;
