import React from 'react';

import styles from './styles.scss';
import RolesGrid from '../containers/RolesGrid';

class Roles extends React.PureComponent {
    render() {
        return (
            <div className={styles.rolesWrapper}>
                <RolesGrid />
            </div>
        );
    }
}

export default Roles;
