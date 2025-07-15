import axios from 'axios';

export const getDates = async () => {
    try {
        const response = await axios.get('/api/public/checkout/getDates');
        return response.data;
    } catch (error) {
        console.error('Error fetching dates:', error);
        throw error;
    }
}