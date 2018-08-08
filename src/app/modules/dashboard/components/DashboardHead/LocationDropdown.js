import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ls from 'i18n';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import styles from './styles.scss';

const defaultMRFName = 'Россия';

class LocationDropdown extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        mrfId: PropTypes.string,
        buildLink: PropTypes.func.isRequired,
    };

    state = {
        isOpen: false,
    };

    toggle = () => this.setState({ isOpen: !this.state.isOpen });

    getCurrentValue() {
        const { mrfId } = this.props;
        if (mrfId === undefined) return defaultMRFName;

        const mrf = this.props.locations.find(location => location.id === mrfId);
        if (mrf === undefined) return defaultMRFName;

        return mrf.name;
    }

    getOptions() {
        return this.props.locations.map(location => ({
            id: location.id,
            title: location.name,
            href: this.props.buildLink({ mrfId: location.id }),
        }));
    }

    render() {
        return (
            <Fragment>
                <label className={styles.locationDropdownLabel}>{`${ls('MRF', 'МРФ')}:`}</label>
                <ButtonDropdown
                    className={this.props.className}
                    color="secondary"
                    isOpen={this.state.isOpen}
                    toggle={this.toggle}
                >
                    <DropdownToggle itemId="dashboard_mrf_button" caret outline color="secondary">{this.getCurrentValue()}</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem className={styles.item}>
                            <Link to={this.props.buildLink({ mrfId: null })}>{defaultMRFName}</Link>
                        </DropdownItem>
                        {this.getOptions().map(option => (
                            <DropdownItem key={option.id} className={styles.item}>
                                <Link to={option.href}>{option.title}</Link>
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </ButtonDropdown>
            </Fragment>
        );
    }
}

export default LocationDropdown;
