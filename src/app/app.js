import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './style.global.scss';
import './images.global.scss';
import './modal.scss';

import Login from './modules/login/containers';
import Roles from './modules/roles/containers';
import rootReducer from './reducers';
import PageWrapper from "./components/PageWrapper/index";


class App extends React.Component {
    render() {
        return (
            <div style={{ height: '100%' }}>
                <Route path="/login" render={props => {props.location.title = 'Логин'; return <Login {...props}/>}} />
                <Route path="/pw" component={PageWrapper} />
                <Route path="/roles/" component={Roles} exact/>
                <Route path="/roles/:action?" component={Roles} exact />
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
