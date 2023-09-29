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
import Home from './components/Home';
import { Activities } from './pages/Home/Activities/Activities';
import { Attendance } from './pages/Home/Attendance/Attendance';
import { Grades } from './pages/Home/Grades/Grades';
import  Homepage from './pages/Home/Home/Homepage';


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

        <Route path="/login" component={Login} exact/>
        <Route path="/home" exact={true} component={Home}/>
        
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
