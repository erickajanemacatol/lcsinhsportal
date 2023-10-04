import {
    IonCard, IonLabel,
    IonCardContent,
    IonContent, IonPage, IonIcon, IonBackButton, IonInput, IonItem, IonButton, IonList, IonSelect, IonSelectOption, IonDatetime, IonButtons, IonChip, IonCardHeader
} from "@ionic/react";
import './AddActivity.css';
import { arrowBack, pricetag } from "ionicons/icons";

const AddActivity = () => {
    return (
        <IonPage>
            <IonContent color={'dark'} scrollX={false} >

                <div className="activity-label">
                    <IonBackButton defaultHref={'/activities'} className="back-button-size">
                        <IonIcon icon={arrowBack}></IonIcon>
                    </IonBackButton>
                    <div className="act-text-pos">
                        <IonLabel className="my-activity-text">Activity Details</IonLabel>
                    </div>
                </div>

                <div className="cards">
                    <div>
                        <IonCard className="add-activity-card" color={"dark"}>

                            <div className="center" >

                                <IonDatetime color={"light"}>
                                    <span slot="title">Select Date</span>
                                </IonDatetime>

                            </div>

                        </IonCard>
                    </div>
                    <div>
                        <IonCard className="add-activity-card">
                            <IonCardContent className="enter-task-card">
                                <div className="enter-task">
                                    <IonInput
                                        id="taks-input"
                                        label="Enter Task Here"
                                        labelPlacement="floating"
                                        counter={true}
                                        maxlength={50}
                                        counterFormatter={(inputLength, maxLength) => `${maxLength - inputLength} characters remaining`}>
                                    </IonInput>

                                    <IonList>
                                        <IonItem>
                                            <IonSelect aria-label="fruit" placeholder="Priority">
                                                <IonSelectOption value="low">Low</IonSelectOption>
                                                <IonSelectOption value="mid">Middle</IonSelectOption>
                                                <IonSelectOption value="high">High</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                    </IonList>


                                    <IonItem>
                                        <IonIcon icon={pricetag}></IonIcon>
                                        <div className="spacer-w-s"></div>
                                        <IonLabel>
                                            Category
                                        </IonLabel>

                                        <IonChip color="light">
                                            Personal
                                        </IonChip>
                                        <IonChip color="light">
                                            School
                                        </IonChip>
                                        <IonChip color="light">
                                            Work
                                        </IonChip>
                                        <IonChip color="light">
                                            Home
                                        </IonChip>
                                    </IonItem>


                                </div>
                                <div className="submit-button-pos">
                                    <IonButton
                                        fill="outline"
                                        className="cancel-button"
                                        size="default">CANCEL
                                    </IonButton>
                                    
                                    <IonButton
                                        className="submit-button"
                                        size="default">ADD TASK
                                    </IonButton>
                                </div>



                            </IonCardContent>

                        </IonCard>
                    </div>

                </div>


            </IonContent>
        </IonPage>
    );
};

export default AddActivity;