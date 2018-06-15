import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

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
            <ButtonDropdown
                className={this.props.className}
                color="action"
                isOpen={this.state.isOpen}
                toggle={this.toggle}
            >
                <DropdownToggle caret color="action">{this.getCurrentValue()}</DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>
                        <Link to={this.props.buildLink({ mrfId: null })}>{defaultMRFName}</Link>
                    </DropdownItem>
                    <DropdownItem divider />
                    {this.getOptions().map(option => (
                        <DropdownItem key={option.id}>
                            <Link to={option.href}>{option.title}</Link>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}

export default LocationDropdown;
