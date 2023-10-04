import {
    IonContent, IonPage, IonImg,
    IonButton,
    IonToolbar, IonLabel,
    IonHeader,
    IonIcon,
} from "@ionic/react";
import './StudentHeader.css';
import { personCircle } from "ionicons/icons";
import React, { useState, useEffect } from "react";

const StudentHeader: React.FC= () => {
    const [activePage, setActivePage] = useState(''); // State to track the active page

    useEffect(() => {
        // Extract the active page from the current URL
        const currentPath = window.location.pathname;

        if (currentPath === '/home') {
            setActivePage('home');
        } else if (currentPath === '/activities') {
            setActivePage('activities');
        } else if (currentPath === '/attendance') {
            setActivePage('attendance');
        } else if (currentPath === '/grades') {
            setActivePage('grades');
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
                        <IonButton className="logo-btn-size" fill="clear">
                            <IonImg src="/src/imgs/logo.png"></IonImg>
                        </IonButton>
                        <IonLabel className="title-label" color={"light"}>Lipa City Science Integrated National High School Portal</IonLabel>
                    </div>
                    <div className="tabs-display">
                        <IonButton fill="clear" className="tab-btn"
                            color={"light"}
                            style={getButtonStyle('home')}
                            href="/home">Home
                        </IonButton>

                        <IonButton fill="clear" className="tab-btn"
                            color={"light"} href="/activities"
                            style={getButtonStyle('activities')}>Activities
                        </IonButton>

                        <IonButton fill="clear" className="tab-btn"
                            color={"light"} href="/attendance"
                            style={getButtonStyle('attendance')}>Attendance
                        </IonButton>

                        <IonButton fill="clear" className="tab-btn"
                            color={"light"} href="/grades"
                            style={getButtonStyle('grades')}>Grades
                        </IonButton>
                    </div>
                    <div className="profile-btn-pos">
                        <IonButton fill="clear" color={"light"} size="large" href="/profile">
                            <IonIcon icon={personCircle} size="large" ></IonIcon>
                        </IonButton>
                    </div>
                </div>
            </IonToolbar>
        </IonHeader>
    );
};


export default StudentHeader;