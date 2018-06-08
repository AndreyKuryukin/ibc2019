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

    getReportFile = (href) => {
        const fakeLink = document.createElement('a');
        const url = href;
        fakeLink.setAttribute('download', url);
        fakeLink.setAttribute('href', url);
        const e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        fakeLink.dispatchEvent(e);
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
            linkProps.style.cursor = 'pointer';
        }

        return (
            <div className={classnames("table-cell-content", { [styles.disabledCell]: disabled })} title={text}>
                {formatIcon && <Icon
                    title={iconTitle}
                    icon={formatIcon}
                    style={{cursor: 'default'}}
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
