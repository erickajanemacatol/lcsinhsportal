import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonDatetime, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonText, useIonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { add, addCircle, create, trash } from "ionicons/icons";
import { useMediaQuery } from "react-responsive";
import './Calendar.css';
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";

const Calendar: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });

    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState("");
    const [events, setEvents] = useState([]);

    const [presentToast, dismissToast] = useIonToast();
    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const handleFormSubmit = () => {

        if (!eventName || !startDate) {
            setError("Please fill in both fields");
            showToast("Event Name and Start Date cannot be empty.", "danger");
            return;
        } else {
            setError("");
        }

        const eventData = {
            eventName,
            description,
            startDate,
            endDate,
        };

        console.log(eventData);

        axios
            .post("http://localhost/event-add.php", eventData)
            .then((response) => {
                setEventName('');
                setDescription('');
                setEndDate(null);
                setStartDate('');
                showToast("Event added successfully.", "success");
                console.log("Event added successfully");

                axios.get("http://localhost/event-fetch.php")
                    .then((response) => {
                        setEvents(response.data);
                    })
                    .catch((error) => {
                        console.error("Error fetching events:", error);
                    });
            })
            .catch((error) => {
                console.error("Error adding event:", error);
            });
    };

    const handleDeleteEvent = (calId) => {
        const confirmed = window.confirm("Are you sure to delete event?")

        if (confirmed) {
            axios
                .post("http://localhost/event-delete.php", { cal_id: calId })
                .then((response) => {
                    showToast("Event deleted successfully.", "success");
                    // Fetch the updated list of events
                    fetchEvents();
                })
                .catch((error) => {
                    console.error("Error deleting event:", error);
                });
        }
    };

    const getFormattedMonth = (date) => {
        const options = { month: "long", year: "numeric" };
        return date.toLocaleDateString("en-AS", options);
    };

    const getFormattedDate = (date) => {
        const options = { month: "long", day: "numeric", year: "numeric" };
        return new Date(date).toLocaleDateString("en-AS", options);
    };

    const fetchEvents = () => {
        axios
            .get("http://localhost/event-fetch.php")
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        axios.get("http://localhost/event-fetch.php")
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    }, []);

    return (
        <IonPage>
            <AdminHeader />
            {isDesktop ?
                <>
                    <IonContent>

                        <div className="spacer-h-l"></div>
                        <IonLabel className="annc-title">School Calendar</IonLabel>
                        <div className="spacer-h-xs"></div>

                        <div className="upload-cal-button">
                            <IonCard className="event-card">
                                <IonCardContent className="upload-cal-button">
                                    <IonInput fill="outline"
                                        label="Event Name"
                                        labelPlacement="stacked"
                                        className="event-custom-input"
                                        value={eventName}
                                        onIonChange={(e) => setEventName(e.detail.value!)}>
                                    </IonInput>

                                    <IonInput fill="outline"
                                        label="Description (Optional)"
                                        labelPlacement="stacked"
                                        className="desc-custom-input"
                                        value={description}
                                        onIonChange={(e) => setDescription(e.detail.value!)}>
                                    </IonInput>

                                    <IonLabel slot="start">Start Date</IonLabel>
                                    <div className="spacer-w-xs" />
                                    <IonInput type="date" className="custom-date-input"
                                        value={startDate} onIonChange={(e) => setStartDate(e.detail.value!)} />


                                    <IonLabel slot="start">End Date</IonLabel>
                                    <div className="spacer-w-xs" />
                                    <IonInput type="date" className="custom-date-input"
                                        value={endDate} onIonChange={(e) => setEndDate(e.detail.value!)} />

                                    <div className="spacer-w-xs" />

                                    {/*Submit Button*/}
                                    <IonButton color={'dark'} fill="clear" type="submit" onClick={handleFormSubmit}>
                                        <IonIcon slot="icon-only" icon={addCircle} size="large" />
                                    </IonButton>
                                </IonCardContent>
                            </IonCard>
                        </div>

                        <div className="display-cal-button">
                            <IonList>
                                {events.map((event, index) => {
                                    const currentDate = new Date(event.start_date);
                                    const prevEventDate = index > 0 ? new Date(events[index - 1].start_date) : null;

                                    return (
                                        <div key={event.cal_id}>
                                            {index === 0 || currentDate.getMonth() !== prevEventDate.getMonth() ? (
                                                <h3 className="month-year">{getFormattedMonth(currentDate)}</h3>
                                            ) : null}

                                            <IonItem>
                                                <IonLabel>
                                                    <h2>{event.event_name}</h2>
                                                    <p>{event.description}</p>
                                                    <p>Start Date: {getFormattedDate(event.start_date)}</p>
                                                    {event.end_date ? (
                                                        <p>End Date: {getFormattedDate(event.end_date)}</p>
                                                    ) : null}
                                                </IonLabel>
                                                <IonButton fill="clear" color="danger" onClick={() => handleDeleteEvent(event.cal_id)}>
                                                    Delete
                                                </IonButton>
                                            </IonItem>
                                        </div>
                                    );
                                })}
                            </IonList>
                        </div>



                    </IonContent>

                </> : <>
                    {/*MOBILE*/}
                    <IonContent>
                        <div className="spacer-h-l"></div>
                        <IonLabel className="annc-title">Announcements</IonLabel>
                        <div className="spacer-h-xs"></div>

                        <div className="create-button">
                            <IonButton size="default" href="/admin/announcement-details">
                                <IonIcon icon={add} />
                                Create
                            </IonButton>
                        </div>

                        <div className="spacer-h-m"></div>


                        <IonCard >
                            <IonCardHeader className="header-disp">
                                <div className="header-disp">
                                    <div className="title-poss">
                                        <IonText className="title-format"></IonText>
                                        <div className="spacer-w-xl" />
                                        {/*(announcement.dateandtime)*/}
                                    </div>
                                    <div className="m-button-pos">
                                        <IonButtons>
                                            <IonButton color="primary">
                                                <IonIcon icon={create} />
                                            </IonButton>
                                            <IonButton color="danger" >
                                                <IonIcon icon={trash} />
                                            </IonButton>
                                        </IonButtons>
                                    </div>

                                </div>

                            </IonCardHeader>

                            <IonCardContent>
                                <IonText color={'dark'}>Description: </IonText>
                            </IonCardContent>

                        </IonCard>
                    </IonContent>
                </>
            }
        </IonPage>
    );
};

export { Calendar };


