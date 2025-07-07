# requirements.txt additions
# Add these to your requirements.txt:
# flask-sqlalchemy
# psycopg2-binary
# flask-migrate
# werkzeug
# pillow

from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
import pymysql
pymysql.install_as_MySQLdb()
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import hashlib
import secrets
import uuid
from decimal import Decimal
import json

load_dotenv()

app = Flask(__name__)

# CORS configuration
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Session configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_hex(32))
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# File upload configuration
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max file size
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg', 'png'}

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_USERNAME")

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
mail = Mail(app)

# Ensure upload directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'videos'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'documents'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'thumbnails'), exist_ok=True)

# Database Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    enrollments = db.relationship('Enrollment', backref='user', lazy=True, cascade='all, delete-orphan')
    notes = db.relationship('StudentNote', backref='user', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('CourseReview', backref='user', lazy=True, cascade='all, delete-orphan')
    favorites = db.relationship('FavoriteCourse', backref='user', lazy=True, cascade='all, delete-orphan')
    progress = db.relationship('StudentProgress', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'fullName': f"{self.first_name} {self.last_name}",
            'email': self.email,
            'phone': self.phone,
            'isAdmin': self.is_admin,
            'registrationDate': self.registration_date.isoformat() if self.registration_date else None,
            'lastLogin': self.last_login.isoformat() if self.last_login else None
        }

class Course(db.Model):
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    short_description = db.Column(db.String(500))
    price = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    thumbnail_url = db.Column(db.String(500))
    category = db.Column(db.String(100))
    difficulty_level = db.Column(db.String(50))  # Beginner, Intermediate, Advanced
    duration_hours = db.Column(db.Integer)
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    lessons = db.relationship('Lesson', backref='course', lazy=True, cascade='all, delete-orphan', order_by='Lesson.order_index')
    enrollments = db.relationship('Enrollment', backref='course', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('CourseReview', backref='course', lazy=True, cascade='all, delete-orphan')
    favorites = db.relationship('FavoriteCourse', backref='course', lazy=True, cascade='all, delete-orphan')
    
    @property
    def average_rating(self):
        if not self.reviews:
            return 0
        return sum(review.rating for review in self.reviews) / len(self.reviews)
    
    @property
    def total_enrollments(self):
        return len(self.enrollments)
    
    def to_dict(self, include_lessons=False):
        course_dict = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'shortDescription': self.short_description,
            'price': float(self.price) if self.price else 0,
            'thumbnailUrl': self.thumbnail_url,
            'category': self.category,
            'difficultyLevel': self.difficulty_level,
            'durationHours': self.duration_hours,
            'isPublished': self.is_published,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'averageRating': round(self.average_rating, 1),
            'totalEnrollments': self.total_enrollments,
            'totalLessons': len(self.lessons)
        }
        
        if include_lessons:
            course_dict['lessons'] = [lesson.to_dict() for lesson in self.lessons]
        
        return course_dict

class Lesson(db.Model):
    __tablename__ = 'lessons'
    
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    video_url = db.Column(db.String(500))
    duration_minutes = db.Column(db.Integer)
    order_index = db.Column(db.Integer, nullable=False, default=0)
    is_free = db.Column(db.Boolean, default=False)  # Free preview lessons
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    documents = db.relationship('LessonDocument', backref='lesson', lazy=True, cascade='all, delete-orphan')
    notes = db.relationship('StudentNote', backref='lesson', lazy=True, cascade='all, delete-orphan')
    progress = db.relationship('StudentProgress', backref='lesson', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'courseId': self.course_id,
            'title': self.title,
            'description': self.description,
            'videoUrl': self.video_url,
            'durationMinutes': self.duration_minutes,
            'orderIndex': self.order_index,
            'isFree': self.is_free,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'documents': [doc.to_dict() for doc in self.documents]
        }

class LessonDocument(db.Model):
    __tablename__ = 'lesson_documents'
    
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    file_url = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(50))  # pdf, doc, ppt, etc.
    file_size = db.Column(db.Integer)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'lessonId': self.lesson_id,
            'title': self.title,
            'fileUrl': self.file_url,
            'fileType': self.file_type,
            'fileSize': self.file_size,
            'uploadedAt': self.uploaded_at.isoformat() if self.uploaded_at else None
        }

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    progress_percentage = db.Column(db.Float, default=0.0)
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('user_id', 'course_id', name='unique_user_course_enrollment'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'courseId': self.course_id,
            'enrolledAt': self.enrolled_at.isoformat() if self.enrolled_at else None,
            'completedAt': self.completed_at.isoformat() if self.completed_at else None,
            'progressPercentage': self.progress_percentage,
            'course': self.course.to_dict() if self.course else None
        }

class StudentProgress(db.Model):
    __tablename__ = 'student_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime)
    watch_time_seconds = db.Column(db.Integer, default=0)
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('user_id', 'lesson_id', name='unique_user_lesson_progress'),)

class StudentNote(db.Model):
    __tablename__ = 'student_notes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    note_text = db.Column(db.Text, nullable=False)
    timestamp_seconds = db.Column(db.Integer)  # Timestamp in video where note was taken
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'lessonId': self.lesson_id,
            'noteText': self.note_text,
            'timestampSeconds': self.timestamp_seconds,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

class CourseReview(db.Model):
    __tablename__ = 'course_reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('user_id', 'course_id', name='unique_user_course_review'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'courseId': self.course_id,
            'rating': self.rating,
            'comment': self.comment,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'userName': f"{self.user.first_name} {self.user.last_name}" if self.user else None
        }

class FavoriteCourse(db.Model):
    __tablename__ = 'favorite_courses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('user_id', 'course_id', name='unique_user_favorite_course'),)

