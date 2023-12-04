import {
    IonAccordion,
    IonAccordionGroup,
    IonButton, IonCard, IonCardHeader, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput,
    IonItem, IonItemDivider, IonLabel, IonModal, IonPage, IonPopover, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonToast
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { addOutline, archive, close, create, ellipsisHorizontal, refreshCircle, trash } from "ionicons/icons";
import { useMediaQuery } from "react-responsive";
import './Faculty.css'
import axios from "axios";
import { BiArchive, BiSolidArchive, BiSolidArchiveOut } from "react-icons/bi";

interface FacultyModel {
    title: string,
    fname: string,
    lname: string,
    employee_no: number | null,
    isArchived: number;
}

const Faculty: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [presentToast, dismissToast] = useIonToast();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [facultyList, setFacultyList] = useState<FacultyModel[]>([]); // Specify the type as an array of FacultyModel
    const [currentEmployeeNo, setCurrentEmployeeNo] = useState<number | null>(null);
    const [archivedFacultyModal, setArchivedfacultyModal] = useState(false);
    const [archivedFacultyList, setArchivedFacultyList] = useState<FacultyModel[]>([]);
    const [showPopover, setShowPopover] = useState<{ isOpen: boolean, event?: Event | undefined }>({ isOpen: false, event: undefined });
    const [showPopoverArchived, setShowPopoverArchived] = useState<{ isOpen: boolean, event?: Event | undefined }>({ isOpen: false, event: undefined });

    const openArchiveModal = () => {
        setArchivedfacultyModal(true);

        axios.get('https://studentportal.lcsinhs.com/scripts/faculty-archived-fetch.php')
            .then((response) => {
                setArchivedFacultyList(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const closeArchiveModal = () => {
        setArchivedfacultyModal(false);
    };

    const [facultyInfo, setFacultyInfo] = useState<FacultyModel>({
        title: "",
        fname: "",
        lname: "",
        employee_no: null, // Initialize as 0 or the appropriate default value
        isArchived: 0, // Initialize as 0 or the appropriate default value
    });

    const [updatedFacultyInfo, setUpdatedFacultyInfo] = useState<FacultyModel>({
        title: "",
        fname: "",
        lname: "",
        employee_no: null, // Initialize as 0 or the appropriate default value
        isArchived: 0, // Initialize as 0 or the appropriate default value
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
        // Set the currentEmployeeNo state
        setCurrentEmployeeNo(faculty.employee_no);

        // Set the updatedFacultyInfo state with the faculty data
        setUpdatedFacultyInfo({
            title: faculty.title,
            fname: faculty.fname,
            lname: faculty.lname,
            employee_no: faculty.employee_no,
            isArchived: 0,
        });
        setShowUpdateModal(true);
    };

    const closeUpmodal = () => {
        setShowUpdateModal(false);
    }

    const handleSubmit = () => {
        if (!facultyInfo.fname || !facultyInfo.lname || !facultyInfo.employee_no) {
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
                    isArchived: 0,
                });
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
        if (!updatedFacultyInfo.fname || !updatedFacultyInfo.lname || currentEmployeeNo === null) {
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

    const archiveFaculty = (employee_no: any) => {
        const confirmed = window.confirm('Are you sure you want to archive this faculty?');

        if (confirmed) {
            axios
                .delete(`https://studentportal.lcsinhs.com/scripts/faculty-archive.php`, {
                    data: { employee_no },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    if (response.data && response.data.success) {
                        showToast(response.data.message || 'Faculty Archived', 'success');

                        // Update both facultyList and archivedFacultyList to reflect the change
                        const updatedFacultyList = facultyList.map((faculty) => {
                            if (faculty.employee_no === employee_no) {
                                return { ...faculty, isArchived: 1 };
                            }
                            return faculty;
                        });

                        const updatedArchivedFacultyList = archivedFacultyList.concat(
                            facultyList.filter((faculty) => faculty.employee_no === employee_no)
                        );

                        setFacultyList(updatedFacultyList);
                        setArchivedFacultyList(updatedArchivedFacultyList);
                    } else {
                        console.error('Archiving failed:', response.data);
                        showToast(response.data.error || 'Faculty Archiving Failed', 'danger');
                    }
                })
                .catch((error) => {
                    console.error('Axios Error:', error);
                    showToast('Faculty Archiving Failed', 'danger');
                });
        }
    };

    const restoreFaculty = (employee_no: any) => {
        const confirmed = window.confirm('Are you sure you want to restore this faculty?');

        if (confirmed) {
            axios
                .delete(`https://studentportal.lcsinhs.com/scripts/faculty-restore.php`, {
                    data: { employee_no },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    if (response.data && response.data.success) {
                        showToast(response.data.message || 'Faculty Restored', 'success');

                        // Update the facultyList to reflect the change
                        const restoredFaculty = archivedFacultyList.find((faculty) => faculty.employee_no === employee_no);
                        if (restoredFaculty) {
                            setFacultyList((prevList) => [...prevList, restoredFaculty]);
                        }

                        // Remove the restored faculty from the archived list
                        setArchivedFacultyList((prevList) => prevList.filter((faculty) => faculty.employee_no !== employee_no));
                    } else {
                        console.error('Restoring failed:', response.data);
                        showToast(response.data.error || 'Faculty Restoring Failed', 'danger');
                    }
                })
                .catch((error) => {
                    console.error('Axios Error:', error);
                    showToast('Faculty Restoring Failed', 'danger');
                });
        }
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
                        showToast(response.data.message || 'Faculty Deleted', 'success');
                        // Filter out the deleted faculty from the facultyList
                        const updatedFacultyList = facultyList.filter((faculty) => faculty.employee_no !== employee_no);
                        setFacultyList(updatedFacultyList);
                    } else {
                        console.error('Deletion failed:', response.data);
                        showToast(response.data.error || 'Faculty Deletion Failed', 'danger');
                    }
                })
                .catch((error) => {
                    console.error('Axios Error:', error);
                    showToast('Faculty Deletion Failed', 'danger');
                });
        }
    };

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
                            <IonButton color={'medium'} shape="round" onClick={openArchiveModal}>
                                Archived Faculty
                            </IonButton>
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
                                            label="Title (Optional):"
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

                        <IonCard className="table-prop">
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
                                    <IonCol className="cell-class" size="3">
                                        <IonText>
                                            <b>Actions</b>
                                        </IonText>
                                    </IonCol>
                                </IonRow>

                                {facultyList.map((faculty: FacultyModel) => (
                                    !faculty.isArchived && (
                                        <IonRow key={faculty.employee_no} >
                                            <IonCol className="cell-class">
                                                <IonText color={'dark'}>
                                                    {faculty.title} {faculty.fname} {faculty.lname}
                                                </IonText>
                                            </IonCol>
                                            <IonCol className="cell-class">
                                                <IonText>{faculty.employee_no}</IonText>
                                            </IonCol>
                                            <IonCol size="3" className="cell-class">
                                                <IonButton color={'primary'}
                                                    className="buttons-font-size"
                                                    onClick={() => {
                                                        openUpdateModal(faculty);
                                                    }}> Update
                                                    <IonIcon slot="start" icon={create} />
                                                </IonButton>
                                                <IonButton
                                                    className="buttons-font-size"
                                                    color={'tertiary'}
                                                    onClick={() => {
                                                        archiveFaculty(faculty.employee_no);
                                                    }}
                                                > Archive
                                                    <IonIcon slot="start" icon={archive} />
                                                </IonButton>
                                                <IonButton
                                                    className="buttons-font-size"
                                                    color={'danger'}
                                                    onClick={() => {
                                                        deleteFaculty(faculty.employee_no);
                                                    }}
                                                > Delete
                                                    <div className="spacer-h-s" />
                                                    <IonIcon slot="start" icon={trash} />
                                                </IonButton>
                                            </IonCol>
                                            <input type="hidden" value={faculty.employee_no !== null ? faculty.employee_no.toString() : ''} />
                                        </IonRow>
                                    )
                                ))}
                            </IonGrid>
                        </IonCard>
                    </div>

                </IonContent>
            </> : <>

                {/*MOBILE*/}
                <IonContent color={'light'}>
                    <div>
                        <div className="spacer-h-s" />
                        <div className="options-col">
                            <div className="att-margin">
                            </div>
                            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                                <IonFabButton color={'tertiary'} onClick={openArchiveModal}
                                >
                                    <BiSolidArchive size={20} />
                                </IonFabButton>
                            </IonFab>
                        </div>

                        <div className="m-upload-cal-button">
                            <IonAccordionGroup>
                                <IonAccordion value="first">
                                    <IonItem slot="header">
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
                                        <div className="spacer-h-xs" />
                                        <div className="m-add-button-pl">
                                            <IonButton color={'dark'} type="submit" onClick={handleSubmit}>
                                                Submit
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonAccordion>
                            </IonAccordionGroup>
                        </div>

                        <div className="spacer-h-s" />

                        <IonGrid className="grid-propsss">
                            <IonRow>
                                <IonCol className="cell-class" size="5"><b>Faculty Name</b></IonCol>
                                <IonCol className="cell-class" size="5"><b>Employee No.</b></IonCol>
                                <IonCol className="cell-class"><b>Actions</b></IonCol>
                            </IonRow>

                            {facultyList.map((faculty: FacultyModel) => (
                                !faculty.isArchived && (
                                    <IonRow key={faculty.employee_no}>
                                        <IonCol className="cell-class" size="5">
                                            <IonText color={'dark'}>
                                                {faculty.title} {faculty.fname} {faculty.lname}
                                            </IonText>
                                        </IonCol>
                                        <IonCol className="cell-class" size="5">
                                            <IonText>{faculty.employee_no}</IonText>
                                        </IonCol>
                                        <IonCol className="cell-class">
                                            <IonRow>
                                                <IonButton id="action-buttons" fill="clear"
                                                    onClick={(e) => setShowPopover({ isOpen: true, event: e.nativeEvent })}
                                                    color={'dark'} size="small"
                                                >
                                                    <IonIcon icon={ellipsisHorizontal} />
                                                </IonButton>

                                                <IonPopover
                                                    side="bottom"
                                                    isOpen={showPopover.isOpen}
                                                    event={showPopover.event}
                                                    onDidDismiss={() => setShowPopover({ isOpen: false, event: undefined })}
                                                >
                                                    <IonContent class="ion-padding">
                                                        <IonButton color={'primary'} onClick={() => { openUpdateModal(faculty); }}>
                                                            <IonIcon icon={create} slot="start" />
                                                            Update
                                                        </IonButton>
                                                        <IonButton color={'tertiary'} onClick={() => { archiveFaculty(faculty.employee_no); }}>
                                                            <IonIcon icon={archive} slot="start" />
                                                            Archive
                                                        </IonButton>
                                                        <IonButton color={'danger'} onClick={() => { deleteFaculty(faculty.employee_no); }}>
                                                            <IonIcon icon={trash} slot="start" />
                                                            Delete
                                                        </IonButton>
                                                    </IonContent>
                                                </IonPopover>

                                            </IonRow>
                                        </IonCol>
                                        {/* Hidden input field to store the employee number */}
                                        <input type="hidden" value={faculty.employee_no !== null ? faculty.employee_no.toString() : ''} />
                                    </IonRow>
                                )
                            ))}
                        </IonGrid>
                    </div>
                </IonContent>
            </>}

            {isDesktop ?
                <>
                    {/*UPDATE MODAL*/}
                    <IonModal isOpen={showUpdateModal}
                        onDidDismiss={closeUpmodal}
                        className="modal-des"
                    >
                        <div className="modal-view">
                            <center>
                                <h3><b>Update Faculty Details</b></h3>
                            </center>
                            <IonItemDivider />
                            <div className="spacer-h-m"></div>
                            <div className="spacer-h-m"></div>

                            <IonSelect
                                fill="outline"
                                name="title"
                                value={updatedFacultyInfo.title}
                                onIonChange={handleUpdateInputChange}
                                interface="popover"
                                justify="space-between"
                                label="Title:"
                                selectedText={updatedFacultyInfo.title}
                            >
                                <IonSelectOption value=""></IonSelectOption>
                                <IonSelectOption value="Ms.">Ms.</IonSelectOption>
                                <IonSelectOption value="Mrs.">Mrs.</IonSelectOption>
                                <IonSelectOption value="Mr.">Mr.</IonSelectOption>
                            </IonSelect>
                            <div className="spacer-h-m"></div>

                            <IonInput
                                label="First Name:"
                                fill="outline"
                                name="fname"
                                value={updatedFacultyInfo.fname}
                                placeholder="First Name"
                                onIonChange={handleUpdateInputChange}
                            ></IonInput>
                            <div className="spacer-h-m"></div>

                            <IonInput
                                label="Last Name:"
                                fill="outline"
                                name="lname"
                                value={updatedFacultyInfo.lname}
                                placeholder="Last Name"
                                onIonChange={handleUpdateInputChange}
                            ></IonInput>
                            <div className="spacer-h-m"></div>

                            <IonInput
                                fill="outline"
                                name="employee_no"
                                type="number"
                                label="Employee No.:"
                                value={updatedFacultyInfo.employee_no}
                                placeholder="Employee Number"
                                onIonChange={handleUpdateInputChange}
                            ></IonInput>
                            <div className="spacer-h-m"></div>

                            <div className="buttons-pref">
                                <IonButton onClick={handleUpdateFaculty}>Update</IonButton>
                                <div className="spacer-w-xxs" />
                            </div>
                        </div>
                    </IonModal>

                    {/*ARCHIVE MODAL*/}
                    <IonModal className='modal-des'
                        isOpen={archivedFacultyModal}
                        onDidDismiss={closeArchiveModal}>
                        <div className='modal-view'>
                            <center>
                                <h3><b>Archived Faculty</b></h3>
                            </center>
                            <IonItemDivider />

                            <div className="spacer-h-m"></div>

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
                                    <IonCol className="cell-class" size="3.5">
                                        <IonText>
                                            <b>Actions</b>
                                        </IonText>
                                    </IonCol>
                                </IonRow>

                                {archivedFacultyList.map((faculty: FacultyModel) => (

                                    <IonRow key={faculty.employee_no} >
                                        <IonCol className="cell-class">
                                            <IonText color={'dark'}>
                                                {faculty.title} {faculty.fname} {faculty.lname}
                                            </IonText>
                                        </IonCol>
                                        <IonCol className="cell-class">
                                            <IonText>{faculty.employee_no}</IonText>
                                        </IonCol>
                                        <IonCol size="3.5" className="cell-class">
                                            <IonButton color={'primary'}
                                                onClick={() => { openUpdateModal(faculty); }}
                                                title="Update"
                                                size="small"
                                                fill="clear"
                                            >
                                                <IonIcon slot="icon-only" icon={create} />
                                            </IonButton>

                                            <IonButton
                                                color={'tertiary'}
                                                onClick={() => { restoreFaculty(faculty.employee_no); }}
                                                title="Restore"
                                                size="small"
                                                fill="clear"
                                            >
                                                <IonIcon slot="icon-only" icon={refreshCircle} />
                                            </IonButton>

                                            <IonButton
                                                color={'danger'}
                                                onClick={() => { deleteFaculty(faculty.employee_no); }}
                                                title="Delete"
                                                size="small"
                                                fill="clear"
                                            >
                                                <IonIcon slot="icon-only" icon={trash} />
                                            </IonButton>
                                        </IonCol>
                                        <input type="hidden" value={faculty.employee_no !== null ? faculty.employee_no.toString() : ''} />
                                    </IonRow>

                                ))}
                            </IonGrid>

                            {/* Check if there are no archived faculty */}
                            {archivedFacultyList.length === 0 && (
                                <>
                                    <div className="spacer-h-s" />
                                    <IonText><center>No archived faculty.</center></IonText>
                                </>
                            )}
                        </div>
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

                    {/*ARCHIVE MODAL*/}
                    <IonModal
                        isOpen={archivedFacultyModal}
                        onDidDismiss={closeArchiveModal}
                        className="m-modal-props"
                        initialBreakpoint={0.80}
                        breakpoints={[0.5, 0.75, 1]}
                        backdropDismiss={true}
                        backdropBreakpoint={0.5}
                    >
                        <div className='modal-view'>
                            <center>
                                <h3><b>Archived Faculty</b></h3>
                            </center>
                            <IonItemDivider />

                            <div className="spacer-h-m"></div>

                            <IonGrid className="grid-propsss">
                                <IonRow>
                                    <IonCol className="cell-class" size="5">
                                        <IonText color={'dark'}>
                                            <b>Faculty Name</b>
                                        </IonText>
                                    </IonCol>
                                    <IonCol className="cell-class" size="5">
                                        <IonText>
                                            <b>Employee No.</b>
                                        </IonText>
                                    </IonCol>
                                    <IonCol className="cell-class">
                                        <IonText>
                                            <b>Actions</b>
                                        </IonText>
                                    </IonCol>
                                </IonRow>

                                {archivedFacultyList.map((faculty: FacultyModel) => (

                                    <IonRow key={faculty.employee_no} >
                                        <IonCol className="cell-class" size="5">
                                            <IonText color={'dark'}>
                                                {faculty.title} {faculty.fname} {faculty.lname}
                                            </IonText>
                                        </IonCol>
                                        <IonCol className="cell-class" size="5">
                                            <IonText>{faculty.employee_no}</IonText>
                                        </IonCol>
                                        <IonCol className="cell-class" >
                                            <IonRow>
                                                <IonButton fill="clear"
                                                    onClick={(e) => setShowPopoverArchived({ isOpen: true, event: e.nativeEvent })}
                                                    color={'dark'} size="small"
                                                >
                                                    <IonIcon icon={ellipsisHorizontal} />
                                                </IonButton>


                                                <IonPopover
                                                    side="bottom"
                                                    isOpen={showPopoverArchived.isOpen}
                                                    event={showPopoverArchived.event}
                                                    onDidDismiss={() => setShowPopoverArchived({ isOpen: false, event: undefined })}
                                                >
                                                    <IonContent class="ion-padding">
                                                        <IonButton color={'primary'}
                                                            onClick={() => { openUpdateModal(faculty); }}
                                                            title="Update"
                                                        >Update
                                                            <IonIcon slot="start" icon={create} />
                                                        </IonButton>

                                                        <IonButton
                                                            color={'tertiary'}
                                                            onClick={() => { restoreFaculty(faculty.employee_no); }}
                                                            title="Restore"
                                                        >Restore
                                                            <IonIcon slot="start" icon={refreshCircle} />
                                                        </IonButton>

                                                        <IonButton
                                                            color={'danger'}
                                                            onClick={() => { deleteFaculty(faculty.employee_no); }}
                                                            title="Delete"
                                                        >Delete
                                                            <IonIcon slot="start" icon={trash} />
                                                        </IonButton>
                                                    </IonContent>
                                                </IonPopover>


                                            </IonRow>
                                        </IonCol>
                                        <input type="hidden" value={faculty.employee_no !== null ? faculty.employee_no.toString() : ''} />
                                    </IonRow>

                                ))}
                            </IonGrid>

                            {/* Check if there are no archived faculty */}
                            {archivedFacultyList.length === 0 && (
                                <>
                                    <div className="spacer-h-s" />
                                    <IonText><center>No archived faculty.</center></IonText>
                                </>
                            )}
                        </div>
                    </IonModal>
                </>}

        </IonPage>
    );
};

export { Faculty };

