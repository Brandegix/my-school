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
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/learning_platform')
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
