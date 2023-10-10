import { IonButton, IonCard, IonContent, IonImg, IonInput, IonPage, IonIcon } from '@ionic/react';
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
      <IonContent color={'dark'} scrollY={false} fullscreen={true}>

        <div>
          {isDesktop ?
            <><div className='contact'>
              <IonButton className="contact-button" fill="clear" color='light' id="trigger-button">
                Contact Us
                <IonIcon slot="end" color="light" icon={mailOutline}></IonIcon>
              </IonButton>
            </div><div className='logo-with-name-container'>
                <IonImg className='logo-size' src="/src/imgs/logo.png" alt='logo'></IonImg>
                <div className='lcsinhs-title'>Lipa City Science Integrated National High School Portal</div>
              </div><div className='login-card-position'>
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
                        <IonButton fill="clear" color="light">Forgot Password?</IonButton>

                      </div>
                      <IonButton
                        className='submit'
                        fill='solid'
                        color="light"
                        onClick={login}
                      >Submit
                      </IonButton>
                    </div>
                  </div>
                </IonCard>
              </div></>
            :
            <><div className='m-contact'>
              <IonButton className="contact-button" fill="clear" color='light' id="trigger-button">
                <IonIcon color="light" icon={mailOutline}></IonIcon>
              </IonButton>
            </div>

              <div className='mobile-logo-with-name-container'>
                <IonImg className='m-logo-size' src="/src/imgs/logo.png" alt='logo'></IonImg>

                <div className='m-lcsinhs-title'>
                  Lipa City Science Integrated National High School Portal
                </div>

              </div>

              <div className='m-login-card-position'>
                <IonCard className='m-login-card'>

                  <div className='m-login-form-container'>
                    <div className='spacer-h-s' />
                    <p className='m-login-text'>Log In</p>
                    <div className='spacer-h-s' />
                    <div>
                      <IonInput fill="outline"
                        label="Username"
                        labelPlacement="floating"
                        size={35}
                        name="username"
                        value={loginData.username}
                        onInput={(e) => handleInputChange(e)}
                      ></IonInput>

                      <IonInput
                        fill="outline"
                        label="Password"
                        labelPlacement="floating"
                        type="password"
                        name="password"
                        value={loginData.password}
                        onInput={(e) => handleInputChange(e)}
                      ></IonInput>

                      <div className='m-forgot'>
                        <IonButton className="m-forgot-text-size"
                          fill="clear"
                          color="light"
                          size='small'>Forgot Password?
                        </IonButton>
                      </div>

                      <IonButton
                        className='m-submit'
                        fill='solid'
                        color="light"
                        onClick={login}
                        size='small'
                      >Submit
                      </IonButton>
                    </div>

                  </div>

                </IonCard>

              </div></>

          }

        </div>
      </IonContent>
    </IonPage >
  );
};

export default Login;
