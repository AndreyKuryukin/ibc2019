import React from 'react';
import PropTypes from 'prop-types';
import Controls from './Controls';
import Table from './Table';
import styles from './styles.scss';

const data = [
    {
        id: 1,
        service: 'IPTV',
        vendor: 'Производитель услуг 1',
        model: 'STB-300-x',
        swVersion: '1.5.2',
        loadingTime: '06:30:02',
    }, {
        id: 2,
        service: 'OTT',
        vendor: 'Производитель услуг 2',
        model: 'S-800A',
        swVersion: '5.1.7',
        loadingTime: '06:15:38',
    }, {
        id: 3,
        service: 'IPTV',
        vendor: 'Производитель услуг 3',
        model: 'A-117C',
        swVersion: '2.3.7',
        loadingTime: '01:30:15',
    }
];

class StbLoading extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        isLoading: false,
        onMount: () => null,
    };

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onSearchTextChange = (searchText) => {
        console.log(searchText);
    }

    render() {
        return (
            <div className={styles.stbLoadingWrapper}>
                <Controls onSearchTextChange={this.onSearchTextChange} />
                <Table
                    data={data}
                    searchText={''}
                    preloader={false}
                />
            </div>
        );
    }
}

export default StbLoading;
