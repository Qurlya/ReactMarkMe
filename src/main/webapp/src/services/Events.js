import axios from 'axios';

export const requestDate = async (date) => {
    const response = await axios.post('/api/public/selectedDate',
        {
            date: date
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
export const requestBoss = async (urlBoss, noteBoss, timeBoss, pvpBoss, master, nameBoss, dateBoss) => {
    const response = await axios.post('api/public/saveBoss',
        {
            urlBoss: urlBoss,
            noteBoss: noteBoss,
            timeBoss: timeBoss,
            pvpBoss: pvpBoss,
            masterBoss: master,
            nameBoss: nameBoss,
            dateBoss: dateBoss,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
    return response.data;
}
export const deleteEvent = async (dateBoss, nameBoss) => {
    const response = await axios.delete("/api/public/deleteBoss", {
        data: {  // Теперь параметры правильно вложены
            nameBoss: nameBoss,
            dateBoss: dateBoss
        },
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });
    return response.data;
}
export const updateEvent = async (urlBoss, noteBoss, timeBoss, pvpBoss, master, nameBoss, dateBoss) => {
    const response = await axios.post('/api/public/updateBoss',
        {
            urlBoss: urlBoss,
            noteBoss: noteBoss,
            timeBoss: timeBoss,
            pvpBoss: pvpBoss,
            masterBoss: master,
            nameBoss: nameBoss,
            dateBoss: dateBoss,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
    return response.data;

}