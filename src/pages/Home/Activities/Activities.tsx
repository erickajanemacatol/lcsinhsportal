import {
    IonCard, IonLabel,
    IonCardContent,
    IonContent, IonPage, IonFab, IonFabButton, IonIcon, IonPopover, IonHeader, IonToolbar, IonChip, IonItemDivider, IonDatetime, IonDatetimeButton, IonItem, IonButton
} from "@ionic/react";
import './Activities.css';
import { add, create, ellipse, trash } from "ionicons/icons";
import Header from "../../../components/StudentHeader";

console.log("Activities component rendered")

const Activities = () => {
    return (

        <IonPage>
            <Header />
            

            <IonContent color={'dark'} scrollX={false}>

            <IonFab className="fab-pos" slot="fixed" vertical="bottom" horizontal="end" >
                <IonFabButton color={"light"} href="/activities/add-activity">
                    <IonIcon icon={add}></IonIcon>
                </IonFabButton>
            </IonFab>

                <div className="spacer-h-s" />
                <IonLabel className="my-act-title">My Activities </IonLabel>


                <div className="avatar-center">
                    <IonCard className="activity-card">
                        <IonItem>
                            <IonIcon icon={ellipse} color={"danger"} />
                            <IonLabel>
                                <b>Sample Task</b>
                            </IonLabel>
                        </IonItem>
                        <div className="spacer-h-s"></div>
                        <IonLabel>Due /Day/, /Month/ /Date/ /Year/</IonLabel>

                        <IonCardContent>
                            <IonButton fill="clear" color={"light"}>
                                <IonIcon icon={create} />
                                Update
                            </IonButton>
                            <IonButton fill="clear" color={'danger'}>
                                <IonIcon icon={trash} />
                                Delete
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>

                <div className="avatar-center">
                    <IonCard className="activity-card">
                        <IonItem>
                            <IonIcon icon={ellipse} color={"warning"} />
                            <IonLabel>
                                <b>Sample Task</b>
                            </IonLabel>
                        </IonItem>
                        <div className="spacer-h-s"></div>
                        <IonLabel>Due /Day/, /Month/ /Date/ /Year/</IonLabel>

                        <IonCardContent>
                            <IonButton fill="clear" color={"light"}>
                                <IonIcon icon={create} />
                                Update
                            </IonButton>
                            <IonButton fill="clear" color={'danger'}>
                                <IonIcon icon={trash} />
                                Delete
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>

                <div className="avatar-center">
                    <IonCard className="activity-card">
                        <IonItem>
                            <IonIcon icon={ellipse} color={"success"} />
                            <IonLabel>
                                <b>Sample Task</b>
                            </IonLabel>
                        </IonItem>
                        <div className="spacer-h-s"></div>
                        <IonLabel>Due /Day/, /Month/ /Date/ /Year/</IonLabel>

                        <IonCardContent>
                            <IonButton fill="clear" color={"light"}>
                                <IonIcon icon={create} />
                                Update
                            </IonButton>
                            <IonButton fill="clear" color={'danger'}>
                                <IonIcon icon={trash} />
                                Delete
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>

                <div className="avatar-center">
                    <IonCard className="activity-card">
                        <IonItem>
                            <IonIcon icon={ellipse} color={"success"} />
                            <IonLabel>
                                <b>Sample Task</b>
                            </IonLabel>
                        </IonItem>
                        <div className="spacer-h-s"></div>
                        <IonLabel>Due /Day/, /Month/ /Date/ /Year/</IonLabel>

                        <IonCardContent>
                            <IonButton fill="clear" color={"light"}>
                                <IonIcon icon={create} />
                                Update
                            </IonButton>
                            <IonButton fill="clear" color={'danger'}>
                                <IonIcon icon={trash} />
                                Delete
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>

                <div className="avatar-center">
                    <IonCard className="activity-card">
                        <IonItem>
                            <IonIcon icon={ellipse} color={"danger"} />
                            <IonLabel>
                                <b>Sample Task</b>
                            </IonLabel>
                        </IonItem>
                        <div className="spacer-h-s"></div>
                        <IonLabel>Due /Day/, /Month/ /Date/ /Year/</IonLabel>

                        <IonCardContent>
                            <IonButton fill="clear" color={"light"}> 
                                <IonIcon icon={create} />
                                Update
                            </IonButton>
                            <IonButton fill="clear" color={'danger'}>
                                <IonIcon icon={trash} />
                                Delete
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>

            </IonContent>

        </IonPage>
    );
};

export { Activities };