import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';


import 'bootstrap/dist/css/bootstrap.css';

import Login from './modules/login/containers';
import rootReducer from './reducers';


class App extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route path="/" component={Login}/>
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
