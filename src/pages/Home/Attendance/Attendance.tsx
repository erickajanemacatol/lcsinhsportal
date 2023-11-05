import { IonCard, IonCardContent, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonText } from "@ionic/react";
import Header from "../../../components/StudentHeader";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { useEffect, useState } from "react";
import './Attendance.css'
import { checkmark, checkmarkDone } from "ionicons/icons";

interface AttendanceModel {
    map: any;
    attendance_date: string;
    student_lrn: string;
    f_name: string;
    l_name: string;
}

const Attendance = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const username = localStorage.getItem('username');
    const [attendanceData, setAttendanceData] = useState<AttendanceModel | null>(null);

    const getFormattedDate = (dateTime: string) => {
        if (dateTime) {
            const options: Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            };
            const formattedDateTime = new Date(dateTime).toLocaleDateString("en-AS", options);
            return formattedDateTime;
        }
        return "Invalid Date";
    };


    useEffect(() => {
        if (username) {
            axios
                .post('https://studentportal.lcsinhs.com/scripts/qr-for-student.php', { username: username })
                .then((response) => {
                    if ('error' in response.data) {
                        console.error('Failed to fetch attendance data:', response.data.error);
                    } else {
                        const attendance: AttendanceModel = response.data;
                        setAttendanceData(attendance);
                        console.log(attendance);
                    }
                })
                .catch((error) => {
                    console.error('Network error:', error);
                });
        }
    }, [username]);

    return (
        <IonPage>
            <Header />

            {isDesktop ? (
                <IonContent color={'light'} scrollX={false}>
                    <div className="spacer-h-m" />
                    <div className="cal-margin">
                        <IonLabel className="my-att-title">Attendance Log</IonLabel>
                    </div>

                    {attendanceData ? (
                        attendanceData.map((attendance: AttendanceModel, index: any) => (
                            <IonCard className="my-att-card" key={index}>
                                <IonCardContent>
                                    <div className="att-item-size">
                                        <IonItem>
                                            <IonText>
                                                {getFormattedDate(attendance.attendance_date)}
                                            </IonText>

                                            <IonText slot="end" style={{ color: 'green' }}>
                                                Logged
                                            </IonText>
                                        </IonItem>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        ))
                    ) : (
                        <div>
                            <p>No attendance data available.</p>
                        </div>
                    )}

                </IonContent>
            ) : (
                /* MOBILE VIEW */
                <IonContent color={'light'} scrollX={false}>
                    <div className="spacer-h-s" />
                    <div className="cal-margin">
                        <IonLabel className="m-my-att-title">Attendance Log</IonLabel>
                    </div>

                    {attendanceData ? (

                        attendanceData.map((attendance: AttendanceModel, index: any) => (
                            <IonCard className="m-my-att-card">
                                <IonCardContent>
                                    <div className="m-att-item-size" key={index}>
                                        <IonItem>
                                            <IonText className="m-att-label">{getFormattedDate(attendance.attendance_date)}</IonText>
                                            <IonIcon slot="end" icon={checkmarkDone} color="success" />
                                        </IonItem>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        ))


                    ) : (
                        <div>
                            <p>No attendance data available.</p>
                        </div>
                    )}
                </IonContent>
            )}
        </IonPage>
    );
};

export { Attendance };
