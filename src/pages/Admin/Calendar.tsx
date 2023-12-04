import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonText, useIonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { addCircle, addOutline, trash } from "ionicons/icons";
import { useMediaQuery } from "react-responsive";
import './Calendar.css';
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";
import { InputChangeEventDetail } from '@ionic/core';

interface EventModel {
    cal_id: string;
    event_name: string;
    description: string;
    start_date: string;
    end_date?: string | null;
}

const Calendar: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });

    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [events, setEvents] = useState<EventModel[]>([]);

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
            .post("https://studentportal.lcsinhs.com/scripts/event-add.php", eventData)
            .then((response) => {
                setEventName('');
                setDescription('');
                setEndDate(null);
                setStartDate('');
                showToast("Event added successfully.", "success");
                console.log("Event added successfully");

                axios.get("https://studentportal.lcsinhs.com/scripts/event-fetch.php")
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

    const handleDeleteEvent = (calId: any) => {
        const confirmed = window.confirm("Are you sure to delete event?")

        if (confirmed) {
            axios
                .post("https://studentportal.lcsinhs.com/scripts/event-delete.php", { cal_id: calId })
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

    const getFormattedMonth = (date: any) => {
        const options = { month: "long", year: "numeric" };
        return date.toLocaleDateString("en-AS", options);
    };

    const getFormattedDate = (date: any) => {
        const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
        return new Date(date).toLocaleDateString("en-AS", options);
    };

    const fetchEvents = () => {
        axios
            .get("https://studentportal.lcsinhs.com/scripts/event-fetch.php")
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
        axios.get("https://studentportal.lcsinhs.com/scripts/event-fetch.php")
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
                    <IonContent color={'light'}>
                        <div className="spacer-h-s"></div>
                        <div className="cal-margin">
                            <IonLabel className="cal">School Calendar</IonLabel>
                        </div>

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

                                    <div className="spacer-w-xs" />
                                    <IonInput type="date" className="custom-date-input" fill="outline" label="Start Date*" required color={'dark'}
                                        value={startDate} onIonChange={(e) => setStartDate(e.detail.value!)} />

                                    <div className="spacer-w-xs" />
                                    <IonInput type="date" className="custom-date-input" fill="outline" label="End Date" color={'dark'}
                                        value={endDate} onIonChange={(e) => setEndDate(e.detail.value || null)} />

                                    <div className="spacer-w-xs" />

                                    {/*Submit Button*/}
                                    <IonButton color={'dark'} fill="clear" type="submit" onClick={handleFormSubmit}>
                                        <IonIcon slot="icon-only" icon={addCircle} size="large" />
                                    </IonButton>
                                </IonCardContent>
                            </IonCard>
                        </div>

                        <div className="display-cal-button">
                            <IonCard className="cal-list">
                                {events.map((event: EventModel, index) => {
                                    const currentDate = new Date(event.start_date);
                                    const prevEventDate = index > 0 ? new Date(events[index - 1].start_date) : null;

                                    return (
                                        <div key={event.cal_id} className="list-mrg">
                                            {index === 0 || (prevEventDate && currentDate.getMonth() !== prevEventDate.getMonth()) ? (
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
                                                <IonButtons>
                                                    <IonButton color="danger" onClick={() => handleDeleteEvent(event.cal_id)}>
                                                        <IonIcon slot="icon-only" icon={trash} />
                                                    </IonButton>
                                                </IonButtons>
                                            </IonItem>
                                        </div>
                                    );
                                })}
                            </IonCard>

                        </div>
                    </IonContent>

                </> : <>
                    {/*MOBILE*/}
                    <IonContent color={'light'}>
                        <div className="spacer-h-xs"></div>

                        <div className="m-upload-cal-button">
                            <IonAccordionGroup>
                                <IonAccordion value="first">
                                    <IonItem slot="header">
                                        <IonLabel>Add Event</IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content">
                                        <IonInput fill="outline"
                                            label="Event Name"
                                            labelPlacement="stacked"
                                            className="m-event-custom-input"
                                            value={eventName}
                                            onIonChange={(e) => setEventName(e.detail.value!)}>
                                        </IonInput>

                                        <div className="spacer-h-xs"></div>
                                        <IonInput fill="outline"
                                            label="Description (Optional)"
                                            labelPlacement="stacked"
                                            className="m-desc-custom-input"
                                            value={description}
                                            onIonChange={(e) => setDescription(e.detail.value!)}>
                                        </IonInput>

                                        <div className="spacer-h-xs"></div>
                                        <IonInput type="date" className="m-custom-date-input" fill="outline" required label="Start Date " labelPlacement="stacked"
                                            value={startDate} onIonChange={(e) => setStartDate(e.detail.value!)} />

                                        <div className="spacer-h-xs"></div>
                                        <IonInput type="date" className="m-custom-date-input" fill="outline" label="End Date (Optional) " labelPlacement="stacked"
                                            value={endDate} onIonChange={(e) => setEndDate(e.detail.value!)} />


                                        {/*Submit Button*/}
                                        <div className="m-add-button-pl">
                                            <IonButton color={'dark'} type="submit" onClick={handleFormSubmit}>
                                                <IonIcon icon={addOutline} slot="start" />
                                                Add
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonAccordion>
                            </IonAccordionGroup>
                        </div>

                        <IonCard className="event-card">
                            <div className="display-cal-button">
                                <IonList>
                                    {events.map((event: EventModel, index) => {
                                        const currentDate = new Date(event.start_date);
                                        const prevEventDate = index > 0 ? new Date(events[index - 1].start_date) : null;

                                        return (
                                            <div key={event.cal_id}>
                                                {index === 0 || (prevEventDate && currentDate.getMonth() !== prevEventDate.getMonth()) ? (
                                                    <h4>{getFormattedMonth(currentDate)}</h4>
                                                ) : null}

                                                <IonItem>
                                                    <IonLabel>
                                                        <h4>{event.event_name}</h4>
                                                        <h5>{event.description}</h5>
                                                        <h5>Start: {getFormattedDate(event.start_date)}</h5>
                                                        {event.end_date ? (
                                                            <h5>End: {getFormattedDate(event.end_date)}</h5>
                                                        ) : null}
                                                    </IonLabel>
                                                    <IonButton slot="end" fill="clear" color="danger" onClick={() => handleDeleteEvent(event.cal_id)}>
                                                        <IonIcon icon={trash}/>
                                                    </IonButton>
                                                </IonItem>
                                            </div>
                                        );
                                    })}
                                </IonList>
                            </div>
                        </IonCard>
                    </IonContent>
                </>
            }
        </IonPage>
    );
};

export { Calendar };


