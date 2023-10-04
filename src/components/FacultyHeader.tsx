import {
    IonContent, IonPage, IonImg,
    IonButton,
    IonToolbar, IonLabel,
    IonHeader,
    IonIcon,
} from "@ionic/react";
import './StudentHeader.css';
import { logOut } from "ionicons/icons";
import React, { useState, useEffect } from "react";

const FacultyHeader: React.FC = () => {
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
        <IonHeader>
            <IonToolbar>
                <div className="header-display">
                    <div className="title-and-logo">
                        <IonButton className="logo-btn-size" fill="clear" href='/faculty/attendance'>
                            <IonImg src="/src/imgs/logo.png"></IonImg>
                        </IonButton>
                        <IonLabel className="title-label" color={"light"}>Lipa City Science Integrated National High School Portal</IonLabel>
                    </div>
                    <div className="tabs-display">
                        <IonButton fill="clear" className="tab-btn"
                            color={"light"}
                            style={getButtonStyle('att')}
                            href="/faculty/attendance">Attendance
                        </IonButton>

                        <IonButton fill="clear" className="tab-btn"
                            color={"light"}
                            style={getButtonStyle('grades')}
                            href="/faculty/grades">Grades
                        </IonButton>

                        <IonButton fill="clear" className="tab-btn"
                            color={"light"}
                            style={getButtonStyle('registration')}
                            href="/faculty/registrationlist">Registration
                        </IonButton>

                    </div>
                    <div className="profile-btn-pos">
                        <IonButton fill="clear" color={"light"} size="large" href="/login">
                            <IonIcon icon={logOut} size="large" ></IonIcon>
                        </IonButton>
                    </div>
                </div>
            </IonToolbar>
            </IonHeader>
    );
};


export default FacultyHeader;