import React from 'react';
import PropTypes from 'prop-types';

import Table from './Table';
import Controls from './Controls';
import styles from './styles.scss';
import Configurator from '../modules/Configurator/containers';
import Calculator from '../modules/Calculator/containers';

class KQI extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        kqiData: PropTypes.array,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        isLoading: false,
        onMount: () => null,
    };


    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
        };
    }

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    }

    render() {
        const { params } = this.props.match;
        const isConfiguratorActive = params.action === 'configure';
        const isCalculatorActive = params.action === 'calculate';

        return (
            <div className={styles.kqiWrapper}>
                <Controls onSearchTextChange={this.onSearchTextChange} />
                <Table
                    data={this.props.kqiData}
                    searchText={this.state.searchText}
                    preloader={false}
                />
                {isConfiguratorActive && <Configurator active={isConfiguratorActive} />}
                {isCalculatorActive && <Calculator active={isCalculatorActive} />}
            </div>
        );
    }

}

export default KQI;
