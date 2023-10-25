import { IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonInput, IonLabel, IonMenu, IonModal, IonPage, IonSearchbar, IonSplitPane, IonText, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { addCircle, addOutline, create, trash } from "ionicons/icons";
import { useMediaQuery } from "react-responsive";
import './Faculty.css'
import axios from "axios";

const Faculty: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [presentToast, dismissToast] = useIonToast();
    const [faculty, setFaculty] = useState('');
    const [error, setError] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [facultyList, setFacultyList] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false); //

    const [facultyInfo, setFacultyInfo] = useState({
        title: "",
        fname: "",
        lname: "",
        employee_no: "",
    });

    const [updatedFacultyInfo, setUpdatedFacultyInfo] = useState({
        title: faculty.title,
        fname: faculty.fname,
        lname: faculty.lname,
        employee_no: faculty.employee_no,
    });

    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFacultyInfo({
            ...facultyInfo,
            [name]: value,
        });
    };

    const handleClear = () => {
        setFacultyInfo({
            title: "",
            fname: "",
            lname: "",
            employee_no: "",
        });
    };

    const openUpdateModal = (faculty) => {
        console.log("Opening update modal for faculty:", faculty);
        setUpdatedFacultyInfo({
            title: faculty.title,
            fname: faculty.fname,
            lname: faculty.lname,
            employee_no: faculty.employee_no,
        });
        // Store the current employee number
        setUpdatedFacultyInfo({ ...updatedFacultyInfo, current_employee_no: faculty.employee_no });
        setShowUpdateModal(true);
    };


    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedFacultyInfo({
            ...updatedFacultyInfo,
            [name]: value,
        });
    };


    const handleSubmit = () => {
        if (!facultyInfo.title || !facultyInfo.fname || !facultyInfo.lname || !facultyInfo.employee_no) {
            showToast('All fields are required.', 'danger');
            return;
        }

        // Check if the employee number already exists
        if (facultyList.some((faculty) => faculty.employee_no === facultyInfo.employee_no)) {
            showToast('Employee number already exists.', 'danger');
            return;
        }

        const employeeNumberValue = parseInt(facultyInfo.employee_no, 10);
        if (isNaN(employeeNumberValue)) {
            showToast('Employee Number must be a number.', 'danger');
            return;
        }

        // Make an HTTP POST request to your PHP script to insert faculty information.
        axios.post("http://localhost/faculty-add.php", facultyInfo)
            .then((response) => {
                console.log("Faculty added successfully:", response.data);
                showToast('Faculty Added', 'success');

                // Fetch the updated list of faculty members
                axios.get('http://localhost/faculty-fetch.php')
                    .then((response) => {
                        setFacultyList(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                setFacultyInfo({
                    title: "",
                    fname: "",
                    lname: "",
                    employee_no: "",
                });

                setShowAddModal(false);
            })
            .catch((error) => {
                console.error("Error adding faculty:", error);
                showToast('Error Adding Faculty', 'danger');
            });
    };

    const handleUpdateFaculty = () => {
        console.log('Updated Faculty Info:', updatedFacultyInfo);
        if (!updatedFacultyInfo.title || !updatedFacultyInfo.fname || !updatedFacultyInfo.lname || !updatedFacultyInfo.employee_no) {
            showToast('All fields are required.', 'danger');
            return;
        }

        // Check if the updated employee number already exists in the facultyList
        if (facultyList.some((faculty) => faculty.employee_no === updatedFacultyInfo.employee_no && faculty.employee_no !== updatedFacultyInfo.current_employee_no)) {
            showToast('Employee number already exists.', 'danger');
            return;
        }

        const employeeNumberValue = parseInt(updatedFacultyInfo.employee_no, 10);
        if (isNaN(employeeNumberValue)) {
            showToast('Employee Number must be a number.', 'danger');
            return;
        }

        // Send an HTTP PUT request to update the faculty details
        axios.put(`http://localhost/faculty-update.php?employee_no=${updatedFacultyInfo.current_employee_no}`, updatedFacultyInfo)
            .then((response) => {
                if (response.data && response.data.success) {
                    showToast('Faculty Updated', 'success');

                    const updatedFacultyList = facultyList.map((faculty) => {
                        if (faculty.employee_no === updatedFacultyInfo.current_employee_no) {
                            return { ...faculty, ...updatedFacultyInfo };
                        }
                        return faculty;
                    });
                    setFacultyList(updatedFacultyList);
                } else {
                    console.error('Update failed:', response.data);
                    showToast('Faculty Update Failed', 'danger');
                }
            })
            .catch((error) => {
                console.error('Axios Error:', error);
                showToast('Faculty Update Failed', 'danger');
            });

        setShowUpdateModal(false);
    };


    const deleteFaculty = (employee_no) => {
        const confirmed = window.confirm('Are you sure you want to delete this faculty?');

        if (confirmed) {
            axios
                .delete(`http://localhost/faculty-delete.php`, {
                    data: { employee_no },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    if (response.data && response.data.success) {
                        showToast('Faculty Deleted', 'success');
                        // Filter out the deleted faculty from the facultyList
                        const updatedFacultyList = facultyList.filter((faculty) => faculty.employee_no !== employee_no);
                        setFacultyList(updatedFacultyList);
                    } else {
                        console.error('Deletion failed:', response.data);
                        showToast('Faculty Deletion Failed', 'danger');
                    }
                })
                .catch((error) => {
                    console.error('Axios Error:', error);
                    showToast('Faculty Deletion Failed', 'danger');
                });
        }
    };

    useEffect(() => {
        // Fetch faculty members from your API endpoint when the component mounts.
        axios
            .get('http://localhost/faculty-fetch.php')
            .then((response) => {
                setFacultyList(response.data); // Set facultyList with the response data
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <IonPage>
            <AdminHeader />
            {isDesktop ? <>
                <IonContent>

                    <div>
                        <div>
                            <IonButton
                                onClick={() => setShowAddModal(true)}>
                                <IonIcon icon={addOutline} />
                                Add Faculty
                            </IonButton>
                        </div>

                        {/*                        <div className="search-bar">
                            <div className="search-bar-desc">
                            </div>
                            <IonSearchbar

                                placeholder="Search"
                                debounce={300}
                            />
                            <div className="search-desc">
                                <IonText color={'medium'} className="search-desc-size">
                                    Input detail of Faculty using either Employee Number, First Name or Last Name and hit enter.
                                </IonText>
                            </div>
                        </div> */}


                        {facultyList.map((faculty) => (
                            <IonCard key={faculty.employee_no}>
                    
                                <div>
                                    <p>
                                        Faculty Name: {faculty.title} {faculty.fname} {faculty.lname}
                                    </p>
                                    <p>Employee Number: {faculty.employee_no}</p>
                                </div>

                                <IonButtons>
                                    <IonButton color={'primary'}
                                        onClick={() => {
                                            const currentEmployeeNo = faculty.employee_no;
                                            console.log('Employee Number:', currentEmployeeNo);
                                            openUpdateModal(faculty);
                                        }}>
                                        <IonIcon icon={create} /> Update
                                    </IonButton>
                                    <IonButton
                                        color={'danger'}
                                        onClick={() => {
                                            console.log('Employee Number:', faculty.employee_no);
                                            deleteFaculty(faculty.employee_no);
                                        }}
                                    >
                                        <IonIcon icon={trash} /> Delete
                                    </IonButton>
                                </IonButtons>
                                {/* Hidden input field to store the employee number */}
                                <input type="hidden" value={faculty.employee_no} />
                            </IonCard>
                        ))}

                    </div>


                </IonContent>
            </> : <></>}

            <IonModal isOpen={showAddModal}>
                <div>
                    <IonInput
                        fill="outline"
                        name="title"
                        value={facultyInfo.title}
                        placeholder="Mr./Ms./Mrs. or leave blank"
                        onIonChange={handleInputChange}
                    ></IonInput>
                    <div className="spacer-h-xxs" />
                    <IonInput
                        fill="outline"
                        name="fname"
                        value={facultyInfo.fname}
                        placeholder="First Name"
                        onIonChange={handleInputChange}
                    ></IonInput>
                    <div className="spacer-h-xxs" />
                    <IonInput
                        fill="outline"
                        name="lname"
                        value={facultyInfo.lname}
                        placeholder="Last Name"
                        onIonChange={handleInputChange}
                    ></IonInput>
                    <div className="spacer-h-xxs" />
                    <IonInput
                        fill="outline"
                        name="employee_no"
                        value={facultyInfo.employee_no}
                        placeholder="Employee Number"
                        onIonChange={handleInputChange}
                    ></IonInput>
                    <div className="spacer-h-xxs" />

                    <div className="buttons-pref">
                        <IonButton fill="outline" color={'dark'} onClick={handleClear}>Clear</IonButton>
                        <IonButton color={'dark'} onClick={handleSubmit}>Add</IonButton>
                    </div>
                </div>
            </IonModal>

            <IonModal isOpen={showUpdateModal}>
                <IonContent>
                    <IonInput
                        fill="outline"
                        name="title"
                        value={updatedFacultyInfo.title}
                        placeholder="Title"
                        onIonChange={handleUpdateInputChange}
                    ></IonInput>
                    <IonInput
                        fill="outline"
                        name="fname"
                        value={updatedFacultyInfo.fname}
                        placeholder="First Name"
                        onIonChange={handleUpdateInputChange}
                    ></IonInput>
                    <IonInput
                        fill="outline"
                        name="lname"
                        value={updatedFacultyInfo.lname}
                        placeholder="Last Name"
                        onIonChange={handleUpdateInputChange}
                    ></IonInput>
                    <IonInput
                        fill="outline"
                        name="employee_no"
                        value={updatedFacultyInfo.employee_no}
                        placeholder="Employee Number"
                        onIonChange={handleUpdateInputChange}
                    ></IonInput>
                    <IonButton onClick={handleUpdateFaculty}>Update</IonButton>
                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export { Faculty };

