import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import 'react-widgets/dist/css/react-widgets.css';
import './scss/style.scss';

import Login from './modules/login/containers';
import Roles from './modules/roles/containers';
import Users from './modules/users/container';
import Policies from './modules/policies/containers';
import StbLoading from './modules/stb-loading/components';
import KQI from './modules/kqi/containers';
import rootReducer from './reducers';
import PageWrapper from './components/PageWrapper';
import Notification from './components/Notification';

moment.locale('ru');
momentLocalizer();

class App extends React.Component {
    render() {
        return (
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <Route path="/login" component={Login} />
                <Route path="/roles/:action?/:id?" component={Roles} />
                <Route path="/users/:action?/:id?" component={Users} />
                <Route path="/policies/:action?/:id?" component={Policies} />
                <Route path="/stb-loading" component={StbLoading} />
                <Route path="/kqi/:action?" component={KQI}/>
            </div>
        );
    }
}

const store = createStore(rootReducer);

const renderRootComponent = () => {
    ReactDOM.render(
        <Notification>
            <Provider store={store}>
                <BrowserRouter>
                    <PageWrapper>
                        <App/>
                    </PageWrapper>
                </BrowserRouter>
            </Provider>
        </Notification>,
        document.getElementById('app-root')
    );
};

renderRootComponent();
