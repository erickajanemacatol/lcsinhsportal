import {
    IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonLabel,
    IonList, IonPage, IonRow, IonSelect, IonSelectOption, useIonToast
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import './fRegistration.css'
import FacultyHeader from "../../components/FacultyHeader";
import { useMediaQuery } from "react-responsive";
import { eye, search } from "ionicons/icons";
import axios from "axios";


interface StudentModel {
    student_lrn: string;
    f_name: string;
    l_name: string;
    grade_level: number;
    CoR: string;
}

interface ClassHandled {
    class_code: string;
    class_display: string;
}

interface FacultyData {
    employee_no: number | null;
    title: string;
    fname: string;
    lname: string;
}

const fRegistration: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [selectedGrade, setSelectedGrade] = useState<number>();
    const [students, setStudents] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [classesHandled, setClassesHandled] = useState<ClassHandled[]>([]);
    const [selectedClassCode, setSelectedClassCode] = useState<string | undefined>();
    const username = localStorage.getItem('username') || ''; // Use an empty string as the fallback if null
    const [presentToast, dismissToast] = useIonToast();
    const [userData, setUserData] = useState<FacultyData>({
        employee_no: null,
        title: '',
        fname: '',
        lname: '',
    });

    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const handleViewClick = (documentPath: string) => {
        if (!documentPath) {
            showToast("No document available.", "warning");
            return;
        }

        const viewUrl = `https://studentportal.lcsinhs.com/scripts/file-fetch-profile.php?file=${documentPath}`;
        window.open(viewUrl, '_blank');
    };

    //For searchbar
    const fetchStudents = async (class_code: any, search: string) => {
        try {
            const response = await fetch(`https://studentportal.lcsinhs.com/scripts/student-with-grades.php?class_code=${class_code}&search=${search}`);
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            } else {
                console.error('Failed to fetch students');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e: any) => {
        setSearchText(e.detail.value);
    };

    useEffect(() => {
        // Fetch classes handled by the faculty and set the state.
        axios.get(`https://studentportal.lcsinhs.com/scripts/qr-for-faculty.php?facultyEmployeeNo=${username}`)
            .then((response) => {
                const data = response.data;
                setClassesHandled(data);
                console.log('class handled : ', data);
            })
            .catch((error) => console.error('Error fetching classes handled:', error));
    }, []);

    useEffect(() => {
        console.log('Selected class code:', selectedClassCode);

        if (selectedClassCode) {
            fetchStudents(selectedClassCode, searchText);
        }
    }, [selectedClassCode, searchText]);

    useEffect(() => {
        console.log('Username:', username);

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
        <IonPage>
            <FacultyHeader />

            {isDesktop ? <>
                <IonContent >
                    <div className="spacer-h-l"></div>
                    <div className="reg-col">
                        <div className="att-margin">
                            <IonLabel className="grades-text">
                                Certificate of Registration
                            </IonLabel>
                        </div>
                        <div className="sel-class-search">
                            <div>
                                <IonSelect
                                    className="sel-props"
                                    interface="popover"
                                    justify="space-between"
                                    fill="outline"
                                    label="Select Class Section:"
                                    value={selectedClassCode}
                                    onIonChange={(e) => {
                                        setSelectedClassCode(e.detail.value);
                                        console.log(selectedClassCode)
                                    }}
                                >
                                    {Array.isArray(classesHandled) && classesHandled.map((classItem) => (
                                        <IonSelectOption key={classItem.class_code} value={classItem.class_code}>
                                            {classItem.class_display}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </div>
                            <div className="spacer-w-s"/>
                            <div>
                                <IonInput fill="outline"
                                    className="sel-props"
                                    value={searchText}
                                    onIonChange={handleSearch}
                                    placeholder="Search students"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mainContent">
                        <IonList>
                            <IonGrid class="grid-props">
                                <IonRow>
                                    <IonCol size="0.25" className="cell-class">

                                    </IonCol>
                                    <IonCol size="3" className="cell-class">
                                        <b>LRN</b>
                                    </IonCol>
                                    <IonCol size="1" className="cell-class">
                                        <b>Grade Level</b>
                                    </IonCol>
                                    <IonCol size="3" className="cell-class">
                                        <b>First Name</b>
                                    </IonCol>
                                    <IonCol size="3" className="cell-class">
                                        <b> Last Name</b>
                                    </IonCol>
                                    <IonCol className="cell-class">
                                        <b> Action</b>
                                    </IonCol>
                                </IonRow>

                                {students.map((student: StudentModel, index: number) => (
                                    <div key={student.student_lrn}>

                                        <IonRow>
                                            <IonCol size="0.25" className="cell-class">
                                                {index + 1}
                                            </IonCol>
                                            <IonCol size="3" className="cell-class">
                                                {student.student_lrn}
                                            </IonCol>
                                            <IonCol size="1" className="cell-class">
                                                {student.grade_level}
                                            </IonCol>
                                            <IonCol size="3" className="cell-class">
                                                {student.f_name}
                                            </IonCol>
                                            <IonCol size="3" className="cell-class">
                                                {student.l_name}
                                            </IonCol>
                                            <IonCol className="cell-class">
                                                <IonButton onClick={() => handleViewClick(student.CoR)}>
                                                    <IonIcon icon={eye} />
                                                    <div className="spacer-w-xxs" />
                                                    Cert of Registration
                                                </IonButton>
                                            </IonCol>
                                        </IonRow>
                                    </div>
                                ))}
                            </IonGrid>
                        </IonList>
                    </div>
                </IonContent>
            </> :
                <>
                    <IonContent>
                        Not yet available in mobile view.

                    </IonContent>
                </>}

        </IonPage>
    );

};
export { fRegistration };