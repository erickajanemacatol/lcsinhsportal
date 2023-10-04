import { IonAvatar, IonBackButton, IonButton, IonCard, IonCardContent, IonContent, IonFab, IonFabButton, IonIcon, IonLabel, IonPage, LocationHistory } from "@ionic/react";
import { add, arrowBack, document, documentText, documentTextOutline, documents, folderOpen, idCard, megaphone, qrCode, school, schoolOutline, time } from "ionicons/icons";
import './Profile.css'
import '/src/components/Spacer.css'

const Profile = () => {
    return (
        <IonPage>
            <IonContent color={'dark'} scrollX={false}>
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
                                <IonButton fill="clear" size="large" color={"light"} href="/login"><u>Logout</u></IonButton>
                            </div>
                        </div>

                        <div className="spacer-h-l"></div>

                        <div>

                            <div>
                                <div className="avatar-center">
                                    <IonAvatar className="avatar">
                                        <img alt="Display Picture" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                                    </IonAvatar>
                                </div>
                                <div className="avatar-center">
                                    <IonLabel className="my-profile-text">User Name</IonLabel>
                                </div>
                                <div className="avatar-center">
                                    <IonLabel className="my-profile-text">20-12345</IonLabel>
                                </div>
                            </div>

                            <div className="avatar-center">
                                <IonCard className="card-border">
                                    <IonCardContent>
                                        <div className="cards-column">
                                            <div className="avatar-center">
                                                <IonButton className="buttons-appearance">
                                                    <IonIcon className="icon-size" icon={document}></IonIcon>
                                                    <div className="spacer-w-s"/>
                                                    <IonLabel className="buttons-label">Certificate of Registration</IonLabel>
                                                </IonButton>
                                            </div>
                                            <div className="avatar-center">
                                                <IonButton className="buttons-appearance">
                                                    <IonIcon className="icon-size" icon={qrCode}></IonIcon>
                                                    <div className="spacer-w-s"/>
                                                    <IonLabel className="buttons-label">QR Code</IonLabel>
                                                </IonButton>
                                            </div>
                                            <div className="avatar-center">
                                                <IonButton className="buttons-appearance">
                                                    <IonIcon className="icon-size" icon={idCard}></IonIcon>
                                                    <div className="spacer-w-s"/>
                                                    <IonLabel className="buttons-label">Student ID</IonLabel>
                                                </IonButton>
                                            </div>
                                            <div className="avatar-center">
                                                <IonButton className="buttons-appearance">
                                                    <IonIcon className="icon-size" icon={time}></IonIcon>
                                                    <div className="spacer-w-s"/>
                                                    <IonLabel className="buttons-label">Class Schedule</IonLabel>
                                                </IonButton>
                                            </div>
                                            <div className="avatar-center">
                                                <IonButton className="buttons-appearance">
                                                    <IonIcon className="icon-size" icon={school}></IonIcon>
                                                    <div className="spacer-w-s"/>
                                                    <IonLabel className="buttons-label">Subjects</IonLabel>
                                                </IonButton>
                                            </div>
                                            <div className="avatar-center">
                                                <IonButton className="buttons-appearance">
                                                    <IonIcon className="icon-size" icon={folderOpen}></IonIcon>
                                                    <div className="spacer-w-s"/>
                                                    <IonLabel className="buttons-label">Documents</IonLabel>
                                                </IonButton>
                                            </div>
                                            <div className="avatar-center">
                                                <IonButton className="buttons-appearance">
                                                    <IonIcon className="icon-size" icon={megaphone}></IonIcon>
                                                    <div className="spacer-w-s"/>
                                                    <IonLabel className="buttons-label">Announcements</IonLabel>
                                                </IonButton>
                                            </div>
                                            <div className="avatar-center">
                                                <IonButton className="buttons-appearance">
                                                    <IonIcon className="icon-size" icon={documentText}></IonIcon>
                                                    <div className="spacer-w-s"/>
                                                    <IonLabel className="buttons-label">Answer Survey</IonLabel>
                                                </IonButton>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </div>
                        </div>


                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export { Profile };