import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GridComponent from '../components/RolesListGrid';
import { fetchSubjectsSuccess } from '../actions';
import rest from '../../../../../rest';

class Grid extends React.PureComponent {
    static propTypes = {
        onFetchSubjectsSuccess: PropTypes.func,
        checked: PropTypes.array,
        onCheckRows: PropTypes.func,
    };

    static defaultProps = {
        checked: null,
        onFetchSubjectsSuccess: () => null,
        onCheckRows: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    onChildMount = () => {
        this.setState({ isLoading: true });
        rest.get('/api/v1/subjects')
            .then((response) => {
                const subjects = response.data;
                this.props.onFetchSubjectsSuccess(subjects);
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <GridComponent
                isLoading={this.state.isLoading}
                onCheckRows={this.props.onCheckRows}
                checked={this.props.checked}
                onMount={this.onChildMount}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onFetchSubjectsSuccess: subjects => dispatch(fetchSubjectsSuccess(subjects)),
});

const RolesListGrid = connect(
    null,
    mapDispatchToProps,
)(Grid);

export default RolesListGrid;
