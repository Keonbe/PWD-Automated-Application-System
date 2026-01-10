import React, { useState, useEffect } from "react";
import "@assets/styles/news-styles.css";
import { getPublishedNews, formatNewsDate } from "@api/newsApi";

/**
 * News Component - Displays announcements and updates from the database
 *
 * Features:
 * - Fetches news posts from MySQL database via PHP API
 * - Server-side pagination for efficient loading
 * - Loading and error states
 * - Responsive card grid layout
 */

export default function News() {
  const ITEMS_PER_PAGE = 4; // Number of news items per page

  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch news posts from API when component mounts or page changes
   */
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getPublishedNews({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        // Transform API data to match component structure
        const transformedPosts = result.posts.map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          date: formatNewsDate(post.publishedAt),
          dateTime: post.publishedAt?.split(" ")[0] || "",
          image: post.imagePath
            ? `http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/${post.imagePath}`
            : "https://placehold.co/600x400?text=News",
          imageAlt: post.imageAlt || post.title,
          slug: post.slug,
          category: post.category,
          viewCount: post.viewCount,
        }));

        setNewsData(transformedPosts);
        setTotalPages(result.pagination.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Unable to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  /**
   * Handles page navigation changes in the pagination system.
   * @param {number} page - The target page number to navigate to.
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of news section
      document
        .getElementById("main-content")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* MAIN CONTENT */}
      <main>
        <section id="main-content" className="container my-5" tabIndex={-1}>
          <section className="mb-4">
            <div>
              <h1 className="h3 mb-0">Latest News</h1>
              <div className="heading-accent" aria-hidden="true"></div>
            </div>
            <div className="subtext">
              <i className="fas fa-newspaper" aria-hidden="true" />
              <span>
                Check out the latest news, events, and announcements from the
                City of Dasmariñas.
              </span>
            </div>
          </section>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading news...</span>
              </div>
              <p className="mt-3 text-muted">Loading latest news...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-warning text-center" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
              <button
                className="btn btn-outline-warning btn-sm ms-3"
                onClick={() => setCurrentPage(1)}>
                <i className="fas fa-sync-alt me-1"></i> Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && newsData.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
              <h3 className="text-muted">No News Available</h3>
              <p className="text-muted">
                Check back later for updates and announcements.
              </p>
            </div>
          )}

          {/* NEWS GRID COMPONENT */}
          {!loading && !error && newsData.length > 0 && (
            <NewsGrid
              news={newsData}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </main>
    </>
  );
}

/**
 * NewsGrid Component - Renders paginated news cards
 *
 * @param {Object} props - Component properties.
 * @param {Array} news - Array of news objects to display on current page
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback function for page changes
 * @returns {JSX.Element} Returns a grid of news cards with pagination controls
 */
function NewsGrid({ news, currentPage, totalPages, onPageChange }) {
  return (
    <>
      {/* TOP PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        position="top"
      />

      {/* NEWS GRID */}
      <div className="row">
        {news.map((item) => (
          <div key={item.id} className="col-12 col-lg-6 mb-4">
            <article className="news-card h-100">
              <a
                href={`/news/${item.slug}`}
                className="text-decoration-none text-reset"
                aria-label={`Read more about ${item.title}`}>
                <img
                  className="card-image"
                  src={item.image}
                  alt={item.imageAlt}
                />
                <div className="card-body">
                  <h2 className="post-title">{item.title}</h2>
                  <div className="post-sub">
                    <i
                      className="fa-regular fa-calendar"
                      aria-hidden="true"></i>
                    <time dateTime={item.dateTime}>{item.date}</time>
                    {item.category && (
                      <span className="ms-3">
                        <i className="fa-solid fa-tag" aria-hidden="true"></i>
                        <span className="ms-1">{item.category}</span>
                      </span>
                    )}
                  </div>
                  <p className="post-excerpt">{item.excerpt}</p>
                  <span className="btn btn-success mt-3" role="button">
                    Read More
                  </span>
                </div>
              </a>
            </article>
          </div>
        ))}
      </div>

      {/* BOTTOM PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        position="bottom"
      />
    </>
  );
}

/**
 * Pagination Component - Renders pagination controls
 * @summary Pagination component for navigating between news pages
 *
 * @param {Object} props - Component properties.
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback function when page changes
 * @param {string} position - Position identifier for CSS (top/bottom)
 *
 * @returns {JSX.Element} Returns pagination controls with previous/next buttons and page numbers.
 *
 * @remarks
 * Generates dynamic page number buttons based on total pages.
 * Includes proper ARIA labels and accessibility attributes for screen readers.
 * Disables navigation buttons at boundary conditions (first/last page).
 */
function Pagination({ currentPage, totalPages, onPageChange, position }) {
  const pageNumbers = [];
  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  /* Pagination controls */
  return (
    <nav
      aria-label={`Page navigation ${position}`}
      className={`mb-3 pager-${position}`}>
      <ul className="pagination justify-content-center">
        {/* Previous button */}
        <li className="page-item">
          <button
            className={`page-link ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-hidden={currentPage === 1}>
            &laquo;
          </button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <li key={page} className="page-item">
            <button
              className={`page-link ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}>
              {page}
            </button>
          </li>
        ))}

        {/* Next button */}
        <li className="page-item">
          <button
            className={`page-link ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-hidden={currentPage === totalPages}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}
