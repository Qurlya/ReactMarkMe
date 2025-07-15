import axios from 'axios';

export const requestDate = async (date, user) => {
    const response = await axios.post('/api/public/mymarks/selectedDate',
        {
            dates: date,
            id: user?.id
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    );
    return response.data;
}

export const requestMark = async (dateEvent, nameEvent, user) => {
    const response = await axios.post('/api/public/mymarks/changeStatus',
        {
            dateEvent: dateEvent,
            nameEvent: nameEvent,
            id: user?.id,
            user: user.username
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
    return response.data;
}