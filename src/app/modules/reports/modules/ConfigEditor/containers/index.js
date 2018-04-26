import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import ConfigEditorComponent from '../components';
import { fetchUsersSuccess, fetchTemplatesSuccess } from '../actions';
import rest from '../../../../../rest';
import { validateForm } from '../../../../../util/validation';

class ConfigEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        active: PropTypes.bool,
        users: PropTypes.array,
        onFetchUsersSuccess: PropTypes.func,
        onFetchTemplatesSuccess: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        users: [],
        onFetchUsersSuccess: () => null,
        onFetchTemplatesSuccess: () => null,
    };

    state = {
        errors: null,
    };

    validationConfig = {
        name: {
            required: true,
        },
        template_id: {
            required: true,
        },
        type: {
            required: true,
        },
        mrf: {
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
        this.context.pageBlur && this.context.pageBlur(true);
        this.setState({ isLoading: true });
        Promise.all([rest.get('/api/v1/user'), rest.get('/api/v1/report/config/templateTypes')])
            .then(([userResponse, templatesResponse]) => {
                const users = userResponse.data;
                const templates = templatesResponse.data;
                this.props.onFetchUsersSuccess(users);
                this.props.onFetchTemplatesSuccess(templates);
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    }

    onSubmit = (config) => {
        const errors = validateForm(config, this.validationConfig);

        if (_.isEmpty(errors)) {
            this.setState({ isLoading: true, errors });

            rest.post('/api/v1/report/config', config)
                .then(() => {
                    this.setState({ isLoading: false });
                    this.context.history.push('/reports');
                })
                .catch((e) => {
                    console.error(e);
                    this.setState({ isLoading: false});
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
                templates={this.props.templates}
                onMount={this.onMount}
                onSubmit={this.onSubmit}
                errors={this.state.errors}
            />
        )
    }
}

const mapStateToProps = state => ({
    users: state.reports.editor.users,
    templates: state.reports.editor.templates,
});

const mapDispatchToProps = dispatch => ({
    onFetchUsersSuccess: users => dispatch(fetchUsersSuccess(users)),
    onFetchTemplatesSuccess: users => dispatch(fetchTemplatesSuccess(users)),
    onSubmitConfigSuccess: config => null,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigEditor);