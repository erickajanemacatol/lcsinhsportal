import { IonButton, IonCard, IonContent, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import React from "react";
import './fRegistration.css'
import FacultyHeader from "../../components/FacultyHeader";

const fRegistration: React.FC = () => {
    return (
        <IonPage>
            <FacultyHeader />
            <IonContent >
                <div className="spacer-h-l"></div>
                <IonLabel className="my-activity-text">View Certificate of Registration</IonLabel>
                <div>
                    <IonList>
                        <IonItem>
                            <IonSelect placeholder="Select Section">
                                <IonSelectOption>
                                    section1
                                </IonSelectOption>
                                <IonSelectOption>
                                    section2
                                </IonSelectOption>
                                <IonSelectOption>
                                    section3
                                </IonSelectOption>
                                <IonSelectOption>
                                    section4
                                </IonSelectOption>
                                <IonSelectOption>
                                    section5
                                </IonSelectOption>
                            </IonSelect>

                        </IonItem>
                    </IonList>
                </div>

                <div className="mainContent">
                    <IonList>
                        <IonCard>
                            <IonItem className="employeeItem" lines="none">
                                <img className="employeeImg" src="/src/imgs/logo.png" alt="employee avatar" />

                                <IonLabel>
                                    <h2>Student Name</h2>
                                    <p>12345566789900</p>
                                </IonLabel>

                                <IonButton size="default">
                                    View
                                </IonButton>
                            </IonItem>
                        </IonCard>
                        <IonCard>
                            <IonItem className="employeeItem" lines="none">
                                <img className="employeeImg" src="/src/imgs/logo.png" alt="employee avatar" />

                                <IonLabel>
                                    <h2>Student Name</h2>
                                    <p>12345566789900</p>
                                </IonLabel>

                                <IonButton size="default">
                                    View
                                </IonButton>
                            </IonItem>
                        </IonCard>
                        <IonCard>
                            <IonItem className="employeeItem" lines="none">
                                <img className="employeeImg" src="/src/imgs/logo.png" alt="employee avatar" />

                                <IonLabel>
                                    <h2>Student Name</h2>
                                    <p>12345566789900</p>
                                </IonLabel>

                                <IonButton size="default">
                                    View
                                </IonButton>
                            </IonItem>
                        </IonCard>
                        <IonCard>
                            <IonItem className="employeeItem" lines="none">
                                <img className="employeeImg" src="/src/imgs/logo.png" alt="employee avatar" />

                                <IonLabel>
                                    <h2>Student Name</h2>
                                    <p>12345566789900</p>
                                </IonLabel>

                                <IonButton size="default">
                                    View
                                </IonButton>
                            </IonItem>
                        </IonCard>
                    </IonList>

                </div>


            </IonContent>
        </IonPage>
    );

};
export { fRegistration };