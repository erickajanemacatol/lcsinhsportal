import { IonContent, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import React, { useEffect, useState } from "react";
import './fAttendance.css'
import FacultyHeader from "../../components/FacultyHeader";
import { useMediaQuery } from "react-responsive";
import axios from "axios";

const fAttendance: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    const [attendanceData, setAttendanceData] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    useEffect(() => {
        // Fetch attendance data
        axios
            .get('http://localhost/qr-for-faculty.php')
            .then((response) => {
                setAttendanceData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        // Fetch available dates
        axios
            .get('http://localhost/qr-dates-unique.php')
            .then((response) => {
                setAvailableDates(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <IonPage >
            <FacultyHeader />
            {isDesktop ?
                <>
                    <IonContent scrollX={false} color={'light'}>
                        <div className="spacer-h-l"></div>
                        <IonLabel className="my-activity-text">View Attendance</IonLabel>
                        <div>
                            <IonItem color={'light'}>
                                <IonSelect
                                    placeholder="Select Date"
                                    value={selectedDate}
                                    onIonChange={(e) => setSelectedDate(e.detail.value)}
                                >
                                    {availableDates.map((date) => (
                                        <IonSelectOption key={date} value={date}>
                                            {formatDate(date)}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                        </div>


                        {/* Render students with attendance for the selected date */}
                        {selectedDate && (
                            <>
                                <IonItem>
                                    <IonLabel>
                                        <h3>Students with Attendance on {formatDate(selectedDate)}:</h3>
                                    </IonLabel>
                                </IonItem>
                                {attendanceData
                                    .filter((entry) => entry.attendance_date === selectedDate)
                                    .map((entry) => (
                                        <IonItem key={entry.student_lrn} lines="none">
                                            <IonLabel slot="start" className="ion-text-wrap">
                                                <h2 className="ion-text-start">{entry.l_name}, {entry.f_name}</h2>
                                                <p className="ion-text-start">{entry.student_lrn}</p>
                                            </IonLabel>
                                            <IonLabel slot="end" className="ion-text-end">
                                                <p>{entry.attendance_time}</p>
                                            </IonLabel>
                                        </IonItem>

                                    ))}
                            </>
                        )}
                    </IonContent>

                </>
                :
                <>
                    <IonContent scrollX={false} color={'light'}>
                        <div className="spacer-h-l"></div>
                        <IonLabel className="my-activity-text">View Attendance</IonLabel>
                        <div>
                            <IonItem color={'light'}>
                                <IonSelect
                                    placeholder="Select Date"
                                    value={selectedDate}
                                    onIonChange={(e) => setSelectedDate(e.detail.value)}
                                >
                                    {availableDates.map((date) => (
                                        <IonSelectOption key={date} value={date}>
                                            {formatDate(date)}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                        </div>


                        {/* Render students with attendance for the selected date */}
                        {selectedDate && (
                            <>
                                <IonItem>
                                    <IonLabel>
                                        <h3>Students with Attendance on {formatDate(selectedDate)}:</h3>
                                    </IonLabel>
                                </IonItem>
                                {attendanceData
                                    .filter((entry) => entry.attendance_date === selectedDate)
                                    .map((entry) => (
                                        <IonItem key={entry.student_lrn} lines="none">
                                            <IonLabel slot="start" className="ion-text-wrap">
                                                <h2 className="ion-text-start">{entry.l_name}, {entry.f_name}</h2>
                                                <p className="ion-text-start">{entry.student_lrn}</p>
                                            </IonLabel>
                                            <IonLabel slot="end" className="ion-text-end">
                                                <p>{entry.attendance_time}</p>
                                            </IonLabel>
                                        </IonItem>

                                    ))}
                            </>
                        )}
                    </IonContent>
                </>
            }
        </IonPage>
    );
};

export { fAttendance };
