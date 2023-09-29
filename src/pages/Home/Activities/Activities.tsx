import {
    IonContent, IonPage
    } from "@ionic/react";
import './Activities.css';

const Activities = () => {
    return (
        <IonPage>
            <IonContent color={'dark'} scrollX={false}>
                This is Activities Page
            </IonContent>
        </IonPage>
    );
};

export {Activities};