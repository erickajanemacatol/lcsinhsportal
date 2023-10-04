import { IonCard, IonCardContent, IonContent, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import React from "react";
import './fAttendance.css'
import FacultyHeader from "../../components/FacultyHeader";

const fAttendance: React.FC = () => {

    return (
        <IonPage >
            <FacultyHeader />
            <IonContent scrollX={false}>
                    <div className="spacer-h-l"></div>
                    <IonLabel className="my-activity-text">View Attendance</IonLabel>
                        <div>
                            <IonList>
                                <IonItem>
                                    <IonSelect placeholder="Select Subject">
                                        <IonSelectOption>
                                            Subject1
                                        </IonSelectOption>
                                        <IonSelectOption>
                                            Subject2
                                        </IonSelectOption>
                                        <IonSelectOption>
                                            Subject3
                                        </IonSelectOption>
                                        <IonSelectOption>
                                            Subject4
                                        </IonSelectOption>
                                        <IonSelectOption>
                                            Subject5
                                        </IonSelectOption>
                                    </IonSelect>

                                </IonItem>
                            </IonList>
                        </div>
                    

            </IonContent>
        </IonPage>
    );
};

export { fAttendance };
