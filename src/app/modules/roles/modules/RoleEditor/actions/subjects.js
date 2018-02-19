import rest from '../../../../../rest';

export const FETCH_SUBJECTS = 'roles/FETCH_SUBJECTS';
export const FETCH_SUBJECTS_SUCCESS = 'roles/FETCH_SUBJECTS_SUCCESS';
export const FETCH_SUBJECTS_ERROR = 'roles/FETCH_SUBJECTS_ERROR';

const fetchSubjectsSuccess = subjects => ({
    type: FETCH_SUBJECTS_SUCCESS,
    payload: { subjects },
});

export const fetchSubjects = async (dispatch) => {
    dispatch({ type: FETCH_SUBJECTS });

    try {
        const { data: subjects } = await rest.get('/api/v1/subjects');
        dispatch(fetchSubjectsSuccess(subjects));
    } catch (e) {
        console.error('Error during fetching subjects', e);
        dispatch({ type: FETCH_SUBJECTS_ERROR });
    }
};
