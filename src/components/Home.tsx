import {
    IonContent, IonPage, IonImg,
    IonButton,
    IonToolbar, IonLabel,
    IonIcon,
    IonRoute,
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonHeader
} from "@ionic/react";

import { UseIonHeaderCollapse, useIonHeaderCollapse } from '@codesyntax/ionic-react-header-collapse';

import './Home.css';
import { IonReactRouter } from "@ionic/react-router";
import { barChart, calendar, home, personCircle, personCircleOutline, playCircle, qrCode, radio, search } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import { Activities } from "../pages/Home/Activities/Activities";
import { Attendance } from "../pages/Home/Attendance/Attendance";
import { Grades } from "../pages/Home/Grades/Grades";
import Homepage from "../pages/Home/Home/Homepage";
import { Profile } from "../pages/Home/Profile/Profile";

const Home: React.FC = () => {

    const { ref } = useIonHeaderCollapse({} as UseIonHeaderCollapse);
    
    return (

        <IonPage>
            <div>
                <IonHeader className="ion-no-border">
                    <IonToolbar className="new-ion-header">
                        <div className="header-items">
                            <IonButton fill="clear" href="home">
                                <IonImg className="header-logo" src="/src/imgs/logo.png"></IonImg>
                            </IonButton>
                        </div>
                        <div className="header-items">
                        <IonLabel className="p">Lipa City Science Integrated National High School Portal</IonLabel>
                        </div>
                    </IonToolbar>

                </IonHeader>
            </div>

            <IonContent>
                <IonReactRouter>
                    <IonTabs>
                        <IonRouterOutlet>

                            <Redirect to="/student-home" />

                            <Route path="/student-home" render={() => <Homepage />} exact={true} />
                            <Route path="/student-activities" render={() => <Activities />} exact={true} />
                            <Route path="/student-attendance" render={() => <Attendance />} exact={true} />
                            <Route path="/student-grades" render={() => <Grades />} exact={true} />
                            <Route path="/student-profile" render={() => <Profile />} exact={true} />
                        </IonRouterOutlet>

                        <IonTabBar slot="top" className="tab-bar-position">
                            <IonButton></IonButton>

                            <IonTabButton tab="home" href="/student-home">
                                <IonIcon icon={home} aria-hidden="true" />
                                <IonLabel>Home</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="activities" href="/student-activities">
                                <IonIcon icon={calendar} />
                                <IonLabel>Activities</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="attendance" href="/student-attendance">
                                <IonIcon icon={qrCode} />
                                <IonLabel>Attendance</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="grades" href="/student-grades">
                                <IonIcon icon={barChart} />
                                <IonLabel>Grades</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="profile" href="/student-profile">
                                <IonIcon icon={personCircle} />
                                <IonLabel>Profile</IonLabel>
                            </IonTabButton>

                        </IonTabBar>
                    </IonTabs>

                </IonReactRouter>
            </IonContent>


        </IonPage>


    );
};


export default Home;