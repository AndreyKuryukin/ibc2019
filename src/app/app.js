import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './style.global.scss';
import './images.scss';

import Login from './modules/login/containers';
import Roles from './modules/roles/components';
import rootReducer from './reducers';


class App extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/roles" component={Roles}/>
            </Switch>
        );
    }
}

const store = createStore(rootReducer);

const renderRootComponent = () => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>,
        document.getElementById('container')
    );
};

renderRootComponent();
