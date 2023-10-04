import { IonButton, IonCard, IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import React from "react";
import './Announcements.css'
import AdminHeader from "../../components/AdminHeader";
import { add } from "ionicons/icons";

const Announcements: React.FC = () => {
    return (
        <IonPage>
            <AdminHeader />
            <IonContent >
                <div className="spacer-h-l"></div>
                <IonLabel className="my-activity-text">Announcements for LCSINHS</IonLabel>
                
                <div className="spacer-h-m"></div>

                <div className="create-button">
                    <IonButton size="default" href="/admin/announcement-details">
                        <IonIcon icon={add}></IonIcon>
                        Create
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );

};


export { Announcements };