import { connect } from 'react-redux';
import RoleEditor from '../components';
import { selectSelectedRole, selectSourceOptions, selectSubjectsByRole } from '../selectors';
import { submitRole } from '../../../actions';
import { fetchRole } from '../actions';

const mapStateToProps = state => ({
    role: selectSelectedRole(state),
    sourceOptions: selectSourceOptions(state),
    subjectsByRole: selectSubjectsByRole(state),
});
const mapDispatchToProps = (dispatch, props) => ({
    onMount: () => {
        if (props.roleId) {
            fetchRole(dispatch, props.roleId);
        }
    },
    onSubmit: (roleId, role) => {
        submitRole(dispatch, roleId, role);
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RoleEditor);
