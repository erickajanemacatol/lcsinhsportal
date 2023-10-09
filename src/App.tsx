import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import AddActivity from './pages/Home/Activities/AddActivity';
import { Activities } from './pages/Home/Activities/Activities';
import { Attendance } from './pages/Home/Attendance/Attendance';
import { Grades } from './pages/Home/Grades/Grades';
import { Homepage } from './pages/Home/Home/Homepage';
import { Profile } from './pages/Home/Profile/Profile';
import { fAttendance } from './pages/Faculty/fAttendance';
import { fGrades } from './pages/Faculty/fGrades';
import { fRegistration } from './pages/Faculty/fRegistration';
import { Announcements } from './pages/Admin/Announcements';
import { addAnnouncement } from './pages/Admin/AddAnnouncement';


setupIonicReact();

const App: React.FC = () => (

  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>

        <Route exact path="/home" component={Homepage} />
        <Route exact path="/activities" component={Activities} />
        <Route path="/activities/add-activity" exact={true} component={AddActivity} />
        <Route exact path="/attendance" component={Attendance} />
        <Route exact path="/grades" component={Grades} />
        <Route exact path="/profile" component={Profile} />

        <Route exact path="/faculty/attendance" component={fAttendance}/>
        <Route exact path="/faculty/grades" component={fGrades}/>
        <Route exact path="/faculty/registrationlist" component={fRegistration}/>

        <Route exact path="/admin/announcements" component={Announcements}/>
        <Route exact path="/admin/announcement-details" component={addAnnouncement}/>

              </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
