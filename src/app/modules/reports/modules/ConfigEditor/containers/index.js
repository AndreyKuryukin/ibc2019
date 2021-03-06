import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import ConfigEditorComponent from '../components';
import { fetchTemplatesSuccess, fetchUsersSuccess } from '../actions';
import rest from '../../../../../rest';
import { handleErrors, validateForm } from '../../../../../util/validation';
import { convertDateToUTC0 } from '../../../../../util/date';
import ls from "i18n";

class ConfigEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        active: PropTypes.bool,
        users: PropTypes.array,
        onSubmitConfig: PropTypes.func,
        onFetchUsersSuccess: PropTypes.func,
        onFetchTemplatesSuccess: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        users: [],
        onSubmitConfig: () => null,
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

    errorConfig = {
        NAME_EXISTS: {
            severity: 'CRITICAL',
            path: 'name',
            title: ls('REPORT_ERROR_NAME_EXISTS', 'Отчет с таким именем уже существует')
        }
    };

    onMount = () => {
        this.context.pageBlur && this.context.pageBlur(true);
        this.setState({ isLoading: true });
        Promise.all([rest.get('/api/v1/user'), rest.get('/api/v1/report/config/templateTypes'), this.fetchLocations()])
            .then(([userResponse, templatesResponse, locationsResp]) => {
                const users = userResponse.data;
                const templates = templatesResponse.data;
                const locations = locationsResp.data;
                this.setState({ isLoading: false, locations }, () => {
                    this.props.onFetchUsersSuccess(users);
                    this.props.onFetchTemplatesSuccess(templates);
                });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    fetchLocations = () => rest.get('/api/v1/common/location');

    onSubmit = (conf) => {
        const config = {
            ...conf,
            period: {
                ...conf.period,
                start_date: convertDateToUTC0(conf.period.start_date).toISOString(),
                end_date: convertDateToUTC0(conf.period.end_date).toISOString(),
            },
        };
        const errors = validateForm(config, this.validationConfig);

        if (_.isEmpty(errors)) {
            this.setState({ isLoading: true, errors });

            rest.post('/api/v1/report/config', config)
                .then(() => {
                    this.setState({ isLoading: false });
                    this.context.history.push('/reports');
                    this.props.onSubmitConfig();
                })
                .catch((e) => {
                    const errorData = e.data;
                    const beErrors = handleErrors(this.errorConfig, [errorData]);
                    this.setState({ isLoading: false, errors: beErrors });
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
                locations={this.state.locations}
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigEditor);