import { IonContent, IonPage, useIonToast } from "@ionic/react";
import { useMediaQuery } from "react-responsive";
import { useRef, useEffect, useState } from 'react';
import './QR.css';
import jsQR from 'jsqr';

const QRAttendance = () => {
    const isDesktop = useMediaQuery({ minWidth: 1050 });
    const [presentToast] = useIonToast();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [scannedData, setScannedData] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [scanningDisabled, setScanningDisabled] = useState(false);
    const [scanningEnabled, setScanningEnabled] = useState(true);

    const showToast = (message, color) => {
        presentToast({
            message: message,
            duration: 2000,
            color: color,
        });
    };

    useEffect(() => {
        const constraints = {
            video: { facingMode: 'environment' }, // Use the rear camera
        };

        async function startScan() {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            videoRef.current.srcObject = stream;
        }

        startScan();
        scanQRCode();
    }, []);

    let canScan = true;
    let countdown = 0;
    let scanningInProgress = false;
    let attendanceLogged = false;
    let scanningTimeout;
    let scanningEnabledLogged = false;

    const scanQRCode = () => {
        if (!canScan) {
            // Scanning is disabled, so don't continue scanning
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                console.log(code);
                if (!scanningInProgress) {
                    scanningInProgress = true;
                    setScanningEnabled(false);
                    setScanningDisabled(true); // Disable scanning while processing
                    fetchStudentData(code.data);
                }
            }
        }

        if (!canScan) {
            countdown++;
            // Reset the logging status when scanning is disabled.
            scanningEnabledLogged = false;
        } else {
            countdown = 0;
            // Check if the log has not been displayed before logging it.
            if (!scanningEnabledLogged) {
                console.log('Scanning is enabled');
                scanningEnabledLogged = true;
            }
        }

        if (!scanningInProgress) {
            requestAnimationFrame(scanQRCode); // Continue scanning only if not in progress
        } else {
            // Wait for 5 seconds after a successful scan, then re-enable scanning
            scanningTimeout = setTimeout(() => {
                scanningInProgress = false; // Reset scanning status
                setScanningEnabled(true); // Re-enable scanning
                setScanningDisabled(false); // Re-enable scanning
            }, 5000);
        }
    };

    const enableScanning = () => {
        canScan = true;
        setScanningDisabled(false);
        attendanceLogged = false; // Reset the attendance status
        console.log('Scanning is enabled again');
    };

    const logAttendance = (studentLRN) => {
        const attendanceData = {
            attendance_date: new Date().toISOString().split('T')[0],
            attendance_time: new Date().toLocaleTimeString(),
            student_lrn: studentLRN,
        };

        console.log(attendanceData);

        fetch('http://localhost/qr-attendance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(attendanceData).toString(),
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.success) {
                showToast("Attendance Recorded.", "success");
                console.log('Attendance logged successfully');
                attendanceLogged = true;
            } else {
                console.error('Failed to log attendance');
                showToast('Failed to log. Student attendance already recorded.', 'danger');
                enableScanning();
            }
        })
        .catch((error) => {
            console.error('Error logging attendance', error);
            showToast('Error logging attendance', 'danger');
            enableScanning();
        })
        .finally(() => {
            enableScanning();
        });
    };

    const fetchStudentData = async (studentLRN) => {
        console.log(studentLRN);
        try {
            const response = await fetch(`http://localhost/qr-attendance-for-screen-fetch.php?student_lrn=${studentLRN}`);
            console.log('Response:', response);

            if (response.ok) {
                const studentDetails = await response.json();
                console.log('Student Details:', studentDetails);
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
                    console.error('Student not found');
                    showToast('Student not found', 'danger');
                    enableScanning(); // Re-enable scanning after an error
                }
            } else {
                console.error('Failed to fetch student details');
                showToast('Error fetching student details', 'danger');
                enableScanning(); // Re-enable scanning after an error
            }
        } catch (error) {
            console.error('Error fetching student details', error);
            showToast('Error fetching student details', 'danger');
            enableScanning(); // Re-enable scanning after an error
        }
    };

    return (
        <IonPage>
            {isDesktop ? (
                <IonContent>
                    <div className="video-position">
                        <video className="video" ref={videoRef} autoPlay playsInline muted></video>
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                        {scannedData && (
                            <div>
                                <p>Scanned Data:</p>
                                <p>{scannedData}</p>
                            </div>
                        )}

                        {studentInfo && (
                            <div>
                                <p>Student Information:</p>
                                <p>LRN: {studentInfo.student_lrn}</p>
                                <p>Name: {studentInfo.f_name} {studentInfo.l_name}</p>
                                {/* Add more student details here */}
                            </div>
                        )}

                        {scanningDisabled && (
                            <div style={{ backgroundColor: 'rgba(255, 0, 0, 0.5)' }}>
                                <p>Scanning is disabled. Please wait...</p>
                            </div>
                        )}
                    </div>
                </IonContent>
            ) : (
                /* MOBILE VIEW */
                <IonContent>

                </IonContent>
            )}
        </IonPage>
    );
};

export { QRAttendance };
