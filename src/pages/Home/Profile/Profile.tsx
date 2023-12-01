import {
    IonAvatar, IonButton, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonIcon, IonImg,
    IonInput, IonItem, IonLabel, IonModal, IonPage, IonText, IonTitle, IonToolbar,
    useIonToast
} from "@ionic/react";
import { arrowBack, close, closeOutline, documentText, folderOpen, idCard, list, logOut, person, qrCode, school, time } from "ionicons/icons";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import QRCode from 'qrcode.react';
import './Profile.css'
import '/src/components/Spacer.css'

interface UserData {
    student_lrn: string;
    f_name: string;
    l_name: string;
    class_code: string;
    CoR: string;
    form_137: string;
    good_moral: string;
    CoEnrolment: string;
    CoRanking: string;
    grade_level: number | null;
    class_schedule: string;

    section_name: string;
    class_adviser: string;
    title: string;
    fname: string;
    lname: string;
}

interface SubjectModel {
    semester: number;
    subject_name: string;
}


const Profile = () => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    const [showQRCode, setShowQRCode] = useState(false);
    const [showQRCodeModal, setShowQRCodeModal] = useState(false);
    const [showDocs, setShowDocs] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const history = useHistory();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [emergencyContact, setEmergencyContact] = useState("");
    const [emergencyNumber, setEmergencyNumber] = useState("");
    const [emergencyAddress, setEmergencyAddress] = useState("");
    const [emailParent, setEmailParent] = useState("");
    const [presentToast, dismissToast] = useIonToast();
    const initialProfilePicturePath = localStorage.getItem('profilePicturePath');
    const [hasUploadedPicture, setHasUploadedPicture] = useState(false);
    const [hasSubmittedInfo, setHasSubmittedInfo] = useState(false);
    const [profilePicturePath, setProfilePicturePath] = useState(
        initialProfilePicturePath || 'https://ionicframework.com/docs/img/demos/avatar.svg'
    );
    const [surveyLink, setSurveyLink] = useState("");
    const [enrolLink, setEnrolLink] = useState("");
    const [showSubjectsModal, setShowSubjectsModal] = useState(false);
    const [showSubjectsJHSModal, setShowSubjectsJHSModal] = useState(false);
    const [gradeLevel, setGradeLevel] = useState<number | null>(null);
    const [subjects, setSubjects] = useState<SubjectModel[]>([]);
    const [subjectsJHS, setSubjectsJHS] = useState<[]>([]);
    const username = localStorage.getItem('username') || '';

    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const [userData, setUserData] = useState<UserData>({
        student_lrn: '', f_name: '', l_name: '', class_code: '', CoR: '',
        form_137: '', good_moral: '', CoEnrolment: '', CoRanking: '', grade_level: 0,
        section_name: '', class_adviser: '', title: '', fname: '', lname: '', class_schedule: '',
    });

    const uploadAvatar = () => {
        if (avatarFile) {
            const formData = new FormData();
            formData.append("profile_pic", avatarFile);
            formData.append("username", username);

            axios
                .post("https://studentportal.lcsinhs.com/scripts/upload-avatar.php", formData)
                .then((response) => {
                    showToast("Avatar uploaded successfully", "success");
                    setProfilePicturePath(response.data);
                    setHasUploadedPicture(true);
                    window.location.reload();
                })
                .catch((error) => {
                    showToast("Error uploading avatar", "danger");
                });
        } else {
            showToast("Please select an avatar file", "danger");
        }
    };

    const submitEmergencyContact = () => {
        if (!emergencyContact || !emergencyNumber || !emergencyAddress) {
            showToast("Please fill in all fields.", "danger");
            return;
        }

        const newData = {
            emergencyContact,
            emergencyNumber,
            emergencyAddress,
            emailParent,
            username,
        };

        axios
            .post("https://studentportal.lcsinhs.com/scripts/submit-emergency-contact.php", JSON.stringify(newData))
            .then((response) => {
                if (response.data.success) {
                    showToast('Information Updated.', 'success');
                    closeInfoModal();
                    setHasSubmittedInfo(true);
                } else {
                    showToast('Error.', 'danger');
                    setHasSubmittedInfo(false);
                }
            })
            .catch((error) => {
                console.log(error);
                showToast("Error submitting emergency contact information", "danger");
            });
    };

    //FOR DOCS

    const handleViewClick = (documentPath: string) => {
        if (!documentPath) {
            showToast("No document available.", "warning");
            return;
        }

        const viewUrl = `https://studentportal.lcsinhs.com/scripts/file-fetch-profile.php?file=${documentPath}`;
        window.open(viewUrl, '_blank');
    };

    const handlePrintClick = (documentPath: string) => {
        if (!documentPath) {
            showToast("No document available.", "warning");
            return;
        }

        const viewUrl = `https://studentportal.lcsinhs.com/scripts/file-fetch-profile.php?file=${documentPath}`;
        const printWindow = window.open(viewUrl, '_blank');
        if (printWindow) {
            printWindow.print();
        } else {
            showToast("Failed to open print dialog.", "error");
        }
    };

    //FOR SCHEDULE

    const openScheduleWindow = () => {
        const schedule_link = userData.class_schedule;
        
        // Open a new window to display the image
        const viewUrl = `https://studentportal.lcsinhs.com/schedule_imgs/${schedule_link}`;
        window.open(viewUrl, '_blank');
    };
    

    //FOR SURVEY

    const handleAnswerSurvey = () => {
        if (surveyLink) {
            window.open(surveyLink, '_blank'); // Open the survey link in a new tab
        } else {
            window.alert("No survey link available.");
        }
    };

    //FOR ENROLMENT

    const handleEnrolForm = () => {
        if (enrolLink) {
            window.open(enrolLink, '_blank'); // Open the survey link in a new tab
        } else {
            window.alert("Request Form link not available.");
        }
    };

    //FETCH SURVEY LINK
    useEffect(() => {
        if (username) {
            axios
                .get('https://studentportal.lcsinhs.com/scripts/survey-fetch.php') // Replace with the actual endpoint to fetch the survey link
                .then((response) => {
                    const fetchedSurveyLink = response.data.surveyLink;
                    if (fetchedSurveyLink) {
                        setSurveyLink(fetchedSurveyLink);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [username]);

    //FETCH REQUEST FORM LINK
    useEffect(() => {
        if (username) {
            axios
                .get('https://studentportal.lcsinhs.com/scripts/enrolment-fetch.php') // Replace with the actual endpoint to fetch the enrollment link
                .then((response) => {
                    const fetchedEnrolForm = response.data.enrolLink;
                    if (fetchedEnrolForm) {
                        setEnrolLink(fetchedEnrolForm);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [username]);

    // FETCH PROFILE PIC AND OTHER DETAILS
    useEffect(() => {
        if (username) {
            axios
                .post('https://studentportal.lcsinhs.com/scripts/profile.php', { username: username })
                .then((response) => {
                    if (response.data.profile_pic) {
                        const profilePicturePath = `https://studentportal.lcsinhs.com/scripts/fetch_profile_pic.php?file=${response.data.profile_pic}`;
                        setProfilePicturePath(profilePicturePath);
                        setHasUploadedPicture(true);
                    } else {
                        setHasUploadedPicture(false);
                    }

                    setEmergencyContact(response.data.emergency_co || '');
                    setEmergencyNumber(response.data.emergency_no || '');
                    setEmergencyAddress(response.data.emergency_add || '');
                    setEmailParent(response.data.parent_email || '');

                    // Check if the response contains the student's grade level
                    if (response.data.grade_level) {
                        setGradeLevel(response.data.grade_level);

                        // Determine the appropriate API endpoint based on the grade level
                        let apiEndpoint;
                        if (response.data.grade_level >= 7 && response.data.grade_level <= 10) {
                            // Grade 7-10 API endpoint
                            apiEndpoint = 'https://studentportal.lcsinhs.com/scripts/subjects-jhs-fetch.php';
                        } else if (response.data.grade_level >= 11 && response.data.grade_level <= 12) {
                            // Grade 11-12 API endpoint (for subjects_shs table)
                            apiEndpoint = 'https://studentportal.lcsinhs.com/scripts/subjects-shs-fetch.php';
                        } else {
                            console.error('Invalid grade level');
                            return;
                        }

                        axios
                            .get(`${apiEndpoint}?gradeLevel=${response.data.grade_level}`) // Use response.data.grade_level here
                            .then((subjectsResponse) => {
                                setSubjects(subjectsResponse.data);
                                setSubjectsJHS(subjectsResponse.data);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    } else {
                        console.error('Failed to fetch grade level');
                    }

                    // Check if the response contains a survey link and set it in the state
                    const savedSurveyLink = localStorage.getItem('surveyLink');
                    if (savedSurveyLink) {
                        setSurveyLink(savedSurveyLink);
                    }

                    // Set user data
                    setUserData(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [username]);

    const openQRCodeModal = () => {
        setShowQRCodeModal(true);
    };

    const closeQRCodeModal = () => {
        setShowQRCodeModal(false);
    };

    const openDocsModal = () => {
        setShowDocs(true);
    };

    const closeDocsModal = () => {
        setShowDocs(false);
    };

    const openPersonInfo = () => {
        setShowInfo(true);
    };

    const closeInfoModal = () => {
        setShowInfo(false);
    };

    const openSubjectsModal = () => {
        if (gradeLevel !== null) {
            if (gradeLevel >= 7 && gradeLevel <= 10) {
                setShowSubjectsJHSModal(true);
            } else if (gradeLevel >= 11 && gradeLevel <= 12) {
                setShowSubjectsModal(true);
            }
        }
    };

    const closeSubjectsModal = () => {
        setShowSubjectsModal(false);
    };

    const closeSubjectsJHSModal = () => {
        setShowSubjectsJHSModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        history.push('/login');
        console.log('Logged out');
    };

    return (
        <IonPage>
            {isDesktop ? <>
                <IonContent color={'light'}>
                    <IonHeader className="ion-no-border">
                        <IonToolbar>
                            <div className="top-placement">
                                <div className="my-profile-top">
                                    <IonButton href={'/home'} className="back-button-size" fill="clear">
                                        <IonIcon icon={arrowBack} color="dark"></IonIcon>
                                    </IonButton>
                                    <IonLabel className="my-profile-text">My Profile</IonLabel>
                                </div>
                                <div className="logout">
                                    <IonButton
                                        fill="clear"
                                        size="large"
                                        color={"dark"}
                                        onClick={openPersonInfo}
                                        className="logout-effect"><IonIcon icon={person} /></IonButton>
                                    <IonButton
                                        fill="clear"
                                        size="large"
                                        color={"dark"}
                                        onClick={handleLogout}
                                        className="logout-effect"><u>Logout</u></IonButton>
                                </div>
                            </div>
                        </IonToolbar>
                    </IonHeader>

                    <div className="spacer-h-l" />

                    <div className="avatar-container">
                        <div className="avatar-center">
                            {hasUploadedPicture ? (
                                <IonAvatar className="avatar">
                                    <IonImg alt="Student Avatar" src={profilePicturePath} />
                                </IonAvatar>

                            ) : (
                                <IonAvatar className="avatar">
                                    <IonImg alt="Student Avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                                </IonAvatar>
                            )}
                        </div>

                        <div className="center-creds">
                            <IonLabel className="my-profile-text">{userData.f_name} {userData.l_name}</IonLabel>
                        </div>
                        <div className="center-creds">
                            <IonChip className="m-profile">LRN: {userData.student_lrn}</IonChip>
                            <IonChip className="m-profile">
                                Grade {userData.grade_level ? userData.grade_level : 'N/A'} - {userData.section_name ? userData.section_name : 'N/A'}
                            </IonChip>
                        </div>
                        <div className="center-creds">
                            <IonChip className="m-profile">
                                Class Adviser: {userData.title && userData.fname && userData.lname ?
                                    `${userData.title} ${userData.fname} ${userData.lname}` : 'N/A'}
                            </IonChip>
                            <IonChip className="m-profile"> S. Y. {new Date().getFullYear()}</IonChip>
                        </div>
                        <div className="spacer-h-xxs" />
                    </div>

                    <div className="avatar-center">
                        <div className="cards-column">
                            <IonButton
                                className="buttons-appearance"
                                onClick={openQRCodeModal}>
                                <div className="but-col">
                                    <IonIcon className="icon-size" icon={qrCode}></IonIcon>
                                    <div className="spacer-w-xs" />
                                    <IonLabel>QR Code</IonLabel>
                                </div>
                            </IonButton>
                            <div>
                                <IonButton className="buttons-appearance"
                                    href={gradeLevel && (gradeLevel >= 7 && gradeLevel <= 10) ? '/school_id?print=true' : '/school_id_shs?print=true'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={idCard}></IonIcon>
                                        <div className="spacer-w-xs" />
                                        <IonLabel>Student ID</IonLabel>
                                    </div>
                                </IonButton>
                            </div>

                            <div>
                                <IonButton className="buttons-appearance"
                                    onClick={openScheduleWindow}>
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={time}></IonIcon>
                                        <div className="spacer-w-xs" />
                                        <IonLabel>Class Schedule</IonLabel>
                                    </div>
                                </IonButton>
                            </div>
                            <div>
                                <div>
                                    <IonButton className="buttons-appearance" onClick={openSubjectsModal}>
                                        <div className="but-col">
                                            <IonIcon className="icon-size" icon={school}></IonIcon>
                                            <div className="spacer-w-xs" />
                                            <IonLabel>Subjects</IonLabel>
                                        </div>
                                    </IonButton>
                                </div>
                            </div>
                            <div>
                                <IonButton className="buttons-appearance"
                                    onClick={openDocsModal}>
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={folderOpen}></IonIcon>
                                        <div className="spacer-w-xs" />
                                        <IonLabel>Documents</IonLabel>
                                    </div>
                                </IonButton>
                            </div>
                            <div>
                                <IonButton className="buttons-appearance" onClick={handleAnswerSurvey}>
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={list}></IonIcon>
                                        <div className="spacer-w-xs" />
                                        <IonLabel>Answer Survey</IonLabel>
                                    </div>
                                </IonButton>
                            </div>
                            <div>
                                <IonButton className="buttons-appearance" onClick={handleEnrolForm}>
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={documentText}></IonIcon>
                                        <div className="spacer-w-xs" />
                                        <IonLabel>Request Form</IonLabel>
                                    </div>
                                </IonButton>
                            </div>
                        </div>
                    </div>
                </IonContent></>

                :
                <>
                    <IonContent color={'light'}>
                        <IonHeader class="ion-no-border">
                            <IonToolbar>
                                <div className="m-header">
                                    <div className="m-header">
                                        <IonButton href={'/home'} className="back-button-size" fill="clear" color={'dark'}>
                                            <IonIcon icon={arrowBack} size="large"></IonIcon>
                                        </IonButton>
                                        <IonLabel className="m-profile-text">My Profile</IonLabel>
                                    </div>

                                    <div className="m-logout">
                                        <IonButton
                                            fill="clear"
                                            size="large"
                                            color={"dark"}
                                            onClick={openPersonInfo}
                                            className="logout-effect"><IonIcon icon={person} /></IonButton>
                                        <IonButton
                                            fill="clear"
                                            size="small"
                                            color={"dark"}
                                            onClick={handleLogout}
                                            className="logout-effect">
                                            <IonIcon icon={logOut} size="large"></IonIcon>
                                        </IonButton>
                                    </div>
                                </div>


                            </IonToolbar>
                        </IonHeader>

                        <div className="spacer-h-m"></div>
                        <div className="avatar-center">
                            {hasUploadedPicture ? (
                                <IonAvatar className="m-avatar">
                                    <IonImg alt="Student Avatar" src={profilePicturePath} />
                                </IonAvatar>

                            ) : (
                                <IonAvatar className="m-avatar">
                                    <IonImg alt="Student Avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                                </IonAvatar>
                            )}
                        </div>
                        <div className="spacer-h-s"></div>
                        <div className="avatar-center">
                            <IonLabel className="m-profile-text">{userData.f_name} {userData.l_name}</IonLabel>
                        </div>
                        <div className="center-creds">
                            <IonChip className="m-profile-txt">LRN: {userData.student_lrn}</IonChip>
                            <IonChip className="m-profile-txt">
                                Grade {userData.grade_level ? userData.grade_level : 'N/A'} - {userData.section_name ? userData.section_name : 'N/A'}
                            </IonChip>
                        </div>
                        <div className="center-creds">
                            <IonChip className="m-profile-txt">
                                Class Adviser: {userData.title && userData.fname && userData.lname ?
                                    `${userData.title} ${userData.fname} ${userData.lname}` : 'N/A'}
                            </IonChip>
                            <IonChip className="m-profile-txt"> S. Y. {new Date().getFullYear()}</IonChip>
                        </div>

                        <div className="spacer-h-"></div>
                        <div className="avatar-center">
                            <div className="m-cards-column">

                                <div>
                                    <IonButton className="m-buttons-appearance" onClick={openQRCodeModal}>
                                        <div className="m-button-content">
                                            <IonIcon className="m-icon-size" icon={qrCode}></IonIcon>
                                            <div className="spacer-h-xs" />
                                            <IonText>QR Code</IonText>
                                        </div>
                                    </IonButton>
                                </div>

                                <div>
                                    <IonButton className="m-buttons-appearance"
                                        href={gradeLevel && (gradeLevel >= 7 && gradeLevel <= 10) ? '/school_id?print=true' : '/school_id_shs?print=true'}
                                    >
                                        <div className="m-button-content">
                                            <IonIcon className="m-icon-size" icon={idCard}></IonIcon>
                                            <div className="spacer-h-xs" />
                                            <IonText>Student ID</IonText>
                                        </div>
                                    </IonButton>
                                </div>

                                <div>
                                    <IonButton className="m-buttons-appearance"
                                        onClick={openScheduleWindow}>
                                        <div className="m-button-content">
                                            <IonIcon className="m-icon-size" icon={time}></IonIcon>
                                            <div className="spacer-h-xs" />
                                            <IonText>Class Schedule</IonText>
                                        </div>
                                    </IonButton>
                                </div>
                                <div>
                                    <IonButton className="m-buttons-appearance" onClick={openSubjectsModal}>
                                        <div className="m-button-content">
                                            <IonIcon className="m-icon-size" icon={school}></IonIcon>
                                            <div className="spacer-h-xs" />
                                            <IonText>Subjects</IonText>
                                        </div>
                                    </IonButton>
                                </div>
                                <div>
                                    <IonButton className="m-buttons-appearance"
                                        onClick={openDocsModal}>
                                        <div className="m-button-content">
                                            <IonIcon className="m-icon-size" icon={folderOpen}></IonIcon>
                                            <div className="spacer-h-xs" />
                                            <IonText>Documents</IonText>
                                        </div>
                                    </IonButton>
                                </div>
                                <div>
                                    <IonButton className="m-buttons-appearance" onClick={handleAnswerSurvey}>
                                        <div className="m-button-content">
                                            <IonIcon className="m-icon-size" icon={list}></IonIcon>
                                            <div className="spacer-h-xs" />
                                            <IonText>Answer Survey</IonText>
                                        </div>
                                    </IonButton>
                                </div>
                                <div>
                                    <IonButton className="m-buttons-appearance" onClick={handleEnrolForm}>
                                        <div className="m-button-content">
                                            <IonIcon className="m-icon-size" icon={documentText}></IonIcon>
                                            <div className="spacer-h-xs" />
                                            <IonText>Request Form</IonText>
                                        </div>
                                    </IonButton>
                                </div>
                            </div>
                        </div>

                    </IonContent>
                </>}

            {showQRCode && (
                <div className="avatar-center">
                    <QRCode value={userData.student_lrn} />
                </div>
            )}

            <IonModal isOpen={showQRCodeModal} onDidDismiss={closeQRCodeModal}>
                <div>
                    <div className="close-but">
                        <IonButton fill="clear" onClick={closeQRCodeModal} color={'dark'}>
                            <IonIcon slot="icon-only" icon={close} />
                        </IonButton>
                    </div>
                    <div className="spacer-h-xl" />
                    <div className="spacer-h-xl" />
                    <div className="avatar-center">
                        <QRCode size={300}
                            value={userData.student_lrn} />
                    </div>
                </div>
            </IonModal>


            <IonModal isOpen={showInfo} onDidDismiss={closeInfoModal} className='modal-des'>
                {isDesktop ? <>
                    <div className="modal-css">
                        <IonHeader className="ion-no-border">
                            <IonToolbar>
                                <h4>Please fill in the Student ID details.</h4>
                                <IonButton fill="clear" onClick={closeInfoModal} color={"dark"} slot="end">
                                    <IonIcon icon={close} slot="icon-only" />
                                </IonButton>
                            </IonToolbar>
                        </IonHeader>

                        <div className="display-block">
                            <IonItem>
                                <IonText slot="start">Upload 1x1 Picture:</IonText>
                                <div className='spacer-w-xs' />
                                <label htmlFor="avatar"></label>
                                <input
                                    type="file"
                                    id="avatarInput"
                                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                                />
                                <IonButton onClick={uploadAvatar} slot="end" color={'dark'}>
                                    {hasUploadedPicture ? 'Reupload' : 'Upload'}
                                </IonButton>
                            </IonItem>
                        </div>

                        <div className='spacer-h-m' />
                        <IonInput fill="outline" value={emergencyContact}
                            label="Person to Contact in Case of Emergency:"
                            labelPlacement="stacked"
                            onIonChange={(e) => setEmergencyContact(e.detail.value!)}
                            placeholder="First Name, Last Name"></IonInput>

                        <div className='spacer-h-s' />
                        <IonInput fill="outline" value={emergencyNumber}
                            label="Contact No.:"
                            labelPlacement="stacked"
                            onIonChange={(e) => setEmergencyNumber(e.detail.value!)}
                            type="tel" placeholder="Tel./Mobile Number"></IonInput>

                        <div className='spacer-h-s' />
                        <IonInput fill="outline" value={emailParent}
                            label="Parent / Guardian's Email Address:"
                            labelPlacement="stacked"
                            onIonChange={(e) => setEmailParent(e.detail.value!)}
                            type="email" placeholder="Email Address"></IonInput>

                        <div className='spacer-h-s' />
                        <IonInput fill="outline" value={emergencyAddress}
                            label="Address: (e. g. Batangas City, Batangas)"
                            labelPlacement="stacked"
                            onIonChange={(e) => setEmergencyAddress(e.detail.value!)}
                            placeholder="City, Province"></IonInput>

                        <div className='spacer-h-l' />

                        <div>
                            <IonButton expand="block" onClick={submitEmergencyContact} color={'dark'}>
                                {hasSubmittedInfo ? 'Resubmit' : 'Submit'}
                            </IonButton>
                        </div>

                    </div>


                </> : <>

                    <div className="modal-css">
                        <div className="close-but">
                            <IonButton fill="clear" onClick={closeInfoModal} color={"dark"}>
                                <IonIcon icon={close} slot="icon-only" />
                            </IonButton>
                        </div>
                        <div className="spacer-h-xl" />

                        <div className="avatar-center">
                            <h2>Please fill in the Student ID details.</h2>
                        </div>
                        <div className="display-block">
                            <div>
                                <p>Upload 1x1 Picture:</p>
                            </div>
                            <div>
                                <IonItem>
                                    <label htmlFor="avatar"></label>
                                    <input
                                        type="file"
                                        id="avatar"
                                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                                    />
                                    <IonButton size="small" onClick={uploadAvatar} color={'dark'}>
                                        {hasUploadedPicture ? 'Reupload' : 'Upload'}
                                    </IonButton>
                                </IonItem>
                            </div>
                        </div>

                        <div className='spacer-h-m' />
                        <IonInput fill="outline" value={emergencyContact}
                            label="Person to Contact in Case of Emergency:"
                            labelPlacement="stacked"
                            onIonChange={(e) => setEmergencyContact(e.detail.value!)}
                            placeholder="First Name, Last Name"></IonInput>

                        <div className='spacer-h-s' />
                        <IonInput fill="outline" value={emergencyNumber}
                            label="Contact No.:"
                            labelPlacement="stacked"
                            onIonChange={(e) => setEmergencyNumber(e.detail.value!)}
                            type="tel" placeholder="Tel./Mobile Number"></IonInput>

                        <div className='spacer-h-s' />
                        <IonInput fill="outline" value={emailParent}
                            label="Parent / Guardian's Email Address:"
                            labelPlacement="stacked"
                            onIonChange={(e) => setEmailParent(e.detail.value!)}
                            type="email" placeholder="Email Address"></IonInput>

                        <div className='spacer-h-s' />
                        <IonInput fill="outline" value={emergencyAddress}
                            label="Address: (e. g. Batangas City, Batangas)"
                            labelPlacement="stacked"
                            onIonChange={(e) => setEmergencyAddress(e.detail.value!)}
                            placeholder="City, Province"></IonInput>

                        <div className='spacer-h-l' />

                        <IonButton expand="block" onClick={submitEmergencyContact} color={'dark'}>
                            <IonText>{hasSubmittedInfo ? 'Resubmit' : 'Submit'}</IonText>
                        </IonButton>
                        <div className='spacer-h-xxs' />

                    </div>
                </>}
            </IonModal>

            <IonModal
                isOpen={showDocs}
                onDidDismiss={closeDocsModal}
            >   <div className="spacer-h-xxl" />
                <IonToolbar>
                    <IonTitle>
                        Documents
                    </IonTitle>
                    <IonButton fill="clear" color={'dark'} slot="end" onClick={closeDocsModal} >
                        <IonIcon icon={closeOutline} slot="icon-only" />
                    </IonButton>
                </IonToolbar>

                <div className="spacer-h-l" />

                <IonContent>
                    <IonItem>
                        <IonLabel>Certificate of Registration</IonLabel>
                        <IonButton fill="outline" onClick={() => handleViewClick(userData.CoR)}
                        >View</IonButton>
                        <IonButton onClick={() => handlePrintClick(userData.CoR)}
                        >Print</IonButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Form 137</IonLabel>
                        <IonButton fill="outline" onClick={() => handleViewClick(userData.form_137)}
                        >View</IonButton>
                        <IonButton onClick={() => handlePrintClick(userData.form_137)}
                        >Print</IonButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Good Moral</IonLabel>
                        <IonButton fill="outline" onClick={() => handleViewClick(userData.good_moral)}
                        >View</IonButton>
                        <IonButton onClick={() => handlePrintClick(userData.good_moral)}
                        >Print</IonButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Certificate of Enrollment</IonLabel>
                        <IonButton fill="outline" onClick={() => handleViewClick(userData.CoEnrolment)}
                        >View</IonButton>
                        <IonButton onClick={() => handlePrintClick(userData.CoEnrolment)}
                        >Print</IonButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Certificate of Ranking</IonLabel>
                        <IonButton fill="outline" onClick={() => handleViewClick(userData.CoRanking)}
                        >View</IonButton>
                        <IonButton onClick={() => handlePrintClick(userData.CoRanking)}
                        >Print</IonButton>
                    </IonItem>
                </IonContent>
            </IonModal>

            {/*MODAL FOR G11-G12)*/}
            <IonModal isOpen={showSubjectsModal} onDidDismiss={closeSubjectsModal}>
                <IonToolbar>
                    <IonTitle>Subjects</IonTitle>
                    <IonButton fill="clear" color={'dark'} slot="end" onClick={closeSubjectsModal} >
                        <IonIcon icon={closeOutline} slot="icon-only" />
                    </IonButton>
                </IonToolbar>

                <IonContent>
                    {subjects.length > 0 ? (
                        subjects.map((subject: SubjectModel, index) => (
                            <IonCard key={index}>
                                <IonItem className="font-subj">
                                    <IonLabel>{subject.subject_name}</IonLabel>
                                    <IonText slot="end">
                                        {subject.semester === 1
                                            ? <IonChip color={'success'}>1st Sem</IonChip>
                                            : subject.semester === 2
                                                ? <IonChip color={'success'}>2nd Sem</IonChip>
                                                : <IonChip color={'danger'}>Unknown Semester</IonChip>
                                        }
                                    </IonText>

                                </IonItem>
                            </IonCard>
                        ))
                    ) : (
                        <IonText>No subjects available for grade level {gradeLevel}</IonText>
                    )}
                </IonContent>
            </IonModal>

            {/*MODAL FOR G7-G10)*/}
            <IonModal isOpen={showSubjectsJHSModal} onDidDismiss={closeSubjectsJHSModal}>
                <IonToolbar>
                    <IonTitle>Subjects</IonTitle>
                    <IonButton fill="clear" color={'dark'} slot="end" onClick={closeSubjectsJHSModal} >
                        <IonIcon icon={closeOutline} slot="icon-only" />
                    </IonButton>
                </IonToolbar>

                <IonContent>
                    {subjectsJHS.length > 0 ? (
                        subjectsJHS.map((subject: SubjectModel, index) => (
                            <IonCard key={index}>
                                <IonItem className="font-subj">
                                    <IonLabel>{subject.subject_name}</IonLabel>
                                </IonItem>
                            </IonCard>
                        ))
                    ) : (
                        <IonText>No subjects available for grade level {gradeLevel}</IonText>
                    )}
                </IonContent>

            </IonModal>

        </IonPage >
    );
};

export { Profile };