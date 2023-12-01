import { useEffect, useState } from "react";
import axios from "axios";
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonChip,
    IonCol,
    IonContent,
    IonGrid,
    IonLabel,
    IonPage,
    IonRow,
    IonText,
} from "@ionic/react";
import Header from "../../../components/StudentHeader";
import "./Grades.css";
import { useMediaQuery } from "react-responsive";

interface StudentModel {
    student_lrn: string;
    f_name: string;
    l_name: string;
    grade_level: number;
}

interface GradeData {
    semester: number;
    student_lrn: string;
    subject_code: string;
    subject_name: string;
    teacher_name: string;
    grades: {
        q1: number | null;
        q2: number | null;
        q3: number | null;
        q4: number | null;
        [key: string]: number | null; // Add an index signature
    };
    class_code: string;
    level: number;
    section_name: string;
}

interface TeacherData {
    subject_code: string;
    teacher_name: string;
}


const Grades = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [gradeLevel, setGradeLevel] = useState<number | null>(null);
    const username = localStorage.getItem("username");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<GradeData[]>([]);
    const [grades, setGrades] = useState<GradeData[]>([]);
    const [teachers, setTeachers] = useState<{ [subjectCode: string]: TeacherData[] | null }>({});

    useEffect(() => {
        if (username) {
            axios
                .post("https://studentportal.lcsinhs.com/scripts/profile.php", {
                    username: username,
                })
                .then((response) => {
                    const studentGradeLevel = response.data.grade_level;

                    if (studentGradeLevel) {
                        setGradeLevel(studentGradeLevel);

                        let apiEndpoint;
                        if (studentGradeLevel >= 7 && studentGradeLevel <= 12) {
                            // Combine both JHS and SHS subjects fetching into a single script
                            apiEndpoint =
                                "https://studentportal.lcsinhs.com/scripts/subjects-fetch.php";
                        } else {
                            console.error("Invalid grade level");
                            return;
                        }

                        axios
                            .get(`${apiEndpoint}?gradeLevel=${studentGradeLevel}`)
                            .then((subjectsResponse) => {
                                setSubjects(subjectsResponse.data);
                                setLoading(false);
                            })
                            .catch((error) => {
                                setError(error.message);
                                setLoading(false);
                            });
                    } else {
                        console.error("Failed to fetch grade level");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [username]);

    // Fetch teachers based on subjects
    useEffect(() => {
        if (subjects.length > 0) {
            const teacherPromises = subjects.map((subject) => (
                axios.get(`https://studentportal.lcsinhs.com/scripts/teachers-fetch.php?subject_code=${subject.subject_code}`)
                    .then((teacherResponse) => {
                        return { subjectCode: subject.subject_code, teachers: teacherResponse.data };
                    })
                    .catch((error) => {
                        console.error('Error fetching teachers:', error);
                        setError(error);
                        return { subjectCode: subject.subject_code, teachers: null };
                    })
            ));

            Promise.all(teacherPromises)
                .then((teacherData) => {
                    const validTeachers: { [subjectCode: string]: TeacherData[] | null } = teacherData.reduce((acc: any, { subjectCode, teachers }) => {
                        if (teachers !== null) {
                            acc[subjectCode] = teachers;
                        }
                        return acc;
                    }, {});
                    setTeachers(validTeachers);
                })
                .catch((error) => {
                    console.error('Error fetching teachers:', error);
                    setError(error.message);
                });
        }
    }, [subjects]);

    // Fetch grades for the selected student and subjects
    useEffect(() => {
        if (username && subjects.length > 0 && gradeLevel !== null) {
            const gradePromises = subjects.map((subject) => {
                const scriptUrl =
                    gradeLevel >= 7 && gradeLevel <= 10
                        ? 'grades-fetch.php'
                        : gradeLevel >= 11 && gradeLevel <= 12
                            ? 'grades-fetch-shs.php'
                            : null;

                if (!scriptUrl) {
                    console.error('Invalid grade level');
                    return null;
                }

                return axios
                    .get(`https://studentportal.lcsinhs.com/scripts/${scriptUrl}?student_lrn=${username}&subject_code=${subject.subject_code}`)
                    .then((gradesResponse) => {
                        console.log('Grades Response Data:', gradesResponse.data);
                        return gradesResponse.data;
                    })                    .catch((error) => {
                        console.error(`Error fetching ${scriptUrl}:`, error);
                        setError(error);
                        return null;
                    });
            });

            Promise.all(gradePromises)
                .then((gradesData) => {
                    const validGrades = gradesData.filter((data) => data !== null);
                    setGrades(validGrades);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching grades:', error);
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [username, subjects, gradeLevel]);

    return (
        <IonPage>
            <Header />

            {isDesktop ? (
                /* Desktop View */
                <>
                    <IonContent color={'light'} scrollX={false}>
                        <div className="spacer-h-m" />
                        <div className="top-title">
                            <div className="cal-margin">
                                <IonLabel className="my-att-title">My Grades</IonLabel>
                            </div>
                        </div>

                        <IonCard className="my-grades-card">
                            <IonCardContent>
                                <div>
                                    <IonGrid className="grid-border">
                                        <IonRow>
                                            <IonCol class="col-border-header" size="5">
                                                Subject Name
                                            </IonCol>
                                            <IonCol class="col-border-header" size="3">
                                                Subject Teacher
                                            </IonCol>
                                            <IonCol class="col-border-header">
                                                Grade
                                            </IonCol>
                                        </IonRow>

                                        {gradeLevel && gradeLevel >= 7 && gradeLevel <= 10 ? (
                                            <IonRow>
                                                <IonCol size="5" className="col-border"></IonCol>
                                                <IonCol size="3" className="col-border"></IonCol>
                                                <IonCol className="col-border">1st Quarter</IonCol>
                                                <IonCol className="col-border">2nd Quarter</IonCol>
                                                <IonCol className="col-border">3rd Quarter</IonCol>
                                                <IonCol className="col-border">4th Quarter</IonCol>
                                            </IonRow>
                                        ) : null}

                                        {subjects.map((subject: GradeData, subjectIndex) => (
                                            <IonRow key={subjectIndex}>
                                                <IonCol class="col-border" size="5">
                                                    {subject.subject_name}
                                                </IonCol>

                                                <IonCol class="col-border" size="3">
                                                    {(teachers[subject.subject_code] ?? []).map((teacher, teacherIndex) => (
                                                        <div key={teacherIndex}>{teacher.teacher_name || "-"}</div>
                                                    ))}
                                                </IonCol>


                                                {gradeLevel && gradeLevel >= 7 && gradeLevel <= 10 ? (
                                                    <>
                                                        {['q1', 'q2', 'q3', 'q4'].map((quarter, quarterIndex) => (
                                                            <IonCol className="col-border" key={quarterIndex}>
                                                                {grades
                                                                    .filter((g) => g.subject_code === subject.subject_code)
                                                                    .map((grade, gradeIndex) => (
                                                                        <div key={gradeIndex}>
                                                                            {grade.grades[quarter] !== null ? grade.grades[quarter] : "-"}
                                                                        </div>
                                                                    ))}
                                                            </IonCol>
                                                        ))}
                                                    </>
                                                ) :
                                                    (
                                                        <>
                                                            <IonCol className="col-border">
                                                                {grades
                                                                    .filter((g) => g.subject_code === subject.subject_code)
                                                                    .map((grade, gradeIndex) => (
                                                                        <div key={gradeIndex}>
                                                                            {/* Replace with the appropriate property for SHS grading */}
                                                                            {grade.grades.grade !== null ? grade.grades.grade : "-"}
                                                                        </div>
                                                                    ))}
                                                            </IonCol>
                                                        </>
                                                    )}
                                            </IonRow>
                                        ))}
                                    </IonGrid>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </IonContent>
                </>
            ) : (
                /* Mobile View */
                <>
                    <IonContent color={'light'} scrollX={false}>
                        <div className="spacer-h-s" />
                        <div className="m-top-title">
                            <div className="cal-margin">
                                <IonLabel className="m-grades-text">My Grades</IonLabel>
                            </div>
                        </div>

                        <IonCard className="m-grades-card">
                            <IonCardContent>
                                <div>
                                    <IonGrid className="m-grid-border">
                                        <IonRow>
                                            <IonCol class="m-col-border-header" size="4">
                                                Subject Name
                                            </IonCol>
                                            <IonCol class="m-col-border-header" size="3">
                                                Subject Teacher
                                            </IonCol>
                                            <IonCol class="m-col-border-header">
                                                Grade
                                            </IonCol>
                                        </IonRow>

                                        {gradeLevel && gradeLevel >= 7 && gradeLevel <= 10 ? (
                                            <IonRow>
                                                <IonCol size="4" className="cell-class"></IonCol>
                                                <IonCol size="3" className="cell-class"></IonCol>
                                                <IonCol className="cell-class">1</IonCol>
                                                <IonCol className="cell-class">2</IonCol>
                                                <IonCol className="cell-class">3</IonCol>
                                                <IonCol className="cell-class">4</IonCol>
                                            </IonRow>
                                        ) : null}

                                        {subjects.map((subject: GradeData, subjectIndex) => (
                                            <IonRow key={subjectIndex}>
                                                <IonCol className="cell-class" size="4">
                                                    {subject.subject_name}

                                                    <IonText slot="end">
                                                        {subject.semester === 1
                                                            ? <IonChip color={'success'}>1st Sem</IonChip>
                                                            : subject.semester === 2
                                                                ? <IonChip color={'success'}>2nd Sem</IonChip>
                                                                : null
                                                        }
                                                    </IonText>
                                                </IonCol>

                                                <IonCol className="cell-class" size="3">
                                                    {(teachers[subject.subject_code] ?? []).map((teacher, teacherIndex) => (
                                                        <div key={teacherIndex}>{teacher.teacher_name || "-"}</div>
                                                    ))}
                                                </IonCol>


                                                {gradeLevel && gradeLevel >= 7 && gradeLevel <= 10 ? (
                                                    <>
                                                        {['q1', 'q2', 'q3', 'q4'].map((quarter, quarterIndex) => (
                                                            <IonCol className="cell-class" key={quarterIndex}>
                                                                {grades
                                                                    .filter((g) => g.subject_code === subject.subject_code)
                                                                    .map((grade, gradeIndex) => (
                                                                        <div key={gradeIndex}>
                                                                            {grade.grades[quarter] !== null ? grade.grades[quarter] : "-"}
                                                                        </div>
                                                                    ))}
                                                            </IonCol>
                                                        ))}
                                                    </>
                                                ) :
                                                    (
                                                        <>
                                                            <IonCol className="cell-class">
                                                                {grades
                                                                    .filter((g) => g.subject_code === subject.subject_code)
                                                                    .map((grade, gradeIndex) => (
                                                                        <div key={gradeIndex}>
                                                                            {/* Replace with the appropriate property for SHS grading */}
                                                                            {grade.grades.grade !== null ? grade.grades.grade : "-"}
                                                                        </div>
                                                                    ))}
                                                            </IonCol>
                                                        </>
                                                    )}
                                            </IonRow>
                                        ))}

                                    </IonGrid>
                                </div>
                            </IonCardContent>
                        </IonCard>

                    </IonContent>
                </>
            )}
        </IonPage>
    );
}
export { Grades };