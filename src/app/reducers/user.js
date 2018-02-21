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
            title: 'Статистика',
            link: '/users'
        },
        {
            title: 'Отчеты',
            link: '/users'
        },
        {
            title: 'Ещё что-то',
            link: '/users'
        }
    ]
};

export default (state = initialState, action) => {
    return state;
};
