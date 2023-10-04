import {
    IonCard, IonLabel,
    IonCardContent,
    IonContent, IonPage, IonFab, IonFabButton, IonIcon, IonPopover, IonHeader, IonToolbar
} from "@ionic/react";
import './Activities.css';
import { add } from "ionicons/icons";
import Header from "../../../components/StudentHeader";

console.log("Activities component rendered")

const Activities = () => {
    return (

        <IonPage>
            <Header />

            <IonContent color={'dark'} scrollX={false}>
                <IonCard className="my-activity-card">
                    <IonCardContent>
                        <IonLabel className="my-activity-text">My Activities</IonLabel>

                    </IonCardContent>

                    <div>
                        <IonFab slot="fixed" vertical="bottom" horizontal="end" >
                            <IonFabButton color={"light"} href="/activities/add-activity">
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