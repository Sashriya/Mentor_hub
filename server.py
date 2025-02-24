from flask import Flask, request, jsonify # type: ignore
from flask_bcrypt import Bcrypt # type: ignore
from flask_jwt_extended import create_access_token, jwt_required, JWTManager # type: ignore
from flask_socketio import SocketIO, send # type: ignore
import pymysql # type: ignore

app = Flask(__name__)
bcrypt = Bcrypt(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Secret key for JWT authentication
app.config["JWT_SECRET_KEY"] = "supersecretkey"
jwt = JWTManager(app)

# MySQL Database Connection
db = pymysql.connect(
    host="localhost",
    user="root",  # Change to your MySQL username
    password="Mentor_hub2025",  # Change to your MySQL password
    database="mentor_hub",
    cursorclass=pymysql.cursors.DictCursor
)
cursor = db.cursor()

# ---------------------- User Registration ----------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data['name']
    email = data['email']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    role = data['role']

    query = "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (name, email, password, role))
    db.commit()

    return jsonify({"message": "User registered successfully"}), 201

# ---------------------- User Login ----------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity={"id": user['id'], "role": user['role']})
        return jsonify({"token": access_token, "role": user['role']})
    else:
        return jsonify({"message": "Invalid email or password"}), 401

# ---------------------- Admin View Users ----------------------
@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    cursor.execute("SELECT id, name, email, role FROM users")
    users = cursor.fetchall()
    return jsonify(users)

# ---------------------- Admin Assign Task to Tutors ----------------------
@app.route('/assign-task', methods=['POST'])
@jwt_required()
def assign_task():
    data = request.json
    tutor_id = data['tutor_id']
    task = data['task']
    lesson = data['lesson']

    query = "INSERT INTO tasks (tutor_id, task, lesson) VALUES (%s, %s, %s)"
    cursor.execute(query, (tutor_id, task, lesson))
    db.commit()

    return jsonify({"message": "Task assigned successfully"}), 201

# ---------------------- Chat between Admin & Tutors ----------------------
@socketio.on('message')
def handle_message(msg):
    print("Message Received:", msg)
    send(msg, broadcast=True)

# ---------------------- Chatbot for Students ----------------------
@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    question = data['question'].lower()

    responses = {
        "what subjects are available?": "We offer Maths, Science, English, and EVS.",
        "how can i register?": "You can register on our website using the signup form.",
        "who can become a tutor?": "Anyone with a relevant qualification can apply to be a tutor."
    }

    response = responses.get(question, "I'm sorry, I don't understand that. Please contact the admin for help.")
    return jsonify({"response": response})

if __name__ == "__main__":
    socketio.run(app, debug=True)
