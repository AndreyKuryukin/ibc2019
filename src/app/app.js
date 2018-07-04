import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

import 'react-widgets/dist/css/react-widgets.css';
import './scss/style.scss';

import rootReducer from './reducers';
import Notification from './modules/notifications/containers';
import App from './containers';

moment.locale('ru');
momentLocalizer();

const store = createStore(rootReducer);

const renderRootComponent = () => {
    ReactDOM.render(
        <Provider store={store}>
            <Notification>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </Notification>
        </Provider>,
        document.getElementById('app-root'));
};

renderRootComponent();
