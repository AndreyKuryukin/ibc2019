import { connect } from 'react-redux';
import Grid from '../components/RolesListGrid';
import { fetchSubjects } from '../actions/subjects';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onMount: () => {
        fetchSubjects(dispatch);
    },
});

const RolesListGrid = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Grid);

export default RolesListGrid;
