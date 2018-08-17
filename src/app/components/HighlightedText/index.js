import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class HighlightedText extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
        highlightedText: PropTypes.string,
    };

    static defaultProps = {
        highlightedText: '',
    };

    split = (text, needle) => {
        const result = [];
        let rest = text;
        let index = text.indexOf(needle);
        let key = 0;

        if (index !== -1) {
            while (index !== -1) {
                const chunk = rest.substr(0, index);
                const matched = rest.substr(index, needle.length);
                rest = rest.substr(index + needle.length);
                index = rest.indexOf(needle);

                result.push(chunk);
                result.push(
                    <span
                        key={key}
                        className={styles.highlightedText}
                    >{matched}</span>
                );
                key += 1;
            }
        }

        result.push(rest);

        return result;
    }

    render() {
        const { text, highlightedText } = this.props;

        return highlightedText ? this.split(text, highlightedText) : text;
    }
}

export default HighlightedText;