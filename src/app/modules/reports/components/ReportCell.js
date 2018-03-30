import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../components/Icon/Icon';
import styles from './styles.scss';
import classnames from "classnames";

class ReportCell extends React.PureComponent {
    static propTypes = {
        formatIcon: PropTypes.string,
        href: PropTypes.string,
        iconTitle: PropTypes.string,
        text: PropTypes.string,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        href: '',
        iconTitle: '',
        text: '',
        isFormatIconHidden: false,
        isRebuildIconHidden: false,
        onRebuildIconClick: () => null,
    };

    getReportFile = (url) => {
        const fakeLink = document.createElement('a');
        fakeLink.setAttribute('download', 'url');
        fakeLink.setAttribute('href', url);
        fakeLink.click();
    };

    render() {
        const {
            formatIcon,
            href,
            text,
            iconTitle,
            disabled
        } = this.props;

        const linkProps = {
            style: {
                color: '#212529'
            }
        };
        if (href) {
            linkProps.onClick = () => {
                this.getReportFile(href);
            };
            linkProps.style.textDecoration = 'underline';
        }

        return (
            <div className={classnames("table-cell-content", { [styles.disabledCell]: disabled })} title={text}>
                {formatIcon && <Icon
                    title={iconTitle}
                    icon={formatIcon}
                />}
                <span className={`truncated ${styles.reportText}`}
                      {...linkProps}
                >
                    {text}
                </span>
            </div>
        );
    }
}

export default ReportCell;
