import {
    IonImg,
    IonButton,
    IonToolbar, IonLabel,
    IonHeader,
    IonIcon,
    IonText,
    IonCard,
    IonItem,
} from "@ionic/react";
import './StudentHeader.css';
import { logOut } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import axios from "axios";

interface FacultyData {
    employee_no: number | null;
    title: string;
    fname: string;
    lname: string;
}

const FacultyHeader: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 })
    const [activePage, setActivePage] = useState('');
    const history = useHistory();
    const username = localStorage.getItem('username') || ''; // Use an empty string as the fallback if null
    const [currentDateTime, setCurrentDateTime] = useState<string>('');

    const [userData, setUserData] = useState<FacultyData>({
        employee_no: null,
        title: '',
        fname: '',
        lname: '',
    });

    useEffect(() => {
        if (username) {
            axios
                .post('https://studentportal.lcsinhs.com/scripts/faculty-profile.php', { username: username })
                .then((response) => {
                    setUserData(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [username]);

    const handleLogout = () => {
        // Clear the user's identifier from localStorage
        localStorage.removeItem('username'); // Replace 'username' with the identifier you use
        history.push('/login');
        console.log('Logged out');
    };

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

    useEffect(() => {
        // Function to update the current date and time
        const updateCurrentDateTime = () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const formattedTime = now.toLocaleTimeString();
            const dateTimeString = `${formattedDate}, ${formattedTime}`;
            setCurrentDateTime(dateTimeString);
        };

        updateCurrentDateTime();
        const intervalId = setInterval(updateCurrentDateTime, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div>
            {isDesktop ?
                <><IonHeader>
                    <IonToolbar color={'dark'}>
                        <div className="header-display">
                            <div className="f-title-and-logo">
                                <IonButton className="logo-btn-size" fill="clear" href="/faculty/attendance" color={'light'}>
                                    <IonImg src="/src/imgs/logo3.png"></IonImg>
                                </IonButton>
                                <IonLabel className="title-label">
                                    LCSINHS Portal - Faculty
                                </IonLabel>
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
                                <IonButton fill="clear" color={"light"} size="large" onClick={handleLogout}>
                                    <IonIcon icon={logOut} size="large" ></IonIcon>
                                </IonButton>
                            </div>
                        </div>

                        <IonCard className="f-title-label-props" color={'dark'}>
                            <>
                                <IonItem className="f-title-label" color={"dark"}>
                                    Name: {userData.title} {userData.fname} {userData.lname}
                                    <div className="spacer-w-m"/>
                                    Employee No.: {userData.employee_no}
                                </IonItem>
                            </>
                            <>
                                <IonItem className="f-title-label" color={'dark'}>{currentDateTime}</IonItem>
                            </>
                        </IonCard>
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
                                        <IonButton className="m-logo-btn-size" fill="clear" href="/faculty/attendance" size="default">
                                            <IonImg src="/src/imgs/logo.png"></IonImg>
                                        </IonButton>
                                        <IonText className="m-title-label" color={"dark"}>LCSINHS Portal</IonText>
                                    </div>
                                    <div className="spacer-w-xs" />
                                    <div className="m-profile-btn-pos">
                                        <IonButton fill="clear" color={"dark"} size="large" onClick={handleLogout}>
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