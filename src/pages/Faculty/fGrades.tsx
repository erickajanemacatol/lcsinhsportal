import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonLabel, IonList, IonPage, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, useIonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import './fGrades.css'
import '/src/components/Spacer.css'
import FacultyHeader from "../../components/FacultyHeader";
import { useMediaQuery } from "react-responsive";
import axios from "axios";

interface StudentModel {
    student_lrn: string;
    f_name: string;
    l_name: string;
    grade_level: number;
}
interface Class {
    class_id: number;
    subject_code: string;
    employee_no: string;
    class_subj_id: number;
    class_code: string;
    grade_level: number;
    section_name: string;
}

interface Subject {
    subject_code: string;
    subject_name: string;
}

interface FacultyTeaching {
    class: Class;
    subject: Subject;
}

const fGrades: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [facultyTeaching, setFacultyTeaching] = useState<FacultyTeaching[]>([]);
    const username = localStorage.getItem('username') || '';
    const [grades, setGrades] = useState<Record<string, Record<string, number>>>({});
    const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('');
    const [existingGrades, setExistingGrades] = useState<Record<string, Record<string, number>>>({});
    const [presentToast, dismissToast] = useIonToast();
    const isClassSelected = selectedClass !== '';
    const [gradesSubmitted, setGradesSubmitted] = useState(false);

    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const handleGradeChange = (lrn: string, quarter: string, value: string) => {
        console.log('Handling grade change:', lrn, quarter, value);

        setGrades((prevGrades) => {
            const newGrades = {
                ...prevGrades,
                [lrn]: {
                    ...prevGrades[lrn],
                    [quarter]: Number(value),
                },
            };
            console.log('New Grades:', newGrades);
            return newGrades;
        });
    };

    const handleGradeChangeSHS = (lrn: string, value: string) => {
        setGrades((prevGrades) => {
            const newGrades = {
                ...prevGrades,
                [lrn]: {
                    ...prevGrades[lrn],
                    grade: Number(value),
                },
            };
            console.log('New Grades for SHS:', newGrades);
            return newGrades;
        });
    };

    const sendGradesToServerJHS = async () => {
        console.log('Grades before sending:', grades);

        try {
            if (!selectedSubjectCode) {
                showToast('Please select a subject.', 'danger');
                return;
            }
            // Prepare the data to be sent
            const gradesData = Object.entries(grades).map(([studentLRN, studentGrades]) => ({
                student_lrn: studentLRN,
                subject_code: selectedSubjectCode,
                q1: studentGrades.Q1 || null,
                q2: studentGrades.Q2 || null,
                q3: studentGrades.Q3 || null,
                q4: studentGrades.Q4 || null,
            }));

            console.log("Grades", gradesData)

            // Send the data to the server
            const response = await axios.post('https://studentportal.lcsinhs.com/scripts/grades-add-update.php', gradesData);

            if (response.data && response.data.success) {
                showToast(response.data.message, 'success');
                setGrades({});
                setGradesSubmitted(true);
            } else {
                showToast(response.data.message || 'Failed to store grades.', 'danger');
                console.error('Failed to store grades:', response.data.error);
            }
        } catch (error) {
            showToast('An error occurred while sending grades.', 'danger');
            console.error('Error storing grades:', error);
        }
    };

    const sendGradesToServerSHS = async () => {
        console.log('Grades before sending:', grades);

        try {
            if (!selectedSubjectCode) {
                showToast('Please select a subject.', 'danger');
                return;
            }
            // Prepare the data to be sent
            const gradesDataSHS = Object.entries(grades).map(([studentLRN, studentGrades]) => ({
                student_lrn: studentLRN,
                subject_code: selectedSubjectCode,
                grade: studentGrades.grade || null,
            }));

            console.log("Grades", gradesDataSHS)

            // Send the data to the server
            const response = await axios.post('https://studentportal.lcsinhs.com/scripts/grades-add-update-shs.php', gradesDataSHS);

            if (response.data && response.data.success) {
                showToast(response.data.message, 'success');
                setGrades({});
                setGradesSubmitted(true);
            } else {
                console.log(response)
                showToast(response.data.message || 'Failed to store grades.', 'danger');
                console.error('Failed to store grades:', response.data.error, response.data);
            }
        } catch (error) {
            showToast('An error occurred while sending grades.', 'danger');
            console.error('Error storing grades:', error);
        }
    };

    useEffect(() => {
        // Your code to refresh or update specific parts of the component
        console.log('Grades have been submitted. Refreshing...');

        // For example, you might want to fetch updated data or perform other actions
        // ...

        // Reset the gradesSubmitted state to false after handling the refresh
        setGradesSubmitted(false);
    }, [gradesSubmitted]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://studentportal.lcsinhs.com/scripts/class-fetch-for-faculty.php?employee_no=${username}`);
                console.log(response);
                setFacultyTeaching(response.data);
            } catch (error) {
                console.error('Error fetching faculty teaching data:', error);
            }
        };

        fetchData(); // Call the async function

    }, [username]);

    const handleClassChange = async (newSelectedClass: string) => {
        // Extract the subject code from the selectedClass
        const subjectCode = newSelectedClass.split('-')[1];
        console.log("Subject Code:", subjectCode);

        // Format the selected class including both class and subject code
        const formattedSelectedClass = `${newSelectedClass.split('-')[0]}-${subjectCode}`;
        console.log("Formatted Selected Class:", formattedSelectedClass);

        setSelectedClass(formattedSelectedClass);
        await fetchStudents(); // Wait for fetchStudents to complete
    };

    // Inside the useEffect block that listens for changes in selectedClass and facultyTeaching
    useEffect(() => {
        if (selectedClass) {
            const formattedSelectedClass = selectedClass.split('-')[0];
            console.log("Formatted Selected Class:", formattedSelectedClass);

            const subjectCode = selectedClass.split('-')[1];
            console.log("Subject Code:", subjectCode);

            const selectedTeaching = facultyTeaching.find(
                (teachingItem) => teachingItem.class.class_code === formattedSelectedClass &&
                    teachingItem.subject.subject_code === subjectCode
            );
            console.log("Selected Teaching:", selectedTeaching);

            if (selectedTeaching) {
                const newSelectedSubjectCode = selectedTeaching.subject.subject_code;
                console.log("New Selected Subject Code:", newSelectedSubjectCode);
                setSelectedSubjectCode(newSelectedSubjectCode);

                // Fetch students after updating the subject code
                const fetchStudents = async () => {
                    try {
                        if (!selectedClass || selectedClass === '' || !newSelectedSubjectCode) {
                            setStudents([]);
                            return;
                        }

                        const response = await fetch(`https://studentportal.lcsinhs.com/scripts/class-fetch-ccode-for-faculty.php?employee_no=${username}&class_code=${formattedSelectedClass}&subject_code=${subjectCode}`);

                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const data = await response.json();
                        console.log("Fetched Students Data:", data);

                        setStudents(data);
                    } catch (error) {
                        console.error('Error fetching students:', error);
                    }
                };

                fetchStudents();
            }
        }
    }, [selectedClass, facultyTeaching]);

    useEffect(() => {
        console.log('Existing Grades (after state update):', existingGrades);
    }, [existingGrades]);
    
    useEffect(() => {
        const fetchGradesForStudent = async (student: any) => {
            try {
                const response = await axios.get(`https://studentportal.lcsinhs.com/scripts/grades-faculty-fetch.php`, {
                    params: {
                        student_lrn: student.student_lrn,
                        subject_code: selectedSubjectCode,
                        grade_level: student.grade_level,
                    },
                });
    
                if (response.data && response.data.success && response.data.grades) {
                    setExistingGrades((prevGrades) => ({
                        ...prevGrades,
                        [student.student_lrn]: response.data.grades || {},
                    }));
                    console.log('Response for student:', student.student_lrn, response.data);
                } else {
                    console.log(`Error fetching existing grades for student ${student.student_lrn}, class ${student.grade_level}, subject ${selectedSubjectCode}:`, response.data);
                
                    // Log the response structure for further inspection
                    console.log('Full response:', response);
                
                    console.error('Error fetching existing grades:', response.data.message);
                }
                
            } catch (error) {
                console.error('Error fetching existing grades:', error);
            }
        };
    
        // Use Promise.all to fetch grades for all students concurrently
        const fetchAllGrades = async () => {
            await Promise.all(students.map(fetchGradesForStudent))
                .catch(error => console.error('Error fetching grades for one or more students:', error));
        };        
    
        fetchAllGrades();
    }, [selectedClass, selectedSubjectCode, students]);

    useEffect(() => {
        if (selectedClass && selectedSubjectCode) {
            fetchStudents();
        }
    }, [selectedClass, selectedSubjectCode]);

    const fetchStudents = async () => {
        try {
            const formattedClassCode = selectedClass.split('-')[0];
            console.log("Formatted Selected Class:", formattedClassCode);

            const response = await fetch(`https://studentportal.lcsinhs.com/scripts/class-fetch-ccode-for-faculty.php?employee_no=${username}&class_code=${formattedClassCode}&subject_code=${selectedSubjectCode}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Sort students by last name
            const sortedStudents = data.sort((a: any, b: any) => a.l_name.localeCompare(b.l_name));
            setStudents(sortedStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    return (
        <IonPage>
            <FacultyHeader />
            {isDesktop ? (
                <IonContent>
                    <div className="spacer-h-l"></div>

                    <div className="options-col">
                        <div className="att-margin">
                            <IonLabel className="grades-text">
                                Grades
                            </IonLabel>
                        </div>
                        <div>
                            <IonSelect
                                className="sel-class-props"
                                value={selectedClass}
                                onIonChange={(e) => {
                                    console.log("IonChange event triggered");
                                    const newSelectedClass = e.detail.value;
                                    handleClassChange(newSelectedClass);

                                    console.log("New selected class:", newSelectedClass);
                                }}
                                interface="popover"
                                justify="space-between"
                                fill="outline"
                                label="Select Class:"
                                slot="end"
                                aria-label="grade_level"
                            >
                                {facultyTeaching.map((teachingItem: any) => (
                                    <IonSelectOption
                                        key={`${teachingItem.class.class_code}-${teachingItem.subject.subject_code}`}
                                        value={`${teachingItem.class.class_code}-${teachingItem.subject.subject_code}`}
                                    >
                                        {`Grade ${teachingItem.class.grade_level} - ${teachingItem.class.section_name} - ${teachingItem.subject.subject_name}`}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </div>
                    </div>

                    <div className="mainContent">
                        <IonList>
                            <IonGrid class="grid-props">
                                <IonRow>
                                    <IonCol size="0.3" className="cell-class">

                                    </IonCol>
                                    <IonCol size="2" className="cell-class">
                                        <b>LRN</b>
                                    </IonCol>
                                    <IonCol size="2" className="cell-class">
                                        <b>First Name</b>
                                    </IonCol>
                                    <IonCol size="2" className="cell-class">
                                        <b>Last Name</b>
                                    </IonCol>
                                    <IonCol className="cell-class">
                                        <b>Grade</b>
                                    </IonCol>
                                </IonRow>

                                {isClassSelected && (
                                    <div >
                                        {isClassSelected && (
                                            <div>
                                                {students
                                                    .sort((a, b) => a.l_name.localeCompare(b.l_name))
                                                    .map((student, index) => (
                                                        <IonRow key={index}>
                                                            <IonCol size="0.3" className="cell-class">
                                                                {index + 1}
                                                            </IonCol>
                                                            <IonCol size="2" className="cell-class">
                                                                {student.student_lrn}
                                                            </IonCol>
                                                            <IonCol size="2" className="cell-class">
                                                                {student.f_name}
                                                            </IonCol>
                                                            <IonCol size="2" className="cell-class">
                                                                {student.l_name}
                                                            </IonCol>

                                                            <IonCol className="cell-class">
                                                                {student.grade_level >= 11 ?
                                                                    (
                                                                        // Render a single input for grades 11 and 12
                                                                        <>
                                                                            <IonLabel>Grade</IonLabel>
                                                                            <div className="spacer-w-l" />
                                                                            <IonInput
                                                                                type="number"
                                                                                fill="outline"
                                                                                value={existingGrades[student.student_lrn]?.grade?.toString() || ""}
                                                                                onIonChange={(e) => handleGradeChangeSHS(student.student_lrn, e.detail.value!)}
                                                                                min="0"
                                                                                max="100"
                                                                            ></IonInput>
                                                                            <div className="spacer-w-m" />
                                                                            <IonButton onClick={sendGradesToServerSHS}>Submit</IonButton>
                                                                        </>
                                                                    ) : (
                                                                        // Render separate inputs for grades 7-10
                                                                        <>
                                                                            <IonLabel>Q1</IonLabel>
                                                                            <div className="spacer-w-m" />
                                                                            <IonInput
                                                                                type="number"
                                                                                fill="outline"
                                                                                value={existingGrades[student.student_lrn]?.q1?.toString() || ""}
                                                                                onIonChange={(e) => handleGradeChange(student.student_lrn, "Q1", e.detail.value!)}
                                                                                min="0"
                                                                                max="100"
                                                                            ></IonInput>
                                                                            <div className="spacer-w-m" />
                                                                            <IonLabel>Q2</IonLabel>
                                                                            <div className="spacer-w-m" />
                                                                            <IonInput
                                                                                type="number"
                                                                                fill="outline"
                                                                                value={existingGrades[student.student_lrn]?.q2?.toString() || ""}
                                                                                onIonChange={(e) => handleGradeChange(student.student_lrn, "Q2", e.detail.value!)}
                                                                                min="0"
                                                                                max="100"
                                                                            ></IonInput>
                                                                            <div className="spacer-w-m" />
                                                                            <IonLabel>Q3</IonLabel>
                                                                            <div className="spacer-w-m" />
                                                                            <IonInput
                                                                                type="number"
                                                                                fill="outline"
                                                                                value={existingGrades[student.student_lrn]?.q3?.toString() || ""}
                                                                                onIonChange={(e) => handleGradeChange(student.student_lrn, "Q3", e.detail.value!)}
                                                                                min="0"
                                                                                max="100"
                                                                            ></IonInput>
                                                                            <div className="spacer-w-m" />
                                                                            <IonLabel>Q4</IonLabel>
                                                                            <div className="spacer-w-m" />
                                                                            <IonInput
                                                                                type="number"
                                                                                fill="outline"
                                                                                value={existingGrades[student.student_lrn]?.q4?.toString() || ""}
                                                                                onIonChange={(e) => handleGradeChange(student.student_lrn, "Q4", e.detail.value!)}
                                                                                min="0"
                                                                                max="100"
                                                                            ></IonInput>
                                                                            <div className="spacer-w-m" />
                                                                            <IonButton onClick={sendGradesToServerJHS}>Submit</IonButton>
                                                                        </>
                                                                    )}
                                                                <div className="spacer-w-m" />
                                                            </IonCol>
                                                        </IonRow>
                                                    ))}
                                            </div>
                                        )}

                                    </div>
                                )}
                            </IonGrid>

                        </IonList>
                    </div>
                </IonContent>
            ) : (
                <>
                    <IonContent>
                        <IonText>Not yet available for mobile view.</IonText>

                    </IonContent>
                </>
            )
            }
        </IonPage >
    );
};
export { fGrades };