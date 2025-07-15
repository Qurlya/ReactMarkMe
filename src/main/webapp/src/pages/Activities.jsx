import React, { useState, useEffect } from "react";
import {deleteEvent, requestBoss, requestDate} from "../services/Events";
import {useAuth} from "../contexts/AuthContext";
import "../scss/Events.scss"
import classNames from "classnames";


export default function Activities() {
    const [date, setDate] = useState(() => {
        return localStorage.getItem("selectedDate") || new Date().toISOString().split("T")[0];
    });
    const { currentUser } = useAuth();
    const [bosses, setBosses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [targetBoss, setTargetBoss] = useState(null);
    const [formData, setFormData] = useState({
        urlBoss: '',
        noteBoss: '',
        timeBoss: '',
        pvpBoss: false,
        master: currentUser.username,
        nameBoss: targetBoss,
        dateBoss: date,
    });
    const resetForm = () => {
        setFormData({
            urlBoss: '',
            noteBoss: '',
            timeBoss: '',
            pvpBoss: false,
            master: currentUser.username,
            nameBoss: targetBoss,
            dateBoss: date,
        });
    };
    const [error, setError] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [createdBosses, setCreatedBosses] = useState([]);
    const [flagUpdate, setFlagUpdate] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await requestDate(date);

                setBosses(response?.ScheduleBosses || []);
                setCreatedBosses(response?.createdBosses || []);
                console.log(createdBosses);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
                setBosses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [date]);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);
        localStorage.setItem("selectedDate", selectedDate);
        setTargetBoss(null)
        resetForm();
        setFlagUpdate(false)
    };
    const handleSelectBoss = (e) => {
        resetForm();
        setFlagUpdate(false)
        setTargetBoss(e.currentTarget.value);
    };

    const handleWriteBoss = (e) => {
        const { name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }
    const handleSaveBoss = async () => {
        try {
            setLoadingSave(true);
            await requestBoss(
                formData.urlBoss,
                formData.noteBoss,
                formData.timeBoss,
                formData.pvpBoss,
                formData.master,
                targetBoss,
                date
            );

            const updatedResponse = await requestDate(date);
            setCreatedBosses(updatedResponse?.createdBosses || []);

            setError(null);
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            setError(errorMessage);
            console.error("Ошибка сохранения:", errorMessage);
        } finally {
            setLoadingSave(false);
            setFlagUpdate(false)
        }
    };
    const handleDeleteForm = async () => {

        try {
            setLoadingDelete(true);
            await deleteEvent(date, targetBoss);
            const updatedResponse = await requestDate(date);
            setCreatedBosses(updatedResponse?.createdBosses || []);

            resetForm();
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            console.error("<UNK> <UNK> <UNK>:", errorMessage);
        } finally {
            setLoadingDelete(false);
        }
    }

    const clickUpdateBoss = async () => {
        formData.timeBoss = (createdBosses.find(event => event.nameBoss === targetBoss)).timeBoss
        formData.noteBoss = (createdBosses.find(event => event.nameBoss === targetBoss)).noteBoss
        formData.urlBoss = (createdBosses.find(event => event.nameBoss === targetBoss)).urlBoss
        formData.pvpBoss = (createdBosses.find(event => event.nameBoss === targetBoss)).pvpBoss
        setFlagUpdate(true)
    }
    return (
        <div className="activities-container">
            <div>
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                />

            </div>
            {loading ? (
                <p>Загрузка...</p>
            ) : bosses.length > 0 && (
                <ul>
                    {bosses.map((boss, index) => (
                        <li key={index}><button
                            value={boss}
                            onClick={handleSelectBoss}
                            className={classNames("boss_btn_event", {
                                "target": targetBoss === boss,
                                "created": createdBosses.some(event => event.nameBoss === boss),
                                "created_target": createdBosses.some(event => event.nameBoss === boss) && targetBoss === boss,
                            })}
                        >{boss}</button></li>
                    ))}
                </ul>
            )}
            <div>

            </div>
            <div>
                {loadingDelete ? (
                    <p>Удаление...</p>
                ) : (loadingSave ? (
                    <p>Сохранение...</p>
                ) : (
                    targetBoss ? (
                        (!createdBosses.some(event => event.nameBoss === targetBoss)) || flagUpdate ? (
                            <div>
                                <input
                                    type="text"
                                    name="urlBoss"
                                    value={formData.urlBoss}
                                    onChange={handleWriteBoss}
                                    placeholder="Ссылка"
                                />
                                <input
                                    type="text"
                                    name="noteBoss"
                                    value={formData.noteBoss}
                                    onChange={handleWriteBoss}
                                    placeholder="Примечание"
                                />
                                <input
                                    type="text"
                                    name="timeBoss"
                                    value={formData.timeBoss}
                                    onChange={handleWriteBoss}
                                    placeholder="Время босса"
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        name="pvpBoss"
                                        checked={formData.pvpBoss}
                                        onChange={handleWriteBoss}
                                    />
                                    ПВП
                                </label>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    onClick={handleSaveBoss}
                                >
                                    Сохранить
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p>{((createdBosses.find(event => event.nameBoss === targetBoss)).nameBoss)}</p>
                                <p>{((createdBosses.find(event => event.nameBoss === targetBoss)).urlBoss)}</p>
                                <p>{((createdBosses.find(event => event.nameBoss === targetBoss)).noteBoss)}</p>
                                <p>{((createdBosses.find(event => event.nameBoss === targetBoss)).timeBoss)}</p>
                                <button
                                    type="submit"
                                    onClick={clickUpdateBoss}
                                >Изменить
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleDeleteForm}
                                >Удалить
                                </button>
                            </div>
                        )
                    ) : (
                        <div>Босс ещё не выбран</div>
                    )))
                }
            </div>
        </div>
    );
}