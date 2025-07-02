import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Upload,
  Save,
  X,
  Users,
  Star,
  Clock,
  DollarSign,
  Settings,
  Image,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminCourseManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
const [selectedCourseForLesson, setSelectedCourseForLesson] = useState(null);
const [showLessonPreview, setShowLessonPreview] = useState(false);
const [previewingLesson, setPreviewingLesson] = useState(null);
const [lessonFormData, setLessonFormData] = useState({
  title: '',
  description: '',
  videoUrl: '',
  durationMinutes: '',
  orderIndex: 0,
  isFree: false
});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    category: '',
    difficultyLevel: 'Beginner',
    durationHours: '',
    isPublished: false
  });

  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    recentEnrollments: 0,
    popularCourses: []
  });

  // API base URL - adjust this to match your backend
  const API_BASE = '/api';

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/courses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust auth method as needed
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      setCourses(data.courses || []);
      
      // Update statistics
      const published = data.courses.filter(course => course.isPublished).length;
      const totalEnrollments = data.courses.reduce((sum, course) => sum + (course.totalEnrollments || 0), 0);
      
      setStatistics({
        totalCourses: data.courses.length,
        publishedCourses: published,
        totalEnrollments,
        recentEnrollments: Math.floor(totalEnrollments * 0.1), // Mock recent enrollments
        popularCourses: data.courses
          .sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0))
          .slice(0, 3)
          .map(course => ({
            title: course.title,
            enrollments: course.totalEnrollments || 0
          }))
      });
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      price: '',
      category: '',
      difficultyLevel: 'Beginner',
      durationHours: '',
      isPublished: false
    });
  };

  const handleCreateCourse = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.price || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
        throw new Error('Please enter a valid price');
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price),
        category: formData.category,
        difficultyLevel: formData.difficultyLevel,
        durationHours: parseInt(formData.durationHours) || 0,
        isPublished: formData.isPublished
      };

      const response = await fetch(`${API_BASE}/admin/courses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust auth method as needed
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create course');
      }

      // Success
      setSuccess('Course created successfully!');
      setCourses(prev => [data.course, ...prev]);
      resetForm();
      setShowCreateModal(false);
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        totalCourses: prev.totalCourses + 1,
        publishedCourses: prev.publishedCourses + (courseData.isPublished ? 1 : 0)
      }));

    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses(prev => prev.filter(course => course.id !== courseId));
      setSuccess('Course deleted successfully');
      
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTogglePublish = async (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    try {
      const response = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isPublished: !course.isPublished
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const updatedCourse = await response.json();
      
      setCourses(prev => prev.map(c => 
        c.id === courseId 
          ? { ...c, isPublished: !c.isPublished }
          : c
      ));

      setSuccess(`Course ${!course.isPublished ? 'published' : 'unpublished'} successfully`);
      
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'published' && course.isPublished) ||
                         (filterStatus === 'unpublished' && !course.isPublished);
    return matchesSearch && matchesFilter;
  });

  const handleLessonInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setLessonFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};

const resetLessonForm = () => {
  setLessonFormData({
    title: '',
    description: '',
    videoUrl: '',
    durationMinutes: '',
    orderIndex: 0,
    isFree: false
  });
};

const handleCreateLesson = async () => {
  if (!selectedCourseForLesson) return;
  
  setSubmitting(true);
  setError('');
  setSuccess('');

  try {
    // Validate required fields
    if (!lessonFormData.title) {
      throw new Error('Please enter a lesson title');
    }
    if (lessonFormData.videoUrl) {
  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(lessonFormData.videoUrl)) {
    throw new Error('Please enter a valid video URL (must start with http:// or https://)');
  }
}


    const lessonData = {
      courseId: selectedCourseForLesson.id,
      title: lessonFormData.title,
      description: lessonFormData.description,
      videoUrl: lessonFormData.videoUrl,
      durationMinutes: parseInt(lessonFormData.durationMinutes) || 0,
      orderIndex: parseInt(lessonFormData.orderIndex) || 0,
      isFree: lessonFormData.isFree
    };


  const response = await fetch(`/api/admin/lessons`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lessonData)
  });

  let data;
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();  // only called if it's not JSON
    throw new Error(text || 'Unexpected non-JSON response from server');
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to create lesson');
  }

  setCourses(prev => prev.map(course => {
    if (course.id === selectedCourseForLesson.id) {
      return {
        ...course,
        lessons: [...(course.lessons || []), data.lesson],
        totalLessons: (course.totalLessons || 0) + 1
      };
    }
    return course;
  }));

  setSuccess('Lesson created successfully!');
  resetLessonForm();
  setShowCreateLessonModal(false);
  setSelectedCourseForLesson(null);

} catch (error) {
  setError(error.message);
} finally {
  setSubmitting(false);
}};

const openLessonPreview = (lesson, course) => {
  setPreviewingLesson({ ...lesson, courseName: course.title });
  setShowLessonPreview(true);
};

const getEmbeddableVideoUrl = (url) => {
  if (!url) return null;
  
  // YouTube URL patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo URL patterns
  const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  // For other URLs, return as-is (assuming they're already embeddable)
  return url;
};

// Add this function to check if URL is a video file
const isDirectVideoFile = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

const openCreateLessonModal = (course) => {
  setSelectedCourseForLesson(course);
  // Set the next order index based on existing lessons
  const nextOrderIndex = (course.lessons || []).length;
  setLessonFormData(prev => ({
    ...prev,
    orderIndex: nextOrderIndex
  }));
  setShowCreateLessonModal(true);
};

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Course Management
          </h1>
          <p className="text-gray-300">Create, manage, and monitor your courses</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <span className="text-green-300">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800/30 backdrop-blur-lg rounded-xl p-1 border border-white/5">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Courses</p>
                    <p className="text-3xl font-bold text-white">{statistics.totalCourses}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Published</p>
                    <p className="text-3xl font-bold text-white">{statistics.publishedCourses}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Enrollments</p>
                    <p className="text-3xl font-bold text-white">{statistics.totalEnrollments}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Recent (30d)</p>
                    <p className="text-3xl font-bold text-white">{statistics.recentEnrollments}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Courses */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/5 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-6">Most Popular Courses</h3>
              <div className="space-y-4">
                {statistics.popularCourses.length > 0 ? (
                  statistics.popularCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{course.title}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="w-4 h-4 mr-2" />
                        {course.enrollments} enrollments
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No courses available yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Course Management Header */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/5 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filter */}
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                    >
                      <option value="all">All Courses</option>
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Create Course Button */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Course
                </button>
              </div>
            </div>

            {/* Courses List */}
            <div className="space-y-4">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              course.isPublished 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                            {course.category && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                {course.category}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-300 mb-4">{course.shortDescription || course.description?.substring(0, 100) + '...'}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <div className="flex items-center">
                              {course.price} MAD
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {course.durationHours || 0}h
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {course.totalEnrollments || 0} enrolled
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-400" />
                              {course.averageRating || 'No ratings'}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(course.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                     <div className="flex items-center space-x-2">
  <button
    onClick={() => openCreateLessonModal(course)}
    className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors"
    title="Add Lesson"
  >
    <Plus className="w-5 h-5" />
  </button>
  <button
    onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
  >
    {expandedCourse === course.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
  </button>
  <button
    onClick={() => setEditingCourse(course)}
    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
  >
    <Edit3 className="w-5 h-5" />
  </button>
  <button
    onClick={() => handleTogglePublish(course.id)}
    className={`p-2 rounded-lg transition-colors ${
      course.isPublished
        ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20'
        : 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
    }`}
  >
    {course.isPublished ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
  </button>
  <button
    onClick={() => handleDeleteCourse(course.id)}
    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
  >
    <Trash2 className="w-5 h-5" />
  </button>
</div>
                      </div>
                    </div>

                    {/* Expanded Course Details */}
                    {expandedCourse === course.id && (
                      <div className="px-6 pb-6 border-t border-gray-700/50">
                        <div className="pt-6">
                          <h4 className="text-lg font-semibold text-white mb-4">Course Details</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h5 className="text-white font-medium mb-2">Description</h5>
                              <p className="text-gray-300 text-sm">{course.description}</p>
                            </div>
                            <div>
                              <h5 className="text-white font-medium mb-3">Lessons ({course.totalLessons || 0})</h5>
                              
{course.lessons && course.lessons.length > 0 ? (
  <div className="space-y-2">
    {course.lessons.map((lesson) => (
      <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-gray-300">{lesson.title}</span>
            {lesson.isFree && (
              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                Free
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">{lesson.durationMinutes}min</span>
          <button
            onClick={() => openLessonPreview(lesson, course)}
            className="p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded transition-colors"
            title="Preview Lesson"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-400 text-sm">No lessons added yet</p>
)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 border border-white/5 shadow-2xl text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
                  <p className="text-gray-400 mb-6">Get started by creating your first course</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Course
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/5 shadow-2xl">
            <div className="text-center py-20">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
              <p className="text-gray-400">Detailed analytics and reporting features coming soon</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Create New Course</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                  setError('');
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
                <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief course description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Detailed course description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (MAD)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    name="durationHours"
                    value={formData.durationHours}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-500 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 bg-gray-700"
                />
                <label htmlFor="isPublished" className="text-gray-300">
                  Publish course immediately
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourse}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                >
                  Create Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCreateLessonModal && selectedCourseForLesson && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Add New Lesson</h2>
          <p className="text-gray-400 text-sm mt-1">Course: {selectedCourseForLesson.title}</p>
        </div>
        <button
          onClick={() => {
            setShowCreateLessonModal(false);
            setSelectedCourseForLesson(null);
            resetLessonForm();
            setError('');
          }}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
          <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lesson Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={lessonFormData.title}
            onChange={handleLessonInputChange}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter lesson title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={lessonFormData.description}
            onChange={handleLessonInputChange}
            rows={4}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Lesson description"
          />
        </div>

       <div>
  <label className="block text-sm font-medium text-gray-300 mb-2">Video URL</label>
  <input
    type="url"
    name="videoUrl"
    value={lessonFormData.videoUrl}
    onChange={handleLessonInputChange}
    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
  />
  <p className="text-gray-500 text-xs mt-1">
    Supports YouTube, Vimeo, or direct video file URLs
  </p>
</div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              name="durationMinutes"
              value={lessonFormData.durationMinutes}
              onChange={handleLessonInputChange}
              min="0"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
            <input
              type="number"
              name="orderIndex"
              value={lessonFormData.orderIndex}
              onChange={handleLessonInputChange}
              min="0"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isFree"
            name="isFree"
            checked={lessonFormData.isFree}
            onChange={handleLessonInputChange}
            className="w-4 h-4 text-purple-500 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 bg-gray-700"
          />
          <label htmlFor="isFree" className="text-gray-300">
            Free preview lesson
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
          <button
            onClick={() => {
              setShowCreateLessonModal(false);
              setSelectedCourseForLesson(null);
              resetLessonForm();
            }}
            disabled={submitting}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateLesson}
            disabled={submitting}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium disabled:opacity-50 flex items-center"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Lesson'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{showLessonPreview && previewingLesson && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10">
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div>
          <h2 className="text-2xl font-semibold text-white">{previewingLesson.title}</h2>
          <p className="text-gray-400 text-sm mt-1">Course: {previewingLesson.courseName}</p>
        </div>
        <button
          onClick={() => {
            setShowLessonPreview(false);
            setPreviewingLesson(null);
          }}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-6">
      {/* Video Player */}
{previewingLesson.videoUrl ? (
  <div className="aspect-video bg-black rounded-lg overflow-hidden">
    {isDirectVideoFile(previewingLesson.videoUrl) ? (
      // Direct video file player
      <video
        controls
        className="w-full h-full"
        poster="" // You can add a thumbnail here if available
      >
        <source src={previewingLesson.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      // Embedded video (YouTube, Vimeo, etc.)
      (() => {
        const embeddableUrl = getEmbeddableVideoUrl(previewingLesson.videoUrl);
        return embeddableUrl ? (
          <iframe
            src={embeddableUrl}
            title={previewingLesson.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          // Fallback for unsupported URLs
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
            <Video className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-300 mb-4">Unable to embed this video</p>
            <a
              href={previewingLesson.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Video className="w-4 h-4 mr-2" />
              Watch in New Tab
            </a>
          </div>
        );
      })()
    )}
  </div>
) : (
  <div className="aspect-video bg-gray-700/50 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-400">No video available for this lesson</p>
    </div>
  </div>
)}


        {/* Lesson Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
            <p className="text-gray-300">
              {previewingLesson.description || 'No description provided for this lesson.'}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Lesson Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{previewingLesson.durationMinutes || 0} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order:</span>
                  <span className="text-white">#{previewingLesson.orderIndex + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Access:</span>
                  <span className={`${previewingLesson.isFree ? 'text-green-400' : 'text-purple-400'}`}>
                    {previewingLesson.isFree ? 'Free Preview' : 'Premium'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
        );
};

export default AdminCourseManagement;