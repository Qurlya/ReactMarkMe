import React, {useEffect, useState} from 'react';
import "../scss/Checkout.scss"
import {getDates} from "../services/Checkout";
export default function Checkout() {
    const [loadingDate, setLoadingDate] = useState(false);
    const [createdDates, setCreatedDates] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            setLoadingDate(true);
            try {
                const response = await getDates();

                setCreatedDates(response?.dates || []); // Используем response.dates

                console.log(response);

            } catch (error) {
                console.error("Ошибка при получении данных:", error);
                setCreatedDates([]);
            } finally {
                setLoadingDate(false);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="body_div-checkout">
            <div className="column_div">Даты</div>
            <div className="column_div">События</div>
            <div className="column_div">Мемберы</div>
            <div className="info_div">Информация</div>
        </div>);
}