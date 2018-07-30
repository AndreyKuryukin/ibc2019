import React from 'react';
import PropTypes from 'prop-types';
import MacroMap from './MacroMap/MacroMap';
import MicroMap from './MicroMap/MicroMap';
import {MACRO_RF_ID} from '../../constants';

class RussianMap extends React.PureComponent {
    static propTypes = {
        mrfId: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        plan: PropTypes.number,
        kqi: PropTypes.objectOf(PropTypes.number).isRequired,
        buildLink: PropTypes.func.isRequired,
    };

    render() {
        const { mrfId, type, plan, kqi, buildLink } = this.props;

        if (mrfId === MACRO_RF_ID) {
            return (
                <MacroMap
                    plan={plan}
                    kqi={kqi}
                    padding={15}
                    buildLink={buildLink}
                />
            );
        }

        return (
            <MicroMap
                mrfId={mrfId}
                type={type}
                plan={plan}
                kqi={kqi}
                padding={15}
            />
        );
    }
}

export default RussianMap;
