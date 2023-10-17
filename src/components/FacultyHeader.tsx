import {
    IonContent, IonPage, IonImg,
    IonButton,
    IonToolbar, IonLabel,
    IonHeader,
    IonIcon,
    IonButtons,
    IonText,
} from "@ionic/react";
import './StudentHeader.css';
import { logOut, personCircle } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

const FacultyHeader: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 })

    const [activePage, setActivePage] = useState(''); // State to track the active page

    useEffect(() => {
        // Extract the active page from the current URL
        const currentPath = window.location.pathname;

        if (currentPath === '/faculty/attendance') {
            setActivePage('att');
        } else if (currentPath === '/faculty/grades') {
            setActivePage('grades');
        } else if (currentPath === '/faculty/registrationlist') {
            setActivePage('registration');
        } else {
            setActivePage('');
        }
    }, []);

    const getButtonStyle = (pageName: string) => {
        return activePage === pageName ? { fontWeight: 'bold' } : {};
    };

    return (
        <div>
            {isDesktop ?
                <><IonHeader class="ion-no-border">
                    <IonToolbar>
                        <div className="header-display">
                            <div className="title-and-logo">
                                <IonButton className="logo-btn-size" fill="clear">
                                    <IonImg src="/src/imgs/logo.png"></IonImg>
                                </IonButton>
                                <IonLabel className="title-label" color={"dark"}>Lipa City Science Integrated National High School Portal</IonLabel>
                            </div>

                            <div className="tabs-display">
                                <IonButton fill="clear" className="tab-btn"
                                    color={"dark"}
                                    style={getButtonStyle('att')}
                                    href="/faculty/attendance">Attendance
                                </IonButton>

                                <IonButton fill="clear" className="tab-btn"
                                    color={"dark"}
                                    style={getButtonStyle('grades')}
                                    href="/faculty/grades">Grades
                                </IonButton>

                                <IonButton fill="clear" className="tab-btn"
                                    color={"dark"}
                                    style={getButtonStyle('registration')}
                                    href="/faculty/registrationlist">Registration
                                </IonButton>

                            </div>
                            <div className="profile-btn-pos">
                                <IonButton fill="clear" color={"dark"} size="large" href="/login">
                                    <IonIcon icon={logOut} size="large" ></IonIcon>
                                </IonButton>
                            </div>
                        </div>
                    </IonToolbar>
                </IonHeader></>
                :
                /*MOBILE VIEW*/
                <>

                    <IonHeader class="ion-no-border">
                        <IonToolbar >
                            <div className="m-header-display">
                                <div className="top-head">
                                    <div className="m-title-and-logo">
                                        <IonButton className="m-logo-btn-size" fill="clear" href="/home" size="default">
                                            <IonImg src="/src/imgs/logo.png"></IonImg>
                                        </IonButton>
                                        <IonText className="m-title-label" color={"dark"}>LCSINHS Portal</IonText>
                                    </div>
                                    <div className="spacer-w-xs"/>
                                    <div className="m-profile-btn-pos">
                                    <IonButton fill="clear" color={"dark"} size="large" href="/login">
                                        <IonIcon icon={logOut} size="large" ></IonIcon>
                                    </IonButton>
                                </div>
                                </div>

                                <div className="m-tabs-display">
                                    <IonButton fill="clear" className="m-tab-btn"
                                        color={"dark"}
                                        style={getButtonStyle('att')}
                                        href="/faculty/attendance">Attendance
                                    </IonButton>

                                    <IonButton fill="clear" className="m-tab-btn"
                                        color={"dark"}
                                        style={getButtonStyle('grades')}
                                        href="/faculty/grades">Grades
                                    </IonButton>

                                    <IonButton fill="clear" className="m-tab-btn"
                                        color={"dark"}
                                        style={getButtonStyle('registration')}
                                        href="/faculty/registrationlist">Registration
                                    </IonButton>

                                </div>
                                
                            </div>
                        </IonToolbar>
                    </IonHeader></>
            }
        </div>

    );

};


export default FacultyHeader;