import React from 'react';
import PropTypes from 'prop-types';
import classnames from "classnames";
import Icon from '../../../components/Icon/Icon';
import styles from './styles.scss';
import rest from '../../../rest';

const iconStyle = { cursor: 'default', flexShrink: 0 };

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

    fireDownloading = (fileUrl) => {
        const fakeLink = document.createElement('a');
        const e = document.createEvent('MouseEvents');

        fakeLink.setAttribute('download', this.props.text);
        fakeLink.setAttribute('href', fileUrl);

        e.initEvent('click', true, true);
        fakeLink.dispatchEvent(e);
    };

    getReportFile = (href) => {
        if (href) {
            rest.get(href, undefined, undefined, { responseType: 'blob' })
                .then((response) => {
                    const fileUrl = URL.createObjectURL(response.data);
                    if (fileUrl) {
                        this.fireDownloading(fileUrl);
                    }
                    URL.revokeObjectURL(fileUrl);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
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
                    style={iconStyle}
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
