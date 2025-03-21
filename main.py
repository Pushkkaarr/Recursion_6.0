import cv2
import mediapipe as mp
from flask import Flask, Response
import threading
import numpy as np
from datetime import datetime
import time
from flask_socketio import SocketIO

app = Flask(__name__)

# Initialize video capture
cap = cv2.VideoCapture(0)
cap.set(3, 740)  # Width
cap.set(4, 480)  # Height
cap.set(5, 30)

# Mediapipe Pose and Drawing
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()

# Thread safety
lock = threading.Lock()
global_frame = None

# Alert status flags
looking_away_detected = False
multiple_people_detected = False

# Store detection history
detection_history = []

def capture_frames():
    """Background thread to continuously capture frames from the camera."""
    global global_frame
    while True:
        success, frame = cap.read()
        if success:
            with lock:
                global_frame = frame.copy()

thread = threading.Thread(target=capture_frames, daemon=True)
thread.start()

socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

def perform_activity_detection(frame):
    """Detect activities and return processed frame and activity data"""
    global multiple_people_detected, looking_away_detected
    
    activity = "Initializing..."
    head_pose = "Unknown"
    people_count = 0
    
    activity_frame = frame.copy()
    
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(max_num_faces=5, min_detection_confidence=0.5, min_tracking_confidence=0.5)
    
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    with mp_pose.Pose(model_complexity=0, min_detection_confidence=0.5, min_tracking_confidence=0.5, smooth_landmarks=True) as pose_detector:
        pose_results = pose_detector.process(rgb_frame)
        
        if pose_results.pose_landmarks:
            people_count = 1
            mp_drawing.draw_landmarks(activity_frame, pose_results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                     landmark_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                                     connection_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2))
            landmarks = pose_results.pose_landmarks.landmark
            try:
                left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
                right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
                left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
                right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
                left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]
                right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
                left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
                right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
                
                hip_avg_y = (left_hip.y + right_hip.y) / 2
                knee_avg_y = (left_knee.y + right_knee.y) / 2
                ankle_avg_y = (left_ankle.y + right_ankle.y) / 2
                shoulder_avg_y = (left_shoulder.y + right_shoulder.y) / 2
                
                body_vertical = hip_avg_y - shoulder_avg_y
                sitting_score = (hip_avg_y - knee_avg_y)
                knee_bend = knee_avg_y - ankle_avg_y
                
                if sitting_score > 0.05:
                    activity = "Sitting"
                elif knee_bend > 0.15:
                    activity = "Crouching"
                else:
                    activity = "Standing"
            except Exception as e:
                activity = "Standing"
                print(f"Error in pose analysis: {e}")
    
    face_results = face_mesh.process(rgb_frame)
    if face_results.multi_face_landmarks:
        face_count = len(face_results.multi_face_landmarks)
        people_count = max(people_count, face_count)
        for face_landmarks in face_results.multi_face_landmarks:
            nose = face_landmarks.landmark[1]
            left_eye = face_landmarks.landmark[33]
            right_eye = face_landmarks.landmark[263]
            eye_width = abs(left_eye.x - right_eye.x)
            nose_position = (nose.x - min(left_eye.x, right_eye.x)) / eye_width
            if nose_position < 0.35 or nose_position > 0.65:
                head_pose = "Looking Away"
                looking_away_detected = True
            else:
                head_pose = "Looking Forward"
                looking_away_detected = False
    else:
        head_pose = "No Face Detected"
        looking_away_detected = True
    
    multiple_people_detected = (people_count > 1)
    
    if multiple_people_detected:
        cv2.putText(activity_frame, "ALERT: Multiple People Detected", (10, 110),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    if looking_away_detected:
        cv2.putText(activity_frame, "ALERT: Looking Away Detected", (10, 140),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    
    cv2.putText(activity_frame, f"Activity: {activity}", (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    cv2.putText(activity_frame, f"Head Pose: {head_pose}", (10, 70),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    cv2.putText(activity_frame, "Activity Detection Active", (10, activity_frame.shape[0] - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    return activity_frame, {'activity': activity, 'head_pose': head_pose, 'people_count': people_count}

def generate_activity_frames():
    """Generate frames with activity detection."""
    global global_frame, multiple_people_detected, looking_away_detected
    
    last_alert_time = time.time() - 10
    
    while True:
        with lock:
            if global_frame is None:
                continue
            frame = global_frame.copy()
        
        activity_frame, activity_data = perform_activity_detection(frame)
        
        current_time = time.time()
        if (multiple_people_detected or looking_away_detected) and (current_time - last_alert_time) > 5.0:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            if multiple_people_detected:
                socketio.emit('activity_detection', {
                    'id': f"multiple_people_{timestamp}",
                    'activity': "Multiple People Detected",
                    'timestamp': timestamp,
                    'type': 'ALERT'
                })
                detection_history.append({
                    'timestamp': timestamp,
                    'activity_type': 'Multiple People',
                    'confidence': 0.85,
                    'alert_type': 'ALERT'
                })
            if looking_away_detected:
                socketio.emit('activity_detection', {
                    'id': f"looking_away_{timestamp}",
                    'activity': "Looking Away Detected",
                    'timestamp': timestamp,
                    'type': 'ALERT'
                })
                detection_history.append({
                    'timestamp': timestamp,
                    'activity_type': 'Looking Away',
                    'confidence': 0.85,
                    'alert_type': 'ALERT'
                })
            last_alert_time = current_time
        
        _, buffer = cv2.imencode('.jpg', activity_frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/alert_status')
def get_alert_status():
    """Return current alert status for activity detection"""
    return {
        'multiple_people_detected': multiple_people_detected,
        'looking_away_detected': looking_away_detected,
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

@app.route('/activity_feed')
def activity_feed():
    """Route for activity detection feed."""
    return Response(generate_activity_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detection_history')
def get_detection_history():
    """Get the detection history"""
    return {'detections': detection_history}

@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

@app.route('/')
def index():
    """Serve a simple HTML page with activity feed"""
    return """
    <html>
        <head>
            <title>Activity Monitoring System</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
                .feed { margin: 20px auto; max-width: 800px; }
                img { max-width: 100%; margin: 10px 0; }
                .status { color: green; font-weight: bold; margin: 10px 0; }
                .alert { color: red; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Activity Monitoring System</h1>
            <div class="status">System Active</div>
            <div class="feed">
                <h2>Activity Detection</h2>
                <p>Monitors student activity and orientation</p>
                <img src="/activity_feed" />
            </div>
        </body>
    </html>
    """

if __name__ == "__main__":
    try:
        print("Starting Activity Monitoring System...")
        print("Access the system at http://localhost:5000")
        socketio.run(app, host="0.0.0.0", port=5000, debug=False, allow_unsafe_werkzeug=True)
    finally:
        cap.release()