import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

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
import { News } from './pages/Admin/News';
import { Announcements } from './pages/Admin/Announcements';
import { Calendar } from './pages/Admin/Calendar';
import { Students } from './pages/Admin/Students';
import { Faculty } from './pages/Admin/Faculty';
import { ID_temp } from './pages/Home/Profile/ID_temp';
import { Links } from './pages/Admin/Links';
import PrivateRoute from './components/utils/PrivateRoute';
import Error from './components/utils/Error';
import { QRAttendance_Timein } from './pages/QR Attendance/QR_timein';
import { ID_temp_shs } from './pages/Home/Profile/ID_temp_shs';
import { QRAttendance_Timeout } from './pages/QR Attendance/QR_timeout';
import { Classes } from './pages/Admin/Classes';

setupIonicReact();

const App: React.FC = () => (

  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Router>
          <Switch>
            <PrivateRoute path="/home" component={Homepage} requiredRole="0" />
            <PrivateRoute exact path="/activities" component={Activities} />
            <PrivateRoute exact path="/activities/add-activity" component={AddActivity} requiredRole="0" />
            <PrivateRoute exact path="/attendance" component={Attendance} requiredRole="0" />
            <PrivateRoute exact path="/grades" component={Grades} requiredRole="0" />
            <PrivateRoute exact path="/profile" component={Profile} requiredRole="0" />
            <PrivateRoute exact path="/school_id" component={ID_temp} requiredRole="0" />
            <PrivateRoute exact path="/school_id_shs" component={ID_temp_shs} requiredRole="0" />

            <PrivateRoute exact path="/faculty/attendance" component={fAttendance} requiredRole="2" />
            <PrivateRoute exact path="/faculty/grades" component={fGrades} requiredRole="2" />
            <PrivateRoute exact path="/faculty/registrationlist" component={fRegistration} requiredRole="2" />

            <PrivateRoute exact path="/admin/news" component={News} requiredRole="1" />
            <PrivateRoute exact path="/admin/announcements" component={Announcements} requiredRole="1" />
            <PrivateRoute exact path="/admin/calendar" component={Calendar} requiredRole="1" />
            <PrivateRoute exact path="/admin/students" component={Students} requiredRole="1" />
            <PrivateRoute exact path="/admin/faculty" component={Faculty} requiredRole="1" />
            <PrivateRoute exact path="/admin/classes" component={Classes} requiredRole="1" />
            <PrivateRoute exact path="/admin/links" component={Links} requiredRole="1" />

            <PrivateRoute exact path="/qr-attendance-timein" component={QRAttendance_Timein} requiredRole="3" />
            <PrivateRoute exact path="/qr-attendance-timeout" component={QRAttendance_Timeout} requiredRole="3" />
            <Route exact path="/error" component={Error} />
            <Route path="/login" component={Login} />
            <Redirect to="/login" />
          </Switch>
        </Router>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>

  /*
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Router>
            <Switch>
              <Route path="/home" component={Homepage} />
              <Route exact path="/activities" component={Activities} />
              <Route exact path="/activities/add-activity" component={AddActivity} />
              <Route exact path="/attendance" component={Attendance} />
              <Route exact path="/grades" component={Grades} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/school_id" component={ID_temp} />
              <Route exact path="/school_id_shs" component={ID_temp_shs} />
  
              <Route exact path="/faculty/attendance" component={fAttendance} />
              <Route exact path="/faculty/grades" component={fGrades} />
              <Route exact path="/faculty/registrationlist" component={fRegistration} />
  
              <Route exact path="/admin/news" component={News} />
              <Route exact path="/admin/announcements" component={Announcements} />
              <Route exact path="/admin/announcement-details" component={AddAnnouncement} />
              <Route exact path="/admin/calendar" component={Calendar} />
              <Route exact path="/admin/students" component={Students} />
              <Route exact path="/admin/faculty" component={Faculty} />
              <Route exact path="/admin/classes" component={Classes} />
              <Route exact path="/admin/survey-result" component={Links} />
  
              <Route exact path="/survey" component={SurveyComponent} />
              <Route exact path="/qr-attendance" component={QRAttendance} />
              <Route exact path="/error" component={Error} />
              <Route path="/login" component={Login} />
              <Redirect to="/login" />
            </Switch>
          </Router>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>*/
);

export default App;
