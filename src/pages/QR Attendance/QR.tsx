import { IonContent, IonPage, useIonToast } from "@ionic/react";
import { useMediaQuery } from "react-responsive";
import { useRef, useEffect, useState } from "react";
import "./QR.css";
import jsQR from "jsqr";

interface QRModel {
  student_lrn: string;
  f_name: string;
  l_name: string;
}

const QRAttendance = () => {
  const isDesktop = useMediaQuery({ minWidth: 1050 });
  const [presentToast] = useIonToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<QRModel | null>(null);
  const [scanningDisabled, setScanningDisabled] = useState(false);
  const [scanningEnabled, setScanningEnabled] = useState(true);

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
    const constraints = {
      video: { facingMode: "environment" },
    };

    async function startScan() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }

    startScan();
    scanQRCode();
  }, []);

  let canScan = true;
  let countdown = 0;
  let scanningInProgress = false;
  let attendanceLogged = false;
  let scanningTimeout: NodeJS.Timeout | null = null;
  let scanningEnabledLogged = false;


  const logAttendance = (studentLRN: string) => {
    const attendanceData = {
      attendance_date: new Date().toISOString().split("T")[0],
      attendance_time: new Date().toLocaleTimeString(),
      student_lrn: studentLRN,
    };

    console.log(attendanceData);

    fetch("https://studentportal.lcsinhs.com/scripts/qr-attendance.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(attendanceData).toString(),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          showToast("Attendance Recorded.", "success");
          console.log("Attendance logged successfully");
          attendanceLogged = true;

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          console.error("Failed to log attendance");
          showToast("Failed to log. Student attendance already recorded.", "danger");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      })
      .catch((error) => {
        console.error("Error logging attendance", error);
        showToast("Error logging attendance", "danger");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  };

  const fetchStudentData = async (studentLRN: string) => {
    console.log(studentLRN);
    try {
      const response = await fetch(
        `https://studentportal.lcsinhs.com/scripts/qr-attendance-for-screen-fetch.php?student_lrn=${studentLRN}`
      );
      console.log("Response:", response);

      if (response.ok) {
        const studentDetails = await response.json();
        console.log("Student Details:", studentDetails);
        if (studentDetails.success) {
          setScannedData(studentLRN);
          setStudentInfo(studentDetails.student);
          setScanningDisabled(true);
          logAttendance(studentLRN);
          setTimeout(() => {
            setScannedData(null);
            setStudentInfo(null);
            setScanningDisabled(false);
          }, 5000);
        } else {
          console.error("Student not found");
          showToast("Student not found", "danger");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        console.error("Failed to fetch student details");
        showToast("Error fetching student details", "danger");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching student details", error);
      showToast("Error fetching student details", "danger");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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

  return (
    <IonPage>
      {isDesktop ? (
        <IonContent>
          <div className="center">
            <h1>LCSINHS Attendance QR</h1>
          </div>

          <div className="spacer-h-s" />
          <div className="video-position">
            <video className="video" ref={videoRef} autoPlay playsInline muted></video>
            <canvas ref={canvasRef} className="input-disp"></canvas>
          </div>

          <div className="student-info">
            <h2>Student Information:</h2>
          </div>

          <div className="student-info">
            <h2>{scannedData}</h2>
          </div>

          <div className="student-info">
            {studentInfo && (
              <div>
                <h1>Name: {studentInfo.f_name} {studentInfo.l_name}</h1>
              </div>
            )}
          </div>
        </IonContent>
      ) : (
        <IonContent>
          {/* MOBILE VIEW */}
        </IonContent>
      )}
    </IonPage>
  );
};

export { QRAttendance };
