import {
  IonImg, IonButton, IonLabel, IonHeader, IonIcon, IonToolbar, IonText,
} from "@ionic/react";
import './AdminHeader.css';
import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import { logOut } from "ionicons/icons";

const AdminHeader: React.FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 1050 })
  const history = useHistory();
  const [activePage, setActivePage] = useState(''); // State to track the active page

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (currentPath === '/admin/news') {
      setActivePage('news');
    } else if (currentPath === '/admin/announcements') {
      setActivePage('anncm');
    } else if (currentPath === '/admin/calendar') {
      setActivePage('cal');
    } else if (currentPath === '/admin/students') {
      setActivePage('students');
    } else if (currentPath === '/admin/faculty') {
      setActivePage('faculty');
    } else if (currentPath === '/admin/links') {
      setActivePage('links');
    } else {
      setActivePage('');
    }
  }, []);

  const getButtonStyle = (pageName: string) => {
    return activePage === pageName ? { fontWeight: 'bold' } : {};
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    history.push('/login');
    console.log('Logged out');
  };

  return (
    <div>
      {isDesktop ?
        <>
          <IonHeader>
            <IonToolbar>
              <div className="header-display">
                <div className="title-and-logo">
                  <IonButton className="logo-btn-size" fill="clear" href="/admin/news">
                    <IonImg src="/src/imgs/logo.png"></IonImg>
                  </IonButton>
                  <IonLabel className="title-label" color={"dark"}>Lipa City Science Integrated National High School Portal</IonLabel>
                </div>
                <div className="tabs-display">
                  <IonButton fill="clear" className="tab-button"
                    color={"dark"}
                    size="default"
                    style={getButtonStyle('news')}
                    href="/admin/news">News
                  </IonButton>
                  <IonButton fill="clear" className="tab-button"
                    color={"dark"}
                    size="default"
                    style={getButtonStyle('anncm')}
                    href="/admin/announcements">Announcements
                  </IonButton>
                  <IonButton fill="clear" className="tab-button"
                    color={"dark"}
                    size="default"
                    style={getButtonStyle('cal')}
                    href="/admin/calendar">Calendar
                  </IonButton>
                  <IonButton fill="clear" className="tab-button"
                    color={"dark"}
                    size="default"
                    style={getButtonStyle('students')}
                    href="/admin/students">Students
                  </IonButton>
                  <IonButton fill="clear" className="tab-button"
                    color={"dark"}
                    size="default"
                    style={getButtonStyle('faculty')}
                    href="/admin/faculty">Faculty
                  </IonButton>
                  <IonButton fill="clear" className="tab-button"
                    color={"dark"}
                    size="default"
                    style={getButtonStyle('links')}
                    href="/admin/links">Links
                  </IonButton>
                </div>
                <div className="profile-btn-pos">
                  <IonButton fill="clear" color={"dark"} size="large" onClick={handleLogout}>
                    <IonIcon icon={logOut} size="large" ></IonIcon>
                  </IonButton>
                </div>
              </div>
            </IonToolbar>
          </IonHeader>
        </>
        :
        /*MOBILE VIEW*/
        <>
          <IonHeader className="ion-no-border">
            <IonToolbar >
              <div className="m-header-display">
                <div className="top-head">
                  <div className="m-title-and-logo">
                    <IonButton className="m-logo-btn-size" fill="clear" href="/admin/news" size="default">
                      <IonImg src="/src/imgs/logo.png"></IonImg>
                    </IonButton>
                    <IonText className="m-title-label" color={"dark"}>LCSINHS Portal - Admin</IonText>
                  </div>
                  <IonButton fill="clear" color={"dark"} onClick={handleLogout}>
                    <IonIcon icon={logOut} size="large" ></IonIcon>
                  </IonButton>
                </div>

           
                  <div className="scrollable-container">
                    <IonButton fill="clear" className="m-tab-button"
                      color={"dark"}
                      size="default"
                      style={getButtonStyle('news')}
                      href="/admin/news">News
                    </IonButton>
                    <IonButton fill="clear" className="m-tab-button"
                      color={"dark"}
                      size="default"
                      style={getButtonStyle('anncm')}
                      href="/admin/announcements">Announcements
                    </IonButton>
                    <IonButton fill="clear" className="m-tab-button"
                      color={"dark"}
                      size="default"
                      style={getButtonStyle('cal')}
                      href="/admin/calendar">Calendar
                    </IonButton>
                    <IonButton fill="clear" className="m-tab-button"
                      color={"dark"}
                      size="default"
                      style={getButtonStyle('students')}
                      href="/admin/students">Students
                    </IonButton>
                    <IonButton fill="clear" className="m-tab-button"
                      color={"dark"}
                      size="default"
                      style={getButtonStyle('faculty')}
                      href="/admin/faculty">Faculty
                    </IonButton>
                    <IonButton fill="clear" className="m-tab-button"
                      color={"dark"}
                      size="default"
                      style={getButtonStyle('links')}
                      href="/admin/links">Links
                    </IonButton>
                  </div>


              </div>
            </IonToolbar>
          </IonHeader>
        </>
      }
    </div>

  );
};


export default AdminHeader;