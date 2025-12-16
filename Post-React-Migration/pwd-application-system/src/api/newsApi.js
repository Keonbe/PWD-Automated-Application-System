/**
 * News API Service
 * 
 * API wrapper for news & announcements feature
 * Handles all news-related API calls to the PHP backend
 */

import { PHP_BASE_URL as API_BASE } from './config';

// ============================================================================
// PUBLIC API FUNCTIONS
// ============================================================================

/**
 * Get published news posts with pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Posts per page (default: 10)
 * @param {string} options.category - Filter by category (optional)
 * @returns {Promise<Object>} - Posts array with pagination metadata
 */
export const getPublishedNews = async ({ page = 1, limit = 10, category = '' } = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (category) {
      params.append('category', category);
    }
    
    const response = await fetch(`${API_BASE}/news-get-published.php?${params}`, {
      method: 'GET'
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch news');
    }
    
    return {
      posts: data.posts || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    };
  } catch (error) {
    console.error('Error fetching published news:', error);
    throw error;
  }
};

/**
 * Get a single news post by slug or ID
 * @param {string|number} identifier - Post slug (string) or ID (number)
 * @returns {Promise<Object>} - Single post object
 */
export const getSinglePost = async (identifier) => {
  try {
    const isSlug = typeof identifier === 'string' && isNaN(identifier);
    const param = isSlug ? `slug=${encodeURIComponent(identifier)}` : `id=${identifier}`;
    
    const response = await fetch(`${API_BASE}/news-get-single.php?${param}`, {
      method: 'GET'
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch post');
    }
    
    return data.post;
  } catch (error) {
    console.error('Error fetching single post:', error);
    throw error;
  }
};

// ============================================================================
// ADMIN API FUNCTIONS
// ============================================================================

/**
 * Get all news posts (admin view - includes drafts and archived)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Posts per page (default: 20)
 * @param {string} options.status - Filter by status: 'all', 'draft', 'published', 'archived'
 * @returns {Promise<Object>} - Posts array with pagination and status counts
 */
export const getAdminNews = async ({ page = 1, limit = 20, status = 'all' } = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status
    });
    
    const response = await fetch(`${API_BASE}/news-admin-get-all.php?${params}`, {
      method: 'GET'
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch news');
    }
    
    return {
      posts: data.posts || [],
      pagination: data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
      statusCounts: data.statusCounts || { draft: 0, published: 0, archived: 0, all: 0 }
    };
  } catch (error) {
    console.error('Error fetching admin news:', error);
    throw error;
  }
};

/**
 * Create a new news post
 * @param {Object} postData - Post data
 * @param {string} postData.title - Post title (required)
 * @param {string} postData.excerpt - Short description (required)
 * @param {string} postData.content - Full HTML content (required)
 * @param {string} postData.status - 'draft' or 'published' (default: 'draft')
 * @param {string} postData.category - Post category (optional)
 * @param {string} postData.imagePath - Path to uploaded image (optional)
 * @param {string} postData.imageAlt - Image alt text (optional)
 * @param {string} postData.createdBy - Admin email (default: 'admin@dasma.gov.ph')
 * @returns {Promise<Object>} - Created post info with ID and slug
 */
export const createNews = async (postData) => {
  try {
    const response = await fetch(`${API_BASE}/news-admin-create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create post');
    }
    
    return {
      postId: data.postId,
      slug: data.slug,
      message: data.message
    };
  } catch (error) {
    console.error('Error creating news post:', error);
    throw error;
  }
};

/**
 * Update an existing news post
 * @param {number} postId - Post ID to update
 * @param {Object} updateData - Fields to update (all optional)
 * @returns {Promise<Object>} - Update result
 */
export const updateNews = async (postId, updateData) => {
  try {
    const response = await fetch(`${API_BASE}/news-admin-update.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: postId, ...updateData })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update post');
    }
    
    return {
      postId: data.postId,
      message: data.message
    };
  } catch (error) {
    console.error('Error updating news post:', error);
    throw error;
  }
};

/**
 * Delete a news post
 * @param {number} postId - Post ID to delete
 * @returns {Promise<Object>} - Delete result
 */
export const deleteNews = async (postId) => {
  try {
    const response = await fetch(`${API_BASE}/news-admin-delete.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: postId })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete post');
    }
    
    return {
      deletedPost: data.deletedPost,
      message: data.message
    };
  } catch (error) {
    console.error('Error deleting news post:', error);
    throw error;
  }
};

/**
 * Upload news image
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} - Upload result with file path
 */
export const uploadNewsImage = async (imageFile) => {
  console.log('[uploadNewsImage] Starting upload...');
  console.log('[uploadNewsImage] File:', imageFile.name, imageFile.type, `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);
  
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    console.log('[uploadNewsImage] Sending to:', `${API_BASE}/news-upload-image.php`);
    
    const response = await fetch(`${API_BASE}/news-upload-image.php`, {
      method: 'POST',
      body: formData
    });
    
    console.log('[uploadNewsImage] Response status:', response.status);
    
    const data = await response.json();
    console.log('[uploadNewsImage] Response data:', data);
    
    if (!data.success) {
      console.error('❌ [uploadNewsImage] Server error:', data.error);
      throw new Error(data.error || 'Failed to upload image');
    }
    
    console.log('✅ [uploadNewsImage] Upload successful:', data.data.path);
    
    return {
      filename: data.data.filename,
      path: data.data.path,
      url: data.data.url,
      size: data.data.size,
      mimeType: data.data.mimeType
    };
  } catch (error) {
    console.error('❌ [uploadNewsImage] Error:', error);
    throw error;
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatNewsDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return formatNewsDate(dateString);
};

// Default export with all functions
const newsApi = {
  // Public
  getPublishedNews,
  getSinglePost,
  // Admin
  getAdminNews,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsImage,
  // Utils
  formatNewsDate,
  getRelativeTime
};

export default newsApi;