# Utility functions
def hash_password(password):
    """Hash password with salt"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}${pwd_hash.hex()}"

def verify_password(password, hashed):
    """Verify password against hash"""
    try:
        salt, pwd_hash = hashed.split('$')
        return pwd_hash == hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
    except:
        return False

def get_current_user():
    """Get current user from session"""
    user_id = session.get('user_id')
    if not user_id:
        return None
    
    user = User.query.filter_by(id=user_id, is_active=True).first()
    return user

def admin_required(f):
    """Decorator to require admin access"""
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def login_required(f):
    """Decorator to require authentication"""
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation
    required_fields = ['firstName', 'lastName', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400
    
    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists with this email"}), 400
    
    # Create user
    user = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        phone=data.get('phone'),
        password_hash=hash_password(data['password'])
    )
    
    try:
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            "message": "Registration successful!",
            "user": user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Registration failed"}), 500



 # Student progress

# Helper function to update course progress
def update_course_progress(user_id, course_id):
    """Calculate and update course progress percentage"""
    # Get total lessons in course
    total_lessons = Lesson.query.filter_by(course_id=course_id).count()
    
    if total_lessons == 0:
        return
    
    # Get completed lessons for this user
    completed_lessons = db.session.query(StudentProgress)\
        .join(Lesson, StudentProgress.lesson_id == Lesson.id)\
        .filter(
            StudentProgress.user_id == user_id,
            Lesson.course_id == course_id,
            StudentProgress.completed == True
        ).count()
    
    # Calculate progress percentage
    progress_percentage = (completed_lessons / total_lessons) * 100
    
    # Update enrollment record
    enrollment = Enrollment.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()
    
    if enrollment:
        enrollment.progress_percentage = progress_percentage
        
        # Mark course as completed if 100%
        if progress_percentage >= 100:
            enrollment.completed_at = datetime.utcnow()

@app.route('/api/progress/lesson/<int:lesson_id>/complete', methods=['POST'])
@login_required
def mark_lesson_complete(lesson_id):
    user_id = session.get('user_id')
    data = request.get_json()
    
    # Validate lesson exists
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404
    
    # Check if user is enrolled in the course
    enrollment = Enrollment.query.filter_by(
        user_id=user_id,
        course_id=lesson.course_id
    ).first()
    
    if not enrollment:
        return jsonify({"error": "User not enrolled in this course"}), 403
    
    try:
        # Get or create student progress record
        progress = StudentProgress.query.filter_by(
            user_id=user_id, 
            lesson_id=lesson_id
        ).first()
        
        if not progress:
            progress = StudentProgress(
                user_id=user_id,
                lesson_id=lesson_id
            )
            db.session.add(progress)
        
        # Update progress
        progress.completed = True
        progress.completed_at = datetime.utcnow()
        progress.watch_time_seconds = data.get('watchTime', 0)
        
        # Update course progress percentage
        update_course_progress(user_id, lesson.course_id)
        
        db.session.commit()
        
        # Get updated enrollment data
        updated_enrollment = Enrollment.query.filter_by(
            user_id=user_id,
            course_id=lesson.course_id
        ).first()
        
        return jsonify({
            "message": "Lesson marked as complete",
            "progressPercentage": updated_enrollment.progress_percentage,
            "courseCompleted": updated_enrollment.completed_at is not None
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update progress"}), 500

@app.route('/api/progress/course/<int:course_id>', methods=['GET'])
@login_required
def get_course_progress(course_id):
    user_id = session.get('user_id')
    
    # Check if user is enrolled
    enrollment = Enrollment.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()
    
    if not enrollment:
        return jsonify({"error": "User not enrolled in this course"}), 404
    
    # Get lesson progress details
    lesson_progress = db.session.query(
        Lesson,
        StudentProgress
    ).outerjoin(
        StudentProgress,
        (StudentProgress.lesson_id == Lesson.id) & 
        (StudentProgress.user_id == user_id)
    ).filter(
        Lesson.course_id == course_id
    ).order_by(Lesson.order_index).all()
    
    lessons_data = []
    for lesson, progress in lesson_progress:
        lessons_data.append({
            'lesson': lesson.to_dict(),
            'completed': progress.completed if progress else False,
            'completedAt': progress.completed_at.isoformat() if progress and progress.completed_at else None,
            'watchTime': progress.watch_time_seconds if progress else 0
        })
    
    return jsonify({
        'enrollment': enrollment.to_dict(),
        'lessons': lessons_data,
        'totalLessons': len(lessons_data),
        'completedLessons': sum(1 for l in lessons_data if l['completed'])
    }), 200

@app.route('/api/progress/dashboard', methods=['GET'])
@login_required
def get_dashboard_stats():
    user_id = session.get('user_id')
    
    # Get all enrollments
    enrollments = Enrollment.query.filter_by(user_id=user_id).all()
    
    total_courses = len(enrollments)
    completed_courses = sum(1 for e in enrollments if e.completed_at)
    in_progress_courses = sum(1 for e in enrollments if e.progress_percentage > 0 and not e.completed_at)
    
    # Calculate average progress
    avg_progress = 0
    if enrollments:
        avg_progress = sum(e.progress_percentage for e in enrollments) / len(enrollments)
    
    # Get total watch time
    total_watch_time = db.session.query(
        func.sum(StudentProgress.watch_time_seconds)
    ).filter_by(user_id=user_id).scalar() or 0
    
    return jsonify({
        'totalCourses': total_courses,
        'completedCourses': completed_courses,
        'inProgressCourses': in_progress_courses,
        'averageProgress': round(avg_progress, 1),
        'totalWatchTimeMinutes': total_watch_time // 60,
        'enrollments': [e.to_dict() for e in enrollments]
    }), 200

@app.route('/api/progress/lesson/<int:lesson_id>/watch-time', methods=['POST'])
@login_required
def update_watch_time(lesson_id):
    user_id = session.get('user_id')
    data = request.get_json()
    
    # Validation
    if not data.get('watchTime'):
        return jsonify({"error": "watchTime is required"}), 400
    
    watch_time = data.get('watchTime', 0)
    
    # Validate lesson exists
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404
    
    # Check if user is enrolled in the course
    enrollment = Enrollment.query.filter_by(
        user_id=user_id,
        course_id=lesson.course_id
    ).first()
    
    if not enrollment:
        return jsonify({"error": "User not enrolled in this course"}), 403
    
    try:
        # Get or create progress record
        progress = StudentProgress.query.filter_by(
            user_id=user_id,
            lesson_id=lesson_id
        ).first()
        
        if not progress:
            progress = StudentProgress(
                user_id=user_id,
                lesson_id=lesson_id
            )
            db.session.add(progress)
        
        # Update watch time (only if new time is greater)
        progress.watch_time_seconds = max(progress.watch_time_seconds, watch_time)
        
        # Auto-complete if watched significant portion
        auto_completed = False
        if lesson.duration_minutes:
            watch_percentage = (watch_time / 60) / lesson.duration_minutes
            if watch_percentage >= 0.9 and not progress.completed:  # 90% threshold
                progress.completed = True
                progress.completed_at = datetime.utcnow()
                auto_completed = True
                
                # Update course progress
                update_course_progress(user_id, lesson.course_id)
        
        db.session.commit()
        
        response_data = {
            "message": "Watch time updated",
            "watchTime": progress.watch_time_seconds
        }
        
        if auto_completed:
            # Get updated enrollment data
            updated_enrollment = Enrollment.query.filter_by(
                user_id=user_id,
                course_id=lesson.course_id
            ).first()
            
            response_data.update({
                "autoCompleted": True,
                "progressPercentage": updated_enrollment.progress_percentage,
                "courseCompleted": updated_enrollment.completed_at is not None
            })
        
        return jsonify(response_data), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update watch time"}), 500

@app.route('/api/progress/lesson/<int:lesson_id>/status', methods=['GET'])
@login_required
def get_lesson_status(lesson_id):
    user_id = session.get('user_id')
    
    # Validate lesson exists
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404
    
    # Get progress record
    progress = StudentProgress.query.filter_by(
        user_id=user_id,
        lesson_id=lesson_id
    ).first()
    
    if not progress:
        return jsonify({
            "completed": False,
            "watchTime": 0,
            "completedAt": None
        }), 200
    
    return jsonify({
        "completed": progress.completed,
        "watchTime": progress.watch_time_seconds,
        "completedAt": progress.completed_at.isoformat() if progress.completed_at else None
    }), 200

@app.route('/api/progress/course/<int:course_id>/reset', methods=['POST'])
@login_required
def reset_course_progress(course_id):
    user_id = session.get('user_id')
    
    # Check if user is enrolled
    enrollment = Enrollment.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()
    
    if not enrollment:
        return jsonify({"error": "User not enrolled in this course"}), 404
    
    try:
        # Get all lessons in this course
        lessons = Lesson.query.filter_by(course_id=course_id).all()
        lesson_ids = [lesson.id for lesson in lessons]
        
        # Delete all progress records for this course
        StudentProgress.query.filter(
            StudentProgress.user_id == user_id,
            StudentProgress.lesson_id.in_(lesson_ids)
        ).delete(synchronize_session=False)
        
        # Reset enrollment progress
        enrollment.progress_percentage = 0.0
        enrollment.completed_at = None
        
        db.session.commit()
        
        return jsonify({
            "message": "Course progress reset successfully",
            "progressPercentage": 0.0
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to reset course progress"}), 500
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=email, is_active=True).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Create session
    session['user_id'] = user.id
    session.permanent = data.get('rememberMe', False)
    
    return jsonify({
        "message": "Login successful",
        "user": user.to_dict()
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/auth/profile', methods=['GET'])
@login_required
def get_profile():
    user = get_current_user()
    return jsonify({"user": user.to_dict()}), 200

# Course Management Routes (Student)
@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Get all published courses with filtering and search"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 12, type=int), 50)
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    difficulty = request.args.get('difficulty', '')
    sort_by = request.args.get('sort_by', 'created_at')  # created_at, title, price, rating
    
    query = Course.query.filter_by(is_published=True)
    
    # Apply filters
    if search:
        query = query.filter(Course.title.ilike(f'%{search}%'))
    if category:
        query = query.filter(Course.category == category)
    if difficulty:
        query = query.filter(Course.difficulty_level == difficulty)
    
    # Apply sorting
    if sort_by == 'title':
        query = query.order_by(Course.title)
    elif sort_by == 'price':
        query = query.order_by(Course.price)
    else:
        query = query.order_by(Course.created_at.desc())
    
    courses = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        "courses": [course.to_dict() for course in courses.items],
        "pagination": {
            "page": courses.page,
            "per_page": courses.per_page,
            "total": courses.total,
            "pages": courses.pages,
            "has_next": courses.has_next,
            "has_prev": courses.has_prev
        }
    }), 200


# get courses for user with lessons

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_single_course_details(course_id):
    """
    API endpoint to fetch details for a single course, including lessons,
    and user-specific data like enrollment status and lesson completion.
    """
    try:
        course = Course.query.filter_by(id=course_id, is_published=True).first()
        if not course:
            return jsonify({'message': 'Course not found or not published'}), 404

        user_id = session.get('user_id')
        
        # Determine if the user is enrolled in this specific course
        is_enrolled = False
        if user_id:
            enrollment = Enrollment.query.filter_by(user_id=user_id, course_id=course.id).first()
            is_enrolled = enrollment is not None

        course_dict = course.to_dict(include_lessons=True) # Get course dict with all lessons

        # Enhance lessons data with user-specific info and content protection
        lessons_data = []
        for lesson in course.lessons:
            lesson_dict = lesson.to_dict()
            
            # Check if lesson is completed by the current user
            lesson_dict['isCompleted'] = False
            if user_id:
                progress = StudentProgress.query.filter_by(user_id=user_id, lesson_id=lesson.id, completed=True).first()
                if progress:
                    lesson_dict['isCompleted'] = True
            
            # Content protection: If user is not enrolled AND lesson is not free, hide video/description
            if not is_enrolled and not lesson.is_free:
                lesson_dict['videoUrl'] = None # Hide video URL
                lesson_dict['description'] = 'Enroll in the course to unlock this lesson.' # Generic message
                # You might also want to filter out documents or other sensitive data here
                lesson_dict['documents'] = [] # Hide documents for locked lessons

            lessons_data.append(lesson_dict)
        
        course_dict['lessons'] = lessons_data
        course_dict['isEnrolled'] = is_enrolled # Add course-level enrollment status

        return jsonify(course_dict), 200

    except Exception as e:
        db.session.rollback() # Rollback in case of DB error
        print(f"Error fetching single course details: {e}")
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500


@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course_details(course_id):
    """Get detailed course information"""
    course = Course.query.filter_by(id=course_id, is_published=True).first()
    if not course:
        return jsonify({"error": "Course not found"}), 404
    
    user = get_current_user()
    is_enrolled = False
    user_progress = None
    
    if user:
        enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course_id).first()
        is_enrolled = enrollment is not None
        if enrollment:
            user_progress = enrollment.progress_percentage
    
    course_data = course.to_dict(include_lessons=True)
    course_data['isEnrolled'] = is_enrolled
    course_data['userProgress'] = user_progress
    
    # Get reviews
    reviews = CourseReview.query.filter_by(course_id=course_id).order_by(CourseReview.created_at.desc()).limit(10).all()
    course_data['reviews'] = [review.to_dict() for review in reviews]
    
    return jsonify(course_data), 200

# Add these routes to your Flask app

@app.route('/api/courses/<int:course_id>/favorite', methods=['POST'])
@login_required
def add_to_favorites(course_id):
    """Add course to user's favorites"""
    user = get_current_user()
    course = Course.query.filter_by(id=course_id, is_published=True).first()
    
    if not course:
        return jsonify({"error": "Course not found"}), 404
    
    # Check if already in favorites
    existing_favorite = FavoriteCourse.query.filter_by(user_id=user.id, course_id=course_id).first()
    if existing_favorite:
        return jsonify({"error": "Course already in favorites"}), 400
    
    favorite = FavoriteCourse(user_id=user.id, course_id=course_id)
    
    try:
        db.session.add(favorite)
        db.session.commit()
        
        return jsonify({
            "message": "Course added to favorites",
            "favorite": {
                "id": favorite.id,
                "courseId": favorite.course_id,
                "addedAt": favorite.added_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add to favorites"}), 500

@app.route('/api/courses/<int:course_id>/favorite', methods=['DELETE'])
@login_required
def remove_from_favorites(course_id):
    """Remove course from user's favorites"""
    user = get_current_user()
    favorite = FavoriteCourse.query.filter_by(user_id=user.id, course_id=course_id).first()
    
    if not favorite:
        return jsonify({"error": "Course not in favorites"}), 404
    
    try:
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({"message": "Course removed from favorites"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to remove from favorites"}), 500

@app.route('/api/my-favorites', methods=['GET'])
@login_required
def get_my_favorites():
    """Get user's favorite courses"""
    user = get_current_user()
    favorites = FavoriteCourse.query.filter_by(user_id=user.id).order_by(FavoriteCourse.added_at.desc()).all()
    
    favorite_courses = []
    for favorite in favorites:
        course_dict = favorite.course.to_dict()
        course_dict['addedToFavoritesAt'] = favorite.added_at.isoformat()
        favorite_courses.append(course_dict)
    
    return jsonify({
        "favorites": favorite_courses
    }), 200

@app.route('/api/courses/<int:course_id>/is-favorite', methods=['GET'])
@login_required
def check_if_favorite(course_id):
    """Check if course is in user's favorites"""
    user = get_current_user()
    favorite = FavoriteCourse.query.filter_by(user_id=user.id, course_id=course_id).first()
    
    return jsonify({
        "isFavorite": favorite is not None
    }), 200

@app.route('/api/courses/<int:course_id>/enroll', methods=['POST'])
@login_required
def enroll_in_course(course_id):
    """Enroll student in a course"""
    user = get_current_user()
    course = Course.query.filter_by(id=course_id, is_published=True).first()
    
    if not course:
        return jsonify({"error": "Course not found"}), 404
    
    # Check if already enrolled
    existing_enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course_id).first()
    if existing_enrollment:
        return jsonify({"error": "Already enrolled in this course"}), 400
    
    # For this demo, we'll skip payment processing
    # In production, you'd integrate with payment gateway here
    
    enrollment = Enrollment(user_id=user.id, course_id=course_id)
    
    try:
        db.session.add(enrollment)
        db.session.commit()
        
        return jsonify({
            "message": "Successfully enrolled in course",
            "enrollment": enrollment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Enrollment failed"}), 500


@app.route('/api/my-courses', methods=['GET'])
@login_required
def get_my_courses():
    """Get user's enrolled courses"""
    user = get_current_user()
    enrollments = Enrollment.query.filter_by(user_id=user.id).order_by(Enrollment.enrolled_at.desc()).all()
    
    return jsonify({
        "enrollments": [enrollment.to_dict() for enrollment in enrollments]
    }), 200


# NEW API ROUTE FOR ENROLLMENT REQUEST
@app.route('/api/enrollment-request', methods=['POST'])
def handle_enrollment_request():
    data = request.get_json()
    user_email = data.get('user_email')
    course_id = data.get('course_id')

    if not user_email or not course_id:
        return jsonify({"message": "Missing user email or course ID"}), 400

    course = Course.query.get(course_id)
    if not course:
        return jsonify({"message": "Course not found"}), 404

    admin_email = "ouma.abouss@gmail.com"
    subject = f"Enrollment Request for Course: {course.title}"
    body = f"User {user_email} is requesting enrollment for the course: {course.title} (ID: {course_id}).\n\n" \
           f"Course Description: {course.description or 'N/A'}\n" \
           f"Course Category: {course.category or 'N/A'}\n" \
           f"Course Price: {float(course.price) if course.price else 'Free'} MAD\n" \
           f"Course Difficulty: {course.difficulty_level or 'N/A'}\n" \
           f"Course Duration: {course.duration_hours or 'N/A'} hours"

    try:
        msg = Message(subject, recipients=[admin_email], sender=app.config['MAIL_DEFAULT_SENDER'])
        msg.body = body
        mail.send(msg)
        return jsonify({"message": "Enrollment request sent successfully!"}), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"message": "Failed to send enrollment request email."}), 500


# @course_bp.route('/<int:course_id>/lessons', methods=['GET'])
@app.route('/api/courses/<int:course_id>/lessons', methods=['GET'])
def get_course_lessons(course_id):
    """
    Fetches all lessons for a specific course ID.
    """
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"message": "Course not found"}), 404

    # The lessons are already loaded due to the 'lessons' relationship
    # and ordered by 'order_index' as defined in the Course model relationship.
    lessons_data = [lesson.to_dict() for lesson in course.lessons]

    return jsonify({
        "course_id": course.id,
        "course_title": course.title,
        "lessons": lessons_data
    }), 200

@app.route('/api/courses/<int:course_id>/lessons/<int:lesson_id>/progress', methods=['POST'])
@login_required
def update_lesson_progress(course_id, lesson_id):
    """Update student's lesson progress"""
    user = get_current_user()
    data = request.get_json()
    
    # Verify enrollment
    enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course_id).first()
    if not enrollment:
        return jsonify({"error": "Not enrolled in this course"}), 403
    
    # Get or create progress record
    progress = StudentProgress.query.filter_by(user_id=user.id, lesson_id=lesson_id).first()
    if not progress:
        progress = StudentProgress(user_id=user.id, lesson_id=lesson_id)
        db.session.add(progress)
    
    # Update progress
    if data.get('completed'):
        progress.completed = True
        progress.completed_at = datetime.utcnow()
    
    if 'watchTimeSeconds' in data:
        progress.watch_time_seconds = data['watchTimeSeconds']
    
    try:
        db.session.commit()
        
        # Update course progress percentage
        update_course_progress(user.id, course_id)
        
        return jsonify({"message": "Progress updated successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update progress"}), 500

def update_course_progress(user_id, course_id):
    """Calculate and update overall course progress"""
    course = Course.query.get(course_id)
    if not course:
        return
    
    total_lessons = len(course.lessons)
    if total_lessons == 0:
        return
    
    completed_lessons = db.session.query(StudentProgress).join(Lesson).filter(
        StudentProgress.user_id == user_id,
        StudentProgress.completed == True,
        Lesson.course_id == course_id
    ).count()
    
    progress_percentage = (completed_lessons / total_lessons) * 100
    
    enrollment = Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first()
    if enrollment:
        enrollment.progress_percentage = progress_percentage
        if progress_percentage == 100:
            enrollment.completed_at = datetime.utcnow()
        db.session.commit()

# Student Notes Routes
@app.route('/api/lessons/<int:lesson_id>/notes', methods=['GET'])
@login_required
def get_lesson_notes(lesson_id):
    """Get student's notes for a lesson"""
    user = get_current_user()
    notes = StudentNote.query.filter_by(user_id=user.id, lesson_id=lesson_id).order_by(StudentNote.timestamp_seconds).all()
    
    return jsonify({
        "notes": [note.to_dict() for note in notes]
    }), 200

@app.route('/api/lessons/<int:lesson_id>/notes', methods=['POST'])
@login_required
def add_lesson_note(lesson_id):
    """Add a note to a lesson"""
    user = get_current_user()
    data = request.get_json()
    
    if not data.get('noteText'):
        return jsonify({"error": "Note text is required"}), 400
    
    note = StudentNote(
        user_id=user.id,
        lesson_id=lesson_id,
        note_text=data['noteText'],
        timestamp_seconds=data.get('timestampSeconds')
    )
    
    try:
        db.session.add(note)
        db.session.commit()
        
        return jsonify({
            "message": "Note added successfully",
            "note": note.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add note"}), 500

# Course Reviews Routes
@app.route('/api/courses/<int:course_id>/reviews', methods=['POST'])
@login_required
def add_course_review(course_id):
    """Add or update course review"""
    user = get_current_user()
    data = request.get_json()
    
    # Verify enrollment
    enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course_id).first()
    if not enrollment:
        return jsonify({"error": "Must be enrolled to review"}), 403
    
    rating = data.get('rating')
    if not rating or rating < 1 or rating > 5:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400
    
    # Get or create review
    review = CourseReview.query.filter_by(user_id=user.id, course_id=course_id).first()
    if not review:
        review = CourseReview(user_id=user.id, course_id=course_id)
        db.session.add(review)
    
    review.rating = rating
    review.comment = data.get('comment', '')
    review.updated_at = datetime.utcnow()
    
    try:
        db.session.commit()
        return jsonify({
            "message": "Review added successfully",
            "review": review.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add review"}), 500

# Admin Course Management Routes
@app.route('/api/admin/courses', methods=['GET'])
@admin_required
def admin_get_courses():
    """Get all courses (published and unpublished) for admin"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    search = request.args.get('search', '')
    status = request.args.get('status', '')  # published, unpublished, all
    
    query = Course.query
    
    # Apply filters
    if search:
        query = query.filter(Course.title.ilike(f'%{search}%'))
    
    if status == 'published':
        query = query.filter(Course.is_published == True)
    elif status == 'unpublished':
        query = query.filter(Course.is_published == False)
    
    query = query.order_by(Course.created_at.desc())
    courses = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        "courses": [course.to_dict(include_lessons=True) for course in courses.items],
        "pagination": {
            "page": courses.page,
            "per_page": courses.per_page,
            "total": courses.total,
            "pages": courses.pages,
            "has_next": courses.has_next,
            "has_prev": courses.has_prev
        }
    }), 200

@app.route('/api/admin/courses', methods=['POST'])
@admin_required
def admin_create_course():
    """Create a new course"""
    user = get_current_user()
    data = request.get_json()
    
    # Validation
    required_fields = ['title', 'description', 'price', 'category']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400
    
    try:
        price = float(data['price'])
        if price < 0:
            return jsonify({"error": "Price must be non-negative"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid price format"}), 400
    
    course = Course(
        title=data['title'],
        description=data['description'],
        short_description=data.get('shortDescription', ''),
        price=Decimal(str(price)),
        category=data['category'],
        difficulty_level=data.get('difficultyLevel', 'Beginner'),
        duration_hours=data.get('durationHours', 0),
        is_published=data.get('isPublished', False),
        created_by=user.id
    )
    
    try:
        db.session.add(course)
        db.session.commit()
        
        return jsonify({
            "message": "Course created successfully",
            "course": course.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create course"}), 500

@app.route('/api/admin/courses/<int:course_id>', methods=['PUT'])
@admin_required
def admin_update_course(course_id):
    """Update an existing course"""
    course = Course.query.get_or_404(course_id)
    data = request.get_json()
    
    # Update fields if provided
    if 'title' in data:
        course.title = data['title']
    if 'description' in data:
        course.description = data['description']
    if 'shortDescription' in data:
        course.short_description = data['shortDescription']
    if 'price' in data:
        try:
            price = float(data['price'])
            if price < 0:
                return jsonify({"error": "Price must be non-negative"}), 400
            course.price = Decimal(str(price))
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid price format"}), 400
    if 'category' in data:
        course.category = data['category']
    if 'difficultyLevel' in data:
        course.difficulty_level = data['difficultyLevel']
    if 'durationHours' in data:
        course.duration_hours = data['durationHours']
    if 'isPublished' in data:
        course.is_published = data['isPublished']
    
    course.updated_at = datetime.utcnow()
    
    try:
        db.session.commit()
        return jsonify({
            "message": "Course updated successfully",
            "course": course.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update course"}), 500

@app.route('/api/admin/courses/<int:course_id>', methods=['DELETE'])
@admin_required
def admin_delete_course(course_id):
    """Delete a course"""
    course = Course.query.get_or_404(course_id)
    
    try:
        db.session.delete(course)
        db.session.commit()
        return jsonify({"message": "Course deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete course"}), 500

@app.route('/api/admin/lessons', methods=['POST'])
@admin_required
def admin_create_lesson():
    """Create a new lesson for a course"""
    try:
        user = get_current_user()
        data = request.get_json()
        
        # Debug logging
        print(f"Received lesson data: {data}")
        print(f"User: {user.id if user else 'None'}")
        
        # Validation
        required_fields = ['courseId', 'title']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        # Validate course exists and user has permission
        course = Course.query.filter_by(id=data['courseId']).first()
        if not course:
            print(f"Course not found with ID: {data['courseId']}")
            return jsonify({"error": "Course not found"}), 404
        
        print(f"Found course: {course.title}, created_by: {course.created_by}")
        
        # Check if user is the course creator (optional - adjust based on your permissions)
        if course.created_by != user.id:
            print(f"Authorization failed. Course creator: {course.created_by}, Current user: {user.id}")
            return jsonify({"error": "Not authorized to add lessons to this course"}), 403
        
        # Validate and process duration
        duration_minutes = 0
        if data.get('durationMinutes'):
            try:
                duration_value = data['durationMinutes']
                if duration_value != '' and duration_value is not None:
                    duration_minutes = int(duration_value)
                    if duration_minutes < 0:
                        return jsonify({"error": "Duration must be non-negative"}), 400
            except (ValueError, TypeError) as e:
                print(f"Duration validation error: {e}, value: {data.get('durationMinutes')}")
                return jsonify({"error": "Invalid duration format"}), 400
        
        # Validate and process order index
        order_index = 0
        if data.get('orderIndex') is not None:
            try:
                order_value = data['orderIndex']
                if order_value != '' and order_value is not None:
                    order_index = int(order_value)
                    if order_index < 0:
                        return jsonify({"error": "Order index must be non-negative"}), 400
            except (ValueError, TypeError) as e:
                print(f"Order index validation error: {e}, value: {data.get('orderIndex')}")
                return jsonify({"error": "Invalid order index format"}), 400
        
        # Validate video URL format if provided
        video_url = data.get('videoUrl', '').strip()
        if video_url:
            # Basic URL validation (you might want to use a more robust validator)
            if not (video_url.startswith('http://') or video_url.startswith('https://')):
                return jsonify({"error": "Invalid video URL format"}), 400
        
        # Create the lesson
        lesson_data = {
            'course_id': data['courseId'],
            'title': data['title'].strip(),
            'description': data.get('description', '').strip(),
            'video_url': video_url if video_url else None,
            'duration_minutes': duration_minutes,
            'order_index': order_index,
            'is_free': data.get('isFree', False)
        }
        
        print(f"Creating lesson with data: {lesson_data}")
        
        lesson = Lesson(**lesson_data)
        
        db.session.add(lesson)
        db.session.flush()  # This will assign an ID to the lesson
        
        # Update course's updated_at timestamp
        course.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        print(f"Lesson created successfully with ID: {lesson.id}")
        
        return jsonify({
            "message": "Lesson created successfully",
            "lesson": lesson.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating lesson: {str(e)}")
        print(f"Exception type: {type(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to create lesson: {str(e)}"}), 500


@app.route('/api/admin/lessons', methods=['GET'])
def test_route():
    return jsonify({"message": "API is working"})

# Optional: Endpoint to update lesson order
@app.route('/api/admin/lessons/<int:lesson_id>', methods=['PUT'])
@admin_required
def admin_update_lesson(lesson_id):
    """Update a lesson"""
    user = get_current_user()
    data = request.get_json()
    
    # Find the lesson
    lesson = Lesson.query.filter_by(id=lesson_id).first()
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404
    
    # Check if user has permission
    course = Course.query.filter_by(id=lesson.course_id).first()
    if course.created_by != user.id:
        return jsonify({"error": "Not authorized to update this lesson"}), 403
    
    # Update fields if provided
    if 'title' in data:
        if not data['title'].strip():
            return jsonify({"error": "Title is required"}), 400
        lesson.title = data['title'].strip()
    
    if 'description' in data:
        lesson.description = data['description'].strip()
    
    if 'videoUrl' in data:
        video_url = data['videoUrl'].strip()
        if video_url and not (video_url.startswith('http://') or video_url.startswith('https://')):
            return jsonify({"error": "Invalid video URL format"}), 400
        lesson.video_url = video_url if video_url else None
    
    if 'durationMinutes' in data:
        try:
            duration = int(data['durationMinutes'])
            if duration < 0:
                return jsonify({"error": "Duration must be non-negative"}), 400
            lesson.duration_minutes = duration
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid duration format"}), 400
    
    if 'orderIndex' in data:
        try:
            order_index = int(data['orderIndex'])
            if order_index < 0:
                return jsonify({"error": "Order index must be non-negative"}), 400
            lesson.order_index = order_index
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid order index format"}), 400
    
    if 'isFree' in data:
        lesson.is_free = bool(data['isFree'])
    
    try:
        db.session.commit()
        
        # Update course's updated_at timestamp
        course.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "message": "Lesson updated successfully",
            "lesson": lesson.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating lesson: {str(e)}")
        return jsonify({"error": "Failed to update lesson"}), 500


# Optional: Endpoint to delete a lesson
@app.route('/api/admin/lessons/<int:lesson_id>', methods=['DELETE'])
@admin_required
def admin_delete_lesson(lesson_id):
    """Delete a lesson"""
    user = get_current_user()
    
    # Find the lesson
    lesson = Lesson.query.filter_by(id=lesson_id).first()
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404
    
    # Check if user has permission
    course = Course.query.filter_by(id=lesson.course_id).first()
    if course.created_by != user.id:
        return jsonify({"error": "Not authorized to delete this lesson"}), 403
    
    try:
        db.session.delete(lesson)
        db.session.commit()
        
        # Update course's updated_at timestamp
        course.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({"message": "Lesson deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting lesson: {str(e)}")
        return jsonify({"error": "Failed to delete lesson"}), 500
# Course Thumbnail Upload
@app.route('/api/admin/courses/<int:course_id>/thumbnail', methods=['POST'])
@admin_required
def upload_course_thumbnail(course_id):
    """Upload course thumbnail"""
    course = Course.query.get_or_404(course_id)
    
    if 'thumbnail' not in request.files:
        return jsonify({"error": "No thumbnail file provided"}), 400
    
    file = request.files['thumbnail']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        filename = secure_filename(f"course_{course_id}_{uuid.uuid4().hex[:8]}.{file.filename.rsplit('.', 1)[1].lower()}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'thumbnails', filename)
        
        try:
            file.save(filepath)
            course.thumbnail_url = f"/api/uploads/thumbnails/{filename}"
            db.session.commit()
            
            return jsonify({
                "message": "Thumbnail uploaded successfully",
                "thumbnailUrl": course.thumbnail_url
            }), 200
            
        except Exception as e:
            return jsonify({"error": "Failed to upload thumbnail"}), 500
    
    return jsonify({"error": "Invalid file type. Only PNG and JPG allowed"}), 400

# Lesson Management Routes
@app.route('/api/admin/courses/<int:course_id>/lessons', methods=['POST'])
@admin_required
def admin_add_lesson(course_id):
    """Add a lesson to a course"""
    course = Course.query.get_or_404(course_id)
    data = request.get_json()
    
    if not data.get('title'):
        return jsonify({"error": "Lesson title is required"}), 400
    
    # Get the next order index
    last_lesson = Lesson.query.filter_by(course_id=course_id).order_by(Lesson.order_index.desc()).first()
    next_order = (last_lesson.order_index + 1) if last_lesson else 1
    
    lesson = Lesson(
        course_id=course_id,
        title=data['title'],
        description=data.get('description', ''),
        duration_minutes=data.get('durationMinutes', 0),
        order_index=data.get('orderIndex', next_order),
        is_free=data.get('isFree', False)
    )
    
    try:
        db.session.add(lesson)
        db.session.commit()
        
        return jsonify({
            "message": "Lesson added successfully",
            "lesson": lesson.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add lesson"}), 500

@app.route('/api/admin/lessons/<int:lesson_id>', methods=['PUT'])
@admin_required
def admin_update_lessons(lesson_id):
    """Update a lesson"""
    lesson = Lesson.query.get_or_404(lesson_id)
    data = request.get_json()
    
    # Update fields if provided
    if 'title' in data:
        lesson.title = data['title']
    if 'description' in data:
        lesson.description = data['description']
    if 'durationMinutes' in data:
        lesson.duration_minutes = data['durationMinutes']
    if 'orderIndex' in data:
        lesson.order_index = data['orderIndex']
    if 'isFree' in data:
        lesson.is_free = data['isFree']
    
    try:
        db.session.commit()
        return jsonify({
            "message": "Lesson updated successfully",
            "lesson": lesson.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update lesson"}), 500

@app.route('/api/admin/lessons/<int:lesson_id>', methods=['DELETE'])
@admin_required
def admin_delete_lessons(lesson_id):
    """Delete a lesson"""
    lesson = Lesson.query.get_or_404(lesson_id)
    
    try:
        db.session.delete(lesson)
        db.session.commit()
        return jsonify({"message": "Lesson deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete lesson"}), 500

# Video Upload for Lessons
@app.route('/api/admin/lessons/<int:lesson_id>/video', methods=['POST'])
@admin_required
def upload_lesson_video(lesson_id):
    """Upload video for a lesson"""
    lesson = Lesson.query.get_or_404(lesson_id)
    
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"lesson_{lesson_id}_{uuid.uuid4().hex[:8]}.{file.filename.rsplit('.', 1)[1].lower()}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'videos', filename)
        
        try:
            file.save(filepath)
            lesson.video_url = f"/api/uploads/videos/{filename}"
            db.session.commit()
            
            return jsonify({
                "message": "Video uploaded successfully",
                "videoUrl": lesson.video_url
            }), 200
            
        except Exception as e:
            return jsonify({"error": "Failed to upload video"}), 500
    
    return jsonify({"error": "Invalid file type"}), 400

# Document Upload for Lessons
@app.route('/api/admin/lessons/<int:lesson_id>/documents', methods=['POST'])
@admin_required
def upload_lesson_document(lesson_id):
    """Upload document for a lesson"""
    lesson = Lesson.query.get_or_404(lesson_id)
    
    if 'document' not in request.files:
        return jsonify({"error": "No document file provided"}), 400
    
    file = request.files['document']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    title = request.form.get('title', file.filename)
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"doc_{lesson_id}_{uuid.uuid4().hex[:8]}.{file.filename.rsplit('.', 1)[1].lower()}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'documents', filename)
        
        try:
            file.save(filepath)
            
            document = LessonDocument(
                lesson_id=lesson_id,
                title=title,
                file_url=f"/api/uploads/documents/{filename}",
                file_type=file.filename.rsplit('.', 1)[1].lower(),
                file_size=os.path.getsize(filepath)
            )
            
            db.session.add(document)
            db.session.commit()
            
            return jsonify({
                "message": "Document uploaded successfully",
                "document": document.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to upload document"}), 500
    
    return jsonify({"error": "Invalid file type"}), 400

@app.route('/api/admin/documents/<int:document_id>', methods=['DELETE'])
@admin_required
def admin_delete_document(document_id):
    """Delete a lesson document"""
    document = LessonDocument.query.get_or_404(document_id)
    
    try:
        # Delete file from filesystem
        if document.file_url:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'documents', 
                                   os.path.basename(document.file_url))
            if os.path.exists(file_path):
                os.remove(file_path)
        
        db.session.delete(document)
        db.session.commit()
        return jsonify({"message": "Document deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete document"}), 500

# User Management Routes
@app.route('/api/admin/users', methods=['GET'])
@admin_required
def admin_get_users():
    """Get all users for admin"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    search = request.args.get('search', '')
    
    query = User.query
    
    if search:
        query = query.filter(
            db.or_(
                User.first_name.ilike(f'%{search}%'),
                User.last_name.ilike(f'%{search}%'),
                User.email.ilike(f'%{search}%')
            )
        )
    
    query = query.order_by(User.registration_date.desc())
    users = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        "users": [user.to_dict() for user in users.items],
        "pagination": {
            "page": users.page,
            "per_page": users.per_page,
            "total": users.total,
            "pages": users.pages,
            "has_next": users.has_next,
            "has_prev": users.has_prev
        }
    }), 200

@app.route('/api/admin/users/<int:user_id>/toggle-status', methods=['PUT'])
@admin_required
def admin_toggle_user_status(user_id):
    """Toggle user active status"""
    user = User.query.get_or_404(user_id)
    current_admin = get_current_user()
    
    # Prevent admin from deactivating themselves
    if user.id == current_admin.id:
        return jsonify({"error": "Cannot modify your own status"}), 400
    
    user.is_active = not user.is_active
    
    try:
        db.session.commit()
        return jsonify({
            "message": f"User {'activated' if user.is_active else 'deactivated'} successfully",
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update user status"}), 500

# Statistics Routes
@app.route('/api/admin/statistics', methods=['GET'])
@admin_required
def admin_get_statistics():
    """Get platform statistics"""
    total_users = User.query.filter_by(is_active=True).count()
    total_courses = Course.query.count()
    published_courses = Course.query.filter_by(is_published=True).count()
    total_enrollments = Enrollment.query.count()
    
    # Recent enrollments (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_enrollments = Enrollment.query.filter(
        Enrollment.enrolled_at >= thirty_days_ago
    ).count()
    
    # Most popular courses
    popular_courses = db.session.query(
        Course.title,
        db.func.count(Enrollment.id).label('enrollment_count')
    ).join(Enrollment).group_by(Course.id).order_by(
        db.func.count(Enrollment.id).desc()
    ).limit(5).all()
    
    return jsonify({
        "totalUsers": total_users,
        "totalCourses": total_courses,
        "publishedCourses": published_courses,
        "totalEnrollments": total_enrollments,
        "recentEnrollments": recent_enrollments,
        "popularCourses": [
            {"title": course.title, "enrollments": course.enrollment_count}
            for course in popular_courses
        ]
    }), 200

# File Serving Routes
@app.route('/api/uploads/<path:filename>')
def serve_uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Categories and Utilities
@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get available course categories"""
    categories = db.session.query(Course.category).distinct().filter(
        Course.category.isnot(None),
        Course.is_published == True
    ).all()
    
    return jsonify({
        "categories": [cat.category for cat in categories if cat.category]
    }), 200

# Lesson Reordering
@app.route('/api/admin/courses/<int:course_id>/lessons/reorder', methods=['PUT'])
@admin_required
def admin_reorder_lessons(course_id):
    """Reorder lessons in a course"""
    course = Course.query.get_or_404(course_id)
    data = request.get_json()
    lesson_orders = data.get('lessonOrders', [])
    
    try:
        for lesson_order in lesson_orders:
            lesson_id = lesson_order.get('id')
            new_order = lesson_order.get('orderIndex')
            
            lesson = Lesson.query.filter_by(id=lesson_id, course_id=course_id).first()
            if lesson:
                lesson.order_index = new_order
        
        db.session.commit()
        return jsonify({"message": "Lessons reordered successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to reorder lessons"}), 500

# Bulk Operations
@app.route('/api/admin/courses/bulk-publish', methods=['PUT'])
@admin_required
def admin_bulk_publish_courses():
    """Bulk publish/unpublish courses"""
    data = request.get_json()
    course_ids = data.get('courseIds', [])
    publish_status = data.get('publish', True)
    
    try:
        Course.query.filter(Course.id.in_(course_ids)).update(
            {Course.is_published: publish_status},
            synchronize_session=False
        )
        db.session.commit()
        
        action = "published" if publish_status else "unpublished"
        return jsonify({
            "message": f"{len(course_ids)} courses {action} successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update courses"}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)