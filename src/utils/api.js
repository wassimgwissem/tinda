// Import axios for making HTTP requests
import axios from "axios";

// Base URL for API endpoints
const API_URL = "http://localhost:5000/api";

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_URL, // Set base URL for all requests
    withCredentials: true // Enable sending cookies with requests (for authentication)
});

// Authentication API functions

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} Response data from server
 */
export const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    return res.data;
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.name - User name
 * @param {string} userData.password - User password
 * @param {File} userData.imageFile - Optional profile image
 * @param {string} userData.userType - Type of user (e.g., 'host', 'guest')
 * @returns {Promise} Response data from server
 */
export const register = async ({ email, name, password, imageFile, userType }) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('password', password);
    formData.append('userType', userType);

    // Append image file if provided
    if (imageFile) formData.append('image', imageFile);
    
    // Send POST request to register endpoint
    const res = await api.post('/register', formData);
    return res.data;
};

// Password reset functions

/**
 * Initiate password reset process
 * @param {string} email - User's email address
 * @returns {Promise} Response data from server
 */
export const updatePassword = async (email) => {
    const res = await api.post('/updatepassword', { email });
    return res.data;
}

/**
 * Verify password reset code
 * @param {string} email - User's email address
 * @param {string} code - Reset code received via email
 * @returns {Promise} Response data from server
 */
export async function verifyResetCode(email, code) {
    const res = await api.post('/verifycode', { email, code });
    return res.data;
}

/**
 * Reset user password with verified code
 * @param {string} email - User's email address
 * @param {string} code - Verified reset code
 * @param {string} newPassword - New password to set
 * @returns {Promise} Response data from server
 */
export async function resetPassword(email, code, newPassword) {
    const res = await api.post('/resetpassword', { email, code, newPassword });
    return res.data;
}

// User management functions

/**
 * Get all users (admin function)
 * @returns {Promise} Array of user objects
 */
export const getUsers = async () => {
    const res = await api.get('/users');
    return res.data;
};

/**
 * Update user profile
 * @param {string} id - User ID to update
 * @param {Object} data - Updated user data
 * @param {boolean} isMultipart - Whether the request contains file data
 * @returns {Promise} Updated user data
 */
export const updateUser = async (id, data, isMultipart = false) => {
    let config = {};
    if (isMultipart) {
        config.headers = {}; // Let browser set multipart headers automatically
    }
    const res = await api.put(`/users/${id}`, data, config);
    return res.data;
};

/**
 * Admin update user (similar to updateUser but with different endpoint)
 * @param {string} id - User ID to update
 * @param {Object} data - Updated user data
 * @param {boolean} isMultipart - Whether the request contains file data
 * @returns {Promise} Updated user data
 */
export const updateUsers = async (id, data, isMultipart = false) => {
    let config = {};
    
    if (isMultipart) {
        config.headers = {
            'Content-Type': 'multipart/form-data' // Explicitly set multipart header
        };
    }

    const res = await api.put(`/admin/users/${id}`, data, config);
    return res.data;
};

/**
 * Logout current user
 * @returns {Promise} Empty response
 */
export const logout = async () => {
    await api.post('/logout');
}

/**
 * Get current user's data
 * @returns {Promise} Current user's data
 */
export const getUser = async () => {
    const res = await api.get('/user');
    return res.data;
};

/**
 * Delete user by ID
 * @param {string} id - User ID to delete
 * @returns {Promise} Deletion confirmation
 */
export const deleteUser = async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
};

// Workspace management functions

/**
 * Create new workspace
 * @param {Object} data - Workspace data
 * @param {string} data.name - Workspace name
 * @param {string} data.location - Workspace location
 * @param {number} data.capacity - Maximum capacity
 * @param {number} data.price - Price per unit
 * @param {string} data.description - Description
 * @param {Array} data.amenities - List of amenities
 * @param {File} data.imageFile - Optional workspace image
 * @returns {Promise} Created workspace data
 */
export const createWorkspace = async (data) => {
  const formData = new FormData();
  
  // Append all workspace data to formData
  formData.append('name', data.name);
  formData.append('location', data.location);
  formData.append('capacity', data.capacity);
  formData.append('price', data.price);
  formData.append('description', data.description);
  formData.append('amenities', JSON.stringify(data.amenities));
  
  // Append image if provided
  if (data.imageFile) {
    formData.append('image', data.imageFile);
  }
  
  // Send POST request with multipart form data
  const res = await api.post('/workspaces', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // Required for file upload
    }
  });
  return res.data;
};

/**
 * Get all workspaces for current host
 * @returns {Promise} Array of workspace objects
 */
export const getWorkspaces = async () => {
  const res = await api.get('/workspaces');
  return res.data;
};

/**
 * Toggle workspace status (active/inactive)
 * @param {string} id - Workspace ID to toggle
 * @returns {Promise} Updated workspace data
 */
export const toggleWorkspaceStatus = async (id) => {
  const res = await api.put(`/workspaces/${id}/toggle`);
  return res.data;
};

/**
 * Update workspace details
 * @param {string} id - Workspace ID to update
 * @param {Object} data - Updated workspace data
 * @returns {Promise} Updated workspace data
 */
export const updateWorkspace = async (id, data) => {
  const res = await api.put(`/workspaces/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data' // Required if updating image
    }
  });
  return res.data;
};

/**
 * Get all active workspaces (public endpoint)
 * @returns {Promise} Array of active workspace objects
 */
export const getAllWorkspaces = async () => {
  const res = await api.get('/all-workspaces');
  return res.data;
};