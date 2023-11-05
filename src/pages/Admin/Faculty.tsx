import {
    IonButton, IonButtons, IonCard, IonCol, IonContent, IonGrid, IonIcon, IonInput,
    IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonText, useIonToast
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { addOutline, close, create, trash } from "ionicons/icons";
import { useMediaQuery } from "react-responsive";
import './Faculty.css'
import axios from "axios";

interface FacultyModel {
    title: string,
    fname: string,
    lname: string,
    employee_no: number | null,
}

const Faculty: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [presentToast, dismissToast] = useIonToast();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [facultyList, setFacultyList] = useState<FacultyModel[]>([]); // Specify the type as an array of FacultyModel
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentEmployeeNo, setCurrentEmployeeNo] = useState<number | null>(null);

    const [facultyInfo, setFacultyInfo] = useState<FacultyModel>({
        title: "",
        fname: "",
        lname: "",
        employee_no: null, // Initialize as 0 or the appropriate default value
    });

    const [updatedFacultyInfo, setUpdatedFacultyInfo] = useState<FacultyModel>({
        title: "",
        fname: "",
        lname: "",
        employee_no: null, // Initialize as 0 or the appropriate default value
    });


    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const handleInputChange = (e: any) => {
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
            employee_no: null,
        });
    };

    const openUpdateModal = (faculty: FacultyModel) => {
        console.log("Opening update modal for faculty:", faculty);
    
        // Set the currentEmployeeNo state
        setCurrentEmployeeNo(faculty.employee_no);
    
        // Set the updatedFacultyInfo state with the faculty data
        setUpdatedFacultyInfo({
            title: faculty.title,
            fname: faculty.fname,
            lname: faculty.lname,
            employee_no: faculty.employee_no,
        });
        setShowUpdateModal(true);
    };
    

    const handleUpdateInputChange = (e: any) => {
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

        const employeeNumberValue = facultyInfo.employee_no;
        if (isNaN(employeeNumberValue)) {
            showToast('Employee Number must be a number.', 'danger');
            return;
        }

        // Make an HTTP POST request to your PHP script to insert faculty information.
        axios.post("https://studentportal.lcsinhs.com/scripts/faculty-add.php", facultyInfo)
            .then((response) => {
                console.log("Faculty added successfully:", response.data);
                showToast('Faculty Added', 'success');

                // Fetch the updated list of faculty members
                axios.get('https://studentportal.lcsinhs.com/scripts/faculty-fetch.php')
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
                    employee_no: null,
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
        if (!updatedFacultyInfo.title || !updatedFacultyInfo.fname || !updatedFacultyInfo.lname || currentEmployeeNo === null) {
            showToast('All fields are required.', 'danger');
            return;
        }
    
        // Send an HTTP PUT request to update the faculty details
        axios.put(`https://studentportal.lcsinhs.com/scripts/faculty-update.php?employee_no=${currentEmployeeNo}`, updatedFacultyInfo)
            .then((response) => {
                if (response.data && response.data.success) {
                    showToast('Faculty Updated', 'success');
    
                    const updatedFacultyList = facultyList.map((faculty) => {
                        if (faculty.employee_no === currentEmployeeNo) {
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
    
      


    const deleteFaculty = (employee_no: any) => {
        const confirmed = window.confirm('Are you sure you want to delete this faculty?');

        if (confirmed) {
            axios
                .delete(`https://studentportal.lcsinhs.com/scripts/faculty-delete.php`, {
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

    const closeAddmodal = () => {
        setShowAddModal(false);
    }

    const closeUpmodal = () => {
        setShowUpdateModal(false);
    }

    useEffect(() => {
        axios
            .get('https://studentportal.lcsinhs.com/scripts/faculty-fetch.php')
            .then((response) => {
                setFacultyList(response.data); 
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
                        <div className="spacer-h-s" />
                        <div className="faculty-add">
                            <IonButton color={'dark'}
                                onClick={() => setShowAddModal(true)}>
                                <IonIcon icon={addOutline} />
                                Add Faculty
                            </IonButton>
                        </div>

                        <IonGrid>
                            <IonRow>
                                <div className="spacer-w-s" />
                                <IonCol sizeMd="5">
                                    <IonText color={'dark'}>
                                        <b>Faculty Name</b>
                                    </IonText>
                                </IonCol>
                                <div className="spacer-w-m" />
                                <IonCol>
                                    <IonText>
                                        <b>Employee Number</b>
                                    </IonText>
                                </IonCol>
                            </IonRow>
                        </IonGrid>


                        {facultyList.map((faculty: FacultyModel) => (

                            <IonList key={faculty.employee_no}>
                                <IonItem>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonText color={'dark'}>
                                                    {faculty.title} {faculty.fname} {faculty.lname}
                                                </IonText>
                                            </IonCol>
                                            <IonCol>
                                                <IonText>{faculty.employee_no}</IonText>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>

                                    <IonButtons slot="end">
                                        <IonButton color={'primary'}
                                            onClick={() => {
                                                const currentEmployeeNo = faculty.employee_no;
                                                console.log('Employee Number:', currentEmployeeNo);
                                                openUpdateModal(faculty);
                                            }}>
                                            Update
                                        </IonButton>
                                        <IonButton
                                            color={'danger'}
                                            onClick={() => {
                                                console.log('Employee Number:', faculty.employee_no);
                                                deleteFaculty(faculty.employee_no);
                                            }}
                                        >
                                            Delete
                                        </IonButton>
                                    </IonButtons>
                                    {/* Hidden input field to store the employee number */}
                                    <input type="hidden" value={faculty.employee_no !== null ? faculty.employee_no.toString() : ''} />
                                </IonItem>
                            </IonList>
                        ))}

                    </div>


                </IonContent>
            </> : <>
                <IonContent>

                    <div>
                        <div className="spacer-h-s" />
                        <div className="faculty-add">
                            <IonButton color={'dark'}
                                onClick={() => setShowAddModal(true)}>
                                <IonIcon icon={addOutline} />
                                Add Faculty
                            </IonButton>
                        </div>


                        <div className="spacer-h-s" />
                        {facultyList.map((faculty: FacultyModel) => (

                            <IonList key={faculty.employee_no}>
                                <IonItem>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonText color={'dark'}>
                                                    {faculty.title} {faculty.fname} {faculty.lname}
                                                </IonText>
                                            </IonCol>
                                            <IonCol>
                                                <IonText>{faculty.employee_no}</IonText>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>

                                    <IonButtons slot="end">
                                        <IonButton color={'primary'}
                                            onClick={() => {
                                                const currentEmployeeNo = faculty.employee_no;
                                                console.log('Employee Number:', currentEmployeeNo);
                                                openUpdateModal(faculty);
                                            }}>
                                            Update
                                        </IonButton>
                                        <IonButton
                                            color={'danger'}
                                            onClick={() => {
                                                console.log('Employee Number:', faculty.employee_no);
                                                deleteFaculty(faculty.employee_no);
                                            }}
                                        >
                                            Delete
                                        </IonButton>
                                    </IonButtons>
                                    {/* Hidden input field to store the employee number */}
                                    <input type="hidden" value={faculty.employee_no !== null ? faculty.employee_no.toString() : ''} />
                                </IonItem>
                            </IonList>
                        ))}


                    </div>


                </IonContent>
            </>}

            <IonModal isOpen={showAddModal} onDidDismiss={closeAddmodal}>
                <div className="faculty-modal">

                    <div className="buttons-pref">
                        <IonButton fill="clear" color={'dark'} onClick={closeAddmodal}>
                            <IonIcon slot="icon-only" icon={close} />
                        </IonButton>
                    </div>

                    <h2>Enter Faculty Details:</h2>
                    <IonInput
                        fill="outline"
                        name="title"
                        value={facultyInfo.title}
                        placeholder="Mr./Ms./Mrs. or leave blank"
                        onIonChange={handleInputChange}
                    ></IonInput>
                    <div className="spacer-h-xs" />
                    <IonInput
                        fill="outline"
                        name="fname"
                        value={facultyInfo.fname}
                        placeholder="First Name"
                        onIonChange={handleInputChange}
                    ></IonInput>
                    <div className="spacer-h-xs" />
                    <IonInput
                        fill="outline"
                        name="lname"
                        value={facultyInfo.lname}
                        placeholder="Last Name"
                        onIonChange={handleInputChange}
                    ></IonInput>
                    <div className="spacer-h-xs" />
                    <IonInput
                        fill="outline"
                        name="employee_no"
                        value={facultyInfo.employee_no}
                        placeholder="Employee Number"
                        onIonChange={handleInputChange}
                    ></IonInput>
                    <div className="spacer-h-m" />

                    <div className="buttons-pref">
                        <IonButton fill="outline" color={'dark'} onClick={handleClear}>Clear</IonButton>
                        <IonButton color={'dark'} onClick={handleSubmit}>Add</IonButton>
                    </div>
                </div>
            </IonModal>

            <IonModal isOpen={showUpdateModal} onDidDismiss={closeUpmodal}>

                <div className="faculty-modal">
                    <div className="buttons-pref">
                        <IonButton fill="clear" color={'dark'} onClick={closeUpmodal}>
                            <IonIcon slot="icon-only" icon={close} />
                        </IonButton>
                    </div>

                    <h2>Update Faculty Details:</h2>

                    <IonInput
                        fill="outline"
                        name="title"
                        value={updatedFacultyInfo.title}
                        placeholder="Title"
                        onIonChange={handleUpdateInputChange}
                    ></IonInput>
                    <div className="spacer-h-xs" />

                    <IonInput
                        fill="outline"
                        name="fname"
                        value={updatedFacultyInfo.fname}
                        placeholder="First Name"
                        onIonChange={handleUpdateInputChange}
                    ></IonInput>
                    <div className="spacer-h-xs" />

                    <IonInput
                        fill="outline"
                        name="lname"
                        value={updatedFacultyInfo.lname}
                        placeholder="Last Name"
                        onIonChange={handleUpdateInputChange}
                    ></IonInput>
                    <div className="spacer-h-xs" />

                    <IonInput
                        fill="outline"
                        name="employee_no"
                        value={updatedFacultyInfo.employee_no}
                        placeholder="Employee Number"
                        onIonChange={handleUpdateInputChange}
                    ></IonInput>
                    <div className="spacer-h-m" />

                    <div className="buttons-pref">
                        <IonButton onClick={handleUpdateFaculty}>Update</IonButton>
                    </div>
                </div>
            </IonModal>
        </IonPage>
    );
};

export { Faculty };

