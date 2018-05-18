import { FETCH_ACTIVE_USER_SUCCESS, RESET_ACTIVE_USER_SUCCESS } from "../actions/index";

const initialState = {
    userName: '',
    login: '',
    menu: [
        {
            title: 'Роли',
            link: '/roles'
        },
        {
            title: 'Пользователи',
            link: '/users'
        },
        {
            title: 'Политики',
            link: '/policies'
        },
        {
            title: 'KPI/KQI',
            link: '/kqi'
        },
        {
            title: 'Выход',
            link: '/login'
        }
    ]
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ACTIVE_USER_SUCCESS: {
            return action.payload.user
        }
        case RESET_ACTIVE_USER_SUCCESS: {
            return initialState;
        }
        default: {
            return state
        }
    }
};
