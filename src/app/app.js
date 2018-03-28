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
import PageWrapper from './components/PageWrapper';
import Notification from './components/Notification';
import App from './containers';

moment.locale('ru');
momentLocalizer();

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
