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
    return state;
};
