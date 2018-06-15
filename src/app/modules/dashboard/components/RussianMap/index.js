import React from 'react';
import PropTypes from 'prop-types';
import MacroMap from './MacroMap/MacroMap';
import MicroMap from './MicroMap/MicroMap';

class RussianMap extends React.PureComponent {
    static propTypes = {
        mrfId: PropTypes.string,
        type: PropTypes.string.isRequired,
        plan: PropTypes.number,
        kqi: PropTypes.objectOf(PropTypes.number).isRequired,
        buildLink: PropTypes.func.isRequired,
    };

    render() {
        const { mrfId, type, plan, kqi, buildLink } = this.props;

        if (mrfId === undefined) {
            return (
                <MacroMap
                    plan={plan}
                    kqi={kqi}
                    padding={0}
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
                padding={0}
            />
        );
    }
}

export default RussianMap;
