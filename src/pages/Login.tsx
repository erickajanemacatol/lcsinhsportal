import {
  IonButton, IonCard, IonContent,
  IonImg, IonInput, IonPage, IonIcon, IonLabel,
  IonFooter, IonToolbar, useIonToast, IonButtons, IonHeader, IonModal, IonTitle, IonCardContent
} from '@ionic/react';
import './Login.css';
import { arrowBack, close, home, mailOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
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
  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
  }, []);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    console.log(name, value);
    setLoginData({
      ...loginData,
      [name]: value
    })

  }

  const showToast = (message: string, color: string) => {
    presentToast({
      message: message,
      duration: 2000, // 2 seconds
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
    } else {
      console.log(loginData, 'loginData');

      setIsLoading(true);

      axios
        .post('https://studentportal.lcsinhs.com/scripts/login.php', JSON.stringify(loginData), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {

          setIsLoading(false);
          const data = response.data;

          if (data.success) {

            localStorage.setItem('username', loginData.username);
            localStorage.setItem('role', data.role_id);
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
              default:
                console.log('Unexpected role:', data.role_id);
            }
          } else {
            showToast('Login failed. Check your credentials.', 'danger');
            console.log(response);
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

  return (
    <IonPage ref={page}>
      {isDesktop ?
        <>
          {isLoading ? (
            <CustomLoading isOpen={isLoading} delay={3000} />
          ) : (
            <IonContent scrollY={false} fullscreen={true}>
              <div className='contact'>
                <IonButton
                  className="contact-button"
                  fill="clear" color='medium'
                  id="open-modal"
                  onClick={() => {
                    setShowForgotPass(true);
                  }}
                >
                  Contact Us
                  <IonIcon slot="end" color="medium" icon={mailOutline}></IonIcon>
                </IonButton>
              </div>

              <div className='logo-with-name-container'>
                <IonImg className='logo-size' src="/src/imgs/logo.png" alt='logo'></IonImg>
                <div className='spacer-h-xxs' />
                <div className='lcsinhs-title'>Welcome to LCSINHS Portal</div>
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
                        type="text"
                        name="username"
                        value={loginData.username}
                        onInput={(e) => handleInputChange(e)}
                      ></IonInput>

                      <div className='spacer-h-s' />

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
                          id="open-modal"
                          fill="clear"
                          color={'medium'}
                          onClick={() => {
                            setShowForgotPass(true);
                            modal.current?.present();
                          }}
                        >Forgot Password?
                        </IonButton>
                      </div>

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
          )}
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
                        id="open-modal"
                        fill="clear"
                        color="medium"
                        size='small'
                        onClick={() => {
                          setShowForgotPass(true);
                        }}>Forgot Password?
                      </IonButton>
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
                <IonButton
                  id="open-modal"
                  className="m-contact-button"
                  fill="clear" color='medium'
                  onClick={() => {
                    setShowForgotPass(true);
                    modal.current?.present();
                  }}
                >
                  Contact Us
                </IonButton>
              </div>
            </IonToolbar>
          </IonFooter>

          {/*HELP CENTER*/}
          <IonModal ref={modal} trigger="open-modal" canDismiss={canDismiss} presentingElement={presentingElement!}>
            <IonHeader>
              <IonToolbar>
                <IonTitle class='header-title'>Help Center</IonTitle>
                <IonButtons slot="start">
                  <IonButton onClick={() => dismiss()}><IonIcon icon={arrowBack} /></IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <p>
                For any portal login concerns, contact us through the following email addresses:
              </p>

              <IonCard className='card'>
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
        </>
      }
    </IonPage >
  );
};

export default Login;
