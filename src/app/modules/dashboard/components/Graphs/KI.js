import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../../../rest';
import KICount from './KICount';
import KIDuration from './KIDuration';

class KI extends React.Component {
    static propTypes = {
        mrfId: PropTypes.string,
        regularity: PropTypes.string.isRequired,
    };

    state = {
        data: [],
    };

    componentDidMount() {
        this.fetchChartData();
    }
    componentWillUpdate(nextProps) {
        if (this.props.regularity !== nextProps.regularity || this.props.mrfId !== nextProps.mrfId) {
            this.fetchChartData(nextProps);
        }
    }

    fetchChartData(props = this.props) {
        const queryParams = {
            regularity: props.regularity,
            mrf: props.mrfId,
        };

        return rest.get('/api/v1/dashboard/ki', {}, { queryParams })
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    render() {
        return (
            <div style={{ width: '100%' }}>
                <KICount data={this.state.data} />
                <KIDuration data={this.state.data} />
            </div>
        );
    }
}

export default KI;
