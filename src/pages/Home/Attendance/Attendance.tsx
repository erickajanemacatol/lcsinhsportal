import { IonCard, IonCardContent, IonContent, IonItem, IonLabel, IonPage } from "@ionic/react";
import Header from "../../../components/StudentHeader";
import './Attendance.css'
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { useEffect, useState } from "react";

const Attendance = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 })
    const username = localStorage.getItem('username');
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        if (username) {
            axios
                .post('http://localhost/qr-for-student.php', { username: username })
                .then((response) => {
                    console.log(response);
                    console.log(username);
                    if (response.data && !response.data.error) {
                        setAttendanceData(response.data);
                    } else {
                        console.error('Failed to fetch attendance data');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [username]);

    return (

        <IonPage>
            <Header />

            {isDesktop ? <>
                <IonContent color={'light'} scrollX={false}>
                    <div className="spacer-h-m" />
                    <div className="display-flex">
                        <IonLabel className="my-att-title">My Classes </IonLabel>
                    </div>

                    <IonCard className="my-grades-card">
                        <IonCardContent>
                            <IonItem>
                                <IonItem>
                                    {attendanceData && !attendanceData.error && attendanceData.attendance_date ? (
                                        <div>
                                            <h2>Attendance Data</h2>
                                            <ul>
                                                <li>{attendanceData.attendance_date} {attendanceData.attendance_time}</li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <div>
                                            <p>No attendance data available.</p>
                                        </div>
                                    )}
                                </IonItem>

                            </IonItem>
                        </IonCardContent>
                    </IonCard>
                </IonContent>
            </>
                :

                /*MOBILE VIEW*/
                <>
                    <IonContent color={'light'} scrollX={false}>
                        <div className="spacer-h-s" />
                        <div className="display-flex">
                            <IonLabel className="m-my-att-title">My Classes </IonLabel>
                        </div>
                    </IonContent>
                </>

            }
        </IonPage>
    );
};

export { Attendance };