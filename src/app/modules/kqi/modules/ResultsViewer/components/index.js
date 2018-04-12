import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import ls from 'i18n';
import { Input } from 'reactstrap';
import DraggableWrapper from '../../../../../components/DraggableWrapper';
import ResultsTable from './ResultsTable';
import styles from './styles.scss';

class ResultsViewer extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
    };

    static defaultProps = {
        active: false,
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

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    render() {
        return (
            <DraggableWrapper>
                <Modal
                    isOpen={this.props.active}
                    className={styles.kqiResultsViewer}
                >
                    <ModalHeader
                        className="handle"
                        toggle={this.props.onClose}
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
                                    data={[]}
                                    searchText={this.state.searchText}
                                    prealoder={false}
                                />
                            </div>
                            <div className={styles.kqiResultsViewerGraphContainer}>
                                {/*Graph component*/}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter />
                </Modal>
            </DraggableWrapper>
        );
    }
}

export default ResultsViewer;
