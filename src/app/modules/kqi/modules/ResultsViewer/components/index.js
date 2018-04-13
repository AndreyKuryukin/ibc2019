import React from 'react';
import PropTypes from 'prop-types';
import { Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ls from 'i18n';
import DraggableWrapper from '../../../../../components/DraggableWrapper';
import ResultsTable from './ResultsTable';
import styles from './styles.scss';
import Graph from "./Graph";

class ResultsViewer extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        match: PropTypes.object,
        results: PropTypes.array,
        resHistory: PropTypes.object,
        onMount: PropTypes.func,
        fetchHistory: PropTypes.func,
        isLoading: PropTypes.bool
    };

    static defaultProps = {
        active: false,
        match: {},
        results: [],
        resHistory: {},
        onMount: () => null,
        fetchHistory: () => null,
        isLoading: false
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onClose = () => {
        this.context.history.push('/kqi');
    };

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    onCheck = (checked) => {
        this.props.fetchHistory(checked);
    };

    render() {
        const { resHistory, results } = this.props;
        return (
            <DraggableWrapper>
                <Modal
                    isOpen={this.props.active}
                    className={styles.kqiResultsViewer}
                >
                    <ModalHeader
                        className="handle"
                        toggle={this.onClose}
                    >
                        {ls('KQI_RESULTS_VIEWER_TITLE', 'Результаты вычисления KQI')}
                    </ModalHeader>
                    <ModalBody>
                        <div className={styles.kqiResultsViewerContent}>
                            <div className={styles.kqiResultsViewerTableContainer}>
                                <div className={styles.searchBar}>
                                    <Input
                                        placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                                        className={styles.search}
                                        onChange={this.onSearchTextChange}
                                    />
                                </div>
                                <ResultsTable
                                    data={results}
                                    searchText={this.state.searchText}
                                    prealoder={false}
                                    onCheck={this.onCheck}
                                />
                            </div>
                            <div className={styles.kqiResultsViewerGraphContainer}>
                                <Graph data={resHistory}/>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter/>
                </Modal>
            </DraggableWrapper>
        );
    }
}

export default ResultsViewer;
