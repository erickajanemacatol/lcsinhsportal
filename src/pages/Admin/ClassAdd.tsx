import {
    IonBackButton,
    IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput,
    IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonText, IonToolbar, useIonToast
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { addOutline, arrowBack, close, create, trash } from "ionicons/icons";
import { useMediaQuery } from "react-responsive";
import './Classes.css'
import axios from "axios";

interface FacultyModel {
    title: string,
    fname: string,
    lname: string,
    employee_no: number | null,
}

const ClassAdd: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [presentToast, dismissToast] = useIonToast();

    const showToast = (message: string, color: string) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };


    return (
        <IonPage>
            {isDesktop ? <>
                <IonContent>
                    <IonHeader className="ion-no-border">
                        <IonToolbar>
                            <IonButton href="/admin/classes" fill="clear" color={'dark'}>
                                <IonIcon slot='icon-only' icon={arrowBack} />
                                <div className="spacer-w-s" />
                                <IonLabel className="back-txt">Back</IonLabel>
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <div>
                        <div className="spacer-h-s" />
                        <div className="faculty-add">
                            <IonButton color={'dark'}
                            //onClick={() => setShowAddModal(true)}
                            >
                                <IonIcon icon={addOutline} />
                                Add Class
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
                                <div className="spacer-w-l" />
                                <IonCol>
                                    <IonText>
                                        <b>Employee Number</b>
                                    </IonText>
                                </IonCol>
                            </IonRow>
                        </IonGrid>

                    </div>


                </IonContent>
            </> : <>
                <IonContent>

                    <div>
                        <div className="spacer-h-s" />
                        <div className="faculty-add">
                            <IonButton color={'dark'}
                            //onClick={() => setShowAddModal(true)}
                            >
                                <IonIcon icon={addOutline} />
                                Add Faculty
                            </IonButton>
                        </div>
                    </div>

                </IonContent>
            </>}

        </IonPage>
    );
};

export { ClassAdd };

