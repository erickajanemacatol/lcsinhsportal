import {
    IonCard, IonLabel,
    IonContent, IonPage, 
    IonFab, IonFabButton, 
    IonIcon, IonChip, IonItem, 
    IonButton, IonCheckbox
} from "@ionic/react";
import './Activities.css';
import { add, addSharp, create, ellipse, trash } from "ionicons/icons";
import Header from "../../../components/StudentHeader";
import { useMediaQuery } from "react-responsive";

console.log("Activities component rendered")

const Activities = () => {
    const isDesktop = useMediaQuery({ minWidth: 992 })

    return (

        <IonPage>
            <Header />

            {isDesktop ? <>
                <IonContent color={'light'} scrollX={false}>
                    <div className="spacer-h-m" />
                    <div className="display-flex">

                        <IonLabel className="my-act-title">My Activities </IonLabel>

                        <div className="add-pos">
                            <IonButton
                                className="add-btn-properties"
                                href="/activities/add-activity"
                                color={'dark'}
                            > Add Task
                                <IonIcon icon={addSharp}></IonIcon>
                            </IonButton>
                        </div>

                        <div className="spacer-h-s" />
                    </div>

                    <IonItem color={"light"}>
                        <IonChip color={"primary"}>All</IonChip>
                        <IonChip>Personal</IonChip>
                        <IonChip>School</IonChip>
                        <IonChip>Work</IonChip>
                        <IonChip>Home</IonChip>
                    </IonItem>

                    <div className="avatar-center">
                        <IonCard className="activity-card">
                            <IonItem>
                                <IonCheckbox color={'dark'} />
                                <div className="spacer-w-l" />
                                <IonIcon icon={ellipse} color={"danger"}>High</IonIcon>
                                <IonLabel>
                                    <b>Sample Task</b>
                                </IonLabel>

                                <IonLabel>Due /Day/, /Month/ /Date/ /Year/</IonLabel>
                                <IonLabel>Category: Work</IonLabel>

                                <IonButton fill="clear" color={"primary"} size="default">
                                    <IonIcon icon={create} />
                                </IonButton>
                                <IonButton fill="clear" color={'danger'} size="default">
                                    <IonIcon icon={trash} />
                                </IonButton>
                            </IonItem>
                        </IonCard>
                    </div>
                </IonContent>
            </>
                :

                /*MOBILE VIEW*/
                <>
                    <IonContent color={'light'} scrollX={false}>
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton className="m-add-btn-properties"
                                href="/activities/add-activity"
                                color={'dark'}>
                                <IonIcon icon={add}></IonIcon>
                            </IonFabButton>
                        </IonFab>

                        <div className="spacer-h-s" />

                        <IonLabel className="m-my-act-title">My Activities </IonLabel>

                        <IonItem color={"light"}>
                            <IonChip color={"primary"}>All</IonChip>
                            <IonChip>Personal</IonChip>
                            <IonChip>School</IonChip>
                            <IonChip>Work</IonChip>
                            <IonChip>Home</IonChip>
                        </IonItem>

                        <div className="avatar-center">
                            <IonCard className="m-activity-card">
                                <IonItem>
                                    <IonCheckbox color={'dark'} />
                                    <div className="spacer-w-s" />
                                    <IonIcon icon={ellipse} color={"danger"}>High</IonIcon>
                                    <IonLabel>
                                        <b>Sample Task</b>
                                    </IonLabel>

                                    <div className="spacer-w-xl" />
                                    <IonButton fill="clear" color={"primary"}>
                                        <IonIcon icon={create} />
                                    </IonButton>
                                    <IonButton fill="clear" color={'danger'}>
                                        <IonIcon icon={trash} />
                                    </IonButton>
                                </IonItem>

                                <div className="spacer-h-xxs" />

                                <IonLabel>Due /Day/, /Month/ /Date/ /Year/</IonLabel>
                                <IonLabel>Category: Work</IonLabel>
                            </IonCard>
                        </div>
                        <div className="avatar-center">
                            <IonCard className="m-activity-card">
                                <IonItem>
                                    <IonCheckbox color={'dark'} />
                                    <div className="spacer-w-s" />
                                    <IonIcon icon={ellipse} color={"danger"}>High</IonIcon>
                                    <IonLabel>
                                        <b>Sample Task</b>
                                    </IonLabel>

                                    <div className="spacer-w-xl" />
                                    <IonButton fill="clear" color={"primary"}>
                                        <IonIcon icon={create} />
                                    </IonButton>
                                    <IonButton fill="clear" color={'danger'}>
                                        <IonIcon icon={trash} />
                                    </IonButton>
                                </IonItem>

                                <div className="spacer-h-xxs" />

                                <IonLabel>Due /Day/, /Month/ /Date/ /Year/</IonLabel>
                                <IonLabel>Category: Work</IonLabel>
                            </IonCard>
                        </div>
                    </IonContent>
                </>

            }
        </IonPage>
    );
};

export { Activities };