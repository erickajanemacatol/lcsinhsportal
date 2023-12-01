import {
  IonButton, IonCard, IonContent,
  IonImg, IonInput, IonPage, IonIcon, IonLabel,
  IonFooter, IonToolbar, useIonToast, IonButtons,
  IonHeader, IonModal, IonTitle, IonCardContent,
  IonCol, IonRow, IonCheckbox
} from '@ionic/react';
import './Login.css';
import { close, home, mailOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import BackgroundLogin from './Login-BG';
import ReCAPTCHA from "react-google-recaptcha";
import CustomLoading from '../components/utils/Loading';

const Login: React.FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 992 })
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [data, setData] = useState<any>(null);
  const history = useHistory();
  const [presentToast, dismissToast] = useIonToast();
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    })
  }

  const handleTogglePassword = (checked: boolean) => {
    setShowPassword(checked);
  };

  const showToast = (message: string, color: string) => {
    presentToast({
      message: message,
      duration: 2000,
      color: color,
    });
  };

  const clearInputFields = () => {
    setLoginData({
      username: '',
      password: '',
    });
  };

  const login = () => {
    if (!navigator.onLine) {
      showToast('No internet connection. Please check your network.', 'danger');
    } else if (loginData.username === '' || loginData.password === '') {
      showToast('Username and password cannot be empty', 'danger');
    } else if (!isCaptchaVerified) {
      showToast('Please complete the reCAPTCHA verification.', 'danger');
    } else {
      setIsLoading(true);

      const postLoginData = {
        ...loginData,
        'g-recaptcha-response': recaptchaToken || '',
      }

      axios
        .post('https://studentportal.lcsinhs.com/scripts/login.php', JSON.stringify(postLoginData), {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        .then(async (response) => {
          setIsLoading(true);
          console.log('Complete Server Response:', response); // Log the complete response
          const data = response.data;
          console.log('Data:', data);

          // Check if data.success is true
          if (data && data.success) {
            // Log the entire data object
            console.log('Complete Data:', data);

            // Check if data.role_id is defined
            if (data.role_id !== undefined) {
              console.log('Role ID in Response:', data.role_id);

              localStorage.setItem('username', loginData.username);
              localStorage.setItem('role', data.role_id);
              console.log('Role ID in Local Storage:', localStorage.getItem('role'));

              setIsLoggedIn(true);

              showToast('Login successful. Welcome to LCSINHS Portal!', 'dark');
              switch (data.role_id) {
                case 0:
                  history.replace('/home');
                  break;
                case 1:
                  history.replace('/admin/news');
                  break;
                case 2:
                  history.replace('/faculty/attendance');
                  break;
                case 3:
                  history.replace('/qr-attendance-timein');
                  break;
                default:
                  console.log('Unexpected role:', data.role_id);
              }
            } else {
              console.error('Role ID is undefined in the response');
              showToast('Role ID is undefined in the response', 'danger');
            }
          } else {
            console.error('Login failed:', data.error);
            showToast('Login failed. Check your credentials.', 'danger');
            clearInputFields();
          }
        })


        .catch((error) => {
          console.error('API Call Error:', error);
          setIsLoading(false);
          showToast('API Call Error. Please try again.', 'danger');
        });
    }
  };

  useEffect(() => {
    axios.get('https://studentportal.lcsinhs.com/scripts/data_sync.php')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      const role = localStorage.getItem('role');
      switch (role) {
        case '0':
          history.replace('/home');
          break;
        case '1':
          history.replace('/admin/news');
          break;
        case '2':
          history.replace('/faculty/attendance');
          break;
        case '3':
          history.replace('/qr-attendance');
          break;
        default:
          history.replace('/default');
      }
    }
  }, [history]);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const onChange = (value: string | null) => {
    setIsCaptchaVerified(!!value);
    setRecaptchaToken(value);
    console.log(value)
  };

  useEffect(() => {
    console.log('Captcha verified:', isCaptchaVerified);
  }, [isCaptchaVerified]);

  return (
    <IonPage ref={page}>
      {isLoading ? (
        <CustomLoading isOpen={true} delay={3000} />
      ) : isDesktop ? (
        <IonContent fullscreen={true} scrollY={false} color={'light'}>
          <BackgroundLogin />
          <div className='contact'>
            <IonButton
              className="contact-button"
              fill="clear"
              color={'white'}
              id="open-modal"
              onClick={() => {
                setShowForgotPass(true);
              }}
            >
              Contact Us
              <IonIcon slot="end" color={'white'} icon={mailOutline}></IonIcon>
            </IonButton>
          </div>

          <div className='center'>
            <IonCard className='login-card-position'>
              <div className='logo-with-name-container'>
                <IonImg className='logo-size' src="/src/imgs/logo.png" alt='logo'></IonImg>
                <div className='spacer-h-xxs' />
                <div className='spacer-h-s' />
              </div>

              <IonRow>
                <IonCol>
                  <div className="divider-line"></div>
                </IonCol>
              </IonRow>

              <div>
                <IonCard className='login-card'>
                  <div className='login-form-container'>
                    <div className='lcsinhs-title'>Welcome to LCSINHS Portal</div>
                    <p className='login-text'>Log In</p>

                    <div>
                      {/*USERNAME FIELD*/}
                      <IonInput fill="outline"
                        label="Username"
                        labelPlacement="floating"
                        size={50}
                        type="text"
                        name="username"
                        value={loginData.username}
                        onInput={(e) => handleInputChange(e)}
                      ></IonInput>

                      <div className='spacer-h-s' />

                      {/* PASSWORD FIELD */}
                      <IonInput
                        fill="outline"
                        label="Password"
                        labelPlacement="floating"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={loginData.password}
                        onInput={handleInputChange}
                        className="password-input"
                      />
                      <div className='spacer-h-xs' />

                      <div className='show-password'>
                        <div className='spacer-w-xs' />
                        <div className='show-check'>
                          <IonCheckbox
                            checked={showPassword}
                            onIonChange={(e) => handleTogglePassword(e.detail.checked)}
                          />
                          <div className='spacer-w-xs' />
                          <IonLabel>Show Password</IonLabel>
                        </div>

                        <div className='spacer-w-xl' />
                        <div className='spacer-w-xl' />
                        <div className='spacer-w-s' />

                        <div className='forgot'>
                          <IonButton
                            id="open-modal"
                            fill="clear"
                            color={'medium'}
                            onClick={() => {
                              setShowForgotPass(true);
                              modal.current?.present();
                            }}
                            size='small'
                          >
                            <IonLabel>Forgot Password?</IonLabel>
                          </IonButton>
                        </div>
                      </div>

                      <div className='spacer-h-xs' />

                      {/* RECAPTCHA */}
                      <ReCAPTCHA
                        sitekey="6LdZyhEpAAAAAHkNn-2ecHZyUfzz3aqRVeaDuQZM"
                        onChange={onChange}
                      />

                      {/* SUBMIT BUTTON */}
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

            </IonCard>
          </div>

        </IonContent>

      ) : (
        <IonContent scrollY={false} fullscreen={true}>

          <div className='spacer-h-m'></div>
          <div className='mobile-logo-with-name-container'>
            <IonImg className='m-logo-size' src="/src/imgs/logo.png" alt='logo'></IonImg>

            <div className='spacer-h-m' />
            <div className='m-lcsinhs-title'>
              Welcome to LCSINHS Portal
            </div>
          </div>
          <div className='spacer-h-m' />

          <div className='m-login-card-position'>
            <IonCard className='m-login-card'>
              <div className='spacer-h-s' />

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
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData.password}
                    onInput={handleInputChange}
                    className="password-input"
                  ></IonInput>

                  <div className='spacer-h-s' />

                  <div className='show-password'>
                    <div className='show-check'>
                      <IonCheckbox
                        checked={showPassword}
                        onIonChange={(e) => handleTogglePassword(e.detail.checked)}
                      />
                      <div className='spacer-w-xs' />
                      <IonLabel>Show Password</IonLabel>
                    </div>
                  </div>

                  <div className='spacer-h-xs' />

                  {/* RECAPTCHA */}
                  <ReCAPTCHA
                    sitekey="6LdZyhEpAAAAAHkNn-2ecHZyUfzz3aqRVeaDuQZM"
                    onChange={onChange}
                  />

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

          <IonFooter className='ion-no-border'>
            <IonToolbar >
              <div className='m-contact'>
                <IonButton
                  id="open-modal"
                  className="m-contact-button"
                  fill="clear" color='medium'
                  onClick={() => {
                    setShowForgotPass(true);
                    modal.current?.present();
                  }}
                >
                  Forgot Password? Contact Us
                </IonButton>
              </div>
            </IonToolbar>
          </IonFooter>
        </IonContent>
      )
      }

      {/*HELP CENTER*/}
      <IonModal className="modal-design " ref={modal} trigger="open-modal" canDismiss={canDismiss} presentingElement={presentingElement!}>
        <IonHeader>
          <IonToolbar>
            <IonTitle class='header-title'>Help Center</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => dismiss()}><IonIcon icon={close} /></IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>
            For any portal login concerns, contact us through the following email addresses:
          </p>

          <IonCard className='card-email'>
            <IonCardContent>
              <IonLabel className='email-1'>
                <IonIcon icon={home} /> Official Email Address
              </IonLabel>
              <br></br>
              <div className='spacer-h-xxs' />
              <IonLabel className='email-2'>
                <IonIcon icon={mailOutline} /> lipacityscienceinhs@gmail.com
              </IonLabel>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonModal>
    </IonPage >
  );
};

export default Login;
