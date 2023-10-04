import { IonButton, IonCard, IonContent, IonImg, IonInput, IonPage, IonIcon} from '@ionic/react';
import './Login.css';
import { mailOutline } from 'ionicons/icons';

const Login: React.FC = () => {

  return (
    <IonPage>
      <IonContent color={'dark'} scrollY={false} fullscreen={true}>

        <div className='contact'>
          <IonButton className="contact-button" fill="clear" color='light' id="trigger-button">
            Contact Us
            <IonIcon slot="end" color="light" icon={mailOutline}></IonIcon>
          </IonButton>
        </div>

        <div className='logo-with-name-container'>
          <IonImg className='logo-size' src="/src/imgs/logo.png" alt='logo'></IonImg>
          <div className='lcsinhs-title'>Lipa City Science Integrated National High School Portal</div>
        </div>

        <div className='login-card-position'>
          <IonCard className='login-card'>

            <div className='login-form-container'>
              <p className='login-text'>Log In</p>
              <div>
                <IonInput fill="outline"
                  label="Username"
                  labelPlacement="floating"
                  size={50}
                ></IonInput>
                <br></br>

                <IonInput
                  fill="outline"
                  label="Password"
                  labelPlacement="floating"
                  type="password"
                ></IonInput>

                <div className='forgot'>
                  <IonButton fill="clear" color="light">Forgot Password?</IonButton>
                </div>
                <IonButton className='submit' fill='solid' color="light" href="/home">Submit</IonButton>
              </div>

            </div>

          </IonCard>

        </div>

      </IonContent>

    </IonPage>
  );
};

export default Login;
