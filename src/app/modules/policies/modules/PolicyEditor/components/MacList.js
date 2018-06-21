import React from 'react';
import PropTypes from 'prop-types';
import ls from "../../../../../../i18n/index";
import * as _ from "lodash";
import ChipList from "../../../../../components/Chip/ChipList";
import Chip from "../../../../../components/Chip/Chip";

class MacList extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        separator: PropTypes.string,
        onChange: PropTypes.func,
        macs: PropTypes.arrayOf(PropTypes.string)
    };

    static defaultProps = {
        title: '',
        separator: ':',
        onChange: () => null,
        macs: []
    };

    state = {
        mac: ''
    };

    replaceSeparators = string => string.trim().replace(/[~'"!@#$%^&*)|/\\(+=._\-]+/g, this.props.separator);

    replaceExtraCaracters = (string) => {
        return string.replace(new RegExp('[^a-fA-F0-9{separator}]'.replace('{separator}', this.props.separator), 'g'), '');
    };

    makeMac = (macString) => {
        let mac = this.replaceSeparators(macString);
        mac = this.replaceExtraCaracters(mac);
        mac = mac.split(this.props.separator);
        _.remove(mac, _.isEmpty);
        mac = mac.join('');
        mac = mac.slice(0, 12).toUpperCase();
        this.setState({ mac })
    };

    composeDisplayString = (mac = '') => {
        const octets = mac.match(/.{1,2}/g);
        if (octets) {
            return octets.join(this.props.separator)
        }
        return ''
    };

    addMac = (mac = '') => {
        const macs = this.props.macs;
        if (mac.length < 12) {
            this.setState({ error: ls('INCORRECT_MAC', 'Некорректный мак-адрес') })
        } else if (macs.findIndex(m => mac === m) !== -1) {
            this.setState({ error:  ls('DUPLICATE_MAC', 'Мак-адрес уже добавлен') });
        } else {
            this.setState({ error: null, mac: '' });
            this.props.onChange([...macs, mac])
        }
    };

    onRemove = (mac) => {
        this.props.onChange(_.without(this.props.macs, mac))
    };

    render() {
        return <ChipList
            id="policy-mac-addresses"
            onChange={this.makeMac}
            onAdd={this.addMac}
            formatValue={this.composeDisplayString}
            valid={!this.state.error}
            error={this.state.error}
            value={this.state.mac}
            placeholder={ls('POLICY_MAC_ADDRESSES_PLACEHOLDER', 'MAC-адрес')}
        >
            {this.props.macs.map(mac => <Chip title={this.composeDisplayString(mac)}
                                              key={mac}
                                              onRemove={() => this.onRemove(mac)}/>)}
        </ChipList>
    }
}

export default MacList;
