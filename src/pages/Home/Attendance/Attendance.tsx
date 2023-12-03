import {
    IonCard,
    IonCardContent,
    IonCol,
    IonContent,
    IonGrid,
    IonItem,
    IonLabel,
    IonPage,
    IonRow,
} from "@ionic/react";
import Header from "../../../components/StudentHeader";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { useEffect, useState } from "react";
import './Attendance.css';

interface AttendanceModel {
    attendance_date: string;
    attendance_type: string;
}

const Attendance = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const username = localStorage.getItem('username');
    const [attendanceData, setAttendanceData] = useState<AttendanceModel[] | null>(null);

    const getFormattedDate = (dateTime: string, displayTime: boolean = false) => {
        if (dateTime) {
            const options: Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: displayTime ? "2-digit" : undefined,
                minute: displayTime ? "2-digit" : undefined,
            };
            return new Date(dateTime).toLocaleDateString("en-AS", options);
        }
        return "Invalid Date";
    };

    const getFormattedTime = (dateTime: string | undefined, displayTime: boolean = false) => {
        if (!dateTime) {
            return "00:00";
        }

        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
        };

        return new Date(dateTime).toLocaleTimeString("en-AS", options);
    };

    useEffect(() => {
        if (username) {
            axios
                .post('https://studentportal.lcsinhs.com/scripts/qr-for-student.php', { username: username })
                .then((response) => {
                    if ('error' in response.data) {
                        console.error('Failed to fetch attendance data:', response.data.error);
                    } else {
                        const attendance: AttendanceModel[] = response.data;
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
                        Object.entries(
                            attendanceData.reduce((acc, attendance, index) => {
                                const formattedDate: string = getFormattedDate(attendance.attendance_date);
                                const timeIn = attendance.attendance_type === 'time_in' ? getFormattedTime(attendance.attendance_date, true) : '-';
                                const timeOut = attendance.attendance_type === 'time_out' ? getFormattedTime(attendance.attendance_date, true) : '-';

                                if (!acc[formattedDate]) {
                                    acc[formattedDate] = { timeIn, timeOut };
                                } else {
                                    acc[formattedDate].timeOut = timeOut;
                                }

                                return acc;
                            }, {} as Record<string, { timeIn: string; timeOut: string }>),
                        ).map(([formattedDate, data], index) => (
                            <IonCard className="cards-disp-log">
                                <IonGrid>
                                    <IonRow className="head-custom-row-spacing">
                                        <IonCol className="custom-row-spacing">
                                            <IonLabel className="head-log">Date</IonLabel>
                                        </IonCol>
                                        <IonCol sizeMd="3" className="custom-row-spacing">
                                            <IonLabel className="head-log">Time In</IonLabel>
                                        </IonCol>
                                        <IonCol sizeMd="3" className="custom-row-spacing">
                                            <IonLabel className="head-log">Time Out</IonLabel>
                                        </IonCol>
                                    </IonRow>

                                    <IonRow key={index}>
                                        <IonCol className="custom-row-spacing">
                                            <IonLabel className="body-log">{formattedDate}</IonLabel>
                                        </IonCol>
                                        <IonCol sizeMd="3" className="custom-row-spacing">
                                            <IonLabel className="body-log">{data.timeIn}</IonLabel>
                                        </IonCol>
                                        <IonCol sizeMd="3" className="custom-row-spacing">
                                            <IonLabel className="body-log">{data.timeOut}</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCard>
                        ))
                    ) : (
                        <IonCard className="cards-disp-log">
                            <IonLabel>No attendance recorded.</IonLabel>
                        </IonCard>
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
                        Object.entries(
                            attendanceData.reduce((acc, attendance) => {
                                const formattedDate: string = getFormattedDate(attendance.attendance_date);
                                const timeIn = attendance.attendance_type === 'time_in' ? getFormattedTime(attendance.attendance_date, true) : '-';
                                const timeOut = attendance.attendance_type === 'time_out' ? getFormattedTime(attendance.attendance_date, true) : '-';

                                if (!acc[formattedDate]) {
                                    acc[formattedDate] = { timeIn, timeOut };
                                } else {
                                    acc[formattedDate].timeOut = timeOut;
                                }

                                return acc;
                            }, {} as Record<string, { timeIn: string; timeOut: string }>),
                        ).map(([formattedDate, data], index) => (
                            <IonCard className="m-cards-disp-log">
                                <IonGrid>
                                    <IonRow className="head-custom-row-spacing">
                                        <IonCol size="6" className="custom-row-spacing">
                                            <IonLabel className="m-head-log">Date</IonLabel>
                                        </IonCol>
                                        <IonCol sizeMd="2" className="custom-row-spacing">
                                            <IonLabel className="m-head-log">Time In</IonLabel>
                                        </IonCol>
                                        <IonCol sizeMd="2" className="custom-row-spacing">
                                            <IonLabel className="m-head-log">Time Out</IonLabel>
                                        </IonCol>
                                    </IonRow>

                                    <IonRow key={index}>
                                        <IonCol size="6" className="custom-row-spacing">
                                            <IonLabel className="m-body-log">{formattedDate}</IonLabel>
                                        </IonCol>
                                        <IonCol className="custom-row-spacing" sizeMd="2">
                                            <IonLabel className="m-body-log">{data.timeIn}</IonLabel>
                                        </IonCol>
                                        <IonCol sizeMd="2" className="custom-row-spacing">
                                            <IonLabel className="m-body-log">{data.timeOut}</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCard>
                        ))
                    ) : (
                        <IonCard className="m-cards-disp-log">
                            <IonLabel>No attendance recorded.</IonLabel>
                        </IonCard>
                    )}
                </IonContent>
            )}
        </IonPage>
    );
};

export { Attendance };
