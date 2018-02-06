import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import styles from './style.global.scss';

import Login from './components/Login';


class App extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route path="/" component={Login} />
            </Switch>
        );
    }
}

const renderRootComponent = () => {
    ReactDOM.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
        document.getElementById('container')
    );
};

renderRootComponent();
