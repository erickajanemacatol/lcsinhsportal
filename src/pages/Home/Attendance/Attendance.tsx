import { IonContent, IonLabel, IonPage } from "@ionic/react";
import Header from "../../../components/StudentHeader";
import './Attendance.css'
import { useMediaQuery } from "react-responsive";

const Attendance = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 })

    return (

        <IonPage>
            <Header />

            {isDesktop ? <>
                <IonContent color={'light'} scrollX={false}>
                    <div className="spacer-h-m" />
                    <div className="display-flex">

                        <IonLabel className="my-att-title">My Classes </IonLabel>
                    </div>
                </IonContent>
            </>
                :

                /*MOBILE VIEW*/
                <>
                    <IonContent color={'light'} scrollX={false}>
                    <div className="spacer-h-s" />
                    <div className="display-flex">
                        <IonLabel className="m-my-att-title">My Classes </IonLabel>
                    </div>
                </IonContent>
                </>

            }
        </IonPage>
    );
};

export { Attendance };