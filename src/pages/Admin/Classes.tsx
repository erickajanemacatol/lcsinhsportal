import {
    IonButton, IonCard, IonCardHeader, IonCheckbox, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon,
    IonInput,
    IonItem,
    IonLabel, IonList, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonToast
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { add, addOutline, closeSharp, create, eye, personAdd, trash } from "ionicons/icons";
import { useMediaQuery } from "react-responsive";
import './Classes.css'
import { BiUpload } from "react-icons/bi";
import axios from "axios";

interface Faculty {
    title: string; fname: string; lname: string; employee_no: number;
}

interface Classes {
    class_code: string; grade_level: number; section_name: string; title: string; fname: string; lname: string;
}

interface Student {
    student_lrn: string; f_name: string; l_name: string; grade_level: number; class_code: string;
}

interface Subject {
    subject_code: string; subject_name: string; level: number; semester: number;
}

interface Props {
    isOpen: boolean; onClose: () => void; classCode: string; classSection: string;
}

interface SubjectWithTeacher extends Subject {
    employee_no?: string;

    assignedTeacher?: {
        title: string;
        fname: string;
        lname: string;
    }
}

const Classes: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [presentToast, dismissToast] = useIonToast();
    const [facultyOptions, setFacultyOptions] = useState<Faculty[]>([]);
    const [classList, setClassList] = useState<Classes[]>([]);
    const [isAddStudentsModalOpen, setAddStudentsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<{
        classCode: string;
        gradeLevel: number;
        classSection: string;
    } | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isViewStudentsModalOpen, setViewStudentsModalOpen] = useState(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isViewSubjectsModalOpen, setViewSubjectsModalOpen] = useState(false);
    const [isAddTeachModalOpen, setViewSAddTeachModalOpen] = useState(false);
    const [selectedTeachers, setSelectedTeachers] = useState<Record<string, string>>({});
    const sortedClassList = classList.slice().sort((a, b) => {
        const orderMultiplier = sortOrder === 'asc' ? 1 : -1;
        return orderMultiplier * (a.grade_level - b.grade_level);
    });

    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const [classData, setClassData] = useState({
        class_code: '',
        grade_level: 0,
        section: '',
        class_adviser: '',
    });

    const handleSubmit = () => {
        if (!classData.class_code || !classData.grade_level || !classData.section || !classData.class_adviser) {
            showToast('Please fill in all required fields.', 'danger');
            return;
        }

        const classExists = classList.some(existingClass => existingClass.class_code === classData.class_code);

        if (classExists) {
            showToast('Class with the same class code already exists.', 'danger');
            return;
        }

        // Make an HTTP POST request to your PHP script to insert class information.
        axios.post("https://studentportal.lcsinhs.com/scripts/class-add.php", classData)
            .then((response) => {
                if (response.data && response.data.success) {
                    showToast(response.data.message, 'success');

                    // Clear the form fields
                    setClassData({
                        class_code: '',
                        grade_level: 0,
                        section: '',
                        class_adviser: '',
                    });

                    axios.get('https://studentportal.lcsinhs.com/scripts/class-fetch.php')
                        .then((response) => {
                            setClassList(response.data);
                        })
                        .catch((error) => {
                            console.error(error);
                        });

                } else {
                    showToast(response.data.message, 'danger');
                    console.error('Failed to add class:', response.data.error);
                }
            })
            .catch((error) => {
                console.error("Error sending request:", error);
            });
    };

    const [updateForm, setUpdateForm] = useState({
        classCode: '',
        gradeLevel: '',
        section: '',
        classAdviser: '',
    });

    const handleUpdate = () => {
        // Perform the update request to your server
        axios.post("https://studentportal.lcsinhs.com/scripts/class-update.php", updateForm)
            .then((response) => {
                if (response.data && response.data.success) {
                    showToast(response.data.message, 'success');
                    closeUpdateModal();

                    axios.get('https://studentportal.lcsinhs.com/scripts/class-fetch.php')
                        .then((response) => {
                            setClassList(response.data);
                        })
                        .catch((error) => {
                            console.error(error);
                        });


                } else {
                    showToast(response.data.message, 'danger');
                    console.error('Failed to update class:', response.data.error);
                }
            })
            .catch((error) => {
                console.error("Error sending update request:", error);
            });
    };

    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

    const openUpdateModal = (classItem: any) => {
        setUpdateForm({
            classCode: classItem.class_code,
            gradeLevel: classItem.grade_level,
            section: classItem.section_name,
            classAdviser: classItem.class_adviser,
        });
        setUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setUpdateModalOpen(false);
        // Reset the update form when the modal is closed
        setUpdateForm({
            classCode: '',
            gradeLevel: '',
            section: '',
            classAdviser: '',
        });
    };

    const handleDelete = (classCode: any) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this class?');

        if (confirmDelete) {
            // User confirmed, proceed with deletion
            axios.delete(`https://studentportal.lcsinhs.com/scripts/class-delete.php?classCode=${classCode}`)
                .then((response) => {
                    if (response.data && response.data.success) {
                        showToast(response.data.message, 'success');

                        axios.get('https://studentportal.lcsinhs.com/scripts/class-fetch.php')
                            .then((response) => {
                                setClassList(response.data);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    } else {
                        showToast(response.data.message, 'danger');
                        console.error('Failed to delete class:', response.data.error);
                    }
                })
                .catch((error) => {
                    console.error("Error sending delete request:", error);
                });
        }
    };

    //Fetch Faculty for Select Options
    useEffect(() => {
        axios.get('https://studentportal.lcsinhs.com/scripts/faculty-fetch.php')
            .then(response => {
                const facultyData = response.data;
                setFacultyOptions(facultyData);
            })
            .catch(error => {
                console.error('Error fetching faculty data:', error);
            });
    }, []);

    //Fetch Class List
    useEffect(() => {
        axios
            .get('https://studentportal.lcsinhs.com/scripts/class-fetch.php')
            .then((response) => {
                setClassList(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    //ADDING STUDENTS TO SECTION
    const openAddStudentsModal = (classCode: string, gradeLevel: number, classSection: string) => {
        setSelectedClass({ classCode, gradeLevel, classSection });

        // Fetch the list of students for the specific grade level
        axios.get(`https://studentportal.lcsinhs.com/scripts/class-get-students.php?gradeLevel=${gradeLevel}`)
            .then((response) => {
                setStudents(response.data);
            })
            .catch((error) => {
                console.error('Error fetching students:', error);
            });

        setClassData({
            ...classData,
            grade_level: gradeLevel,
            section: classSection,
            class_code: classCode,
        });

        setAddStudentsModalOpen(true);
    };

    const closeAddStudentsModal = () => {
        setAddStudentsModalOpen(false);
        setSelectedClass(null);
        setSelectedStudents([]);
    };

    const handleStudentSelection = (selectedValues: string[] | null) => {
        setSelectedStudents(selectedValues || []);
    };

    const handleAddStudents = () => {
        if (selectedStudents.length === 0) {
            showToast('Please select at least one student.', 'danger');
            return;
        }

        const requestData = {
            classCode: classData.class_code,
            selectedStudents: selectedStudents,
        };

        console.log(requestData);

        axios.post("https://studentportal.lcsinhs.com/scripts/class-assign-students.php", requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

            .then((response) => {
                console.log(response);
                if (response.data && response.data.success) {
                    showToast(response.data.message, 'success');
                    closeAddStudentsModal();
                } else {
                    showToast(response.data.message, 'danger'); // Here, response.data.message is undefined
                    console.error('Failed to add students to section:', response.data.error);
                }
            })
            .catch((error) => {
                console.error("Error sending request:", error);
            });

    };

    // VIEWING STUDENTS
    const [selectedClassStudents, setSelectedClassStudents] = useState<Student[]>([]);

    const openStudentModal = (classCode: string, gradeLevel: number, classSection: string) => {
        setSelectedClass({ classCode, gradeLevel, classSection });

        console.log(classCode, gradeLevel, classSection)

        // Fetch the list of students for the specific class
        axios.get(`https://studentportal.lcsinhs.com/scripts/class-student-fetch-by-glevel.php`, {
            params: {
                classCode: classCode,
                gradeLevel: gradeLevel
            }
        })
            .then((response) => {
                const studentsArray = Array.isArray(response.data) ? response.data : [];
                console.log(response)
                setSelectedClassStudents(studentsArray);
            })
            .catch((error) => {
                console.error('Error fetching students:', error);
                // Set an empty array in case of an error
                setSelectedClassStudents([]);
            });

        setClassData({
            ...classData,
            grade_level: gradeLevel,
            section: classSection,
            class_code: classCode,
        });

        setViewStudentsModalOpen(true);
    };

    const closeStudentModal = () => {
        setViewStudentsModalOpen(false);
    };

    const handleRemoveStudent = (studentToRemove: Student) => {
        const confirmDelete = window.confirm('Are you sure you want to remove this student?');

        if (confirmDelete) {
            // User confirmed, proceed with deletion
            axios.delete(`https://studentportal.lcsinhs.com/scripts/class-remove-student.php`, {
                params: {
                    student_lrn: studentToRemove.student_lrn,
                    classCode: studentToRemove.class_code
                }
            })
                .then((response) => {
                    console.log(response);
                    if (response.data && response.data.success) {
                        showToast("Student removed successfully.", 'success');

                        // Re-fetch the updated list of students for the specific class
                        axios.get(`https://studentportal.lcsinhs.com/scripts/class-student-fetch-by-glevel.php`, {
                            params: {
                                classCode: selectedClass?.classCode,
                                gradeLevel: selectedClass?.gradeLevel
                            }
                        })
                            .then((response) => {
                                const studentsArray = Array.isArray(response.data) ? response.data : [];
                                console.log(response)
                                setSelectedClassStudents(studentsArray);
                            })
                            .catch((error) => {
                                console.error('Error fetching students:', error);
                                // Set an empty array in case of an error
                                setSelectedClassStudents([]);
                            });

                        // Optionally, you can also update the class list
                        axios.get('https://studentportal.lcsinhs.com/scripts/class-fetch.php')
                            .then((response) => {
                                setClassList(response.data);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    } else {
                        showToast(response.data.message, 'danger');
                        console.error('Failed to delete student:', response.data.error);
                    }
                })
                .catch((error) => {
                    console.error("Error sending delete request:", error);
                });
        }
    };

    //SUBJECTS && ASSIGNING TEACHERS
    const fetchSubjects = (classCode: string, gradeLevel: number) => {
        // Make an HTTP request to fetch subjects based on classCode and gradeLevel
        axios.get(`https://studentportal.lcsinhs.com/scripts/classSubject-fetch.php`, {
            params: {
                classCode,
                gradeLevel,
            },
        })
            .then(response => {
                console.log(response)
                setSubjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching subjects:', error);
            });
    };

    const openSubjectModal = async (classCode: string, gradeLevel: number, classSection: string) => {
        setSelectedClass({ classCode, gradeLevel, classSection });
        fetchSubjects(classCode, gradeLevel);
        setViewSubjectsModalOpen(true);
    };

    const closeSubjectModal = () => {
        setViewSubjectsModalOpen(false);
    };

    const openAddTeachModal = async (classCode: string, gradeLevel: number, classSection: string) => {
        setSelectedClass({ classCode, gradeLevel, classSection });

        try {
            let subjectsApiUrl = '';

            // Check the grade level and set the appropriate API URL
            if (Number(gradeLevel) === 11 || Number(gradeLevel) === 12) {
                subjectsApiUrl = 'https://studentportal.lcsinhs.com/scripts/class-subject-fetch-shs.php';
            } else {
                subjectsApiUrl = 'https://studentportal.lcsinhs.com/scripts/class-subject-fetch-jhs.php';
            }

            console.log('Grade Level Type:', typeof gradeLevel);
            console.log('Grade Level:', gradeLevel);
            console.log('API URL:', subjectsApiUrl);

            const response = await axios.get(subjectsApiUrl, {
                params: {
                    classCode,
                    gradeLevel,
                },
            });

            console.log('API Response:', response.data);

            const subjectsData = response.data;
            setSubjects(subjectsData);
            setViewSAddTeachModalOpen(true);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const closeAddTeachModal = () => {
        setViewSAddTeachModalOpen(false);
    };

    const handleTeacherChange = (subject: Subject, selectedTeacherId: string) => {
        const data = {
            subject_code: subject.subject_code,
            teacher_id: selectedTeacherId,
            class_code: selectedClass?.classCode,
        };

        console.log(data);


        axios.post("https://studentportal.lcsinhs.com/scripts/classSubject-add.php", data)
            .then((response) => {
                if (response.data && response.data.success) {
                    console.log("Teacher changed successfully:", response.data);
                    showToast(response.data.message, 'success');
                    console.log('Teacher changed successfully');

                } else {
                    showToast(response.data.message, 'danger');
                    console.error('Failed to add class:', response.data.error);
                }
            })
            .catch((error) => {
                console.error("Error sending request:", error);
            });
    };

    //adding schedule
    const inputKeys: string[] = ["class_schedule"];
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, string | null>>({});
    const [fileStatesMap, setFileStatesMap] = useState<Record<string, Record<string, File | null>>>({});
    const [fileNamesMap, setFileNamesMap] = useState<Record<string, Record<string, string>>>({});

    const openHiddenFileInput = (classCode: string, inputIndex: number) => {
        const hiddenInput = document.getElementById(`hiddenFileInput-${classCode}-${inputIndex}`);
        if (hiddenInput) {
            hiddenInput.click();
        }
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        classCode: string,
        inputIndex: number
    ) => {
        if (event.target.files) {
            const updatedFileStates = { ...fileStatesMap };
            const updatedFileNamesMap = { ...fileNamesMap };
            const file = event.target.files[0];

            if (file) {
                const key = inputKeys[inputIndex - 1];

                if (!updatedFileStates[classCode]) {
                    updatedFileStates[classCode] = {};
                    updatedFileNamesMap[classCode] = {};
                }
                updatedFileStates[classCode][key] = file;
                updatedFileNamesMap[classCode][key] = file.name; // Store the file name

                setFileStatesMap(updatedFileStates);
                setFileNamesMap(updatedFileNamesMap);
            }
        }
    };

    const handleSchedUpload = (classCode: string) => {
        const files = fileStatesMap[classCode];

        if (!files || Object.values(files).every((file) => file === null)) {
            showToast('Please select a file', 'danger');
            return;
        }

        const uploadPromises = inputKeys.map((key, index) => {
            const file = files[key];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('class_code', classCode);
                formData.append('input_index', (index + 1).toString());

                return axios.post('https://studentportal.lcsinhs.com/scripts/sched-upload.php', formData);
            }
            return null;
        });
        Promise.all(uploadPromises)
            .then((responses) => {
                let uploadSuccess = false;

                for (const response of responses) {
                    if (response && response.data) {
                        console.log('Response data:', response.data);
                        if (response.data.success) {
                            showToast('File uploaded successfully', 'success');
                            // Update state with the uploaded file URL
                            setUploadedFiles((prevFiles) => ({ ...prevFiles, [classCode]: response.data.fileUrl }));
                            console.log('uploaded: ', uploadedFiles);

                            // Reset the file input state
                            const updatedFileStates = { ...fileStatesMap };
                            const updatedFileNamesMap = { ...fileNamesMap };
                            updatedFileStates[classCode] = {};
                            updatedFileNamesMap[classCode] = {};
                            setFileStatesMap(updatedFileStates);
                            setFileNamesMap(updatedFileNamesMap);

                            uploadSuccess = true;
                        } else {
                            console.error(response.data.error);
                            showToast('File exceeds maximum size (2MB).', 'danger');
                        }
                    }
                }

                // Clear the file input only if the upload was successful
                if (uploadSuccess) {
                    const input = document.getElementById(`hiddenFileInput-${classCode}-${inputKeys.length}`) as HTMLInputElement;
                    if (input) {
                        input.value = ''; // Reset the input value
                    }
                }
            })
            .catch((error) => {
                showToast('File upload failed', 'danger');
            });
    };

    const handleViewUploadedFile = (classCode: string) => {
        const fileUrl = uploadedFiles[classCode];

        if (fileUrl) {
            const viewUrl = `https://studentportal.lcsinhs.com/scripts/sched-fetch.php?file=${fileUrl}`;
            window.open(viewUrl, '_blank');
        } else {
            showToast("No schedule uploaded.", "warning")
            console.error('File URL not found.');
        }
    };

    useEffect(() => {
        // Fetch the uploaded schedules when the component mounts
        fetchUploadedSchedules();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const fetchUploadedSchedules = () => {
        // Fetch the schedule information and update the state
        axios.get('https://studentportal.lcsinhs.com/scripts/get-classes.php')
            .then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    const filesMap: Record<string, string | null> = {};

                    response.data.forEach((classItem) => {
                        // Assuming 'class_code' is unique for each class
                        const classCode = classItem.class_code;
                        const scheduleFileName = classItem.class_schedule || null;

                        // Populate the files map with class code as key and schedule file name as value
                        filesMap[classCode] = scheduleFileName;
                    });

                    setUploadedFiles(filesMap);
                }
            })
            .catch((error) => {
                console.error('Error fetching uploaded schedules:', error);
            });
    };

    return (
        <IonPage>
            <AdminHeader />

            {isDesktop ? <>
                <IonContent color={'light'}>
                    <div className="spacer-h-s"></div>
                    <div className="options-col">
                        <div className="att-margin">
                            <IonLabel className="grades-text">
                                Classes
                            </IonLabel>
                        </div>
                    </div>

                    <IonCard className="classes-card">
                        <IonCardHeader color={'light'}>
                            <IonText>Add A Class Section</IonText>
                        </IonCardHeader>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="2">
                                    <IonInput label="Class Code:" fill="outline"
                                        placeholder="e.g. GR7S1"
                                        name="class_code"
                                        value={classData.class_code}
                                        onIonChange={(e) => setClassData({ ...classData, class_code: e.detail.value || '' })}
                                    />
                                </IonCol>
                                <IonCol size="2">
                                    <IonSelect
                                        interface="popover"
                                        justify="space-between"
                                        fill="outline"
                                        label="Select Grade Level"
                                        name="grade_level"
                                        value={classData.grade_level}
                                        onIonChange={(e) => setClassData({ ...classData, grade_level: e.detail.value })}

                                    >
                                        <IonSelectOption value="7">7</IonSelectOption>
                                        <IonSelectOption value="8">8</IonSelectOption>
                                        <IonSelectOption value="9">9</IonSelectOption>
                                        <IonSelectOption value="10">10</IonSelectOption>
                                        <IonSelectOption value="11">11</IonSelectOption>
                                        <IonSelectOption value="12">12</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                                <IonCol>
                                    <IonInput label="Section Name:" fill="outline"
                                        placeholder="Enter Section Name"
                                        name="section"
                                        value={classData.section}
                                        onIonChange={(e) => setClassData({ ...classData, section: e.detail.value || '' })}
                                    />
                                </IonCol>
                                <IonCol>
                                    <IonSelect
                                        interface="popover"
                                        justify="space-between"
                                        fill="outline"
                                        label="Select Class Adviser:"
                                        name="class_adviser"
                                        value={classData.class_adviser}
                                        onIonChange={(e) => setClassData({ ...classData, class_adviser: e.detail.value })}
                                    >
                                        {facultyOptions.map(faculty => (
                                            <IonSelectOption key={faculty.employee_no} value={faculty.employee_no}>
                                                {faculty.title} {faculty.fname} {faculty.lname}
                                            </IonSelectOption>
                                        ))}
                                    </IonSelect>
                                </IonCol>
                                <IonCol size=".8">
                                    <IonButton color={'dark'}
                                        onClick={handleSubmit}>
                                        <IonIcon icon={addOutline} />
                                        Add
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCard>

                    {/*render added sections*/}
                    <IonGrid className="grid-class">
                        <IonRow>
                            <IonCol className="cell-class" size=".3"></IonCol>
                            <IonCol className="cell-class" size="1"><b>Class Code</b></IonCol>
                            <IonCol className="cell-class" size=".8"><b>Grade Level</b></IonCol>
                            <IonCol className="cell-class" size="1"><b>Section</b></IonCol>
                            <IonCol className="cell-class" size="1.5"><b>Class Adviser</b></IonCol>
                            <IonCol className="cell-class" size="2"><b>Class Schedule</b></IonCol>
                            <IonCol className="cell-class" size="2"><b>Subjects</b></IonCol>
                            <IonCol className="cell-class" size="2"><b>Students</b></IonCol>
                            <IonCol className="cell-class" > <b>Other Actions</b> </IonCol>
                        </IonRow>

                        {sortedClassList.map((classItem, index) => (
                            <IonRow key={classItem.class_code}>
                                <IonCol className="cell-class" size=".3">
                                    {index + 1}
                                </IonCol>
                                <IonCol className="cell-class" size="1">{classItem.class_code}</IonCol>
                                <IonCol className="cell-class" size=".8" >{classItem.grade_level}</IonCol>
                                <IonCol className="cell-class" size="1">{classItem.section_name}</IonCol>
                                <IonCol className="cell-class" size="1.5"> {classItem.title} {classItem.fname} {classItem.lname}</IonCol>
                                <IonCol className="cell-class" size="2">
                                    <IonRow key={classItem.class_code}>
                                        {inputKeys.map((key, inputIndex) => (
                                            <div className="col-div" key={inputIndex}>
                                                <IonRow>
                                                    File (Max Size: 2MB):  {/* Display the selected file name */}
                                                    {fileNamesMap[classItem.class_code] && fileNamesMap[classItem.class_code][key] && (
                                                        <>{fileNamesMap[classItem.class_code][key]}</>
                                                    )}
                                                </IonRow>
                                                <IonRow key={inputIndex}>
                                                    <input
                                                        type="file"
                                                        id={`hiddenFileInput-${classItem.class_code}-${inputIndex + 1}`}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleFileChange(e, classItem.class_code, inputIndex + 1)}
                                                    />

                                                    <IonButton
                                                        fill="outline" color="dark" size="small"
                                                        onClick={() => openHiddenFileInput(classItem.class_code, inputIndex + 1)}
                                                    >
                                                        Select
                                                    </IonButton>

                                                    <IonButton
                                                        color="dark" size="small"
                                                        onClick={() => handleSchedUpload(classItem.class_code)}
                                                        title="Upload"
                                                    >Upload
                                                    </IonButton>
                                                    {/* View button for uploaded file */}
                                                    {uploadedFiles[classItem.class_code] && (
                                                        <IonButton size="small" color="tertiary"
                                                            onClick={() => handleViewUploadedFile(classItem.class_code)}>
                                                            <IonIcon icon={eye} />
                                                        </IonButton>
                                                    )}
                                                </IonRow>
                                            </div>
                                        ))}
                                    </IonRow>
                                </IonCol>
                                <IonCol className="cell-class" size="2">
                                    <IonRow>
                                        <IonButton className="buttons-font-size"
                                            onClick={() => openAddTeachModal(classItem.class_code, classItem.grade_level, classItem.section_name)}>
                                            Assign Teachers
                                            <IonIcon slot="start" icon={add} />
                                        </IonButton>
                                        <IonButton color={'success'} className="buttons-font-size"
                                            onClick={() => openSubjectModal(classItem.class_code, classItem.grade_level, classItem.section_name)}>
                                            <IonIcon icon={eye} />
                                            <div className="spacer-w-s" />
                                            View Subjects
                                        </IonButton>
                                    </IonRow>
                                </IonCol>
                                <IonCol className="cell-class" size="2">
                                    <IonRow>
                                        <IonButton className="buttons-font-size"
                                            onClick={() => openAddStudentsModal(classItem.class_code, classItem.grade_level, classItem.section_name)}>
                                            Add Students
                                            <IonIcon slot="start" icon={personAdd} />
                                        </IonButton>
                                        <IonButton color={'success'} className="buttons-font-size" onClick={() => openStudentModal(classItem.class_code, classItem.grade_level, classItem.section_name)}>
                                            <IonIcon icon={eye} />
                                            <div className="spacer-w-s" />
                                            View Students
                                        </IonButton>
                                    </IonRow>
                                </IonCol>

                                <IonCol className="cell-class">
                                    <IonRow>

                                        <IonButton className="buttons-font-size"
                                            onClick={() => openUpdateModal(classItem)}>
                                            Update Class
                                            <IonIcon slot="start" icon={create} />
                                        </IonButton>
                                        <IonButton className="buttons-font-size" color={'danger'}
                                            onClick={() => handleDelete(classItem.class_code)}>
                                            <IonIcon slot="start" icon={trash} />
                                            Delete Class
                                        </IonButton>
                                    </IonRow>

                                </IonCol>
                            </IonRow>
                        ))}
                    </IonGrid>
                </IonContent>
            </> : <>
                <IonContent>
                    <div className="spacer-h-l"></div>
                    <div className="spacer-h-m"></div>
                    <div className="center">
                        <IonLabel>Classes not available in mobile view.</IonLabel>
                    </div>
                </IonContent>
            </>}

            <IonModal isOpen={isUpdateModalOpen} onDidDismiss={closeUpdateModal}>
                <IonContent>
                    <IonHeader className="ion-no-border">
                        <IonToolbar>
                            <IonButton slot="end" fill="clear" color={'dark'} onClick={closeUpdateModal}>
                                <IonIcon icon={closeSharp} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>

                    <IonTitle>
                        Update Class Details for class with Class Code  {updateForm.classCode}:
                    </IonTitle>
                    <div className="spacer-h-s"></div>

                    <IonGrid>
                        <IonCol>
                            <IonSelect
                                interface="popover"
                                justify="space-between"
                                fill="outline"
                                label="Select Grade Level"
                                name="grade_level"
                                value={updateForm.gradeLevel}
                                onIonChange={(e) => setUpdateForm({ ...updateForm, gradeLevel: e.detail.value || '' })}
                            >
                                <IonSelectOption value="7">7</IonSelectOption>
                                <IonSelectOption value="8">8</IonSelectOption>
                                <IonSelectOption value="9">9</IonSelectOption>
                                <IonSelectOption value="10">10</IonSelectOption>
                                <IonSelectOption value="11">11</IonSelectOption>
                                <IonSelectOption value="12">12</IonSelectOption>
                            </IonSelect>
                        </IonCol>
                        <IonCol>
                            <IonInput label="Section Name:" fill="outline"
                                name="section"
                                value={updateForm.section}
                                onIonChange={(e) => setUpdateForm({ ...updateForm, section: e.detail.value || '' })}
                            />
                        </IonCol>
                        <IonCol>
                            <IonSelect
                                interface="popover"
                                justify="space-between"
                                fill="outline"
                                label="Select Class Adviser:"
                                name="class_adviser"
                                value={updateForm.classAdviser}
                                onIonChange={(e) => setUpdateForm({ ...updateForm, classAdviser: e.detail.value || '' })}
                            >
                                {facultyOptions.map(faculty => (
                                    <IonSelectOption key={faculty.employee_no} value={faculty.employee_no}>
                                        {faculty.title} {faculty.fname} {faculty.lname}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonCol>
                    </IonGrid>

                    <div className="spacer-h-xs"></div>
                    <div className="buttons-pref">
                        <IonButton fill="outline" onClick={closeUpdateModal}>Cancel</IonButton>
                        <IonButton onClick={handleUpdate}>Update</IonButton>
                        <div className="spacer-w-s"></div>
                    </div>

                </IonContent>
            </IonModal>

            <IonModal isOpen={isAddStudentsModalOpen} onDidDismiss={closeAddStudentsModal}>
                <IonContent>
                    <IonHeader className="ion-no-border">
                        <IonToolbar>
                            <IonButton slot="end" fill="clear" color={'dark'} onClick={closeAddStudentsModal}>
                                <IonIcon icon={closeSharp} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>

                    <IonTitle>
                        Add Students for Grade {classData.grade_level} - {classData.section}
                    </IonTitle>

                    <IonGrid>
                        <IonList>
                            {students.map((student) => (
                                <IonItem key={student.student_lrn}>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>{student.student_lrn}</IonCol>
                                            <IonCol>{student.f_name}</IonCol>
                                            <IonCol>{student.l_name}</IonCol>
                                        </IonRow>
                                    </IonGrid>
                                    <IonCheckbox
                                        slot="start"
                                        value={student.student_lrn}
                                        checked={selectedStudents.includes(student.student_lrn)}
                                        onIonChange={(e) => {
                                            const selectedValue = student.student_lrn;
                                            const updatedSelection = [...selectedStudents];

                                            if (e.detail.checked) {
                                                // Add the selected value
                                                updatedSelection.push(selectedValue);
                                            } else {
                                                // Remove the selected value
                                                const index = updatedSelection.indexOf(selectedValue);
                                                if (index !== -1) {
                                                    updatedSelection.splice(index, 1);
                                                }
                                            }

                                            handleStudentSelection(updatedSelection);
                                        }}
                                        aria-label="Label"
                                    />
                                </IonItem>
                            ))}
                        </IonList>

                    </IonGrid>

                    <div className="buttons-pref">
                        <IonButton onClick={handleAddStudents}>Add Students</IonButton>
                        <div className="spacer-w-xs" />
                    </div>
                </IonContent>
            </IonModal>

            <IonModal isOpen={isViewStudentsModalOpen} onDidDismiss={closeStudentModal}>
                <IonContent>
                    <IonHeader className="ion-no-border">
                        <IonToolbar>
                            <IonButton slot="end" fill="clear" color={'dark'} onClick={closeStudentModal}>
                                <IonIcon icon={closeSharp} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>

                    <IonTitle>
                        Grade {classData.grade_level} - {classData.section}
                    </IonTitle>

                    <IonGrid>
                        <IonList>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="4">LRN</IonCol>
                                    <IonCol size="3">Last Name</IonCol>
                                    <IonCol size="3">First Name</IonCol>
                                    <IonCol></IonCol>
                                </IonRow>
                            </IonGrid>
                            {selectedClassStudents
                                .slice()
                                .sort((a, b) => a.l_name.localeCompare(b.l_name))
                                .map((student: Student) => (
                                    <IonGrid>
                                        <IonRow key={student.student_lrn} className="grid-class">
                                            <IonCol size="4">{student.student_lrn}</IonCol>
                                            <IonCol size="3">{student.l_name}</IonCol>
                                            <IonCol size="3">{student.f_name}</IonCol>
                                            <IonCol>
                                                <IonButton color={'danger'} size="small" onClick={() => handleRemoveStudent(student)}>
                                                    Remove
                                                </IonButton>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                ))}
                        </IonList>
                    </IonGrid>
                </IonContent>
            </IonModal>

            <IonModal isOpen={isViewSubjectsModalOpen}
                onDidDismiss={closeSubjectModal}
                onDidPresent={() => console.log('Modal presented')}>
                <IonContent>
                    <IonHeader className="ion-no-border">
                        <IonToolbar>
                            <IonButton slot="end" fill="clear" color={'dark'} onClick={closeSubjectModal}>
                                <IonIcon icon={closeSharp} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>

                    <IonTitle>
                        Subjects for Grade {selectedClass?.gradeLevel} - {selectedClass?.classSection}
                    </IonTitle>

                    <IonList>
                        {subjects.map((subject: SubjectWithTeacher) => (
                            <IonItem key={subject.subject_code}>
                                <IonLabel>
                                    {subject.subject_name}

                                    {subject.assignedTeacher && (
                                        <IonText>
                                            <p>Assigned Teacher: {subject.assignedTeacher.title} {subject.assignedTeacher.fname} {subject.assignedTeacher.lname}</p>
                                        </IonText>
                                    )}
                                </IonLabel>
                                <IonText slot="end">
                                    {subject.semester === 1
                                        ? <IonChip color={'success'}>1st Sem</IonChip>
                                        : subject.semester === 2
                                            ? <IonChip color={'primary'}>2nd Sem</IonChip>
                                            : null
                                    }
                                </IonText>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonModal>

            <IonModal isOpen={isAddTeachModalOpen}
                onDidDismiss={closeAddTeachModal}
                onDidPresent={() => console.log('Modal presented')}>
                <IonContent>
                    <IonHeader className="ion-no-border">
                        <IonToolbar>
                            <IonButton slot="end" fill="clear" color={'dark'} onClick={closeAddTeachModal}>
                                <IonIcon icon={closeSharp} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>

                    <IonTitle>
                        Subjects for Grade {selectedClass?.gradeLevel} - {selectedClass?.classSection}
                    </IonTitle>

                    <IonList>
                        {subjects.map((subject: SubjectWithTeacher) => (
                            <IonItem key={subject.subject_code}>
                                {subject.subject_name}

                                <IonText slot="end">
                                    {subject.semester === 1
                                        ? <IonChip color={'success'}>1st Sem</IonChip>
                                        : subject.semester === 2
                                            ? <IonChip color={'primary'}>2nd Sem</IonChip>
                                            : null
                                    }
                                </IonText>

                                <IonSelect
                                    slot="end"
                                    value={selectedTeachers[subject.subject_code] || undefined}
                                    onIonChange={(event: CustomEvent) => handleTeacherChange(subject, String(event.detail.value))}
                                    selectedText={selectedTeachers[subject.subject_code]}
                                >
                                    {facultyOptions.map((faculty: Faculty) => (
                                        <IonSelectOption key={faculty.employee_no} value={faculty.employee_no}>
                                            {faculty.title} {faculty.fname} {faculty.lname}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>

                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonModal>

        </IonPage>
    );
};

export { Classes };

