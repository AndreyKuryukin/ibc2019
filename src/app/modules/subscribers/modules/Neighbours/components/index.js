import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import Widget from '../../../components/Widget';
import NeighboursGrid from './NeighboursGrid';
import Graph from './Graph';
import AccDevice from './AccDevice';

const graphStyle = { marginTop: 20 };

class Neighbours extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array.isRequired,
        accDevice: PropTypes.object.isRequired,
        isLoading: PropTypes.bool.isRequired,
    };

    render() {
        const { accDevice } = this.props;

        return (
            <Fragment>
                <Widget
                    title={ls('SUBSCRIBERS_NEIGHBOURS_WIDGET_TITLE', 'Соседние порты по оборудованию доступа')}
                >
                    <AccDevice
                        accDevice={accDevice}
                    />
                    <NeighboursGrid
                        data={this.props.data}
                        isLoading={this.props.isLoading}
                    />
                </Widget>
                <Graph
                    data={accDevice.id ? [{
                        id: `${ls('SUBSCRIBERS_ACC_DEVICE_TITLE', 'Оборудование доступа')} ${accDevice.id ? '(' + accDevice.id + ')' : ''}`,
                        value: accDevice.value,
                        main: true,
                    }].concat(this.props.data) : this.props.data}
                    style={graphStyle}
                    isLoading={this.props.isLoading}
                />
            </Fragment>
        );
    }
}

export default Neighbours;
