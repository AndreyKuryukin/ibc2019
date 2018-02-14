import React from 'react';
import styles from './styles.scss';
import RolesGrid from '../containers/RolesGrid';
import RoleEditor from '../modules/RoleEditor/components';

class Roles extends React.PureComponent {
    render() {
        return (
            <div className={styles.rolesWrapper}>
                <RolesGrid />
                <RoleEditor active={true} />
            </div>
        );
    }
}

export default Roles;
