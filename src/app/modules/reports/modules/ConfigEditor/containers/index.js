import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import ConfigEditorComponent from '../components';
import { fetchUsersSuccess } from '../actions';
import rest from '../../../../../rest';
import { validateForm } from '../../../../../util/validation';

class ConfigEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        users: PropTypes.array,
        onFetchUsersSuccess: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        users: [],
        onFetchUsersSuccess: () => null,
    };

    state = {
        errors: null,
    };

    validationConfig = {
        config_name: {
            required: true,
        },
        template_id: {
            required: true,
        },
        type: {
            required: true,
        },
        period: () => ({
            start_date: {
                required: true,
            },
            end_date: {
                required: true,
            },
        }),
    };

    onMount = () => {
        this.setState({ isLoading: true });

        rest.get('/api/v1/user')
            .then((response) => {
                const users = response.data;

                this.props.onFetchUsersSuccess(users);
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    onSubmit = (config) => {
        const errors = validateForm(config, this.validationConfig);
        if (_.isEmpty(errors)) {
            this.setState({ isLoading: true });

            rest.post('/api/v1/reports/configs', config)
                .then((response) => {
                    const newConfig = response.data;
                    console.log(newConfig);

                    this.setState({ isLoading: false });
                    this.context.history.push('/reports');
                })
                .catch((e) => {
                    console.error(e);
                    this.setState({ isLoading: false });
                });
        } else {
            this.setState({ errors });
        }
    };

    render() {
        return (
            <ConfigEditorComponent
                active={this.props.active}
                users={this.props.users}
                onMount={this.onMount}
                onSubmit={this.onSubmit}
                errors={this.state.errors}
            />
        )
    }
}

const mapStateToProps = state => ({
    users: state.reports.editor.users,
});

const mapDispatchToProps = dispatch => ({
    onFetchUsersSuccess: users => dispatch(fetchUsersSuccess(users)),
    onSubmitConfigSuccess: config => null,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigEditor);