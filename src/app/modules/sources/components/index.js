import React from 'react';
import PropTypes from 'prop-types';

import Table from './Table';
import Controls from './Controls';

import styles from './styles.scss';

class Sources extends React.Component {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        sources: PropTypes.array,
        isLoading: PropTypes.bool,
        onRefresh: PropTypes.func

    };

    static defaultProps = {
        sources: [],
        isLoading: false,
        onRefresh: () => null
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    render() {
        const {
            searchText,
        } = this.state;
        const {  sources, onRefresh, isLoading } = this.props;
        return (
            <div className={styles.sourcesWrapper}>
                <Controls
                    searchText={searchText}
                    onSearchTextChange={this.onSearchTextChange}
                    onRefresh={onRefresh}
                />
                <Table
                    searchText={searchText}
                    preloader={isLoading}
                    data={sources}
                />
            </div>

        );
    }
}

export default Sources;
