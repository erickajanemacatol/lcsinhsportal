import { IonAvatar, IonButton, IonCard, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonPage, IonToolbar, useIonToast } from "@ionic/react";
import { useMediaQuery } from "react-responsive";
import { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import { logOut } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "./QR.css";
import axios from "axios";

interface QRModel {
  student_lrn: string;
  f_name: string;
  l_name: string;
}

const QRAttendance_Timein = () => {
  const isDesktop = useMediaQuery({ minWidth: 1050 });
  const [presentToast] = useIonToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<QRModel | null>(null);
  const [scanningDisabled, setScanningDisabled] = useState(false);
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const history = useHistory();
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [attendanceType, setAttendanceType] = useState('time_in');
  const initialProfilePicturePath = localStorage.getItem('profilePicturePath');
  const [hasUploadedPicture, setHasUploadedPicture] = useState(false);
  const [profilePicturePath, setProfilePicturePath] = useState(
      initialProfilePicturePath || 'https://ionicframework.com/docs/img/demos/avatar.svg'
  );

  let canScan = true;
  let countdown = 0;
  let scanningInProgress = false;
  let attendanceLogged = false;
  let scanningTimeout: NodeJS.Timeout | null = null;
  let scanningEnabledLogged = false;

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

  const showToast = (message: string, color: string) => {
    presentToast({
      message: message,
      duration: 2000,
      color: color,
    });
  };

  const resetScanningStatus = () => {
    setScanningDisabled(false);
    setScanningEnabled(true);
    setScannedData(null);
    setStudentInfo(null);
  };

  useEffect(() => {
    if (isDesktop) {
      const constraints = {
        video: { facingMode: "environment" },
      };

      async function startScan() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);

          mediaStreamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
        }
      }

      startScan();
      scanQRCode();
    }
  }, [isDesktop]);

  const logAttendance = (studentLRN: string, attendanceType: string) => {
    const attendanceData = {
      attendance_date: new Date().toISOString().split("T")[0],
      attendance_time: new Date().toLocaleTimeString(),
      student_lrn: studentLRN,
      attendance_type: attendanceType,
    };

    console.log(attendanceData);

    axios.post('https://studentportal.lcsinhs.com/scripts/qr-attendance.php', new URLSearchParams(attendanceData).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        if (response.data && response.data.success) {
          showToast("Attendance Recorded.", "success");
          console.log("Attendance logged successfully");
          attendanceLogged = true;

          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          console.error("Failed to log attendance. Invalid server response:", response.data.error);
          showToast(response.data.error, "danger");
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      })
      .catch((error) => {
        // Handle fetch error
        console.error("Error:", error);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      });
  };

  const fetchStudentData = async (studentLRN: string) => {
    console.log(studentLRN);
  
    try {
      // Fetch student details
      const response = await fetch(
        `https://studentportal.lcsinhs.com/scripts/qr-attendance-for-screen-fetch.php?student_lrn=${studentLRN}`
      );
  
      if (response.ok) {
        const studentDetails = await response.json();
  
        if (studentDetails.success) {
          // Fetch profile data
          axios
            .post('https://studentportal.lcsinhs.com/scripts/profile.php', { username: studentLRN })
            .then((profileResponse) => {
              console.log(profileResponse.data);
              if (profileResponse.data.profile_pic) {
                const profilePicturePath = `https://studentportal.lcsinhs.com/scripts/fetch_profile_pic.php?file=${profileResponse.data.profile_pic}`;
                setProfilePicturePath(profilePicturePath);
                setHasUploadedPicture(true);
              } else {
                setHasUploadedPicture(false);
              }
            })
            .catch((profileError) => {
              console.error('Error fetching profile data:', profileError);
            });
  
          // Set student information
          setScannedData(studentLRN);
          setStudentInfo(studentDetails.student);
          setScanningDisabled(true);
          logAttendance(studentLRN, attendanceType);
  
          // Reset data after 5 seconds
          setTimeout(() => {
            setScannedData(null);
            setStudentInfo(null);
            setScanningDisabled(false);
          }, 5000);
        } else {
          console.error('Student not found');
          showToast('Student not found', 'danger');
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      } else {
        console.error('Failed to fetch student details');
        showToast('Error fetching student details', 'danger');
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.error('Error fetching student details', error);
      showToast('Error fetching student details', 'danger');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  };  

  const scanQRCode = () => {
    if (!canScan) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          console.log(code);
          if (!scanningInProgress) {
            scanningInProgress = true;
            setScanningEnabled(false);
            setScanningDisabled(true);
            fetchStudentData(code.data);
          }
        }
      }
    }

    if (!canScan) {
      countdown++;
      scanningEnabledLogged = false;
    } else {
      countdown = 0;
      if (!scanningEnabledLogged) {
        console.log("Scanning is enabled");
        scanningEnabledLogged = true;
      }
    }

    if (!scanningInProgress) {
      requestAnimationFrame(scanQRCode);
    } else {
      if (scanningTimeout) {
        clearTimeout(scanningTimeout);
      }
      scanningTimeout = setTimeout(() => {
        scanningInProgress = false;
        resetScanningStatus();
      }, 5000);
    }
  };

  const handleLogout = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    localStorage.removeItem('username');
    history.push('/login');
    console.log('Logged out');
  };

  return (
    <IonPage>
      {isDesktop ? (
        <IonContent>
          <IonHeader >
            <IonToolbar color="dark">
              <div className="center">
              </div>

              <div className="attend-header">
                <IonImg src="/src/imgs/footer-logo.png" className="qr-logo"></IonImg>


                <IonLabel className="time-props">{currentDateTime}</IonLabel>

                <IonButton
                  color={"tertiary"}
                  onClick={() => {
                    history.push('/qr-attendance-timeout')
                  }}
                > Switch to Time Out
                </IonButton>
                <IonButton fill="clear" color={'light'} onClick={handleLogout}>
                  <IonIcon slot="icon-only" icon={logOut} />
                </IonButton>
              </div>

              <div className="center">
              </div>
            </IonToolbar>
          </IonHeader>

          <div className="spacer-h-xl" />
          <div className="attend-body">
            {/*CAMERA*/}
            <div>
              <div className="spacer-h-m" />
              <div className="center">
                <h1>Attendance QR Scanner  Time In</h1>
              </div>

              <div className="spacer-h-s" />
              <div className="video-position">
                <video className="video" ref={videoRef} autoPlay playsInline muted></video>
                <canvas ref={canvasRef} className="input-disp"></canvas>
              </div>
            </div>

            {/*STUDENT INFO*/}
            <div>
              <div className="spacer-h-m" />
              <IonCard className="attend-card">
                <div className="student-info">
                  <h2>Student Information:</h2>
                </div>

                <div className="student-info">
                  {studentInfo && (
                    <div>
                      <div className="spacer-h-l" />
                      {hasUploadedPicture ? (
                        <div className="center">
                          <IonAvatar className="attend-avatar">
                            <IonImg alt="Student Avatar" src={profilePicturePath} />
                          </IonAvatar>
                        </div>
                      ) : (
                        <div className="center">
                          <IonAvatar className="attend-avatar">
                            <IonImg alt="Student Avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                          </IonAvatar>
                        </div>
                      )}
                      <div className="spacer-h-s" />
                      <h2>LRN: {scannedData}</h2>
                      <h2>Name: {studentInfo.f_name} {studentInfo.l_name}</h2>
                      {/*<h2>Grade: {studentInfo.grade_level} {studentInfo.section}</h2>*/}
                    </div>
                  )}
                </div>
              </IonCard>
            </div>
          </div>
        </IonContent>
      ) : (
        <IonContent>
          {/* MOBILE VIEW */}
          <div className="spacer-h-m" />
          <div className="center">
            <div className="spacer-h-s" />
            <IonLabel>Attendance QR Scanner not available in mobile view. Click here to redirect back to <a onClick={handleLogout}><u>login page.</u></a></IonLabel>
          </div>
        </IonContent>
      )}
    </IonPage>
  );
};

export { QRAttendance_Timein };
