import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, useIonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import './Students.css';

interface StudentModel {
    student_lrn: string;
    f_name: string;
    l_name: string;
}

const Students: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [sortCriteria, setSortCriteria] = useState<keyof StudentModel>("student_lrn");
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [presentToast, dismissToast] = useIonToast();
    const inputKeys: string[] = ["CoR", "form_137", "good_moral", "CoEnrolment", "CoRanking"];
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: CustomEvent) => {
        setSearchQuery(e.detail.value);
    };

    const [fileStates, setFileStates] = useState(
        students.map(() => ({
            CoR: null as File | null,
            form_137: null as File | null,
            good_moral: null as File | null,
            CoEnrolment: null as File | null,
            CoRanking: null as File | null
        }))
    );


    const showToast = (message: string, color: 'primary' | 'danger' | 'success' | 'warning') => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        studentIndex: number,
        inputIndex: number
    ) => {
        if (event.target.files) {
            const updatedFileStates = [...fileStates];
            const file = event.target.files[0];

            if (file) {
                const key = inputKeys[inputIndex - 1] as keyof typeof updatedFileStates[0];
                updatedFileStates[studentIndex][key] = file;
            }

            setFileStates(updatedFileStates);
        }
    };

    const handleUpload = (studentIndex: number) => {
        if (!students || students.length <= studentIndex || students[studentIndex] == null) {
            showToast('Student data not available', 'danger');
            return;
        }

        const studentLRN = students[studentIndex].student_lrn;
        const files = fileStates[studentIndex];

        if (Object.values(files).every((file) => file === null)) {
            showToast('Please select at least one file', 'danger');
            return;
        }

        const uploadPromises = inputKeys.map((key, index) => {
            const file = files[key as keyof typeof files]; // Use type assertion here
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('student_lrn', studentLRN);
                formData.append('input_index', (index + 1).toString());

                return axios.post('https://studentportal.lcsinhs.com/scripts/file-upload.php', formData);
            }
            return null;
        });

        Promise.all(uploadPromises)
            .then((responses) => {
                for (const response of responses) {
                    if (response && response.data) {
                        if (response.data.success) {
                            showToast('File uploaded successfully', 'success');
                            window.location.reload();
                        } else {
                            console.error(response.data.error);
                            showToast('File upload failed', 'danger');
                        }
                    }
                }
            })
            .catch((error) => {
                showToast('File upload failed', 'danger');
            });
    };


    const handleViewClick = (studentIndex: number, category: keyof StudentModel) => {
        const student = students[studentIndex];
        const filePath = student[category];

        if (!filePath) {
            showToast(`No ${category} file available.`, "warning");
            return;
        }

        const viewUrl = `https://studentportal.lcsinhs.com/scripts/file-fetch.php?file=${filePath}&category=${category}`;
        window.open(viewUrl, '_blank');
    };


    useEffect(() => {
        axios.get('https://studentportal.lcsinhs.com/scripts/get-students.php')
            .then((response) => {
                setStudents(response.data);

                // Initialize fileStates after setting students
                const initialFileStates = response.data.map(() => ({
                    CoR: null,
                    form_137: null,
                    good_moral: null,
                    CoEnrolment: null,
                    CoRanking: null
                }));
                setFileStates(initialFileStates);

                // Load the last uploaded file data
                const lastUploadedFileData = response.data.map(() => ({
                    CoR: null,
                    form_137: null,
                    good_moral: null,
                    CoEnrolment: null,
                    CoRanking: null
                }));

                // Assuming your response.data contains the file paths
                for (let i = 0; i < response.data.length; i++) {
                    lastUploadedFileData[i] = {
                        CoR: response.data[i].CoR,
                        form_137: response.data[i].form_137,
                        good_moral: response.data[i].good_moral,
                        CoEnrolment: response.data[i].CoEnrolment,
                        CoRanking: response.data[i].CoRanking
                    };
                }

                setFileStates(lastUploadedFileData);
            })
            .catch((error) => {
                console.error('Error fetching students:', error);
            });
    }, []);

    const filteredAndSortedStudents = students
        .filter((student: StudentModel) => {
            // Filter students based on the search query
            return (
                student.student_lrn.includes(searchQuery) ||
                student.f_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.l_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        .sort((a, b) => {
            return a[sortCriteria].localeCompare(b[sortCriteria]);
        });

    return (
        <IonPage>
            <AdminHeader />
            {isDesktop ? (
                <IonContent>
                    <div className="spacer-h-l"></div>
                    <div className="search-bar-size">
                        <IonSearchbar
                            value={searchQuery}
                            onIonChange={handleSearch}
                            placeholder="Search"
                            debounce={300}
                        />
                        <div className="search-bar-desc">
                            <IonText color={'medium'}>
                                Input detail of student using either LRN, First Name or Last Name and hit enter.
                            </IonText>
                        </div>
                    </div>

                    <div className="spacer-h-l"></div>
                    <IonItem>
                        <IonLabel>LRN</IonLabel>
                        <IonLabel>Student</IonLabel>
                        <div className="spacer-w-l" />
                        <IonLabel>CoR</IonLabel>
                        <IonLabel></IonLabel>
                        <IonLabel>Form 137</IonLabel>
                        <IonLabel></IonLabel>
                        <IonLabel>Good Moral</IonLabel>
                        <IonLabel></IonLabel>
                        <IonLabel>Enrolment</IonLabel>
                        <IonLabel></IonLabel>
                        <IonLabel>Ranking</IonLabel>
                        <IonLabel></IonLabel>
                        <IonLabel></IonLabel>
                    </IonItem>

                    <IonGrid>
                        <IonRow>
                            {students
                                .filter((student: StudentModel) =>
                                    student.student_lrn.includes(searchQuery) ||
                                    student.f_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    student.l_name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((student: StudentModel, index) => (
                                    <IonRow key={student.student_lrn}>
                                        <IonCol className="column-lrn">{student.student_lrn}</IonCol>
                                        <IonCol className="column-name">{student.f_name} {student.l_name}</IonCol>
                                        {inputKeys.map((key, inputIndex) => (
                                            <IonCol className="column-upload" key={inputIndex}>
                                                <div className="input-width">
                                                    <label htmlFor={`fileInput-${index}-${inputIndex + 1}`}>Upload file:</label>
                                                    <input
                                                        id={`fileInput-${index}-${inputIndex + 1}`}
                                                        type="file"
                                                        onChange={(e) => handleFileChange(e, index, inputIndex + 1)}
                                                    />
                                                    {student[key as keyof StudentModel] && ( // Type assertion
                                                        <IonButton size="small" color="tertiary" onClick={() => handleViewClick(index, key as keyof StudentModel)}>View</IonButton> // Type assertion
                                                    )}
                                                </div>
                                            </IonCol>
                                        ))}

                                        <IonCol className="column-upload">
                                            <IonButton className="submit-button-pref" onClick={() => handleUpload(index)}>
                                                Submit
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                ))}
                        </IonRow>
                    </IonGrid>

                </IonContent>
            ) : (
                <IonContent>
                    <div className="spacer-h-l"></div>
                    <div className="spacer-h-m"></div>
                    <div className="center">
                        <IonLabel>Not Available in Mobile View</IonLabel>
                    </div>
                </IonContent>
            )
            }
        </IonPage >
    );
};

export { Students };
