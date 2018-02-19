import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import RolesGrid from '../containers/RolesGrid';
import RoleEditor from '../modules/RoleEditor/containers/RoleEditor';

class Roles extends React.PureComponent {
    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        const { match } = this.props;
        const { params } = match;

        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const roleId = params.id ? Number(params.id) : null;

        return (
            <div className={styles.rolesWrapper}>
                <RolesGrid />
                {isEditorActive && <RoleEditor
                    active={isEditorActive}
                    roleId={roleId}
                />}
            </div>
        );
    }
}

export default Roles;
