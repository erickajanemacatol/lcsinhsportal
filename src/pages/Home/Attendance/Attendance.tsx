import { IonCard, IonCardContent, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonPage, IonToolbar } from "@ionic/react";
import Header from "../../../components/StudentHeader";

const Attendance = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar class="toolbar-height">
                    <Header title="hello"></Header>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'dark'} scrollX={false}>
                <IonCard className="my-activity-card">
                    <IonCardContent>
                        <IonLabel className="my-activity-text">My Classes</IonLabel>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export { Attendance };