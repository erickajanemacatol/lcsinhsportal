import { IonButton, IonCard, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, useIonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import './Students.css';
import { cloudUpload, eye, trash } from "ionicons/icons";

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
    const [fileStatesMap, setFileStatesMap] = useState<Record<string, Record<string, File | null>>>({});
    const [fileNamesMap, setFileNamesMap] = useState<Record<string, Record<string, string>>>({});

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

    const openHiddenFileInput = (studentLRN: string, inputIndex: number) => {
        const hiddenInput = document.getElementById(`hiddenFileInput-${studentLRN}-${inputIndex}`);
        if (hiddenInput) {
            hiddenInput.click();
        }
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        studentLRN: string,
        inputIndex: number
    ) => {
        if (event.target.files) {
            const updatedFileStates = { ...fileStatesMap };
            const file = event.target.files[0];

            if (file) {
                const key = inputKeys[inputIndex - 1];
                if (!updatedFileStates[studentLRN]) {
                    updatedFileStates[studentLRN] = {};
                }
                updatedFileStates[studentLRN][key] = file;

                const updatedFileNamesMap = { ...fileNamesMap };
                if (!updatedFileNamesMap[studentLRN]) {
                    updatedFileNamesMap[studentLRN] = {};
                }
                updatedFileNamesMap[studentLRN][key] = file.name; // Store the file name

                setFileStatesMap(updatedFileStates);
                setFileNamesMap(updatedFileNamesMap); // Update the file names map
            }
        }
    };

    const handleUpload = (studentLRN: string) => {
        const files = fileStatesMap[studentLRN];

        if (!files || Object.values(files).every((file) => file === null)) {
            showToast('Please select at least one file', 'danger');
            return;
        }

        const uploadPromises = inputKeys.map((key, index) => {
            const file = files[key];
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
                            showToast('File exceeds maximum size (2MB).', 'danger');
                        }
                    }
                }
            })
            .catch((error) => {
                showToast('File upload failed', 'danger');
            });
    };


    const handleViewClick = (studentLRN: string, category: keyof StudentModel) => {
        const student = students.find((s) => s.student_lrn === studentLRN);
        if (!student) {
            showToast(`Student not found.`, "warning");
            return;
        }

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

    return (
        <IonPage>
            <AdminHeader />
            {isDesktop ? (
                <IonContent color={'light'}>
                    <div className="spacer-h-s"></div>

                    <div className="ttl-col">
                        <div className="att-margin">
                            <IonLabel className="grades-text">
                                Students List
                            </IonLabel>
                        </div>
                        <div className="search-bar-desc">
                            <IonSearchbar className="search-bar-size" color={'light'}
                                value={searchQuery}
                                onIonChange={handleSearch}
                                placeholder="Search LRN, First Name or Last Name"
                                debounce={300}
                            />
                        </div>
                    </div>

                    <div className="max-size">
                        Upload Files (Max Size: 2MB)
                    </div>
                    <IonCard color={'light'}>
                        <IonGrid class="grid-props">
                            <IonRow>
                                <IonCol size='0.3' class="cell-class">
                                </IonCol>
                                <IonCol size='1.4' class="cell-class">
                                    LRN
                                </IonCol>
                                <IonCol size='1.5' class="cell-class">
                                    Student Name
                                </IonCol>
                                <IonCol size='1.5' class="cell-class">
                                    Certificate of Registration
                                </IonCol>
                                <IonCol size='1.5' class="cell-class">
                                    Form 137
                                </IonCol>
                                <IonCol size='1.5' class="cell-class">
                                    Good Moral
                                </IonCol>
                                <IonCol size='1.5' class="cell-class">
                                    Certificate of Enrollment
                                </IonCol>
                                <IonCol size='1.5' class="cell-class">
                                    Certificate of Ranking
                                </IonCol>
                                <IonCol class="cell-class">
                                    Action
                                </IonCol>
                            </IonRow>

                            {students
                                .sort((a, b) => a.l_name.localeCompare(b.l_name) || a.f_name.localeCompare(b.f_name))
                                .filter((student: StudentModel) =>
                                    student.student_lrn.includes(searchQuery) ||
                                    student.f_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    student.l_name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((student: StudentModel, index) => (
                                    <IonRow key={student.student_lrn}>
                                        <IonCol size="0.3" className="cell-class">
                                            {index + 1}
                                        </IonCol>
                                        <IonCol size='1.4' className="cell-class">{student.student_lrn}</IonCol>
                                        <IonCol size='1.5' className="cell-class">{student.l_name}, {student.f_name}</IonCol>
                                        {inputKeys.map((key, inputIndex) => (
                                            <IonCol size='1.5' key={inputIndex} className="cell-class">
                                                <div className="input-width">
                                                    <input
                                                        type="file"
                                                        id={`hiddenFileInput-${student.student_lrn}-${inputIndex + 1}`}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleFileChange(e, student.student_lrn, inputIndex + 1)}
                                                    />

                                                    <IonButton
                                                        size="small" fill="outline" color="dark"
                                                        onClick={() => openHiddenFileInput(student.student_lrn, inputIndex + 1)}
                                                    >
                                                        Select
                                                    </IonButton>

                                                    {student[key as keyof StudentModel] && (
                                                        <IonButton size="small" color="tertiary"
                                                            onClick={() => handleViewClick(student.student_lrn, key as keyof StudentModel)}>
                                                            <IonIcon icon={eye} /> <div className="spacer-w-xs" /> View
                                                        </IonButton>
                                                    )}

                                                    {/* Display the selected file name */}
                                                    {fileNamesMap[student.student_lrn] && fileNamesMap[student.student_lrn][key] && (
                                                        <div>{fileNamesMap[student.student_lrn][key]}</div>
                                                    )}
                                                </div>
                                            </IonCol>
                                        ))}

                                        <IonCol className="cell-class">
                                            <IonButton className="submit-button-pref"
                                                size="small"
                                                onClick={() => handleUpload(student.student_lrn)}>
                                                <IonIcon icon={cloudUpload} />
                                                <div className="spacer-w-s" />
                                                Submit
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                ))}
                        </IonGrid>
                    </IonCard>

                </IonContent>
            ) : (
                <IonContent>
                    <div className="spacer-h-l"></div>
                    <div className="spacer-h-m"></div>
                    <div className="center">
                        <IonLabel>Students not available in mobile view.</IonLabel>
                    </div>
                </IonContent>
            )
            }
        </IonPage >
    );
};

export { Students };
