import { IonCard, IonCardContent, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonLabel, IonPage, IonRow, IonToggle, IonToolbar } from "@ionic/react";
import Header from "../../../components/StudentHeader";
import './Grades.css'
import { useMediaQuery } from "react-responsive";

const Grades = () => {

    const isDesktop = useMediaQuery({ minWidth: 992 })

    return (

        <IonPage>
            <Header />

            {isDesktop ?
                <>
                    <IonContent color={'light'} scrollX={false}>
                        <div className="spacer-h-m" />
                        <IonLabel className="my-grades-text">My Grades</IonLabel>

                        <IonCard className="my-grades-card">
                            <IonCardContent>

                                <div className="spacer-h-m"></div>

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
                        <IonLabel className="m-grades-text">My Grades</IonLabel>

                        <IonCard className="m-grades-card">
                            <IonCardContent>

                                <div className="spacer-h-s"></div>

                                <div>
                                    <IonGrid className="grid-border">
                                        <IonRow>
                                            <IonCol class="col-border-header" size="2.5">
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
                                            <IonCol class="col-border" size="2.5">
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
                </>}

        </IonPage>
    );
};

export { Grades };