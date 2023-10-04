import { IonButton, IonCard, IonCardContent, IonContent, IonIcon, IonInput, IonLabel, IonPage } from "@ionic/react";
import React from "react";
import './Announcements.css'
import { arrowBack, checkmark, close } from "ionicons/icons";

const addAnnouncement: React.FC = () => {
    return (
        <IonPage>

            <IonContent >
                <div className="spacer-h-l"></div>
                <div className="top-placement">
                    <div className="my-profile-top">
                        <IonButton href={'/admin/announcements'} className="back-button-size" fill="clear">
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                        <IonLabel className="my-profile-text">Announcement Details</IonLabel>
                    </div>
                </div>

                <div className="spacer-h-l"></div>
                <div className="center">
                    <IonCard className="ann-deets-size">
                        <IonCardContent>
                            <div className="spacer-h-m"></div>
                            <IonLabel>Title</IonLabel>
                            <IonInput
                                id="taks-input"
                                labelPlacement="floating"
                                counter={true}
                                maxlength={25}
                                counterFormatter={(inputLength, maxLength) => `${maxLength - inputLength} characters remaining`}>
                            </IonInput>

                            <div className="spacer-h-m"></div>

                            <IonLabel>Description</IonLabel>
                            <IonInput
                                id="taks-input"
                                labelPlacement="floating"
                                counter={true}
                                maxlength={200}
                                counterFormatter={(inputLength, maxLength) => `${maxLength - inputLength} characters remaining`}>
                            </IonInput>

                            <div className="spacer-h-l"></div>
                            <div className="submit-button-pos">
                                <IonButton
                                    href={'/admin/announcements'}
                                    fill="outline"
                                    className="cancel-button"
                                    size="default">
                                    <IonIcon icon={close}></IonIcon>
                                </IonButton>

                                <IonButton
                                    href={'/admin/announcements'}
                                    className="submit-button"
                                    size="default">
                                    <IonIcon icon={checkmark}></IonIcon>
                                </IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );

};


export { addAnnouncement };