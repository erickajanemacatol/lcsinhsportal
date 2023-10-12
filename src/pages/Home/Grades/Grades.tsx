import {
    IonButton,
    IonCard, IonCardContent, IonChip, IonCol,
    IonContent, IonGrid, IonIcon, IonLabel,
    IonList,
    IonListHeader,
    IonPage, IonRow
} from "@ionic/react";
import Header from "../../../components/StudentHeader";
import './Grades.css'
import { useMediaQuery } from "react-responsive";
import { filter, funnel } from "ionicons/icons";

const Grades = () => {

    const isDesktop = useMediaQuery({ minWidth: 1050 })

    return (

        <IonPage>
            <Header />

            {isDesktop ?
                <>
                    <IonContent color={'light'} scrollX={false}>
                        <div className="spacer-h-m" />
                        <div className="top-title">
                            <div>
                                <IonLabel className="my-grades-text">My Grades</IonLabel>
                            </div>

                            <div className="top2">
                                <IonButton fill="clear"  color={'medium'}>
                                    <IonIcon icon={funnel}></IonIcon>
                                    <div className="spacer-w-xs" />
                                    Filter
                                </IonButton>
                            </div>
                        </div>

                        <IonCard className="my-grades-card">
                            <IonCardContent>

                                <div>
                                    <IonGrid className="grid-border">
                                        <IonRow>
                                            <IonCol class="col-border-header" size="2">
                                                Subject Code
                                            </IonCol>
                                            <IonCol class="col-border-header" size="3">
                                                Subject Teacher
                                            </IonCol>
                                            <IonCol class="col-border-header" size="4">
                                                Subject Name
                                            </IonCol>
                                            <IonCol class="col-border-header" >
                                                Grade
                                            </IonCol>
                                        </IonRow>

                                        {/*RETURN GRADES HERE*/}
                                        <div className="spacer-h-xss"></div>
                                        <IonRow>
                                            <IonCol class="col-border" size="2">
                                                FIL101
                                            </IonCol>
                                            <IonCol class="col-border" size="3">
                                                Ms. Ericka
                                            </IonCol>
                                            <IonCol class="col-border" size="4">
                                                Filipino
                                            </IonCol>
                                            <IonCol class="col-border" >
                                                98
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </div>

                            </IonCardContent>
                        </IonCard>
                    </IonContent>
                </>
                :

                /*MOBILE VIEW*/
                <>
                    <IonContent color={'light'} scrollX={false}>
                        <div className="spacer-h-s" />
                        <div className="m-top-title">
                            <div>
                                <IonLabel className="m-grades-text">My Grades</IonLabel>
                            </div>

                            <div className="m-top2">
                                <IonButton fill="clear" shape="round" color={'medium'}>
                                    <IonIcon icon={funnel}></IonIcon>                                    
                                </IonButton>
                            </div>
                        </div>


                        <IonCard className="m-grades-card">
                            <IonCardContent>

                                <div>
                                    <IonGrid className="grid-border">
                                        <IonRow>
                                            <IonCol class="col-border-header" size="2.5">
                                                Subject Code
                                            </IonCol>
                                            <IonCol class="col-border-header" size="3.5">
                                                Subject Teacher
                                            </IonCol>
                                            <IonCol class="col-border-header" size="3.5">
                                                Subject Name
                                            </IonCol>
                                            <IonCol class="col-border-header" >
                                                Grade
                                            </IonCol>
                                        </IonRow>

                                        {/*RETURN GRADES HERE*/}
                                        <div className="spacer-h-xss"></div>
                                        <IonRow>
                                            <IonCol class="col-border" size="2.5">
                                                FIL101
                                            </IonCol>
                                            <IonCol class="col-border" size="3.5">
                                                Ms. Ericka
                                            </IonCol>
                                            <IonCol class="col-border" size="3.5">
                                                Filipino
                                            </IonCol>
                                            <IonCol class="col-border" >
                                                98
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </div>

                            </IonCardContent>
                        </IonCard>
                    </IonContent>
                </>}

        </IonPage>
    );
};

export { Grades };