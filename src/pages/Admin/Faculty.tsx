import {
    IonAccordion,
    IonAccordionGroup,
    IonButton, IonButtons, IonCard, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput,
    IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonToast
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { addOutline, close, create, createOutline, trash } from "ionicons/icons";
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

    const handleSubmit = () => {
        if (facultyInfo.title || !facultyInfo.fname || !facultyInfo.lname || !facultyInfo.employee_no) {
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

        console.log(facultyInfo);

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

    const handleUpdateInputChange = (e: any) => {
        const { name, value } = e.target;
        setUpdatedFacultyInfo({
            ...updatedFacultyInfo,
            [name]: value,
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
                <IonContent color={'light'}>

                    <div>
                        <div className="spacer-h-s" />
                        <div className="options-col">
                            <div className="att-margin">
                                <IonLabel className="grades-text">
                                    Faculty List
                                </IonLabel>
                            </div>
                        </div>

                        <IonCard className="classes-card">
                            <IonCardHeader color={'light'}>
                                <IonText>Add A Faculty</IonText>
                            </IonCardHeader>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="2">
                                        <IonSelect
                                            fill="outline"
                                            name="title"
                                            value={facultyInfo.title}
                                            onIonChange={handleInputChange}
                                            interface="popover"
                                            justify="space-between"
                                            label="Select Title"
                                        >
                                            <IonSelectOption value=""></IonSelectOption>
                                            <IonSelectOption value="Ms.">Ms.</IonSelectOption>
                                            <IonSelectOption value="Mrs.">Mrs.</IonSelectOption>
                                            <IonSelectOption value="Mr.">Mr.</IonSelectOption>
                                        </IonSelect>
                                    </IonCol>
                                    <IonCol>
                                        <IonInput label="First Name:" fill="outline"
                                            name="fname"
                                            value={facultyInfo.fname}
                                            placeholder="Enter First Name"
                                            onIonChange={handleInputChange}
                                        />
                                    </IonCol>
                                    <IonCol>
                                        <IonInput label="Last Name:" fill="outline"
                                            name="lname"
                                            value={facultyInfo.lname}
                                            placeholder="Enter Last Name"
                                            onIonChange={handleInputChange}
                                        />
                                    </IonCol>
                                    <IonCol>
                                        <IonInput
                                            label="Employee No.:"
                                            fill="outline"
                                            name="employee_no"
                                            type="number"
                                            value={facultyInfo.employee_no}
                                            placeholder="Enter Employee Number"
                                            onIonChange={handleInputChange}
                                        ></IonInput>
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

                        <IonGrid>
                            <IonRow>
                                <IonCol className="cell-class">
                                    <IonText color={'dark'}>
                                        <b>Faculty Name</b>
                                    </IonText>
                                </IonCol>
                                <IonCol className="cell-class">
                                    <IonText>
                                        <b>Employee Number</b>
                                    </IonText>
                                </IonCol>
                                <IonCol className="cell-class" size="2">
                                    <IonText>
                                        <b>Actions</b>
                                    </IonText>
                                </IonCol>
                            </IonRow>

                            {facultyList.map((faculty: FacultyModel) => (

                                <IonRow key={faculty.employee_no} >
                                    <IonCol className="cell-class">
                                        <IonText color={'dark'}>
                                            {faculty.title} {faculty.fname} {faculty.lname}
                                        </IonText>
                                    </IonCol>
                                    <IonCol className="cell-class">
                                        <IonText>{faculty.employee_no}</IonText>
                                    </IonCol>
                                    <IonCol size="2" className="cell-class">
                                        <IonButton color={'primary'}
                                            className="buttons-font-size"
                                            onClick={() => {
                                                const currentEmployeeNo = faculty.employee_no;
                                                console.log('Employee Number:', currentEmployeeNo);
                                                openUpdateModal(faculty);
                                            }}> Update
                                            <IonIcon slot="start" icon={create} />
                                        </IonButton>
                                        <IonButton
                                            className="buttons-font-size"
                                            color={'danger'}
                                            onClick={() => {
                                                console.log('Employee Number:', faculty.employee_no);
                                                deleteFaculty(faculty.employee_no);
                                            }}
                                        > Delete
                                            <div className="spacer-h-s" />
                                            <IonIcon slot="start" icon={trash} />
                                        </IonButton>
                                    </IonCol>
                                    <input type="hidden" value={faculty.employee_no !== null ? faculty.employee_no.toString() : ''} />
                                </IonRow>
                            ))}
                        </IonGrid>
                    </div>


                </IonContent>
            </> : <>
                <IonContent>

                    <div>
                        <div className="spacer-h-s" />

                        <div className="m-upload-cal-button">
                            <IonAccordionGroup>
                                <IonAccordion value="first">
                                    <IonItem slot="header" color="light">
                                        <IonLabel>Add a Faculty</IonLabel>
                                    </IonItem>
                                    <div className="ion-padding" slot="content">
                                        <IonSelect
                                            fill="outline"
                                            name="title"
                                            value={facultyInfo.title}
                                            onIonChange={handleInputChange}
                                            interface="popover"
                                            justify="space-between"
                                            label="Select Title"
                                            labelPlacement="stacked"
                                        >
                                            <IonSelectOption value=""></IonSelectOption>
                                            <IonSelectOption value="Ms.">Ms.</IonSelectOption>
                                            <IonSelectOption value="Mrs.">Mrs.</IonSelectOption>
                                            <IonSelectOption value="Mr.">Mr.</IonSelectOption>
                                        </IonSelect>

                                        <div className="spacer-h-xs"></div>

                                        <IonInput label="First Name:" fill="outline"
                                            name="fname"
                                            value={facultyInfo.fname}
                                            onIonChange={handleInputChange}
                                            labelPlacement="stacked"
                                        />
                                        <div className="spacer-h-xs"></div>

                                        <IonInput label="Last Name:" fill="outline"
                                            name="lname"
                                            value={facultyInfo.lname}
                                            onIonChange={handleInputChange}
                                            labelPlacement="stacked"
                                        />
                                        <div className="spacer-h-xs"></div>

                                        <IonInput
                                            label="Employee No.:"
                                            fill="outline"
                                            name="employee_no"
                                            type="number"
                                            value={facultyInfo.employee_no}
                                            onIonChange={handleInputChange}
                                            labelPlacement="stacked"
                                        ></IonInput>

                                        {/*Submit Button*/}
                                        <div className="m-add-button-pl">
                                            <IonButton color={'dark'} type="submit" onClick={handleSubmit}>
                                                <IonIcon icon={addOutline} slot="start" />
                                                Add
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonAccordion>
                            </IonAccordionGroup>
                        </div>

                        <div className="spacer-h-s" />

                        <IonGrid>
                            <IonRow>
                                <IonCol className="cell-class" size="1"></IonCol>
                                <IonCol className="cell-class" size="4.5">Faculty Name</IonCol>
                                <IonCol className="cell-class" size="4.5">Employee No.</IonCol>
                                <IonCol className="cell-class">Actions</IonCol>
                            </IonRow>

                            {facultyList.map((faculty: FacultyModel, index) => (
                                <IonRow key={faculty.employee_no}>
                                    <IonCol className="cell-class"size="1">{index + 1}</IonCol>
                                    <IonCol className="cell-class"size="4.5">
                                        <IonText color={'dark'}>
                                            {faculty.title} {faculty.fname} {faculty.lname}
                                        </IonText>
                                    </IonCol>
                                    <IonCol className="cell-class"size="4.5">
                                        <IonText>{faculty.employee_no}</IonText>
                                    </IonCol>
                                    <IonCol className="cell-class">
                                        <IonRow>
                                            <IonButton color={'primary'}
                                                size="small"
                                                onClick={() => {
                                                    const currentEmployeeNo = faculty.employee_no;
                                                    console.log('Employee Number:', currentEmployeeNo);
                                                    openUpdateModal(faculty);
                                                }}>
                                                <IonIcon icon={create} />
                                            </IonButton>
                                            <IonButton
                                                size="small"
                                                color={'danger'}
                                                onClick={() => {
                                                    console.log('Employee Number:', faculty.employee_no);
                                                    deleteFaculty(faculty.employee_no);
                                                }}
                                            >
                                                <IonIcon icon={trash} />
                                            </IonButton>
                                        </IonRow>

                                    </IonCol>
                                    {/* Hidden input field to store the employee number */}
                                    <input type="hidden" value={faculty.employee_no !== null ? faculty.employee_no.toString() : ''} />
                                </IonRow>
                            ))}
                        </IonGrid>
                    </div>
                </IonContent>
            </>}

            {isDesktop ?
                <>
                    <IonModal isOpen={showUpdateModal} onDidDismiss={closeUpmodal}
                    >
                        <IonContent>
                            <IonHeader className="ion-no-border">
                                <IonToolbar>
                                    <IonTitle>Update Faculty Details</IonTitle>
                                    <IonButton fill="clear" color={'dark'} onClick={closeUpmodal} slot="end">
                                        <IonIcon slot="icon-only" icon={close} />
                                    </IonButton>
                                </IonToolbar>
                            </IonHeader>

                            <IonGrid>
                                <IonCol>
                                    <IonSelect
                                        fill="outline"
                                        name="title"
                                        value={updatedFacultyInfo.title}
                                        onIonChange={handleUpdateInputChange}
                                        interface="popover"
                                        justify="space-between"
                                        label="Select Title"
                                        selectedText={updatedFacultyInfo.title}
                                    >
                                        <IonSelectOption value=""></IonSelectOption>
                                        <IonSelectOption value="Ms.">Ms.</IonSelectOption>
                                        <IonSelectOption value="Mrs.">Mrs.</IonSelectOption>
                                        <IonSelectOption value="Mr.">Mr.</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        label="First Name:"
                                        fill="outline"
                                        name="fname"
                                        value={updatedFacultyInfo.fname}
                                        placeholder="First Name"
                                        onIonChange={handleUpdateInputChange}
                                    ></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        label="Last Name:"
                                        fill="outline"
                                        name="lname"
                                        value={updatedFacultyInfo.lname}
                                        placeholder="Last Name"
                                        onIonChange={handleUpdateInputChange}
                                    ></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        fill="outline"
                                        name="employee_no"
                                        type="number"
                                        label="Employee No.:"
                                        value={updatedFacultyInfo.employee_no}
                                        placeholder="Employee Number"
                                        onIonChange={handleUpdateInputChange}
                                    ></IonInput>
                                </IonCol>
                                <div className="buttons-pref">
                                    <IonButton onClick={handleUpdateFaculty}>Update</IonButton>
                                    <div className="spacer-w-xxs" />
                                </div>
                            </IonGrid>
                        </IonContent>
                    </IonModal>
                </> : <>
                    <IonModal isOpen={showUpdateModal}
                        onDidDismiss={closeUpmodal}
                        className="m-modal-props"
                        initialBreakpoint={0.60}
                        breakpoints={[0.5, 0.75, 1]}
                        backdropDismiss={true}
                        backdropBreakpoint={0.5}
                    >
                        <IonContent>
                            <div className="spacer-h-s" />

                            <IonHeader className="ion-no-border">
                                <IonToolbar>
                                    <IonTitle>Update Faculty Details</IonTitle>
                                    <IonButton fill="clear" color={'dark'} onClick={closeUpmodal} slot="end">
                                        <IonIcon slot="icon-only" icon={close} />
                                    </IonButton>
                                </IonToolbar>
                            </IonHeader>

                            <IonGrid>
                                <IonCol>
                                    <IonSelect
                                        fill="outline"
                                        name="title"
                                        value={updatedFacultyInfo.title}
                                        onIonChange={handleUpdateInputChange}
                                        interface="popover"
                                        justify="space-between"
                                        label="Select Title"
                                        selectedText={updatedFacultyInfo.title}
                                    >
                                        <IonSelectOption value=""></IonSelectOption>
                                        <IonSelectOption value="Ms.">Ms.</IonSelectOption>
                                        <IonSelectOption value="Mrs.">Mrs.</IonSelectOption>
                                        <IonSelectOption value="Mr.">Mr.</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        label="First Name:"
                                        fill="outline"
                                        name="fname"
                                        value={updatedFacultyInfo.fname}
                                        placeholder="First Name"
                                        onIonChange={handleUpdateInputChange}
                                    ></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        label="Last Name:"
                                        fill="outline"
                                        name="lname"
                                        value={updatedFacultyInfo.lname}
                                        placeholder="Last Name"
                                        onIonChange={handleUpdateInputChange}
                                    ></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        fill="outline"
                                        name="employee_no"
                                        type="number"
                                        label="Employee No.:"
                                        value={updatedFacultyInfo.employee_no}
                                        placeholder="Employee Number"
                                        onIonChange={handleUpdateInputChange}
                                    ></IonInput>
                                </IonCol>
                                <div className="spacer-h-s" />
                                <IonButton onClick={handleUpdateFaculty} expand="block">Update</IonButton>
                            </IonGrid>
                        </IonContent>
                    </IonModal>
                </>}
        </IonPage>
    );
};

export { Faculty };

