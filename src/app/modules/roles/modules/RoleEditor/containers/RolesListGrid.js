import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Panel } from 'qreact';
import { fetchSubjectsSuccess } from '../actions';
import rest from '../../../../../rest';
import { selectSubjects } from '../selectors';
import RolesListTable from '../components/RolesListGrid/RolesListTable';
import RolesListControls from '../components/RolesListGrid/RolesListControls';

class Grid extends React.PureComponent {
    static propTypes = {
        subjectsData: PropTypes.array,
        checked: PropTypes.array,
        onCheckRows: PropTypes.func,
        onFetchSubjectsSuccess: PropTypes.func,
    };

    static defaultProps = {
        subjectsData: [],
        checked: [],
        onFetchSubjectsSuccess: () => null,
        onCheckRows: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            isAllChecked: false,
            isLoading: false,
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        rest.get('/api/v1/subjects')
            .then((response) => {
                const subjects = response.data;
                this.props.onFetchSubjectsSuccess(subjects);
                this.setState({ isLoading: false });
            });
    }

    onCheck = (isAllChecked, checkedIds) => {
        if (Array.isArray(checkedIds)) {
            this.props.onCheckRows(checkedIds);
        }

        this.setState({ isAllChecked });
    }

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    }

    onTableDataChange = ({ checked, isAllChecked }) => {
        const checkedIds = checked.map(row => row.id);
        this.onCheck(isAllChecked, checkedIds);
    }

    render() {
        const {
            searchText,
            isAllChecked,
            isLoading,
        } = this.state;
        return (
            <Panel
                noScroll
                vertical
            >
                <RolesListControls
                    isAllChecked={isAllChecked}
                    searchText={searchText}
                    onSearchTextChange={this.onSearchTextChange}
                    onCheckAll={this.onCheck}
                />
                <RolesListTable
                    searchText={searchText}
                    isAllChecked={isAllChecked}
                    preloader={isLoading}
                    checked={this.props.checked}
                    onTableDataChange={this.onTableDataChange}
                    data={this.props.subjectsData}
                />
            </Panel>
        );
    }
}

const mapStateToProps = state => ({
    subjectsData: selectSubjects(state),
});

const mapDispatchToProps = dispatch => ({
    onFetchSubjectsSuccess: subjects => dispatch(fetchSubjectsSuccess(subjects)),
});

const RolesListGrid = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Grid);

export default RolesListGrid;
