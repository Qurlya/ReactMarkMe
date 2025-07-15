import React, {useEffect, useState, useCallback} from "react";
import {requestDate, requestMark} from "../services/Mymarks";
import "../scss/Mymarks.scss"
import "../scss/Events.scss"
import {useAuth} from "../contexts/AuthContext";
import classNames from "classnames";
import {deleteEvent, requestBoss} from "../services/Events";

export default function Mymarks() {
    const [date, setDate] = useState(() => {
        return localStorage.getItem("selectedDate") || new Date().toISOString().split("T")[0];
    });
    const [datesForWeek, setDatesForWeek] = useState({});
    const { currentUser } = useAuth();
    const [scheduleBosses, setScheduleBosses] = useState({});
    const [loadingDate, setLoadingDate] = useState(true);
    const [flagBosses, setFlagBosses] = useState([]);
    const [targetBoss, setTargetBoss] = useState(null);
    const [targetDate, setTargetDate] = useState(null);
    const [formData, setFormData] = useState({
        urlBoss: '',
        noteBoss: '',
        timeBoss: '',
        pvpBoss: false,
        master: currentUser.username,
        nameBoss: targetBoss,
        dateBoss: targetDate,
    });
    const resetForm = () => {
        setFormData({
            urlBoss: '',
            noteBoss: '',
            timeBoss: '',
            pvpBoss: false,
            master: currentUser.username,
            nameBoss: targetBoss,
            dateBoss: targetDate,
        });
    };
    const [createdBosses, setCreatedBosses] = useState([]);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [flagUpdate, setFlagUpdate] = useState(false);
    const [error, setError] = useState(null);

    const calculateWeekDates = useCallback((baseDate) => {
        const dateObj = new Date(baseDate);
        const isSunday = dateObj.getDay() === 0;
        const mondayOffset = isSunday ? -6 : 1 - dateObj.getDay();

        return {
            monday: new Date(dateObj.setDate(dateObj.getDate() + mondayOffset)).toISOString().split("T")[0],
            tuesday: new Date(dateObj.setDate(dateObj.getDate() + 1)).toISOString().split("T")[0],
            wednesday: new Date(dateObj.setDate(dateObj.getDate() + 1)).toISOString().split("T")[0],
            thursday: new Date(dateObj.setDate(dateObj.getDate() + 1)).toISOString().split("T")[0],
            friday: new Date(dateObj.setDate(dateObj.getDate() + 1)).toISOString().split("T")[0],
            saturday: new Date(dateObj.setDate(dateObj.getDate() + 1)).toISOString().split("T")[0],
            sunday: new Date(dateObj.setDate(dateObj.getDate() + 1)).toISOString().split("T")[0]
        };
    }, []);

    useEffect(() => {
        setDatesForWeek(calculateWeekDates(date));
    }, [date, calculateWeekDates]);

    useEffect(() => {
        if (!Object.keys(datesForWeek).length) return;

        const fetchData = async () => {
            setLoadingDate(true);
            try {
                const response = await requestDate(datesForWeek, currentUser);

                setScheduleBosses(response?.ScheduleBosses || {});
                setFlagBosses(response?.Marks || []);
                setCreatedBosses(response?.createdBosses || [])

                console.log(flagBosses);

            } catch (error) {
                console.error("Ошибка при получении данных:", error);
                setCreatedBosses([]);
            } finally {
                setLoadingDate(false);
            }
        };

        fetchData();
    }, [datesForWeek, currentUser]);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);
        localStorage.setItem("selectedDate", selectedDate);
    };

    const handleBossClick = useCallback(async (dayDate, bossName) => {
        if (!currentUser) return;

        try {
            const existingMarkIndex = flagBosses.findIndex(mark =>
                mark.dateEvent === dayDate && mark.nameEvent === bossName
            );

            const currentStatus = existingMarkIndex >= 0
                ? flagBosses[existingMarkIndex].status
                : null;

            let newStatus;
            if (currentStatus === "confirmed") {
                newStatus = "confirmed";
            } else if (currentStatus === "waiting") {
                newStatus = "white";
            } else {
                newStatus = "waiting";
            }

            setFlagBosses(prev => {
                const updated = prev.filter(mark =>
                    !(mark.dateEvent === dayDate && mark.nameEvent === bossName)
                );

                return newStatus
                    ? [...updated, { dateEvent: dayDate, nameEvent: bossName, status: newStatus }]
                    : updated;
            });

            await requestMark(dayDate, bossName, currentUser);

        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
            setFlagBosses(prev => [...prev]);
        }
    }, [currentUser, flagBosses]);

    const getBossStatus = useCallback((dayDate, bossName) => {
        const mark = flagBosses.find(mark =>
            mark.nameEvent === bossName &&
            mark.dateEvent === dayDate
        );
        return mark?.status;
    }, [flagBosses]);


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
                targetDate
            );

            const updatedResponse = await requestDate(datesForWeek, currentUser);
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
    const handleSelectBoss = (selectedBoss, selectedDate) => {
        resetForm();
        setFlagUpdate(false)
        setTargetBoss(selectedBoss);
        setTargetDate(selectedDate);
    };
    const clickUpdateBoss = async () => {
        formData.timeBoss = (createdBosses.find(event => event.nameBoss === targetBoss)).timeBoss
        formData.noteBoss = (createdBosses.find(event => event.nameBoss === targetBoss)).noteBoss
        formData.urlBoss = (createdBosses.find(event => event.nameBoss === targetBoss)).urlBoss
        formData.pvpBoss = (createdBosses.find(event => event.nameBoss === targetBoss)).pvpBoss
        setFlagUpdate(true)
    }
    const handleDeleteForm = async () => {

        try {
            setLoadingDelete(true);
            await deleteEvent(targetDate, targetBoss);
            const updatedResponse = await requestDate(datesForWeek, currentUser);
            setCreatedBosses(updatedResponse?.createdBosses || []);

            resetForm();
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            console.error("<UNK> <UNK> <UNK>:", errorMessage);
        } finally {
            setLoadingDelete(false);
        }
    }
    return (
        <div className="body_div">
            <div className="date_div">
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    disabled={false}
                />
            </div>
            <div className="sevenBosses_div">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <div key={day} className="oneBosses_div">
                        <p>{datesForWeek[day]}</p>
                        {scheduleBosses[day.toUpperCase()]?.length > 0 && (
                            <ul>
                                {scheduleBosses[day.toUpperCase()].map((item, index) => (
                                    <li key={index}>
                                        <div className="boss_event_div">
                                            <button
                                                value={item}
                                                onClick={() => handleBossClick(datesForWeek[day], item)}
                                                className={classNames("boss_btn", {
                                                    confirmed: getBossStatus(datesForWeek[day], item) === "confirmed",
                                                    waiting: getBossStatus(datesForWeek[day], item) === "waiting"
                                                })}
                                            >
                                                {item}
                                            </button>
                                            <button
                                                value={item}
                                                className={classNames("boss_btn_event", {
                                                    "target": (targetBoss === item && targetDate === datesForWeek[day]),
                                                    "created": createdBosses.some(event => (event.nameBoss === item && event.dateBoss === datesForWeek[day])),
                                                    "created_target": (createdBosses.some(event => event.nameBoss === targetBoss && event.dateBoss === targetDate) && targetBoss === item && targetDate === datesForWeek[day]),
                                                })}
                                                onClick={() => handleSelectBoss(item, datesForWeek[day])}
                                            >{createdBosses.some(event => (event.nameBoss === item && event.dateBoss === datesForWeek[day])) ? "?" : "+"}</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            <div className="info_div">
                {loadingDelete ? (
                    <p>Удаление...</p>
                ) : (loadingSave ? (
                    <p>Сохранение...</p>
                ) : (
                    targetBoss ? (
                        (!createdBosses.some(event => event.nameBoss === targetBoss && event.dateBoss===targetDate)) || flagUpdate ? (
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
                                <p>{((createdBosses.find(event => event.nameBoss === targetBoss && event.dateBoss === targetDate)).nameBoss)}</p>
                                <p>{((createdBosses.find(event => event.nameBoss === targetBoss && event.dateBoss === targetDate)).urlBoss)}</p>
                                <p>{((createdBosses.find(event => event.nameBoss === targetBoss && event.dateBoss === targetDate)).noteBoss)}</p>
                                <p>{((createdBosses.find(event => event.nameBoss === targetBoss && event.dateBoss === targetDate)).timeBoss)}</p>
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