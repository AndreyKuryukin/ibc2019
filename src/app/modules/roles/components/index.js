import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import RolesGrid from '../containers/RolesGrid';
import RoleEditor from '../modules/RoleEditor/containers/RoleEditor';

class Roles extends React.PureComponent {
    static propTypes = {
        location: PropTypes.object,
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location !== nextProps.location) {
            console.log(nextProps.location);
        }
    }

    render() {
        return (
            <div className={styles.rolesWrapper}>
                <RolesGrid />
                {/*<RoleEditor active={true} roleId={1}/>*/}
                <RoleEditor active={true} />
            </div>
        );
    }
}

export default Roles;
