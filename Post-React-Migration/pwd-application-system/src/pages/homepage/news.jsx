import React, { useState } from "react";
import '../../assets/styles/news-styles.css';

/**
 * TODO: Future enhancement - Admin post announcement (feature planned for admin side)
 * When implemented, this component should be:
 * 1. Accept new posts from the admin panel
 * 2. Store posts in a backend database or API (Hopefully a database)
 * 3. Fetch posts dynamically instead of hardcoding them (By making them a component, as well as dynamic using State or Props)
 * 4. Allow admin to create, edit, and delete news posts from admin panel
 */

export default function News() {
    /** 
     * @summary News component for displaying announcements and updates. Static news data array containing announcement information.
     * @param {Array} newsData - Array of news objects
     * @remarks Currently hardcoded but designed for future replacement with API/database integration.
     * Simple news data structure - can be replaced with API call or database query in future */
    const newsData = [
        {
        id: 1,
        title: "New PWD Services Available",
        excerpt: "The City of Dasmariñas has launched new services for Persons with Disabilities. These include online application processing and mobile assistance units that visit communities.",
        date: "September 01, 2025",
        dateTime: "2025-09-01",
        image: "https://placehold.co/600x400",
        imageAlt: "Illustration of accessible services",
        link: "news-page-1.html"
        },
        {
        id: 2,
        title: "Community Outreach Program",
        excerpt: "Join our upcoming community outreach program designed to support PWD individuals and their families. Registration is now open for the October sessions.",
        date: "September 02, 2025",
        dateTime: "2025-09-02",
        image: "https://placehold.co/600x400",
        imageAlt: "Community gathering illustration",
        link: "news-page-2.html"
        },
        {
        id: 3,
        title: "PWD ID Application Process Simplified",
        excerpt: "We've simplified the PWD ID application process. Applicants can now submit documents online for faster processing and reduced wait times.",
        date: "September 03, 2025",
        dateTime: "2025-09-03",
        image: "https://placehold.co/600x400",
        imageAlt: "Document processing illustration",
        link: "news-page-3.html"
        },
        {
        id: 4,
        title: "Accessibility Improvements in Public Spaces",
        excerpt: "Major accessibility improvements have been completed in public parks throughout Dasmariñas, including ramps, tactile paving, and accessible restrooms.",
        date: "September 04, 2025",
        dateTime: "2025-09-02",
        image: "https://placehold.co/600x400",
        imageAlt: "Accessibility ramp illustration",
        link: "news-page-4.html"
        }
    ];

    const ITEMS_PER_PAGE = 2; // Number of news items per page; Can be set to 4-6 when news pages are populated
    const [currentPage, setCurrentPage] = useState(1); // Tracks which page of news articles is currently being displayed.

    /** 
     * @summary Calculates pagination details and current news items to display.
     * 
     * @remarks
     * Computes total pages, start/end indices, and slices the news data for current page.
     * Automatically updates when currentPage state changes.
     * 
     * @param {number} totalPages - Total number of pages
     * @param {number} startIndex - Starting index for current page
     * @param {number} endIndex - Ending index for current page
     * @returns {Object} Pagination details including current page, total pages, and item range
    */

    const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentNews = newsData.slice(startIndex, endIndex);

    /**
     * @summary Handles page navigation changes in the pagination system.
     * 
     * @param {number} page - The target page number to navigate to.
     * 
     * @remarks
     * Validates page boundaries before updating current page state.
     * Prevents navigation to invalid pages outside the available range.
     */
    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
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
                <span>Check out the latest news, events, and announcements from the City of Dasmariñas.</span>
                </div>
            </section>

            {/* NEWS GRID COMPONENT */}
            <NewsGrid 
                news={currentNews} 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
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
 * 
 * @remarks
 * Renders news articles in a responsive grid layout with top and bottom pagination.
 * Provides accessible navigation and semantic HTML structure for news content.
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
        {/* newsData object value */}
        <div className="row">
            {news.map((item) => (
            <div key={item.id} className="col-12 col-lg-6 mb-4">
                <article className="news-card h-100">
                <a href={item.link} className="text-decoration-none text-reset" aria-label={`Read more about ${item.title}`}>
                    <img className="card-image" src={item.image} alt={item.imageAlt} />
                    <div className="card-body">
                    <h2 className="post-title">{item.title}</h2>
                    <div className="post-sub">
                        <i className="fa-regular fa-calendar" aria-hidden="true"></i>
                        <time dateTime={item.dateTime}>{item.date}</time>
                    </div>
                    <p className="post-excerpt">{item.excerpt}</p>
                    <a className="btn btn-success mt-3" href={item.link} role="button">Read More</a>
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
        <nav aria-label={`Page navigation ${position}`} className={`mb-3 pager-${position}`}>
        <ul className="pagination justify-content-center">
            {/* Previous button */}
            <li className="page-item">
            <button 
                className={`page-link ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-hidden={currentPage === 1}
            >
                &laquo;
            </button>
            </li>

            {/* Page numbers */}
            {pageNumbers.map((page) => (
            <li key={page} className="page-item">
                <button
                className={`page-link ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                >
                {page}
                </button>
            </li>
            ))}

            {/* Next button */}
            <li className="page-item">
            <button 
                className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-hidden={currentPage === totalPages}
            >
                &raquo;
            </button>
            </li>
        </ul>
        </nav>
    );
}
