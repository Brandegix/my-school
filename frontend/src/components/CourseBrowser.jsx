import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Clock, Users, Star, Eye, ChevronDown, ChevronUp, Plus, Edit, Trash2, BookOpen, X, Heart, Loader2, ArrowLeft } from 'lucide-react'; // Import ArrowLeft for back icon

const CourseBrowser = () => {
  const [courses, setCourses] = useState([]); // Currently displayed courses (paginated and filtered by API)
  const [loading, setLoading] = useState(true); // Loading for main course fetch
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showMyCourses, setShowMyCourses] = useState(false);
  const [myEnrolledCourses, setMyEnrolledCourses] = useState([]);
  const [loadingMyCourses, setLoadingMyCourses] = useState(false);
  const [myCoursesError, setMyCoursesError] = useState(null);

  // State for favorites
  const [showMyFavorites, setShowMyFavorites] = useState(false);
  const [myFavoriteCourses, setMyFavoriteCourses] = useState([]);
  const [loadingMyFavorites, setLoadingMyFavorites] = useState(false);
  const [myFavoritesError, setMyFavoritesError] = useState(null);
  const [favoriteStatuses, setFavoriteStatuses] = useState({}); // Track which courses are favorited
  const [favoritingCourseId, setFavoritingCourseId] = useState(null); // New state for loading favorite action

  // State for the enrollment modal
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [sendingEnrollRequest, setSendingEnrollRequest] = useState(false);
  const [enrollRequestMessage, setEnrollRequestMessage] = useState('');

  // Hardcoded filter options
  const categories = ['Programming', 'Business', 'Design', 'Marketing', 'Data Science'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  // Debounce effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch courses from backend (for current page, filters, sort)
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 12,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
        sort_by: sortBy
      });

      const response = await fetch(`/api/courses?${params}`);
      if (!response.ok) throw new Error('Failed to fetch courses');

      const data = await response.json();
      setCourses(data.courses);
      setPagination(data.pagination);
      
      // Fetch favorite status for each course
      await fetchFavoriteStatuses(data.courses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorite statuses for courses
  const fetchFavoriteStatuses = async (coursesToCheck) => {
    // Only fetch if there are courses and we are not showing my favorites (as my favorites are already known to be favorites)
    if (!coursesToCheck || coursesToCheck.length === 0 || showMyFavorites) {
      return;
    }

    try {
      const statuses = {};
      // Using Promise.all to fetch statuses concurrently
      await Promise.all(
        coursesToCheck.map(async (course) => {
          try {
            const response = await fetch(`/api/courses/${course.id}/is-favorite`);
            if (response.ok) {
              const data = await response.json();
              statuses[course.id] = data.isFavorite;
            } else {
              // If not OK, assume not favorited or handle error specifically
              statuses[course.id] = false;
              console.warn(`Could not fetch favorite status for course ${course.id}. Status: ${response.status}`);
            }
          } catch (err) {
            console.error(`Error checking favorite status for course ${course.id}:`, err);
            statuses[course.id] = false; // Default to false on error
          }
        })
      );
      setFavoriteStatuses(prev => ({ ...prev, ...statuses }));
    } catch (err) {
      console.error('Error fetching favorite statuses overall:', err);
    }
  };

  // New function to fetch enrolled courses
  const fetchMyEnrolledCourses = async () => {
    setLoadingMyCourses(true);
    setMyCoursesError(null);
    try {
      const response = await fetch('/api/my-courses');
      if (!response.ok) throw new Error('Failed to fetch enrolled courses');
      const data = await response.json();
      const enrolledCourses = data.enrollments.map(enrollment => enrollment.course);
      setMyEnrolledCourses(enrolledCourses);
      
      // Fetch favorite status for enrolled courses
      await fetchFavoriteStatuses(enrolledCourses);
    } catch (err) {
      setMyCoursesError(err.message);
    } finally {
      setLoadingMyCourses(false);
    }
  };

  // New function to fetch favorite courses
  const fetchMyFavoriteCourses = async () => {
    setLoadingMyFavorites(true);
    setMyFavoritesError(null);
    try {
      const response = await fetch('/api/my-favorites');
      if (!response.ok) throw new Error('Failed to fetch favorite courses');
      const data = await response.json();
      setMyFavoriteCourses(data.favorites);
      
      // Mark all fetched courses as favorites immediately
      const newFavoriteStatuses = {};
      data.favorites.forEach(course => {
        newFavoriteStatuses[course.id] = true;
      });
      setFavoriteStatuses(newFavoriteStatuses); // Overwrite, as these are *all* favorites
    } catch (err) {
      setMyFavoritesError(err.message);
    } finally {
      setLoadingMyFavorites(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (courseId) => {
    // Prevent multiple clicks while an action is in progress for this course
    if (favoritingCourseId === courseId) {
      return;
    }

    const isCurrentlyFavorite = favoriteStatuses[courseId];
    setFavoritingCourseId(courseId); // Set loading state for this specific course

    try {
      const response = await fetch(`/api/courses/${courseId}/favorite`, {
        method: isCurrentlyFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update favorite status');
      }

      // Optimistically update local state for immediate feedback
      setFavoriteStatuses(prev => ({
        ...prev,
        [courseId]: !isCurrentlyFavorite
      }));

      // If we're currently showing favorites and we just unfavorited, remove it from the list
      if (showMyFavorites && isCurrentlyFavorite) {
        setMyFavoriteCourses(prev => prev.filter(course => course.id !== courseId));
      } else if (!showMyFavorites && !isCurrentlyFavorite) {
          // If we're on "All Courses" and just favorited, and the course is not in myFavoriteCourses,
          // we might want to refetch myFavoriteCourses to keep it updated in the background.
          // Or, more simply, just let the next click on "My Favorites" to refresh.
      }

    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert optimistic update on error
      setFavoriteStatuses(prev => ({
        ...prev,
        [courseId]: isCurrentlyFavorite // Revert to previous state
      }));
      // You might want to show a toast notification here
      alert(`Failed to update favorite status: ${err.message}`); // Using alert for now as a simple notification
    } finally {
      setFavoritingCourseId(null); // Clear loading state
    }
  };

  // Effect to refetch main courses when filters/pagination change
  useEffect(() => {
    if (!showMyCourses && !showMyFavorites) {
      fetchCourses();
    }
  }, [currentPage, debouncedSearchTerm, selectedCategory, selectedDifficulty, sortBy, showMyCourses, showMyFavorites]);

  // Fetch detailed course info including lessons
  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch course details');

      const courseData = await response.json();

      // Update the course in the appropriate list with detailed info
      const updateCourse = (course) => 
        course.id === courseId
          ? { ...course, lessons: courseData.lessons, isEnrolled: courseData.isEnrolled }
          : course;

      setCourses(prevCourses => prevCourses.map(updateCourse));
      setMyEnrolledCourses(prevEnrolled => prevEnrolled.map(updateCourse));
      setMyFavoriteCourses(prevFavorites => prevFavorites.map(updateCourse));
    } catch (err) {
      console.error('Error fetching course details:', err);
    }
  };

  const toggleCourseExpansion = async (courseId) => {
    const newExpanded = new Set(expandedCourses);

    if (expandedCourses.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
      
      // Check if we need to fetch details for this course from any of the lists
      const courseInCourses = courses.find(c => c.id === courseId);
      const courseInMyCourses = myEnrolledCourses.find(c => c.id === courseId);
      const courseInFavorites = myFavoriteCourses.find(c => c.id === courseId);

      if ((courseInCourses && !courseInCourses.lessons) || 
          (courseInMyCourses && !courseInMyCourses.lessons) ||
          (courseInFavorites && !courseInFavorites.lessons)) {
        await fetchCourseDetails(courseId);
      }
    }
    setExpandedCourses(newExpanded);
  };

  const handleEnroll = (courseId) => {
    setSelectedCourseForEnroll(courseId);
    setShowEnrollModal(true);
    setEnrollRequestMessage('');
    setUserEmail('');
  };

  const sendEnrollmentRequest = async () => {
    if (!userEmail) {
      setEnrollRequestMessage('Please enter your email.');
      return;
    }
    if (!selectedCourseForEnroll) {
      setEnrollRequestMessage('No course selected for enrollment.');
      return;
    }

    setSendingEnrollRequest(true);
    setEnrollRequestMessage('');

    try {
      const response = await fetch('/api/enrollment-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: selectedCourseForEnroll,
          user_email: userEmail,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse response as JSON:", jsonError);
        setEnrollRequestMessage(`Error: Unexpected server response. Status: ${response.status}`);
        setSendingEnrollRequest(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send enrollment request.');
      }

      setEnrollRequestMessage('Your enrollment request has been sent to the admin!');
      setTimeout(() => {
        setShowEnrollModal(false);
        setSelectedCourseForEnroll(null);
      }, 2000);
    } catch (err) {
      setEnrollRequestMessage(`Error: ${err.message}`);
    } finally {
      setSendingEnrollRequest(false);
    }
  };

  const formatDuration = (hours) => {
    if (!hours) return 'N/A';
    return hours === 1 ? '1h' : `${hours}h`;
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `${price} MAD`;
  };

  const handleMyCoursesClick = () => {
    setShowMyCourses(prev => !prev);
    setShowMyFavorites(false); // Hide favorites when showing enrolled courses
    
    if (!showMyCourses) {
      fetchMyEnrolledCourses();
    }
    resetFiltersAndPagination();
  };

  const handleMyFavoritesClick = () => {
    setShowMyFavorites(prev => !prev);
    setShowMyCourses(false); // Hide enrolled courses when showing favorites
    
    if (!showMyFavorites) {
      fetchMyFavoriteCourses();
    }
    resetFiltersAndPagination();
  };

  const resetFiltersAndPagination = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSortBy('created_at');
    setExpandedCourses(new Set());
  };

  // Determine which courses to display and which loading/error states to use
  let coursesToDisplay, currentLoadingState, currentErrorState, noCoursesMessage;

  if (showMyFavorites) {
    coursesToDisplay = myFavoriteCourses;
    currentLoadingState = loadingMyFavorites;
    currentErrorState = myFavoritesError;
    noCoursesMessage = "You haven't added any courses to favorites yet.";
  } else if (showMyCourses) {
    coursesToDisplay = myEnrolledCourses;
    currentLoadingState = loadingMyCourses;
    currentErrorState = myCoursesError;
    noCoursesMessage = "You haven't enrolled in any courses yet.";
  } else {
    coursesToDisplay = courses;
    currentLoadingState = loading; // This loading refers to the paginated fetch
    currentErrorState = error;
    noCoursesMessage = "No courses found matching your criteria.";
  }

  // Show full-page loader only if main courses are loading and none are displayed
  if (currentLoadingState && coursesToDisplay.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg flex items-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading courses...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            {!showMyCourses && !showMyFavorites && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  disabled={currentLoadingState} // Disable during loading
                />
              </div>
            )}

            {/* Filters */}
            {!showMyCourses && !showMyFavorites && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                  disabled={currentLoadingState} // Disable during loading
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                  disabled={currentLoadingState} // Disable during loading
                >
                  <option value="">All Levels</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                  disabled={currentLoadingState} // Disable during loading
                >
                  <option value="created_at">Newest</option>
                  <option value="title">Title A-Z</option>
                  <option value="price">Price</option>
                </select>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleMyFavoritesClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${showMyFavorites ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'}`}
                disabled={currentLoadingState} // Disable during loading
              >
                {showMyFavorites && <ArrowLeft className="w-4 h-4" />} {/* Arrow for "Show All Courses" */}
                <Heart className="w-4 h-4" />
                {showMyFavorites ? 'Show All Courses' : 'My Favorites'}
              </button>

              <button
                onClick={handleMyCoursesClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${showMyCourses ? 'bg-purple-700 hover:bg-purple-800' : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'}`}
                disabled={currentLoadingState} // Disable during loading
              >
                {showMyCourses && <ArrowLeft className="w-4 h-4" />} {/* Arrow for "Show All Courses" */}
                <BookOpen className="w-4 h-4" />
                {showMyCourses ? 'Show All Courses' : 'My Courses'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="max-w-7xl mx-auto px-6 py-6 relative">
        {currentErrorState && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 text-red-400">
            Error: {currentErrorState}
          </div>
        )}

        {/* Loading Overlay for filter/sort/pagination changes or API fetches for user-specific lists */}
        {currentLoadingState && coursesToDisplay.length > 0 && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-20 rounded-xl">
            <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
          </div>
        )}

        {coursesToDisplay.length === 0 && !currentLoadingState ? (
          <div className="text-center text-gray-400 py-10">
            {noCoursesMessage}
          </div>
        ) : (
          <div className="space-y-4">
            {coursesToDisplay.map((course) => (
              <div key={course.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                {/* Course Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.isPublished
                            ? 'bg-green-900/30 text-green-400 border border-green-800'
                            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {course.category && (
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-900/30 text-purple-400 border border-purple-800">
                            {course.category}
                          </span>
                        )}
                        {showMyFavorites && course.addedToFavoritesAt && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-900/30 text-red-400 border border-red-800">
                            Added {new Date(course.addedToFavoritesAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-white">{formatPrice(course.price)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(course.durationHours)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.totalEnrollments} enrolled</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{course.averageRating > 0 ? course.averageRating : 'No ratings'}</span>
                        </div>
                        <div className="text-xs">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {course.isEnrolled && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-400 border border-blue-800">
                          Enrolled
                        </span>
                      )}
                      
                      {/* Favorite Button with Loading Indicator */}
                      <button
                        onClick={() => toggleFavorite(course.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          favoriteStatuses[course.id] 
                            ? 'text-red-400 hover:bg-red-900/20' 
                            : 'text-gray-400 hover:bg-gray-700'
                        } ${favoritingCourseId === course.id ? 'cursor-not-allowed opacity-70' : ''}`}
                        title={favoriteStatuses[course.id] ? 'Remove from favorites' : 'Add to favorites'}
                        disabled={favoritingCourseId === course.id} // Disable during loading
                      >
                        {favoritingCourseId === course.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" /> // Spinner
                        ) : (
                          <Heart className={`w-5 h-5 ${favoriteStatuses[course.id] ? 'fill-current' : ''}`} />
                        )}
                      </button>

                      <button
                        onClick={() => toggleCourseExpansion(course.id)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {expandedCourses.has(course.id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Course Details */}
                {expandedCourses.has(course.id) && (
                  <div className="border-t border-gray-700">
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Description */}
                        <div>
                          <h4 className="text-lg font-medium mb-3">Description</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {course.description || 'No description available'}
                          </p>

                          {!course.isEnrolled && (
                            <button
                              onClick={() => handleEnroll(course.id)}
                              className="mt-4 bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                            >
                              Enroll Now
                            </button>
                          )}
                        </div>

                        {/* Lessons */}
                        <div>
                          <h4 className="text-lg font-medium mb-3">
                            Lessons ({course.totalLessons || 0})
                          </h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {course.lessons ? (
                              course.lessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{lesson.title}</span>
                                      {lesson.isFree && (
                                        <span className="px-1.5 py-0.5 text-xs bg-green-900/30 text-green-400 rounded border border-green-800">
                                          Free
                                        </span>
                                      )}
                                    </div>
                                    {lesson.description && (
                                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                        {lesson.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    {lesson.durationMinutes && (
                                      <span>{lesson.durationMinutes}min</span>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-400 text-sm">Loading lessons...</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!showMyCourses && !showMyFavorites && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={!pagination.has_prev || currentLoadingState}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                    }`}
                    disabled={currentLoadingState}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
              disabled={!pagination.has_next || currentLoadingState}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Enrollment Request Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowEnrollModal(false)}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">Request Enrollment</h3>
            <p className="text-gray-300 mb-4">
              Enter your email to send an enrollment request for "
              {courses.find(c => c.id === selectedCourseForEnroll)?.title ||
                myEnrolledCourses.find(c => c.id === selectedCourseForEnroll)?.title ||
                'selected course'}
              " to the admin.
            </p>
            <input
              type="email"
              placeholder="Your Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 mb-4"
            />
            {enrollRequestMessage && (
              <p className={`text-sm mb-4 ${enrollRequestMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {enrollRequestMessage}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                disabled={sendingEnrollRequest}
              >
                Cancel
              </button>
              <button
                onClick={sendEnrollmentRequest}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                disabled={sendingEnrollRequest}
              >
                {sendingEnrollRequest ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBrowser;
