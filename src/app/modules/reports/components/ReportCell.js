import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../../../components/Icon/Icon';
import styles from './styles.scss';

class ReportCell extends React.PureComponent {
    static propTypes = {
        formatIcon: PropTypes.string.isRequired,
        rebuildIcon: PropTypes.string.isRequired,
        href: PropTypes.string,
        text: PropTypes.string,
        isFormatIconHidden: PropTypes.bool,
        isRebuildIconHidden: PropTypes.bool,
        onRebuildIconClick: PropTypes.func,
        onLinkClick: PropTypes.func,
    };

    static defaultProps = {
        href: '',
        text: '',
        isFormatIconHidden: false,
        isRebuildIconHidden: false,
        onRebuildIconClick: () => null,
        onLinkClick: () => null,
    };

    render() {
        const {
            formatIcon,
            rebuildIcon,
            href,
            text,
            isFormatIconHidden,
            isRebuildIconHidden,
            onRebuildIconClick,
            onLinkClick,
        } = this.props;

        return (
            <div className="table-cell-content" title={text}>
                {!isFormatIconHidden && <Icon
                    icon={formatIcon}
                />}
                <span className={`truncated ${styles.reportText}`}>
                    {href ? (
                        <Link
                            onClick={onLinkClick}
                            to={href}
                            style={{ color: '#212529', textDecoration: 'underline' }}
                        >{text}</Link>
                    ) : text}
                </span>
                {!isRebuildIconHidden && <Icon
                    icon={rebuildIcon}
                    onClick={onRebuildIconClick}
                />}
            </div>
        );
    }
}

export default ReportCell;
