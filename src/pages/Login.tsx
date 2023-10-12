import { IonButton, IonCard, IonContent, IonImg, IonInput, IonPage, IonIcon, IonLabel, IonHeader, IonFooter, IonToolbar } from '@ionic/react';
import './Login.css';
import { mailOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive'


const Login: React.FC = () => {
  
  const [loginData, setLoginData] = useState({
    username: null,
    password: null
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    console.log(name, value);
    setLoginData({
      ...loginData,
      [name]: value
    })

  }

  const login = () => {
    console.log(loginData, 'loginData')
  }

  const isDesktop = useMediaQuery({ minWidth: 992 })

  return (
    <IonPage>

      {isDesktop ?
        <>
          <IonContent scrollY={false} fullscreen={true}>
            <div className='contact'>
              <IonButton className="contact-button" fill="clear" color='medium' id="trigger-button">
                Contact Us
                <IonIcon slot="end" color="medium" icon={mailOutline}></IonIcon>
              </IonButton>
            </div>

            <div className='logo-with-name-container'>
              <IonImg className='logo-size' src="/src/imgs/logo.png" alt='logo'></IonImg>
              <div className='spacer-h-xxs' />
              <div className='lcsinhs-title'>Lipa City Science Integrated National High School Portal</div>
              <div className='spacer-h-s' />
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
                      name="username"
                      value={loginData.username}
                      onInput={(e) => handleInputChange(e)}
                    ></IonInput>
                    <br></br>

                    <IonInput
                      fill="outline"
                      label="Password"
                      labelPlacement="floating"
                      type="password"
                      name="password"
                      value={loginData.password}
                      onInput={(e) => handleInputChange(e)}
                    ></IonInput>

                    <div className='forgot'>
                      <IonButton
                        fill="clear"
                        color={'medium'}>Forgot Password?
                      </IonButton>
                    </div>

                    <div className='spacer-h-xs' />
                    <IonButton
                      className='submit'
                      fill='solid'
                      color="dark"
                      onClick={login}
                    >Submit
                    </IonButton>
                  </div>
                </div>

              </IonCard>

            </div>
          </IonContent>
        </>
        :
        <>
          <IonContent scrollY={false} fullscreen={true}>

            <div className='spacer-h-m'></div>
            <div className='mobile-logo-with-name-container'>
              <IonImg className='m-logo-size' src="/src/imgs/logo.png" alt='logo'></IonImg>

              <div className='spacer-h-m' />
              <div className='m-lcsinhs-title'>
                Lipa City Science Integrated National High School Portal
              </div>
            </div>
            <div className='spacer-h-m' />

            <div className='m-login-card-position'>
              <IonCard className='m-login-card'>
                <div className='spacer-h-m' />

                <IonLabel className='m-login-text'>Log In</IonLabel>


                <div className='m-login-form-container'>
                  <div>
                    <div className='spacer-h-xs' />
                    <IonInput fill="outline"
                      label="Username"
                      labelPlacement="floating"
                      size={35}
                      name="username"
                      value={loginData.username}
                      onInput={(e) => handleInputChange(e)}
                    ></IonInput>

                    <div className='spacer-h-xs' />
                    <IonInput
                      fill="outline"
                      label="Password"
                      labelPlacement="floating"
                      type="password"
                      name="password"
                      value={loginData.password}
                      onInput={(e) => handleInputChange(e)}
                    ></IonInput>

                    <div className='spacer-h-xs' />
                    <div className='m-forgot'>
                      <IonButton className="m-forgot-text-size"
                        fill="clear"
                        color="medium"
                        size='small'>
                      </IonButton>
                      Forgot Password?
                    </div>

                    <div className='spacer-h-s' />
                    <IonButton
                      className='m-submit'
                      fill='solid'
                      color="dark"
                      onClick={login}
                    >Submit
                    </IonButton>

                    <div className='spacer-h-xxs' />

                  </div>
                </div>
              </IonCard>
            </div>

          </IonContent>
          <IonFooter className='ion-no-border'>
            <IonToolbar >
              <div className='m-contact'>
                <IonButton className="m-contact-button" fill="clear" color='medium' id="trigger-button">
                  Contact Us
                </IonButton>
              </div>
            </IonToolbar>

          </IonFooter>
        </>
      }


    </IonPage >
  );
};

export default Login;
