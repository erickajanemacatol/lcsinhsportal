import {
    IonContent, IonPage, IonImg,
    IonButton,
    IonToolbar, IonLabel,
    IonIcon,
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonHeader
} from "@ionic/react";

import './HomeTabs.css';
import { IonReactRouter } from "@ionic/react-router";
import { barChart, calendar, home, personCircle, qrCode } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import { Activities } from "../pages/Home/Activities/Activities";
import { Attendance } from "../pages/Home/Attendance/Attendance";
import { Grades } from "../pages/Home/Grades/Grades";
import { Homepage } from "../pages/Home/Home/Homepage";
import { Profile } from "../pages/Home/Profile/Profile";

const HomeTabs: React.FC = () => {
    return (
        <IonPage>
            <div>
                <IonHeader className="ion-no-border" >
                    <IonToolbar className="new-ion-header">
                        <div className="profile-pos">
                            <IonButton className="profile-button" fill="clear" 
                            slot="icon-only" size="large" color={"light"} href={'/profile'}>
                                <IonIcon icon={personCircle} size="100">
                                </IonIcon>
                            </IonButton>
                        </div>
                        <div className="header-items">
                            <IonButton fill="clear">
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

                            <Redirect exact path="/tabs" to="/tabs/home" />

                            <Route exact path="/home" >
                                <Homepage />
                            </Route>
                            <Route exact path="/activities" >
                                <Activities />
                            </Route>
                            <Route exact path="/attendance" >
                                <Attendance />
                            </Route>
                            <Route exact path="/grades" >
                                <Grades />
                            </Route>
                            <Route exact path="/profile" >
                                <Profile />
                            </Route>

                        </IonRouterOutlet>

                        <IonTabBar slot="top" className="tab-bar-position">
                            <IonButton></IonButton>

                            <IonTabButton tab="home" href="/home">
                                <IonIcon icon={home} aria-hidden="true" />
                                <IonLabel>Home</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="activities" href="/activities">
                                <IonIcon icon={calendar} />
                                <IonLabel>Activities</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="attendance" href="/attendance">
                                <IonIcon icon={qrCode} />
                                <IonLabel>Attendance</IonLabel>
                            </IonTabButton>

                            <IonTabButton tab="grades" href="/grades">
                                <IonIcon icon={barChart} />
                                <IonLabel>Grades</IonLabel>
                            </IonTabButton>
                        </IonTabBar>
                    </IonTabs>

                </IonReactRouter>
            </IonContent>


        </IonPage>


    );
};


export default HomeTabs;