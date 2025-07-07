import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import {
  Play,
  Clock,
  BookOpen,
  MessageSquare,
  Plus,
  Eye,
  Star,
  Calendar,
  User,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  Download,
  CheckCircle,
  Circle,
  TrendingUp,
  Award,
  Filter
} from 'lucide-react';
import UserProfiles from "./UserProfiles"; // Import the UserProfiles component


const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('my-courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // State for API data
  const [enrollments, setEnrollments] = useState([]);
  const [lessonNotes, setLessonNotes] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});
  const [userStats, setUserStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    currentStreak: 0
  });

  // NEW STATE: To store lessons for the currently selected course
  const [courseLessons, setCourseLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsError, setLessonsError] = useState(null);

  // API base URL
  const API_BASE = '/api';

  // Fetch user's enrolled courses
  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/my-courses`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setEnrollments(data.enrollments || []);

      // Populate completedLessons state based on the fetched data
      const initialCompleted = {};
      data.enrollments.forEach(enrollment => {
        if (enrollment.course && enrollment.course.lessons) {
          enrollment.course.lessons.forEach(lesson => {
            if (lesson.isCompleted) {
              initialCompleted[lesson.id] = true;
            }
          });
        }
      });
      setCompletedLessons(initialCompleted);

      // Calculate user statistics
      const totalCourses = data.enrollments.length;
      const completedCourses = data.enrollments.filter(e => e.completedAt).length;
      const totalHours = data.enrollments.reduce((sum, e) => sum + (e.course.durationHours || 0), 0);

      setUserStats({
        totalCourses,
        completedCourses,
        totalHours,
        currentStreak: data.currentStreak || 0
      });

    } catch (err) {
      setError(err.message);
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // NEW FUNCTION: Fetch lessons for a specific course
  const fetchCourseLessons = async (courseId) => {
    setLessonsLoading(true);
    setLessonsError(null);
    try {
      const response = await fetch(`${API_BASE}/courses/${courseId}/lessons`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lessons for course');
      }

      const data = await response.json();
      const sortedLessons = data.lessons.sort((a, b) => a.orderIndex - b.orderIndex);
      setCourseLessons(sortedLessons);
    } catch (err) {
      setLessonsError(err.message);
      console.error('Error fetching course lessons:', err);
    } finally {
      setLessonsLoading(false);
    }
  };

  // Fetch notes for a specific lesson
  const fetchLessonNotes = async (lessonId) => {
    try {
      const response = await fetch(`${API_BASE}/lessons/${lessonId}/notes`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setLessonNotes(prev => ({
        ...prev,
        [lessonId]: data.notes || []
      }));
    } catch (err) {
      console.error('Error fetching lesson notes:', err);
    }
  };



  // Load notes when lesson is selected
  useEffect(() => {
    if (selectedLesson && !lessonNotes[selectedLesson.id]) {
      fetchLessonNotes(selectedLesson.id);
    }
  }, [selectedLesson, lessonNotes]); // Removed fetchLessonNotes from dependency array as it's not a direct dependency in a way that causes issues

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleLessonExpansion = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const getEmbeddableVideoUrl = (url) => {
    if (!url) return null;

    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch) {
      // Corrected embed URL for YouTube
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);

    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  // Mark lesson as complete
const markLessonComplete = async (lessonId, watchTime = 0) => {
  try {
    const response = await fetch(`/api/progress/lesson/${lessonId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ watchTime })
    });
    
    const data = await response.json();
    if (response.ok) {
      // Update UI with new progress
      setProgressPercentage(data.progressPercentage);
      if (data.courseCompleted) {
        showCourseCompletedMessage();
      }
    }
  } catch (error) {
    console.error('Error marking lesson complete:', error);
  }
};

