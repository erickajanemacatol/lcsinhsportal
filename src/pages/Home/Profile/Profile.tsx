import { IonAvatar, IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonToolbar } from "@ionic/react";
import { arrowBack, document, documentText, folderOpen, idCard, logOut, megaphone, qrCode, school, time } from "ionicons/icons";
import './Profile.css'
import '/src/components/Spacer.css'
import { useMediaQuery } from "react-responsive";

const Profile = () => {
    const isDesktop = useMediaQuery({ minWidth: 992 })

    return (
        <IonPage>
            {isDesktop ? <>
                <IonContent color={'light'}>
                    <IonCard className="my-profile-card" color={"light"}>
                        <IonCardContent>
                            <div className="top-placement">
                                <div className="my-profile-top">
                                    <IonButton href={'/home'} className="back-button-size" fill="clear">
                                        <IonIcon icon={arrowBack}></IonIcon>
                                    </IonButton>
                                    <IonLabel className="my-profile-text">My Profile</IonLabel>
                                </div>
                                <div className="logout">
                                    <IonButton
                                        fill="clear"
                                        size="large"
                                        color={"dark"}
                                        href="/login"
                                        className="logout-effect"><u>Logout</u></IonButton>
                                </div>
                            </div>

                            <div className="spacer-h-l"></div>


                            <div className="avatar-center">
                                <IonAvatar className="avatar">
                                    <img alt="Student Avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                                </IonAvatar>
                            </div>
                            <div className="avatar-center">
                                <IonLabel className="my-profile-text">User Name</IonLabel>
                            </div>
                            <div className="avatar-center">
                                <IonLabel className="my-profile-text">20-12345</IonLabel>
                            </div>


                            <div className="avatar-center">
                                <IonCard className="card-border">
                                    <div className="ion-align-items-center">
                                        <IonCardContent className="cards-column">
                                            <div>
                                                <IonButton className="buttons-appearance">
                                                    <div className="but-col">
                                                        <IonIcon className="icon-size" icon={document}></IonIcon>
                                                        <IonLabel>Certificate of Registration</IonLabel>
                                                    </div>
                                                </IonButton>
                                            </div>
                                            <div>
                                                <IonButton className="buttons-appearance">
                                                    <div className="but-col">
                                                        <IonIcon className="icon-size" icon={qrCode}></IonIcon>
                                                        <IonLabel>QR Code</IonLabel>
                                                    </div>
                                                </IonButton>
                                            </div>
                                            <div>
                                                <IonButton className="buttons-appearance">
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
                                                <IonButton className="buttons-appearance">
                                                    <div className="but-col">
                                                        <IonIcon className="icon-size" icon={folderOpen}></IonIcon>
                                                        <IonLabel>Documents</IonLabel>
                                                    </div>
                                                </IonButton>
                                            </div>
                                            <div>
                                                <IonButton className="buttons-appearance">
                                                    <div className="but-col">
                                                        <IonIcon className="icon-size" icon={megaphone}></IonIcon>
                                                        <IonLabel>Announcements</IonLabel>
                                                    </div>
                                                </IonButton>
                                            </div>
                                            <div>
                                                <IonButton className="buttons-appearance">
                                                    <div className="but-col">
                                                        <IonIcon className="icon-size" icon={documentText}></IonIcon>
                                                        <IonLabel>Answer Survey</IonLabel>
                                                    </div>
                                                </IonButton>
                                            </div>

                                        </IonCardContent>
                                    </div>
                                </IonCard>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </IonContent></>

                :
                /*MOBILE VIEW*/
                <>
                    <IonContent color={'light'}>

                        <IonHeader class="ion-no-border">
                            <IonToolbar color={'light'}>
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
                                            size="small"
                                            color={"dark"}
                                            href="/login"
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
                        <div className="avatar-center">
                            <IonLabel className="my-profile-text">User Name</IonLabel>
                        </div>
                        <div className="avatar-center">
                            <IonLabel className="my-profile-text">20-12345</IonLabel>
                        </div>


                        <div className="avatar-center">
                            <IonCard className="m-card-border" color={'light'}>
                                <div className="ion-align-items-center">
                                    <IonCardContent>
                                        <div>
                                            <IonButton className="m-buttons-appearance">
                                                <div className="m-but-col">
                                                    <IonIcon className="m-icon-size" icon={document}></IonIcon>
                                                    <IonLabel>Cert. of Registration</IonLabel>
                                                </div>
                                            </IonButton>
                                        </div>
                                        <div>
                                            <IonButton className="m-buttons-appearance">
                                                <div className="m-but-col">
                                                    <IonIcon className="m-icon-size" icon={qrCode}></IonIcon>
                                                    <IonLabel>QR Code</IonLabel>
                                                </div>
                                            </IonButton>
                                        </div>
                                        <div>
                                            <IonButton className="m-buttons-appearance">
                                                <div className="m-but-col">
                                                    <IonIcon className="m-icon-size" icon={idCard}></IonIcon>
                                                    <IonLabel>Student ID</IonLabel>
                                                </div>
                                            </IonButton>
                                        </div>
                                        <div>
                                            <IonButton className="m-buttons-appearance">
                                                <div className="m-but-col">
                                                    <IonIcon className="m-icon-size" icon={time}></IonIcon>
                                                    <IonLabel>Class Schedule</IonLabel>
                                                </div>
                                            </IonButton>
                                        </div>
                                        <div>
                                            <IonButton className="m-buttons-appearance">
                                                <div className="m-but-col">
                                                    <IonIcon className="m-icon-size" icon={school}></IonIcon>
                                                    <IonLabel>Subjects</IonLabel>
                                                </div>
                                            </IonButton>
                                        </div>
                                        <div>
                                            <IonButton className="m-buttons-appearance">
                                                <div className="m-but-col">
                                                    <IonIcon className="m-icon-size" icon={folderOpen}></IonIcon>
                                                    <IonLabel>Documents</IonLabel>
                                                </div>
                                            </IonButton>
                                        </div>
                                        <div>
                                            <IonButton className="m-buttons-appearance">
                                                <div className="m-but-col">
                                                    <IonIcon className="m-icon-size" icon={megaphone}></IonIcon>
                                                    <IonLabel>Announcements</IonLabel>
                                                </div>
                                            </IonButton>
                                        </div>
                                        <div>
                                            <IonButton className="m-buttons-appearance">
                                                <div className="m-but-col">
                                                    <IonIcon className="m-icon-size" icon={documentText}></IonIcon>
                                                    <IonLabel>Answer Survey</IonLabel>
                                                </div>
                                            </IonButton>
                                        </div>

                                    </IonCardContent>
                                </div>
                            </IonCard>
                        </div>

                    </IonContent>
                </>}

        </IonPage >
    );
};

export { Profile };