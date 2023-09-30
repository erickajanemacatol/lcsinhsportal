import {
    IonCard, IonLabel,
    IonCardContent,
    IonContent, IonPage, IonFab, IonFabButton, IonIcon, IonPopover
} from "@ionic/react";
import './Activities.css';
import { add } from "ionicons/icons";

const Activities = () => {
    return (
        <IonPage>
            <IonContent color={'dark'} scrollX={false}>
                <IonCard className="my-activity-card">
                    <IonCardContent>
                        <IonLabel className="my-activity-text">My Activities</IonLabel>
                    </IonCardContent>

                    <div>
                        <IonFab slot="fixed" vertical="bottom" horizontal="end" >
                            <IonFabButton color={"light"} href="/student-activities/add-activity">
                                <IonIcon icon={add}></IonIcon>
                            </IonFabButton>
                        </IonFab>
                    </div>


                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export { Activities };