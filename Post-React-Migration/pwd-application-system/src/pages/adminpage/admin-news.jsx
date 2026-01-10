import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@components/adminsidebar";
import {
  getAdminNews,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsImage,
  formatNewsDate,
} from "@api/newsApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "@assets/styles/adminpage.css";

/**
 * AdminNews Component - News Management Dashboard
 *
 * Features:
 * - View all news posts (draft, published, archived)
 * - Create new news posts
 * - Edit existing posts
 * - Delete posts
 * - Image upload support
 * - Status filtering
 */

const AdminNews = () => {
  const navigate = useNavigate();

  // State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    draft: 0,
    published: 0,
    archived: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
    category: "",
    imagePath: "",
    imageAlt: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // Field-level validation errors
  const [imageError, setImageError] = useState(""); // Image-specific error

  /**
   * Scroll to section in help modal
   */
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /**
   * Fetch news posts from API
   */
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAdminNews({
        page: currentPage,
        limit: 10,
        status: statusFilter,
      });
      setPosts(result.posts);
      setStatusCounts(result.statusCounts);
      setTotalPages(result.pagination.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle image file selection
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError(""); // Clear previous error
    console.log("File selected:", file ? file.name : "No file");

    if (file) {
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        const errorMsg = `❌ Invalid file type "${file.type}". Please upload JPG, PNG, GIF, or WebP only.`;
        console.log("❌ File rejected: Invalid type", file.type);
        setImageError(errorMsg);
        setImageFile(null);
        e.target.value = ""; // Reset file input
        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
        const errorMsg = `❌ File too large (${fileSizeMB} MB). Maximum size is 5 MB.`;
        console.log("❌ File rejected: Too large", file.size);
        setImageError(errorMsg);
        setImageFile(null);
        e.target.value = ""; // Reset file input
        return;
      }

      console.log("✅ File accepted, ready for upload");
      setImageFile(file);
      setImageError("");
    }
  };

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters";
    } else if (formData.title.trim().length > 255) {
      errors.title = "Title must be less than 255 characters";
    }

    if (!formData.excerpt.trim()) {
      errors.excerpt = "Excerpt is required";
    } else if (formData.excerpt.trim().length < 10) {
      errors.excerpt = "Excerpt must be at least 10 characters";
    } else if (formData.excerpt.trim().length > 500) {
      errors.excerpt = "Excerpt must be less than 500 characters";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    } else if (formData.content.trim().length < 20) {
      errors.content = "Content must be at least 20 characters";
    }

    if (!formData.category) {
      errors.category = "Please select a category";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Reset form to default state
   */
  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      status: "draft",
      category: "",
      imagePath: "",
      imageAlt: "",
    });
    setImageFile(null);
    setFormError("");
    setFieldErrors({});
    setImageError("");
    setSelectedPost(null);
  };

  /**
   * Open create modal
   */
  const handleOpenCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  /**
   * Open edit modal with post data
   */
  const handleOpenEdit = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      status: post.status || "draft",
      category: post.category || "",
      imagePath: post.imagePath || "",
      imageAlt: post.imageAlt || "",
    });
    setImageFile(null);
    setFormError("");
    setFieldErrors({});
    setImageError("");
    setShowEditModal(true);
  };

  /**
   * Open delete confirmation modal
   */
  const handleOpenDelete = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  /**
   * Create new post
   */
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate form first
    if (!validateForm()) {
      setFormError("Please fix the errors below before submitting.");
      return;
    }

    // Check for image error
    if (imageError) {
      setFormError("Please fix the image error before submitting.");
      return;
    }

    setFormLoading(true);

    try {
      // Upload image if selected
      let imagePath = "";
      if (imageFile) {
        try {
          const uploadResult = await uploadNewsImage(imageFile);
          imagePath = uploadResult.path;
          console.log("✅ Image uploaded successfully:", uploadResult);
        } catch (uploadErr) {
          console.error("❌ Image upload failed:", uploadErr);
          setFormError(`❌ Image upload failed: ${uploadErr.message}`);
          setFormLoading(false);
          return; // Stop if image upload fails
        }
      }

      await createNews({
        ...formData,
        imagePath: imagePath || formData.imagePath,
      });

      setShowCreateModal(false);
      resetForm();
      fetchNews();
    } catch (err) {
      setFormError(`❌ Failed to create post: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Update existing post
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedPost) return;

    setFormError("");

    // Validate form first
    if (!validateForm()) {
      setFormError("Please fix the errors below before submitting.");
      return;
    }

    // Check for image error
    if (imageError) {
      setFormError("Please fix the image error before submitting.");
      return;
    }

    setFormLoading(true);

    try {
      // Upload new image if selected
      let imagePath = formData.imagePath;
      if (imageFile) {
        try {
          const uploadResult = await uploadNewsImage(imageFile);
          imagePath = uploadResult.path;
          console.log("✅ Image uploaded successfully:", uploadResult);
        } catch (uploadErr) {
          console.error("❌ Image upload failed:", uploadErr);
          setFormError(`❌ Image upload failed: ${uploadErr.message}`);
          setFormLoading(false);
          return; // Stop if image upload fails
        }
      }

      await updateNews(selectedPost.id, {
        ...formData,
        imagePath,
      });

      setShowEditModal(false);
      resetForm();
      fetchNews();
    } catch (err) {
      setFormError(`❌ Failed to update post: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Delete post
   */
  const handleDelete = async () => {
    if (!selectedPost) return;

    setFormLoading(true);
    setFormError("");
    try {
      const result = await deleteNews(selectedPost.id);
      console.log("Delete result:", result);
      setShowDeleteModal(false);
      setSelectedPost(null);
      await fetchNews();
    } catch (err) {
      console.error("Failed to delete post:", err);
      setFormError(err.message || "Failed to delete post. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Get status badge class
   */
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "published":
        return "bg-success";
      case "draft":
        return "bg-warning text-dark";
      case "archived":
        return "bg-secondary";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar />
      <main className="admin-content">
        <div className="container-fluid p-4">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <div>
              <h1 className="h3 mb-0">News Management</h1>
              <p className="text-muted mb-0 d-none d-sm-block">
                Create and manage news posts
              </p>
            </div>
            <div
              className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto"
              style={{ maxWidth: "300px" }}>
              <button
                className="btn btn-outline-secondary flex-grow-1"
                onClick={() => setShowHelpModal(true)}
                title="Help & Guide">
                <i className="fas fa-question-circle me-2"></i>
                Help
              </button>
              <button
                className="btn btn-success flex-grow-1"
                onClick={handleOpenCreate}>
                <i className="fas fa-plus me-2"></i>
                Create Post
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="card mb-4">
            <div className="card-body p-2">
              <div className="row g-2" role="group">
                {["all", "published", "draft", "archived"].map((status) => (
                  <div key={status} className="col-6 col-sm-3">
                    <button
                      type="button"
                      className={`btn w-100 ${
                        statusFilter === status
                          ? "btn-success"
                          : "btn-outline-success"
                      }`}
                      onClick={() => {
                        setStatusFilter(status);
                        setCurrentPage(1);
                      }}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                      <span className="badge bg-light text-dark ms-1">
                        {statusCounts[status] || 0}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Posts Table */}
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No posts found</h5>
                  <p className="text-muted">
                    Create your first news post to get started.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th className="d-none d-lg-table-cell">Category</th>
                        <th className="d-none d-md-table-cell">Views</th>
                        <th className="d-none d-md-table-cell">Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr key={post.id}>
                          <td>
                            <div
                              className="fw-medium text-truncate"
                              style={{ maxWidth: "200px" }}>
                              {post.title}
                            </div>
                            <small
                              className="text-muted d-none d-sm-block text-truncate"
                              style={{ maxWidth: "180px" }}>
                              {post.slug}
                            </small>
                          </td>
                          <td>
                            <span
                              className={`badge ${getStatusBadgeClass(
                                post.status
                              )}`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="d-none d-lg-table-cell">
                            {post.category || "-"}
                          </td>
                          <td className="d-none d-md-table-cell">
                            {post.viewCount || 0}
                          </td>
                          <td className="d-none d-md-table-cell">
                            {formatNewsDate(post.createdAt)}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleOpenEdit(post)}
                                title="Edit">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleOpenDelete(post)}
                                title="Delete">
                                <i className="fas fa-trash"></i>
                              </button>
                              {post.status === "published" && (
                                <a
                                  href={`/news/${post.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-success"
                                  title="View">
                                  <i className="fas fa-eye"></i>
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center mb-0">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}>
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            overflow: "auto",
          }}>
          <div
            className="modal-dialog modal-lg"
            style={{ margin: "1.75rem auto" }}>
            <div
              className="modal-content"
              style={{
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}>
              <div className="modal-header" style={{ flexShrink: 0 }}>
                <h5 className="modal-title">
                  {showCreateModal ? "Create New Post" : "Edit Post"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}></button>
              </div>
              <form
                onSubmit={showCreateModal ? handleCreate : handleUpdate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  flex: 1,
                }}>
                <div
                  className="modal-body"
                  style={{ overflowY: "auto", flex: 1 }}>
                  {formError && (
                    <div className="alert alert-danger">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {formError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        fieldErrors.title
                          ? "is-invalid"
                          : formData.title.trim().length >= 5
                          ? "is-valid"
                          : ""
                      }`}
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter post title (min 5 characters)"
                    />
                    {fieldErrors.title && (
                      <div className="invalid-feedback">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {fieldErrors.title}
                      </div>
                    )}
                    <small className="text-muted">
                      {formData.title.length}/255 characters
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Excerpt *</label>
                    <textarea
                      className={`form-control ${
                        fieldErrors.excerpt
                          ? "is-invalid"
                          : formData.excerpt.trim().length >= 10
                          ? "is-valid"
                          : ""
                      }`}
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Brief description for preview cards (min 10 characters)"
                    />
                    {fieldErrors.excerpt && (
                      <div className="invalid-feedback">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {fieldErrors.excerpt}
                      </div>
                    )}
                    <small className="text-muted">
                      {formData.excerpt.length}/500 characters
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Content * (HTML supported)
                    </label>
                    <textarea
                      className={`form-control ${
                        fieldErrors.content
                          ? "is-invalid"
                          : formData.content.trim().length >= 20
                          ? "is-valid"
                          : ""
                      }`}
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows="8"
                      placeholder="Full article content - HTML tags supported (min 20 characters)"
                    />
                    {fieldErrors.content && (
                      <div className="invalid-feedback">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {fieldErrors.content}
                      </div>
                    )}
                    <small className="text-muted">
                      {formData.content.length} characters
                    </small>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className={`form-select ${
                          fieldErrors.category
                            ? "is-invalid"
                            : formData.category
                            ? "is-valid"
                            : ""
                        }`}
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}>
                        <option value="">-- Select Category --</option>
                        <option value="Announcement">Announcement</option>
                        <option value="Event">Event</option>
                        <option value="Service Update">Service Update</option>
                        <option value="Advisory">Advisory</option>
                        <option value="Community">Community</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                      {fieldErrors.category && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-triangle me-1"></i>
                          {fieldErrors.category}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Featured Image</label>
                    <input
                      type="file"
                      className={`form-control ${
                        imageError ? "is-invalid" : imageFile ? "is-valid" : ""
                      }`}
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                    />
                    {imageError && (
                      <div className="invalid-feedback d-block">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {imageError}
                      </div>
                    )}
                    <small className="text-muted d-block mt-1">
                      <i className="fas fa-info-circle me-1"></i>
                      Max 5MB. Supported formats: JPG, PNG, GIF, WebP
                    </small>
                    {formData.imagePath && !imageFile && !imageError && (
                      <div className="mt-2 alert alert-info py-1 px-2">
                        <small>
                          <i className="fas fa-image me-1"></i>
                          Current image: {formData.imagePath}
                        </small>
                      </div>
                    )}
                    {imageFile && !imageError && (
                      <div className="mt-2 alert alert-success py-1 px-2">
                        <small>
                          <i className="fas fa-check-circle me-1"></i>
                          Ready to upload: {imageFile.name} (
                          {(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image Alt Text</label>
                    <input
                      type="text"
                      className="form-control"
                      name="imageAlt"
                      value={formData.imageAlt}
                      onChange={handleInputChange}
                      placeholder="Description for accessibility"
                    />
                  </div>
                </div>
                <div className="modal-footer" style={{ flexShrink: 0 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    disabled={formLoading}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        {showCreateModal ? "Create Post" : "Save Changes"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPost && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedPost(null);
                    setFormError("");
                  }}></button>
              </div>
              <div className="modal-body">
                {formError && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {formError}
                  </div>
                )}
                <p>Are you sure you want to delete this post?</p>
                <div className="alert alert-warning">
                  <strong>{selectedPost.title}</strong>
                  <br />
                  <small className="text-muted">
                    This action cannot be undone.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedPost(null);
                    setFormError("");
                  }}
                  disabled={formLoading}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash me-2"></i>
                      Delete Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Help Modal */}
      {showHelpModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            overflow: "auto",
          }}>
          <div
            className="modal-dialog modal-lg"
            style={{ margin: "1.75rem auto" }}>
            <div
              className="modal-content"
              style={{
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}>
              <div
                className="modal-header bg-success text-white"
                style={{ flexShrink: 0 }}>
                <h5 className="modal-title">
                  <i className="fas fa-book-open me-2"></i>
                  News Management Guide
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowHelpModal(false)}></button>
              </div>
              <div
                className="modal-body"
                style={{ overflowY: "auto", flex: 1 }}>
                {/* Introduction */}
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Welcome to the News Management System!</strong>
                  <p className="mb-0 mt-2">
                    This guide will help you create, edit, and manage news posts
                    that appear on the PWD Application System website. News
                    posts help keep PWD applicants and the community informed
                    about important announcements, events, and updates.
                  </p>
                </div>

                {/* Table of Contents */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <strong>
                      <i className="fas fa-list me-2"></i>Quick Navigation
                    </strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="list-unstyled mb-0">
                          <li>
                            <a
                              href="#help-overview"
                              onClick={(e) =>
                                scrollToSection(e, "help-overview")
                              }
                              className="text-decoration-none">
                              📋 Overview
                            </a>
                          </li>
                          <li>
                            <a
                              href="#help-creating"
                              onClick={(e) =>
                                scrollToSection(e, "help-creating")
                              }
                              className="text-decoration-none">
                              ✏️ Creating a New Post
                            </a>
                          </li>
                          <li>
                            <a
                              href="#help-editing"
                              onClick={(e) =>
                                scrollToSection(e, "help-editing")
                              }
                              className="text-decoration-none">
                              📝 Editing Posts
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="list-unstyled mb-0">
                          <li>
                            <a
                              href="#help-status"
                              onClick={(e) => scrollToSection(e, "help-status")}
                              className="text-decoration-none">
                              🔄 Post Status Guide
                            </a>
                          </li>
                          <li>
                            <a
                              href="#help-images"
                              onClick={(e) => scrollToSection(e, "help-images")}
                              className="text-decoration-none">
                              🖼️ Adding Images
                            </a>
                          </li>
                          <li>
                            <a
                              href="#help-tips"
                              onClick={(e) => scrollToSection(e, "help-tips")}
                              className="text-decoration-none">
                              💡 Tips & Best Practices
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overview Section */}
                <div id="help-overview" className="mb-4">
                  <h5 className="text-success border-bottom pb-2">
                    <i className="fas fa-clipboard-list me-2"></i>
                    Overview: Understanding the Dashboard
                  </h5>
                  <p>
                    The News Management dashboard displays all your news posts
                    in a table format. Here's what each column means:
                  </p>
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Column</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Title</strong>
                        </td>
                        <td>
                          The headline of your news post. The smaller text below
                          shows the URL-friendly version (slug).
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Status</strong>
                        </td>
                        <td>
                          Shows if the post is Draft (not visible), Published
                          (live on website), or Archived (hidden but saved).
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Category</strong>
                        </td>
                        <td>
                          The type of post (e.g., Announcement, Event, Update).
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Views</strong>
                        </td>
                        <td>
                          How many times the post has been read by visitors.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Created</strong>
                        </td>
                        <td>When the post was first created.</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Actions</strong>
                        </td>
                        <td>Buttons to Edit, Delete, or View the post.</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="alert alert-secondary">
                    <strong>Filter Tabs:</strong> Use the tabs at the top (All,
                    Published, Draft, Archived) to quickly filter posts by their
                    status.
                  </div>
                </div>

                {/* Creating Posts Section */}
                <div id="help-creating" className="mb-4">
                  <h5 className="text-success border-bottom pb-2">
                    <i className="fas fa-plus-circle me-2"></i>
                    Creating a New Post
                  </h5>
                  <ol className="list-group list-group-numbered mb-3">
                    <li className="list-group-item">
                      <strong>Click the green "Create Post" button</strong> in
                      the top-right corner of the page.
                    </li>
                    <li className="list-group-item">
                      <strong>Fill in the required fields:</strong>
                      <ul className="mt-2">
                        <li>
                          <strong>Title:</strong> Enter a clear, descriptive
                          headline (e.g., "New PWD ID Cards Now Available")
                        </li>
                        <li>
                          <strong>Excerpt:</strong> Write a brief 1-2 sentence
                          summary that will appear in preview cards
                        </li>
                        <li>
                          <strong>Content:</strong> Write the full article
                          content (see formatting tips below)
                        </li>
                      </ul>
                    </li>
                    <li className="list-group-item">
                      <strong>Set the Status:</strong>
                      <ul className="mt-2">
                        <li>
                          <span className="badge bg-warning text-dark">
                            Draft
                          </span>{" "}
                          - Save without publishing (only you can see it)
                        </li>
                        <li>
                          <span className="badge bg-success">Published</span> -
                          Make it live on the website immediately
                        </li>
                      </ul>
                    </li>
                    <li className="list-group-item">
                      <strong>Add a Category</strong> (optional but recommended)
                      - Examples: "Announcement", "Event", "Service Update",
                      "Community"
                    </li>
                    <li className="list-group-item">
                      <strong>Upload a Featured Image</strong> (optional) - This
                      image will appear at the top of the article
                    </li>
                    <li className="list-group-item">
                      <strong>Click "Create Post"</strong> to save your news
                      article
                    </li>
                  </ol>
                </div>

                {/* Editing Posts Section */}
                <div id="help-editing" className="mb-4">
                  <h5 className="text-success border-bottom pb-2">
                    <i className="fas fa-edit me-2"></i>
                    Editing Existing Posts
                  </h5>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h6>
                        <i className="fas fa-mouse-pointer me-2"></i>How to
                        Edit:
                      </h6>
                      <ol>
                        <li>Find the post you want to edit in the table</li>
                        <li>
                          Click the{" "}
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="fas fa-edit"></i>
                          </button>{" "}
                          (Edit) button in the Actions column
                        </li>
                        <li>Make your changes in the form that appears</li>
                        <li>Click "Save Changes" to update the post</li>
                      </ol>
                    </div>
                  </div>
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Important:</strong> Changes to published posts are
                    immediate. Visitors will see the updated content right away.
                  </div>
                </div>

                {/* Status Guide Section */}
                <div id="help-status" className="mb-4">
                  <h5 className="text-success border-bottom pb-2">
                    <i className="fas fa-toggle-on me-2"></i>
                    Understanding Post Status
                  </h5>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <div className="card h-100 border-warning">
                        <div className="card-header bg-warning text-dark">
                          <strong>Draft</strong>
                        </div>
                        <div className="card-body">
                          <p className="small mb-2">
                            The post is saved but <strong>NOT visible</strong>{" "}
                            to the public.
                          </p>
                          <p className="small mb-0">
                            <strong>Use when:</strong>
                          </p>
                          <ul className="small mb-0">
                            <li>You're still writing the article</li>
                            <li>Waiting for approval</li>
                            <li>Need to review before publishing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card h-100 border-success">
                        <div className="card-header bg-success text-white">
                          <strong>Published</strong>
                        </div>
                        <div className="card-body">
                          <p className="small mb-2">
                            The post is <strong>live and visible</strong> on the
                            website.
                          </p>
                          <p className="small mb-0">
                            <strong>Use when:</strong>
                          </p>
                          <ul className="small mb-0">
                            <li>Article is complete and approved</li>
                            <li>Ready for public viewing</li>
                            <li>Time-sensitive announcements</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card h-100 border-secondary">
                        <div className="card-header bg-secondary text-white">
                          <strong>Archived</strong>
                        </div>
                        <div className="card-body">
                          <p className="small mb-2">
                            The post is <strong>hidden</strong> but kept for
                            records.
                          </p>
                          <p className="small mb-0">
                            <strong>Use when:</strong>
                          </p>
                          <ul className="small mb-0">
                            <li>Event has passed</li>
                            <li>Information is outdated</li>
                            <li>Want to keep but not display</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div id="help-images" className="mb-4">
                  <h5 className="text-success border-bottom pb-2">
                    <i className="fas fa-image me-2"></i>
                    Adding Featured Images
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-primary">Supported Image Types:</h6>
                      <ul>
                        <li>
                          <strong>JPG/JPEG</strong> - Best for photographs
                        </li>
                        <li>
                          <strong>PNG</strong> - Best for graphics with text
                        </li>
                        <li>
                          <strong>GIF</strong> - Supports animation
                        </li>
                        <li>
                          <strong>WebP</strong> - Modern format, smaller files
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-primary">Requirements:</h6>
                      <ul>
                        <li>
                          Maximum file size: <strong>5 MB</strong>
                        </li>
                        <li>
                          Recommended dimensions:{" "}
                          <strong>1200 x 630 pixels</strong>
                        </li>
                        <li>Landscape orientation works best</li>
                      </ul>
                    </div>
                  </div>
                  <div className="alert alert-info">
                    <i className="fas fa-universal-access me-2"></i>
                    <strong>Accessibility Tip:</strong> Always fill in the
                    "Image Alt Text" field with a description of the image. This
                    helps visually impaired users understand what the image
                    shows. Example: "Mayor presenting PWD ID cards to residents
                    at City Hall"
                  </div>
                </div>

                {/* Tips Section */}
                <div id="help-tips" className="mb-4">
                  <h5 className="text-success border-bottom pb-2">
                    <i className="fas fa-lightbulb me-2"></i>
                    Tips & Best Practices
                  </h5>

                  <div className="accordion" id="tipsAccordion">
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#tipWriting">
                          ✍️ Writing Effective News Posts
                        </button>
                      </h2>
                      <div
                        id="tipWriting"
                        className="accordion-collapse collapse show"
                        data-bs-parent="#tipsAccordion">
                        <div className="accordion-body">
                          <ul>
                            <li>
                              <strong>Keep titles clear and concise</strong> -
                              Use action words and be specific
                            </li>
                            <li>
                              <strong>Put important information first</strong> -
                              Readers may not read the whole article
                            </li>
                            <li>
                              <strong>Use simple language</strong> - Avoid
                              jargon and technical terms
                            </li>
                            <li>
                              <strong>Include dates and deadlines</strong> -
                              When applicable, always mention specific dates
                            </li>
                            <li>
                              <strong>Add contact information</strong> - Let
                              readers know who to contact for questions
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#tipFormatting">
                          📄 Formatting Your Content
                        </button>
                      </h2>
                      <div
                        id="tipFormatting"
                        className="accordion-collapse collapse"
                        data-bs-parent="#tipsAccordion">
                        <div className="accordion-body">
                          <p>
                            The content field supports HTML formatting. Here are
                            some useful tags:
                          </p>
                          <table className="table table-sm table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th>To Create</th>
                                <th>Type This</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>New paragraph</td>
                                <td>
                                  <code>&lt;p&gt;Your text here&lt;/p&gt;</code>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>Bold text</strong>
                                </td>
                                <td>
                                  <code>&lt;strong&gt;text&lt;/strong&gt;</code>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <em>Italic text</em>
                                </td>
                                <td>
                                  <code>&lt;em&gt;text&lt;/em&gt;</code>
                                </td>
                              </tr>
                              <tr>
                                <td>Section heading</td>
                                <td>
                                  <code>&lt;h3&gt;Heading&lt;/h3&gt;</code>
                                </td>
                              </tr>
                              <tr>
                                <td>Bullet list</td>
                                <td>
                                  <code>
                                    &lt;ul&gt;&lt;li&gt;Item
                                    1&lt;/li&gt;&lt;li&gt;Item
                                    2&lt;/li&gt;&lt;/ul&gt;
                                  </code>
                                </td>
                              </tr>
                              <tr>
                                <td>Numbered list</td>
                                <td>
                                  <code>
                                    &lt;ol&gt;&lt;li&gt;First&lt;/li&gt;&lt;li&gt;Second&lt;/li&gt;&lt;/ol&gt;
                                  </code>
                                </td>
                              </tr>
                              <tr>
                                <td>Link</td>
                                <td>
                                  <code>
                                    &lt;a href="https://..."&gt;Click
                                    here&lt;/a&gt;
                                  </code>
                                </td>
                              </tr>
                              <tr>
                                <td>Line break</td>
                                <td>
                                  <code>&lt;br&gt;</code>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="alert alert-secondary mt-2">
                            <strong>Don't know HTML?</strong> You can simply
                            type your content with blank lines between
                            paragraphs. It will still be readable, though
                            without special formatting.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#tipCategories">
                          🏷️ Choosing Categories
                        </button>
                      </h2>
                      <div
                        id="tipCategories"
                        className="accordion-collapse collapse"
                        data-bs-parent="#tipsAccordion">
                        <div className="accordion-body">
                          <p>
                            Use consistent categories to help readers find
                            related content:
                          </p>
                          <div className="row">
                            <div className="col-md-6">
                              <ul>
                                <li>
                                  <strong>Announcement</strong> - Official
                                  notices
                                </li>
                                <li>
                                  <strong>Event</strong> - Upcoming activities
                                </li>
                                <li>
                                  <strong>Service Update</strong> - Changes to
                                  services
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6">
                              <ul>
                                <li>
                                  <strong>Community</strong> - Community stories
                                </li>
                                <li>
                                  <strong>Advisory</strong> - Important alerts
                                </li>
                                <li>
                                  <strong>Partnership</strong> - Collaborations
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#tipDelete">
                          🗑️ Deleting vs Archiving
                        </button>
                      </h2>
                      <div
                        id="tipDelete"
                        className="accordion-collapse collapse"
                        data-bs-parent="#tipsAccordion">
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="card border-danger">
                                <div className="card-header bg-danger text-white">
                                  Delete
                                </div>
                                <div className="card-body">
                                  <p className="small">
                                    <strong>Permanently removes</strong> the
                                    post. Cannot be recovered.
                                  </p>
                                  <p className="small mb-0">
                                    Use for: Duplicate posts, test posts, posts
                                    created by mistake.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="card border-secondary">
                                <div className="card-header bg-secondary text-white">
                                  Archive
                                </div>
                                <div className="card-body">
                                  <p className="small">
                                    <strong>Hides but keeps</strong> the post.
                                    Can be republished later.
                                  </p>
                                  <p className="small mb-0">
                                    Use for: Past events, outdated info you may
                                    need again.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need More Help */}
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6>
                      <i className="fas fa-headset me-2"></i>Need More Help?
                    </h6>
                    <p className="small mb-2">
                      If you have questions or encounter issues with the News
                      Management system, please contact the IT Department or
                      your system administrator.
                    </p>
                    <p className="small text-muted mb-0">
                      <i className="fas fa-envelope me-1"></i>{" "}
                      support@dasmariñas.gov.ph
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => setShowHelpModal(false)}>
                  <i className="fas fa-check me-2"></i>
                  Got It!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default AdminNews;
