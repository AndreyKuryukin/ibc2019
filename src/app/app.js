import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './scss/style.scss';

import Login from './modules/login/containers';
import Roles from './modules/roles/containers';
import Users from './modules/users/container';
import Policies from './modules/policies/containers';
import rootReducer from './reducers';
import PageWrapper from "./components/PageWrapper/index";


class App extends React.Component {
    render() {
        return (
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <Route path="/login" render={props => {props.location.title = 'Логин'; return <Login {...props}/>}} />
                <Route path="/roles/:action?/:id?" component={Roles} />
                <Route path="/users/:action?/:id?" component={Users} />
                <Route path="/policies/:action?/:id?" component={Policies} />
            </div>
        );
    }
}

const store = createStore(rootReducer);

const renderRootComponent = () => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <PageWrapper>
                   <App />
                </PageWrapper>
            </BrowserRouter>
        </Provider>,
        document.getElementById('app-root')
    );
};

renderRootComponent();
