import React from 'react';
import PropTypes from 'prop-types';
import WidgetWrapper from './WidgetWrapper';
import DynamicKAB from './Graphs/DynamicKAB';
import Drilldown from './Graphs/Drilldown';
import BarchartKAB from './Graphs/BarchartKAB';
import Amount from './Graphs/Amount';
import KI from './Graphs/KI';

class Graph extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
        mrfId: PropTypes.string,
    };

    render() {
        const { regularity, mrfId } = this.props;

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '7fr 3fr',
                gridColumnGap: 30,
                gridRowGap: 30,
            }}>
                <WidgetWrapper style={{
                    gridColumn: '1 / 3',
                }}>
                    <DynamicKAB regularity={regularity} />
                </WidgetWrapper>
                <WidgetWrapper
                    title="KQI МРФ Волга"
                    style={{
                        gridColumn: '1 / 3',
                        height: 400,
                    }}
                >
                    <Drilldown
                        regularity={regularity}
                        mrfId={mrfId}
                    />
                </WidgetWrapper>
                <WidgetWrapper style={{
                    gridColumn: '1 / 2',
                }}>
                    <BarchartKAB
                        regularity={regularity}
                        mrfId={mrfId}
                    />
                </WidgetWrapper>
                <WidgetWrapper style={{
                    gridColumn: '2 / 3',
                }}>
                    <Amount
                        regularity={regularity}
                        mrfId={mrfId}
                    />
                </WidgetWrapper>
                <WidgetWrapper style={{
                    gridColumn: '1 / 2',
                }}>
                    <KI
                        regularity={regularity}
                        mrfId={mrfId}
                    />
                </WidgetWrapper>
            </div>
        );
    }
}

export default Graph;
