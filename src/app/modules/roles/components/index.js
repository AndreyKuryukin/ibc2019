import React from 'react';
import styles from './styles.scss';
import RolesGrid from '../containers/RolesGrid';
import RoleEditor from '../modules/RoleEditor/containers/RoleEditor';

class Roles extends React.PureComponent {
    render() {
        return (
            <div className={styles.rolesWrapper}>
                <RolesGrid />
                {/*<RoleEditor active roleId={2} />*/}
                <RoleEditor active={false} />
            </div>
        );
    }
}

export default Roles;
