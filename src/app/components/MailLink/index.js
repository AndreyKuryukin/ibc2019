import React from 'react';
import PropTypes from 'prop-types';

import style from './style.scss';

class MailLink extends React.PureComponent {
    static propTypes = {
        href: PropTypes.string,
    };

    static defaultProps = {
        href: '',
    };

    render() {
        const { href, children } = this.props;
        return <a className={style.mailLink} href={`mailto:${href}`}>{children}</a>;
    }
}

export default MailLink;
