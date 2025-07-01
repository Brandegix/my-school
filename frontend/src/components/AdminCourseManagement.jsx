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
    totalCourses: 24,
    publishedCourses: 18,
    totalEnrollments: 1247,
    recentEnrollments: 89,
    popularCourses: [
      { title: 'React Fundamentals', enrollments: 342 },
      { title: 'Python for Beginners', enrollments: 298 },
      { title: 'UI/UX Design Masterclass', enrollments: 256 }
    ]
  });

  // Mock courses data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses([
        {
          id: 1,
          title: 'React Fundamentals',
          description: 'Learn the basics of React including components, props, state, and hooks.',
          shortDescription: 'Master React from scratch',
          price: 99.99,
          category: 'Programming',
          difficultyLevel: 'Beginner',
          durationHours: 12,
          isPublished: true,
          enrollmentCount: 342,
          rating: 4.8,
          createdAt: '2024-01-15',
          lessons: [
            { id: 1, title: 'Introduction to React', duration: 45, orderIndex: 1 },
            { id: 2, title: 'Components and JSX', duration: 60, orderIndex: 2 },
            { id: 3, title: 'Props and State', duration: 75, orderIndex: 3 }
          ]
        },
        {
          id: 2,
          title: 'Advanced Node.js',
          description: 'Deep dive into Node.js with advanced concepts and real-world projects.',
          shortDescription: 'Master backend development',
          price: 149.99,
          category: 'Programming',
          difficultyLevel: 'Advanced',
          durationHours: 20,
          isPublished: false,
          enrollmentCount: 89,
          rating: 4.6,
          createdAt: '2024-02-10',
          lessons: [
            { id: 4, title: 'Express.js Deep Dive', duration: 90, orderIndex: 1 },
            { id: 5, title: 'Database Integration', duration: 120, orderIndex: 2 }
          ]
        },
        {
          id: 3,
          title: 'UI/UX Design Principles',
          description: 'Learn modern design principles and create stunning user interfaces.',
          shortDescription: 'Design beautiful interfaces',
          price: 79.99,
          category: 'Design',
          difficultyLevel: 'Intermediate',
          durationHours: 8,
          isPublished: true,
          enrollmentCount: 256,
          rating: 4.9,
          createdAt: '2024-01-28',
          lessons: []
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateCourse = () => {
    // Simulate course creation
    const newCourse = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price),
      durationHours: parseInt(formData.durationHours),
      enrollmentCount: 0,
      rating: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lessons: []
    };
    
    setCourses(prev => [newCourse, ...prev]);
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
    setShowCreateModal(false);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const handleTogglePublish = (courseId) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isPublished: !course.isPublished }
        : course
    ));
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'published' && course.isPublished) ||
                         (filterStatus === 'unpublished' && !course.isPublished);
    return matchesSearch && matchesFilter;
  });

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
                {statistics.popularCourses.map((course, index) => (
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
                ))}
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
              {filteredCourses.map((course) => (
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
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            {course.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{course.shortDescription}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${course.price}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.durationHours}h
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.enrollmentCount} enrolled
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            {course.rating || 'No ratings'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(course.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
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
                            <h5 className="text-white font-medium mb-3">Lessons ({course.lessons.length})</h5>
                            {course.lessons.length > 0 ? (
                              <div className="space-y-2">
                                {course.lessons.map((lesson) => (
                                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                    <span className="text-gray-300">{lesson.title}</span>
                                    <span className="text-gray-400 text-sm">{lesson.duration}min</span>
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
              ))}
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
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
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
      </div>
        );
};

export default AdminCourseManagement;