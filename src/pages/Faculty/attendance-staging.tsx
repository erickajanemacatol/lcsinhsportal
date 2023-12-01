import { IonCard, IonContent, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import React, { useEffect, useState } from "react";
import './fAttendance.css'
import FacultyHeader from "../../components/FacultyHeader";
import { useMediaQuery } from "react-responsive";
import axios from "axios";

interface AttendanceModel {
    attendance_date: string;
    student_lrn: string;
    f_name: string;
    l_name: string;
    grade_level: number;
}

interface FacultyData {
    employee_no: number | null;
    title: string;
    fname: string;
    lname: string;
}

interface ClassHandled {
    class_code: string;
    class_display: string;
}

const fAttendance: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    const [attendanceData, setAttendanceData] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [classesHandled, setClassesHandled] = useState<ClassHandled[]>([]);
    const [selectedClassCode, setSelectedClassCode] = useState<string | undefined>();

    const [userData, setUserData] = useState<FacultyData>({
        employee_no: null,
        title: '',
        fname: '',
        lname: '',
    });

    const username = localStorage.getItem('username') || ''; // Use an empty string as the fallback if null

    function formatDate(dateString: any) {
        const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-AS", options);
    }

    useEffect(() => {
        // Fetch classes handled by the faculty and set the state.
        axios.get(`https://studentportal.lcsinhs.com/scripts/qr-for-faculty.php?facultyEmployeeNo=${username}`)
            .then((response) => {
                const data = response.data;
                setClassesHandled(data);
                console.log(data)
            })
            .catch((error) => console.error('Error fetching classes handled:', error));

        // Fetch available dates
        axios
            .get('https://studentportal.lcsinhs.com/scripts/qr-dates-unique.php')
            .then((response) => {
                setAvailableDates(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (username) {
            axios
                .post('https://studentportal.lcsinhs.com/scripts/faculty-profile.php', { username: username })
                .then((response) => {
                    setUserData(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [username]);

    return (
        <IonPage >
            <FacultyHeader />
            {isDesktop ?
                <>
                    <IonContent scrollX={false}>
                        <IonText>Hello {userData.title} {userData.fname} {userData.lname}</IonText>
                        <div className="spacer-h-l"></div>

                        <div className="title-grade-date">
                            <div className="att-margin">
                                <IonLabel className="grades-text">
                                    Student Attendance Log
                                </IonLabel>
                            </div>
                            <div className="grade-date">
                                <div>
                                    <IonSelect
                                        interface="popover"
                                        justify="space-between"
                                        fill="outline"
                                        label="Select Class"
                                        value={selectedClassCode}
                                        onIonChange={(e) => {
                                            console.log('Selected Class:', e.detail.value);
                                            setSelectedClassCode(e.detail.value);
                                        }}
                                    >
                                        {Array.isArray(classesHandled) && classesHandled.map((classItem) => (
                                            <IonSelectOption key={classItem.class_code} value={classItem.class_code}>
                                                {classItem.class_display}
                                            </IonSelectOption>
                                        ))}
                                    </IonSelect>

                                </div>
                                <div className="spacer-w-m"></div>
                                <div>
                                    <IonSelect
                                        interface="action-sheet"
                                        justify="space-between"
                                        fill="outline"
                                        label="Select Date"
                                        value={selectedDate}
                                        onIonChange={(e) => setSelectedDate(e.detail.value)}
                                    >
                                        {availableDates.map((date) => (
                                            <IonSelectOption key={date} value={date}>
                                                {formatDate(date)}
                                            </IonSelectOption>
                                        ))}
                                    </IonSelect>
                                </div>
                            </div>
                        </div>


                        {selectedDate && (
                            <>
                                <IonCard>
                                    <IonItem>
                                        <IonLabel>
                                            <h3>Grade {selectedClassCode} Students with Attendance on {formatDate(selectedDate)}:</h3>
                                        </IonLabel>
                                    </IonItem>
                                    {attendanceData
                                        .filter((entry: AttendanceModel) => entry.attendance_date === selectedDate && entry.grade_level === selectedGrade)
                                        .map((entry: AttendanceModel) => (
                                            <IonItem key={entry.student_lrn} lines="none">
                                                <IonLabel slot="start" className="ion-text-wrap">
                                                    <h2 className="ion-text-start">{entry.l_name}, {entry.f_name}</h2>
                                                    <p className="ion-text-start">LRN: {entry.student_lrn}</p>
                                                    <p>Grade Level: {entry.grade_level}</p>
                                                </IonLabel>
                                            </IonItem>

                                        ))}
                                </IonCard>

                            </>
                        )}
                    </IonContent>

                </>
                :
                <>
                    <IonContent scrollX={false} color={'light'}>
                        <div className="spacer-h-s" />
                        <div className="att-margin">
                            <IonLabel className="grades-text">
                                Student Attendance Log
                            </IonLabel>
                        </div>

                        <div className="spacer-h-s" />

                        <div className="m-select-marg">
                            <IonSelect
                                interface="popover"
                                justify="space-between"
                                fill="outline"
                                label="Select Grade Level"
                                value={selectedGrade}
                                onIonChange={(e) => {
                                    console.log('Selected Grade:', e.detail.value);
                                    setSelectedGrade(e.detail.value);
                                }}
                            >
                                <IonSelectOption value="7">7</IonSelectOption>
                                <IonSelectOption value="8">8</IonSelectOption>
                                <IonSelectOption value="9">9</IonSelectOption>
                                <IonSelectOption value="10">10</IonSelectOption>
                                <IonSelectOption value="11">11</IonSelectOption>
                                <IonSelectOption value="12">12</IonSelectOption>
                            </IonSelect>
                            <div className="spacer-h-s"></div>
                            <div>
                                <IonSelect
                                    interface="action-sheet"
                                    justify="space-between"
                                    fill="outline"
                                    label="Select Date"
                                    value={selectedDate}
                                    onIonChange={(e) => setSelectedDate(e.detail.value)}
                                >
                                    {availableDates.map((date) => (
                                        <IonSelectOption key={date} value={date}>
                                            {formatDate(date)}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </div>
                        </div>

                        {selectedDate && (
                            <>
                                <IonCard>
                                    <IonCard className="card-no-border">
                                        <IonLabel>
                                            <h3>Grade {selectedGrade} Students with Attendance on {formatDate(selectedDate)}:</h3>
                                        </IonLabel>
                                    </IonCard>
                                    {attendanceData
                                        .filter((entry: AttendanceModel) => entry.attendance_date === selectedDate && entry.grade_level === selectedGrade)
                                        .map((entry: AttendanceModel) => (
                                            <IonItem key={entry.student_lrn} lines="none">
                                                <IonLabel slot="start" className="ion-text-wrap">
                                                    <h2>{entry.l_name}, {entry.f_name}</h2>
                                                    <p className="ion-text-start">LRN: {entry.student_lrn}</p>
                                                    <p>Grade Level: {entry.grade_level}</p>
                                                </IonLabel>
                                            </IonItem>

                                        ))}
                                </IonCard>

                            </>
                        )}
                    </IonContent>
                </>
            }
        </IonPage >
    );
};

export { fAttendance };
