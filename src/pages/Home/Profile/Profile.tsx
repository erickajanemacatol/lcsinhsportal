import { IonAvatar, IonButton, IonCard, IonCardContent, IonContent, IonIcon, IonLabel, IonPage } from "@ionic/react";
import { arrowBack, document, documentText, folderOpen, idCard, megaphone, qrCode, school, time } from "ionicons/icons";
import './Profile.css'
import '/src/components/Spacer.css'

const Profile = () => {
    return (
        <IonPage>
            <IonContent color={'dark'}>
                <IonCard className="my-profile-card" color={"dark"}>
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
                                    color={"light"}
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
            </IonContent>
        </IonPage >
    );
};

export { Profile };