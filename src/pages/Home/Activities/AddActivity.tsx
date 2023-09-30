import {
    IonCard, IonLabel,
    IonCardContent,
    IonContent, IonPage, IonFab, IonFabButton, IonIcon, IonPopover, IonBackButton, IonToolbar, IonButtons, IonHeader
} from "@ionic/react";
import './AddActivity.css';
import { add, caretBack } from "ionicons/icons";

const AddActivity = () => {
    return (
        <IonPage>
            <IonContent color={'dark'} scrollX={false}>
                <IonHeader>
                    <IonToolbar>

                        <IonButtons slot="start">
                            <IonBackButton text="Back" icon={caretBack}  defaultHref="/student-activities">
                            </IonBackButton>
                        </IonButtons>

                        <IonLabel className="my-activity-text">Add an Activity</IonLabel>
                        
                    </IonToolbar>
                </IonHeader>

                <div className="add-activity-card-position">
                    <IonCard className="add-activity-card">

                        <IonCardContent>

                        </IonCardContent>
                    </IonCard>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default AddActivity ;