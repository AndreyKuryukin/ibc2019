import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './style.global.scss';
import './images.global.scss';
import './modal.scss';


import Login from './modules/login/containers';
// import Roles from './modules/roles/components';
import rootReducer from './reducers';


class App extends React.PureComponent {
    render() {
        return (
            <div style={{ height: '100%' }}>
                <Route path="/login" component={Login} key="login" />
                <Route path="/roles/:action?/:id?" component={Roles} key="roles" />
            </div>
        );
    }
}

const store = createStore(rootReducer);

const renderRootComponent = () => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>,
        document.getElementById('container')
    );
};

renderRootComponent();
