import { IonCard, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
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
    attendance_id: number;
    attendance_type: string;
    time_in: string;
    time_out: string;
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
    const [attendanceData, setAttendanceData] = useState<AttendanceModel[]>([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [classesHandled, setClassesHandled] = useState<ClassHandled[]>([]);
    const [selectedClassCode, setSelectedClassCode] = useState<string | undefined>();
    const [studentsList, setStudentsList] = useState<any[]>([]); // State to store the list of students
    const username = localStorage.getItem('username') || ''; // Use an empty string as the fallback if null

    const [userData, setUserData] = useState<FacultyData>({
        employee_no: null,
        title: '',
        fname: '',
        lname: '',
    });

    useEffect(() => {
        // Get the current date
        const currentDate = new Date();

        // Format the date as a string compatible with IonInput (YYYY-MM-DD)
        const formattedDate = currentDate.toISOString().split('T')[0];

        // Set the initial value
        setSelectedDate(formattedDate);
    }, []);

    function formatDate(dateString: any) {
        const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-AS", options);
    }

    const formatTime = (timeString: string | undefined) => {
        if (timeString && !isNaN(Date.parse(timeString))) {
            const options: Intl.DateTimeFormatOptions = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };
            return new Date(timeString).toLocaleTimeString('en-AS', options);
        }
        return 'N/A';
    };

    useEffect(() => {
        // Fetch classes handled by the faculty and set the state.
        axios.get(`https://studentportal.lcsinhs.com/scripts/qr-for-faculty.php?facultyEmployeeNo=${username}`)
            .then((response) => {
                const data = response.data;
                setClassesHandled(data);
            })
            .catch((error) => console.error('Error fetching classes handled:', error));

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
        // Fetch the list of students based on the selected class code
        if (selectedClassCode) {
            axios
                .get(`https://studentportal.lcsinhs.com/scripts/qr-student-list.php?classCode=${selectedClassCode}`)
                .then((response) => {
                    const data = response.data;
                    setStudentsList(data);
                })
                .catch((error) => console.error('Error fetching students:', error));
        }
    }, [selectedClassCode]);

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

    const handleFetchAttendanceData = () => {
        // Fetch time in and time out data based on selected date, class code, and faculty information
        if (selectedDate && selectedClassCode) {
            axios
                .get(`https://studentportal.lcsinhs.com/scripts/qr-attendance-tintout.php?classCode=${selectedClassCode}&date=${selectedDate}`)
                .then((response) => {
                    setAttendanceData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching time in and time out data:', error);
                });
        }
    };

    useEffect(() => {
        // Fetch time in and time out data when selectedDate or selectedClassCode changes
        handleFetchAttendanceData();
    }, [selectedDate, selectedClassCode]);

    return (
        <IonPage >
            <FacultyHeader />
            {isDesktop ?
                <>
                    <IonContent scrollX={false}>
                        <div className="spacer-h-l"></div>

                        <div className="title-grade-date">
                            <div className="att-margin">
                                <IonLabel className="grades-text">
                                    Student Attendance Log
                                </IonLabel>
                            </div>
                            <div className="grade-date">
                                <IonSelect
                                    className="sel-props"
                                    interface="popover"
                                    justify="space-between"
                                    fill="outline"
                                    label="Select Class Section:"
                                    value={selectedClassCode}
                                    onIonChange={(e) => {
                                        setSelectedClassCode(e.detail.value);
                                    }}
                                >
                                    {Array.isArray(classesHandled) && classesHandled.map((classItem) => (
                                        <IonSelectOption key={classItem.class_code} value={classItem.class_code}>
                                            {classItem.class_display}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>

                                <div className="spacer-w-m"></div>
                                <div>
                                    <IonInput
                                        className="custom-date-input"
                                        label="Select Date: "
                                        fill="outline"
                                        type="date"
                                        value={selectedDate}
                                        onIonChange={(e) => setSelectedDate(e.detail.value!)}
                                    ></IonInput>
                                </div>
                            </div>
                        </div>

                        <div className="spacer-h-xs"></div>
                        <div>
                            <IonGrid color="dark">
                                <IonRow>
                                    <IonCol className="cell-class" size=".3">
                                    </IonCol>
                                    <IonCol className="cell-class">
                                        <b>LRN</b>
                                    </IonCol>
                                    <IonCol className="cell-class">
                                        <b>Student Name</b>
                                    </IonCol>
                                    <IonCol size='2' className="cell-class">
                                        <b>Time In</b>
                                    </IonCol>
                                    <IonCol size='2' className="cell-class">
                                        <b>Time Out</b>
                                    </IonCol>
                                </IonRow>
                                {studentsList.map((student, index) => {
                                    const studentAttendance = attendanceData.find(
                                        (entry: any) => entry.student_lrn === student.student_lrn
                                    );

                                    return (
                                        <IonRow key={student.lrn}>
                                            <IonCol className="cell-class" size=".3">
                                                {index + 1}
                                            </IonCol>
                                            <IonCol className="cell-class">
                                                {student.student_lrn}
                                            </IonCol>
                                            <IonCol className="cell-class">
                                                {`${student.l_name}, ${student.f_name}`}
                                            </IonCol>
                                            <IonCol size='2' className="cell-class">
                                                {formatTime(studentAttendance?.time_in || 'N/A')}
                                            </IonCol>
                                            <IonCol size='2' className="cell-class">
                                                {formatTime(studentAttendance?.time_out || 'N/A')}
                                            </IonCol>
                                        </IonRow>
                                    );
                                })}

                            </IonGrid>
                        </div>
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