// Update watch time (call this periodically during video playback)
const updateWatchTime = async (lessonId, watchTime) => {
  try {
    const response = await fetch(`/api/progress/lesson/${lessonId}/watch-time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ watchTime })
    });
    
    const data = await response.json();
    if (data.autoCompleted) {
      // Lesson was auto-completed
      setProgressPercentage(data.progressPercentage);
      showLessonCompletedMessage();
    }
  } catch (error) {
    console.error('Error updating watch time:', error);
  }
};

// Get course progress
const getCourseProgress = async (courseId) => {
  try {
    const response = await fetch(`/api/progress/course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    if (response.ok) {
      return data;
    }
  } catch (error) {
    console.error('Error getting course progress:', error);
  }
};
  const isDirectVideoFile = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // Filter enrollments based on search and filter
  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enrollment.course.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'completed' && enrollment.completedAt) ||
      (filterStatus === 'in-progress' && !enrollment.completedAt);
    return matchesSearch && matchesFilter;
  });

  // Statistics Dashboard Component
  const StatsDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Courses</p>
            <p className="text-2xl font-bold text-white">{userStats.totalCourses}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-white">{userStats.completedCourses}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Hours</p>
            <p className="text-2xl font-bold text-white">{userStats.totalHours}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Current Streak</p>
            <p className="text-2xl font-bold text-white">{userStats.currentStreak} days</p>
          </div>
        </div>
      </div>
    </div>
  );

  // My Courses Component
  const MyCourses = () => (
    <div className="space-y-6">
      <StatsDashboard />

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
        >
          <option value="all">All Courses</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">Error: {error}</div>
          <button
            onClick={fetchMyCourses}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No courses found' : 'No Courses Yet'}
          </h3>
          <p className="text-gray-400">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'You haven\'t enrolled in any courses yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10"
              onClick={() => {
                setSelectedCourse(enrollment.course);
                fetchCourseLessons(enrollment.course.id);
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{enrollment.course.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                      {enrollment.course.category}
                    </span>
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                      {enrollment.course.difficultyLevel}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{enrollment.course.averageRating || 'N/A'}</span>
                </div>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-2">{enrollment.course.shortDescription || enrollment.course.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {enrollment.course.durationHours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {enrollment.course.totalLessons || enrollment.course.lessons?.length || 0} lessons
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(enrollment.enrolledAt)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Progress</span>
                  <span className="text-sm font-medium text-purple-300">
                    {Math.round(enrollment.progressPercentage || 0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${enrollment.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>

              {enrollment.completedAt && (
                <div className="mt-4 flex items-center gap-2 text-green-400">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Completed on {formatDate(enrollment.completedAt)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Course Detail Component
  const CourseDetail = ({ course }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setSelectedCourse(null);
            setCourseLessons([]);
            setLessonsError(null);
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back to My Courses
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span>{course.durationHours} hours</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <BookOpen className="w-5 h-5" />
                <span>{courseLessons.length || 0} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-5 h-5" />
                <span>{course.totalEnrollments || 0} students</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span>{course.averageRating || 'N/A'} rating</span>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                {course.category}
              </span>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                {course.difficultyLevel}
              </span>
              {course.isPublished && (
                <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
                  Published
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Course Lessons</h2>

        {lessonsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
          </div>
        ) : lessonsError ? (
          <div className="text-center py-8">
            <div className="text-red-400 mb-4">Error loading lessons: {lessonsError}</div>
            <button
              onClick={() => fetchCourseLessons(course.id)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              Retry Loading Lessons
            </button>
          </div>
        ) : courseLessons.length > 0 ? (
          <div className="space-y-4">
            {courseLessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-full">
                      <span className="text-purple-300 font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{lesson.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{lesson.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {lesson.durationMinutes} min
                        </span>
                        {lesson.isFree && (
                          <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded-full text-xs">
                            Free Preview
                          </span>
                        )}
                        {lesson.documents && lesson.documents.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {lesson.documents.length} files
                          </span>
                        )}
                        {completedLessons[lesson.id] && (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lesson.videoUrl ? (
                      <button
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setShowVideoPlayer(true);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Watch
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-600/50 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
                        title="Enroll to watch"
                      >
                        <Play className="w-4 h-4" />
                        Locked
                      </button>
                    )}
                    <button
                      onClick={() => toggleLessonExpansion(lesson.id)}
                      className="text-gray-400 hover:text-white transition-colors p-2"
                    >
                      {expandedLessons[lesson.id] ?
                        <ChevronUp className="w-5 h-5" /> :
                        <ChevronDown className="w-5 h-5" />
                      }
                    </button>
                  </div>
                </div>

                {expandedLessons[lesson.id] && (
                  <div className="mt-4 pt-4 border-t border-slate-600/50">
                    {lesson.documents && lesson.documents.length > 0 ? (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-white mb-2">Lesson Materials</h4>
                        <div className="space-y-2">
                          {lesson.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between bg-slate-600/30 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <FileText className="w-4 h-4" />
                                <span>{doc.title}</span>
                                <span className="text-gray-500">({doc.fileType?.toUpperCase()})</span>
                              </div>
                              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No materials available for this lesson.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No lessons available for this course yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Video Player Component (Updated to manage its own note state)
  // Fixed VideoPlayer Component
  // Fixed VideoPlayer Component
// Replace your VideoPlayer component with this improved version


const VideoPlayer = ({ lesson }) => {
  // State for note input and timestamp
  const [newNote, setNewNote] = useState('');
  const [noteTimestamp, setNoteTimestamp] = useState(0);
  const [noteTimeInput, setNoteTimeInput] = useState('0:00'); // <-- string input for user
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Refs for video and iframe elements
  const videoRef = useRef(null);
  const iframeRef = useRef(null);

  // Format seconds as M:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Parse M:SS string to total seconds, returns null if invalid
  const parseTime = (input) => {
    const parts = input.trim().split(':');
    if (parts.length !== 2) return null;
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds) || seconds < 0 || seconds > 59) return null;
    return minutes * 60 + seconds;
  };

  // Add note handler with validation
  const addNote = async () => {
    if (!newNote.trim() || !lesson) return;

    const totalSeconds = parseTime(noteTimeInput);
    if (totalSeconds === null) {
      setError('Invalid time format. Use M:SS');
      setSuccess('');
      return;
    }
    if (videoDuration && totalSeconds > videoDuration) {
      setError('Timestamp exceeds video duration');
      setSuccess('');
      return;
    }

    setError('');
    setIsAddingNote(true);
    try {
      const response = await fetch(`${API_BASE}/lessons/${lesson.id}/notes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteText: newNote,
          timestampSeconds: totalSeconds,
        }),
      });

      if (!response.ok) throw new Error('Failed to add note');

      const data = await response.json();

      setLessonNotes(prev => ({
        ...prev,
        [lesson.id]: [...(prev[lesson.id] || []), data.note],
      }));

      setNewNote('');
      setNoteTimestamp(0);
      setNoteTimeInput('0:00');
      setSuccess('Note added successfully!');
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Failed to add note. Please try again.');
      setSuccess('');
    } finally {
      setIsAddingNote(false);
    }
  };

  // Capture current video time and update input + timestamp
  const captureCurrentTime = () => {
    const time = videoRef.current?.currentTime ?? currentVideoTime;
    const formatted = formatTime(Math.floor(time));
    setNoteTimeInput(formatted);
    setNoteTimestamp(Math.floor(time));
    setError('');
    setSuccess('');
  };

  // On video loaded metadata
  const handleVideoLoad = () => {
    setIsVideoReady(true);
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  // On time update for direct videos
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentVideoTime(videoRef.current.currentTime);
    }
  };

  // Jump to timestamp on note click
  const jumpToTimestamp = (seconds) => {
    if (videoRef.current && isVideoReady) {
      videoRef.current.currentTime = seconds;
    } else {
      setError('Time jumping not available for embedded videos');
    }
  };

  // Reset states when lesson changes
  useEffect(() => {
    if (lesson && !lessonNotes[lesson.id]) {
      fetchLessonNotes(lesson.id);
    }
    setIsVideoReady(false);
    setCurrentVideoTime(0);
    setNoteTimestamp(0);
    setNoteTimeInput('0:00');
    setError('');
    setSuccess('');
  }, [lesson]);

  // Auto-update timestamp input if user hasn't set one yet and video is playing
  useEffect(() => {
    if (currentVideoTime > 0 && (noteTimestamp === 0 || noteTimeInput === '0:00')) {
      const newTime = Math.floor(currentVideoTime);
      setNoteTimestamp(newTime);
      setNoteTimeInput(formatTime(newTime));
    }
  }, [currentVideoTime, noteTimestamp, noteTimeInput]);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 py-8">
        <div className="w-full max-w-7xl bg-slate-800 rounded-2xl overflow-hidden my-4">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{lesson.title}</h2>
              <p className="text-gray-400">{lesson.description}</p>
            </div>
            <button
              onClick={() => {
                setShowVideoPlayer(false);
                setSelectedLesson(null);
              }}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 p-6">
            {/* Video Section */}
            <div className="xl:col-span-3 space-y-4">
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                {lesson.videoUrl ? (
                  isDirectVideoFile(lesson.videoUrl) ? (
                    <video
                      ref={videoRef}
                      src={getEmbeddableVideoUrl(lesson.videoUrl)}
                      controls
                      className="w-full h-full"
                      onLoadedData={handleVideoLoad}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleVideoLoad}
                      preload="metadata"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <iframe
                        ref={iframeRef}
                        src={getEmbeddableVideoUrl(lesson.videoUrl)}
                        title={lesson.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                      {/* Time tracker overlay for embedded videos */}
                      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                        Session time: {formatTime(currentVideoTime)}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Video className="w-20 h-20 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Video not available</p>
                      <p className="text-sm">Enroll in the course to unlock content</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-between bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => markLessonComplete(lesson.id)}
                    disabled={completedLessons[lesson.id]}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      completedLessons[lesson.id]
                        ? 'bg-green-600/20 text-green-300 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg'
                    }`}
                  >
                    {completedLessons[lesson.id] ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                    {completedLessons[lesson.id] ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.durationMinutes} minutes</span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Lesson Notes
                </h3>

                {/* Existing Notes */}
                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto custom-scrollbar">
                  {lessonNotes[lesson.id]?.length > 0 ? (
                    lessonNotes[lesson.id].map((note) => (
                      <div
                        key={note.id}
                        className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800/70 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <button
                            onClick={() => jumpToTimestamp(note.timestampSeconds)}
                            className="text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1 hover:bg-purple-600/20 px-2 py-1 rounded"
                            disabled={!isVideoReady}
                            title="Jump to this timestamp"
                          >
                            <Play className="w-3 h-3" />
                            {formatTime(note.timestampSeconds)}
                          </button>
                          <span className="text-xs text-gray-500">
                            {formatDate(note.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{note.noteText}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No notes yet</p>
                      <p className="text-xs">Start taking notes to remember key moments!</p>
                    </div>
                  )}
                </div>

                {/* Add New Note */}
                <div className="space-y-4 border-t border-slate-600/50 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Timestamp
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={noteTimeInput}
                          onChange={(e) => setNoteTimeInput(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono"
                          placeholder="M:SS"
                        />
                       
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Note
                    </label>
                    <textarea
                      className="w-full p-3 bg-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                      rows="3"
                      placeholder="What's important at this moment?"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  {success && (
                    <p className="text-green-400 text-sm">{success}</p>
                  )}

                  <button
                    onClick={addNote}
                    disabled={!newNote.trim() || isAddingNote}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    {isAddingNote ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {isAddingNote ? 'Saving...' : `Add Note at ${noteTimeInput}`}
                  </button>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Quick Tips
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    Click "Now" to capture current video time
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    Click timestamps to jump to that moment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    Edit timestamp manually (format: M:SS)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    Notes are automatically saved
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8">Student Dashboard</h1>

        {/* Global Messages */}
        {success && (
          <div className="bg-green-600/20 text-green-300 p-4 rounded-lg mb-6 flex items-center justify-between animate-fade-in-down">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-300 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        )}
        {error && (
          <div className="bg-red-600/20 text-red-300 p-4 rounded-lg mb-6 flex items-center justify-between animate-fade-in-down">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-300 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="border-b border-slate-700 mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => { setActiveTab('my-courses'); setSelectedCourse(null); }}
              className={`py-3 px-4 text-lg font-medium transition-colors duration-300 ${activeTab === 'my-courses' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <BookOpen className="inline-block mr-2 w-5 h-5" /> My Courses
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-4 text-lg font-medium transition-colors duration-300 ${activeTab === 'profile' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <User className="inline-block mr-2 w-5 h-5" /> Profile
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'my-courses' && (
            selectedCourse ? (
              <CourseDetail course={selectedCourse} />
            ) : (
              <MyCourses />
            )
          )}
          {activeTab === 'profile' && <UserProfiles />} {/* UserProfiles component added here */}
          {activeTab === 'achievements' && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 text-center">
              <Award className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">My Achievements</h2>
              <p className="text-gray-300">Unlock badges and certificates by completing courses and milestones.</p>
              {/* Future: Display achievements */}
              <div className="mt-6 text-gray-400">
                <p>No achievements unlocked yet. Keep learning!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showVideoPlayer && selectedLesson && (
        <VideoPlayer lesson={selectedLesson} />
      )}
      
    </div>
  );
};

export default StudentDashboard;