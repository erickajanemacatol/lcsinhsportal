import { useEffect, useState } from "react";
import axios from "axios";
import {
    IonCard,
    IonCardContent,
    IonCol,
    IonContent,
    IonGrid,
    IonLabel,
    IonPage,
    IonRow,
} from "@ionic/react";
import Header from "../../../components/StudentHeader";
import './Grades.css'
import { useMediaQuery } from "react-responsive";

const Grades = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [subjects, setSubjects] = useState<string[]>([]);
    const [gradeLevel, setGradeLevel] = useState<number | null>(null);
    const username = localStorage.getItem('username');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (username) {
            axios
                .post('https://studentportal.lcsinhs.com/scripts/profile.php', { username: username })
                .then((response) => {
                    const studentGradeLevel = response.data.grade_level;

                    if (studentGradeLevel) {
                        setGradeLevel(studentGradeLevel);
                        console.log("Grade Level: " + studentGradeLevel);

                        let apiEndpoint;
                        if (studentGradeLevel >= 7 && studentGradeLevel <= 10) {
                            // Grade 7-10 API endpoint
                            apiEndpoint = 'https://studentportal.lcsinhs.com/scripts/subjects-fetch.php';
                        } else if (studentGradeLevel >= 11 && studentGradeLevel <= 12) {
                            // Grade 11-12 API endpoint (for subjects_shs table)
                            apiEndpoint = 'https://studentportal.lcsinhs.com/scripts/subject-shs-fetch-1.php';
                        } else {
                            console.error('Invalid grade level');
                            return;
                        }

                        // Fetch subjects based on the student's grade level
                        axios
                            .get(`${apiEndpoint}?gradeLevel=${studentGradeLevel}`)
                            .then((subjectsResponse) => {
                                setSubjects(subjectsResponse.data);
                                setLoading(false);
                            })
                            .catch((error) => {
                                setError(error);
                                setLoading(false);
                            });

                    } else {
                        console.error('Failed to fetch grade level');
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

                                        {/* Populate subjects in the table */}
                                        {subjects.map((subject, index) => (
                                            <IonRow key={index}>
                                                <IonCol class="col-border" size="5">
                                                    {subject}
                                                </IonCol>
                                                <IonCol class="col-border" size="3">
                                                    -
                                                </IonCol>
                                                <IonCol class="col-border">
                                                    -
                                                </IonCol>
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
                                    <IonGrid className="grid-border">
                                        <IonRow>
                                            <IonCol class="col-border-header" size="6">
                                                Subject Name
                                            </IonCol>
                                            <IonCol class="col-border-header" size="3.5">
                                                Subject Teacher
                                            </IonCol>
                                            <IonCol class="col-border-header">
                                                Grade
                                            </IonCol>
                                        </IonRow>

                                        {/* Populate subjects in the table */}
                                        {subjects.map((subject, index) => (
                                            <IonRow key={index}>
                                                <IonCol class="col-border" size="6">
                                                    {subject}
                                                </IonCol>
                                                <IonCol class="col-border" size="3.5">
                                                    -
                                                </IonCol>
                                                <IonCol class="col-border">
                                                    -
                                                </IonCol>
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