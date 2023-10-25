import { IonAvatar, IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonPage, IonText, IonToolbar, useIonToast } from "@ionic/react";
import { arrowBack, close, documentText, folderOpen, idCard, list, logOut, person, qrCode, school, time } from "ionicons/icons";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from 'qrcode.react';
import './Profile.css'
import '/src/components/Spacer.css'
import { useHistory } from "react-router-dom";
import { SiGoogleforms } from "react-icons/si";

interface UserData {
    student_lrn: string; // Adjust the data type if it's not a string
    // Include other properties from your actual userData object
}

const Profile = () => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    const [showQRCode, setShowQRCode] = useState(false);
    const [showQRCodeModal, setShowQRCodeModal] = useState(false);
    const [showDocs, setShowDocs] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const history = useHistory();
    const [avatarFile, setAvatarFile] = useState(null);
    const [emergencyContact, setEmergencyContact] = useState("");
    const [emergencyNumber, setEmergencyNumber] = useState("");
    const [emergencyAddress, setEmergencyAddress] = useState("");
    const [presentToast, dismissToast] = useIonToast();
    const initialProfilePicturePath = localStorage.getItem('profilePicturePath');
    const [hasUploadedPicture, setHasUploadedPicture] = useState(false);
    const [hasSubmittedInfo, setHasSubmittedInfo] = useState(false);
    const [profilePicturePath, setProfilePicturePath] = useState(
        initialProfilePicturePath || 'https://ionicframework.com/docs/img/demos/avatar.svg'
    );
    const [surveyLink, setSurveyLink] = useState("");
    const [enrolLink, setEnrolLink] = useState("");

    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    const [userData, setUserData] = useState<UserData>({ student_lrn: '' });
    const username = localStorage.getItem('username');

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

    const uploadAvatar = () => {
        const formData = new FormData();
        formData.append("profile_pic", avatarFile);
        formData.append("username", username);

        axios
            .post("http://localhost/upload-avatar.php", formData)
            .then((response) => {
                console.log(response.data);
                showToast("Avatar uploaded successfully", "success");
                setProfilePicturePath(response.data);
                setHasUploadedPicture(true);
                window.location.reload();
            })
            .catch((error) => {
                showToast("Error uploading avatar", "danger");
            });
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
            username,
        };
        console.log(newData);

        axios
            .post("http://localhost/submit-emergency-contact.php", JSON.stringify(newData))
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

    const handleViewClick = (documentPath: string) => {
        if (!documentPath) {
            showToast("No document available.", "warning");
            return;
        }

        const viewUrl = `http://localhost/file-fetch-profile.php?file=${documentPath}`;
        window.open(viewUrl, '_blank');
    };

    const handleAnswerSurvey = () => {
        if (surveyLink) {
            window.open(surveyLink, '_blank'); // Open the survey link in a new tab
        } else {
            window.alert("No survey link available.");
        }
    };

    const handleEnrolForm = () => {
        if (enrolLink) {
            window.open(enrolLink, '_blank'); // Open the survey link in a new tab
        } else {
            window.alert("Enrollment is closed.");
        }
    };

    useEffect(() => {
        if (username) {
            axios
                .get('http://localhost/survey-fetch.php') // Replace with the actual endpoint to fetch the survey link
                .then((response) => {
                    // Assuming your API response contains a property named 'surveyLink'
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

    useEffect(() => {
        if (username) {
            axios
                .get('http://localhost/enrolment-fetch.php') // Replace with the actual endpoint to fetch the survey link
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


    useEffect(() => {
        if (username) {
            axios
                .post('http://localhost/profile.php', { username: username })
                .then((response) => {
                    console.log(response);
                    setUserData(response.data);

                    if (response.data.profile_pic) {
                        // User has uploaded an avatar; display it
                        const profilePicturePath = `http://localhost/file-fetch-profile.php?file=${response.data.profile_pic}`;
                        setProfilePicturePath(profilePicturePath);
                        setHasUploadedPicture(true);
                    } else {
                        setHasUploadedPicture(false);
                    }

                    const savedSurveyLink = localStorage.getItem("surveyLink");
                    if (savedSurveyLink) {
                        setSurveyLink(savedSurveyLink);
                    }

                    setEmergencyContact(response.data.emergency_co || '');
                    setEmergencyNumber(response.data.emergency_no || '');
                    setEmergencyAddress(response.data.emergency_add || '');
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [username]);

    const handleLogout = () => {
        // Clear the user's identifier from localStorage
        localStorage.removeItem('username'); // Replace 'username' with the identifier you use
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

                        <div className="avatar-center">
                            <IonLabel className="my-profile-text">{userData.f_name} {userData.l_name}</IonLabel>
                        </div>
                        <div className="avatar-center">
                            <IonLabel className="my-profile-text">LRN: {userData.student_lrn}</IonLabel>
                        </div>

                        <div className="spacer-h-l" />
                    </div>

                    <div className="avatar-center">
                        <div className="cards-column">
                            <IonButton
                                className="buttons-appearance"
                                onClick={openQRCodeModal}>
                                <div className="but-col">
                                    <IonIcon className="icon-size" icon={qrCode}></IonIcon>
                                    <IonLabel>QR Code</IonLabel>
                                </div>
                            </IonButton>
                            <div>
                                <IonButton className="buttons-appearance"
                                    href={'/school_id?print=true'} target="_blank" rel="noopener noreferrer">
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={idCard}></IonIcon>
                                        <IonLabel>Student ID</IonLabel>
                                    </div>
                                </IonButton>
                            </div>
                            <div>
                                <IonButton className="buttons-appearance">
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={time}></IonIcon>
                                        <IonLabel>Class Schedule</IonLabel>
                                    </div>
                                </IonButton>
                            </div>
                            <div>
                                <IonButton className="buttons-appearance">
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={school}></IonIcon>
                                        <IonLabel>Subjects</IonLabel>
                                    </div>
                                </IonButton>
                            </div>
                            <div>
                                <IonButton className="buttons-appearance"
                                    onClick={openDocsModal}>
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={folderOpen}></IonIcon>
                                        <IonLabel>Documents</IonLabel>
                                    </div>
                                </IonButton>
                            </div>
                            <div>
                                <IonButton className="buttons-appearance" onClick={handleAnswerSurvey}>
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={list}></IonIcon>
                                        <IonLabel>Answer Survey</IonLabel>
                                    </div>
                                </IonButton>
                            </div>
                            <div>
                                <IonButton className="buttons-appearance" onClick={handleEnrolForm}>
                                    <div className="but-col">
                                        <IonIcon className="icon-size" icon={documentText}></IonIcon>
                                        <IonLabel>Enrollment Form</IonLabel>
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
                            <IonAvatar className="m-avatar">
                                <img alt="Student Avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                            </IonAvatar>
                        </div>
                        <div className="spacer-h-m"></div>
                        <div className="avatar-center">
                            <IonLabel className="m-profile-text">{userData.f_name} {userData.l_name}</IonLabel>
                        </div>
                        <div className="avatar-center">
                            <IonLabel className="m-profile-text">LRN: {userData.student_lrn}</IonLabel>
                        </div>

                        <div className="spacer-h-m"></div>
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
                                        href={'/school_id?print=true'} target="_blank" rel="noopener noreferrer">
                                        <div className="m-button-content">
                                            <IonIcon className="m-icon-size" icon={idCard}></IonIcon>
                                            <div className="spacer-h-xs" />
                                            <IonText>Student ID</IonText>
                                        </div>
                                    </IonButton>
                                </div>
                                <div>
                                    <IonButton className="m-buttons-appearance">
                                        <div className="m-button-content">
                                            <IonIcon className="m-icon-size" icon={time}></IonIcon>
                                            <div className="spacer-h-xs" />
                                            <IonText>Class Schedule</IonText>
                                        </div>
                                    </IonButton>
                                </div>
                                <div>
                                    <IonButton className="m-buttons-appearance">
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
                                            <IonText>Enrollment Form</IonText>
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
                    <div className="spacer-h-xl"/>
                    <div className="spacer-h-xl"/>
                    <div className="avatar-center">
                        <QRCode size={300}
                            value={userData.student_lrn} />
                    </div>
                </div>
            </IonModal>


            <IonModal isOpen={showInfo} onDidDismiss={closeInfoModal} className='modal-des'>
                {isDesktop ? <>
                    <div className="modal-css">
                        <div className="close-but">
                            <IonButton fill="clear" onClick={closeInfoModal} color={"dark"}>
                                <IonIcon icon={close} slot="icon-only" />
                            </IonButton>
                        </div>

                        <div className="avatar-center">
                            <h2>Please fill in the Student ID details.</h2>
                        </div>
                        <div className="display-block">
                            <div>
                                <p>Upload Avatar:</p>
                            </div>
                            <div>
                                <IonItem>
                                    <label htmlFor="avatar"></label>
                                    <input
                                        type="file"
                                        id="avatar"
                                        onChange={(e) => setAvatarFile(e.target.files[0])}
                                    />
                                    <IonButton onClick={uploadAvatar} slot="end" color={'dark'}>
                                        {hasUploadedPicture ? 'Reupload' : 'Upload'}
                                    </IonButton>
                                </IonItem>
                            </div>
                        </div>

                        <div className='spacer-h-s' />
                        Person to Contact in Case of Emergency:
                        <div className='spacer-h-xs' />
                        <IonInput fill="outline" value={emergencyContact}
                            onIonChange={(e) => setEmergencyContact(e.detail.value!)}
                            placeholder="First Name, Last Name"></IonInput>

                        <div className='spacer-h-xs' />
                        Contact No.:
                        <div className='spacer-h-xs' />
                        <IonInput fill="outline" value={emergencyNumber}
                            onIonChange={(e) => setEmergencyNumber(e.detail.value!)}
                            type="tel" placeholder="Tel./Mobile Number"></IonInput>


                        <div className='spacer-h-xs' />
                        <IonText>Address: (e. g. Batangas City, Batangas)</IonText>
                        <div className='spacer-h-xs' />
                        <IonInput fill="outline" value={emergencyAddress}
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
                                <p>Upload Avatar:</p>
                            </div>
                            <div>
                                <IonItem>
                                    <label htmlFor="avatar"></label>
                                    <input
                                        type="file"
                                        id="avatar"
                                        onChange={(e) => setAvatarFile(e.target.files[0])}
                                    />
                                    <IonButton size="small" onClick={uploadAvatar} color={'dark'}>
                                        {hasUploadedPicture ? 'Reupload' : 'Upload'}
                                    </IonButton>
                                </IonItem>
                            </div>
                        </div>

                        <div className='spacer-h-l' />
                        Person to Contact in Case of Emergency:
                        <div className='spacer-h-xs' />
                        <IonInput fill="outline" value={emergencyContact}
                            onIonChange={(e) => setEmergencyContact(e.detail.value!)}
                            placeholder="First Name, Last Name">
                        </IonInput>

                        <div className='spacer-h-m' />
                        Contact No.:
                        <div className='spacer-h-xs' />
                        <IonInput fill="outline" value={emergencyNumber}
                            onIonChange={(e) => setEmergencyNumber(e.detail.value!)}
                            type="tel" placeholder="Tel./Mobile Number"></IonInput>


                        <div className='spacer-h-s' />
                        <IonText>Address: (e. g. Batangas City, Batangas)</IonText>
                        <div className='spacer-h-xs' />
                        <IonInput fill="outline" value={emergencyAddress}
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
                <div className="center"><h2>Documents</h2></div>
                <IonItem>
                    <IonLabel>Certificate of Registration</IonLabel>
                    <IonButton onClick={() => handleViewClick(userData.CoR)}
                    >View</IonButton>
                </IonItem>
                <IonItem>
                    <IonLabel>Form 137</IonLabel>
                    <IonButton onClick={() => handleViewClick(userData.form_137)}
                    >View</IonButton>
                </IonItem>
                <IonItem>
                    <IonLabel>Good Moral</IonLabel>
                    <IonButton onClick={() => handleViewClick(userData.good_moral)}
                    >View</IonButton>
                </IonItem>
                <IonItem>
                    <IonLabel>Certificate of Enrolment</IonLabel>
                    <IonButton onClick={() => handleViewClick(userData.CoEnrolment)}
                    >View</IonButton>
                </IonItem>
                <IonItem>
                    <IonLabel>Certificate of Ranking</IonLabel>
                    <IonButton onClick={() => handleViewClick(userData.CoRanking)}
                    >View</IonButton>
                </IonItem>
                <IonButton onClick={closeDocsModal}>Close Documents</IonButton>
            </IonModal>
        </IonPage >
    );
};

export { Profile };