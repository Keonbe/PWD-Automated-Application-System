import React from "react";
import '../../assets/styles/news-styles.css';

export default function News() {
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

            {/* TOP PAGINATION */}
            <nav aria-label="Page navigation example" className="mb-3 pager-top">
                <ul className="pagination justify-content-center">
                <li className="page-item">
                    <a className="page-link disabled" href="#" aria-hidden="true">&laquo;</a> {/* NEXT NEWS PAGE */}
                </li>

                <li className="page-item">
                    <a className="page-link active" href="#pg1">1</a>
                </li>
                <li className="page-item">
                    <a className="page-link" href="#pg2">2</a>
                </li>
                <li className="page-item">
                    <a className="page-link" href="#pg3">3</a>
                </li>

                <li className="page-item">
                    <a className="page-link disabled" href="#" aria-hidden="true">&raquo;</a> {/* NEXT NEWS PAGE */}
                </li>
                </ul>
            </nav>

            {/* NEWS GRID */}
            <div className="row">
                <div className="col-12 col-lg-6 mb-4">
                <article className="news-card h-100">
                    <a href="news-page-1.html" className="text-decoration-none text-reset" aria-label="Read more about New PWD Services Available">
                    <img className="card-image" src="https://placehold.co/600x400" alt="Illustration of accessible services" />
                    <div className="card-body">
                        <h2 className="post-title">New PWD Services Available</h2>
                        <div className="post-sub">
                        <i className="fa-regular fa-calendar" aria-hidden="true"></i>
                        <time dateTime="2025-09-05">September 01, 2025</time>
                        </div>
                        <p className="post-excerpt">The City of Dasmariñas has launched new services for Persons with Disabilities. These include online application processing and mobile assistance units that visit communities.</p>
                        <a className="btn btn-success mt-3" href="news-page-2.html" role="button">Read More</a>
                    </div>
                    </a>
                </article>
                </div>

                <div className="col-12 col-lg-6 mb-4">
                <article className="news-card h-100">
                    <a href="news-page-2.html" className="text-decoration-none text-reset" aria-label="Read more about Community Outreach Program">
                    <img className="card-image" src="https://placehold.co/600x400" alt="Community gathering illustration" />
                    <div className="card-body">
                        <h2 className="post-title">Community Outreach Program</h2>
                        <div className="post-sub">
                        <i className="fa-regular fa-calendar" aria-hidden="true"></i>
                        <time dateTime="2025-09-04">September 02, 2025</time>
                        </div>
                        <p className="post-excerpt">Join our upcoming community outreach program designed to support PWD individuals and their families. Registration is now open for the October sessions.</p>
                        <a className="btn btn-success mt-3" href="news-page-2.html" role="button">Read More</a>
                    </div>
                    </a>
                </article>
                </div>

                <div className="col-12 col-lg-6 mb-4">
                <article className="news-card h-100">
                    <a href="news-page-3.html" className="text-decoration-none text-reset" aria-label="Read more about PWD ID Application Process Simplified">
                    <img className="card-image" src="https://placehold.co/600x400" alt="Document processing illustration" />
                    <div className="card-body">
                        <h2 className="post-title">PWD ID Application Process Simplified</h2>
                        <div className="post-sub">
                        <i className="fa-regular fa-calendar" aria-hidden="true"></i>
                        <time dateTime="2025-09-03">September 03, 2025</time>
                        </div>
                        <p className="post-excerpt">We've simplified the PWD ID application process. Applicants can now submit documents online for faster processing and reduced wait times.</p>
                        <a className="btn btn-success mt-3" href="news-page-3.html" role="button">Read More</a>
                    </div>
                    </a>
                </article>
                </div>

                <div className="col-12 col-lg-6 mb-4">
                <article className="news-card h-100">
                    <a href="news-page-4.html" className="text-decoration-none text-reset" aria-label="Read more about Accessibility Improvements">
                    <img className="card-image" src="https://placehold.co/600x400" alt="Accessibility ramp illustration" />
                    <div className="card-body">
                        <h2 className="post-title">Accessibility Improvements in Public Spaces</h2>
                        <div className="post-sub">
                        <i className="fa-regular fa-calendar" aria-hidden="true"></i>
                        <time dateTime="2025-09-02">September 04, 2025</time>
                        </div>
                        <p className="post-excerpt">Major accessibility improvements have been completed in public parks throughout Dasmariñas, including ramps, tactile paving, and accessible restrooms.</p>
                        <a className="btn btn-success mt-3" href="news-page-4.html" role="button">Read More</a>
                    </div>
                    </a>
                </article>
                </div>
            </div>

            {/* BOTTOM PAGINATION */}
            <nav aria-label="Page navigation example" className="mt-4 pager-bottom">
                <ul className="pagination justify-content-center">
                <li className="page-item">
                    <a className="page-link disabled" href="#" aria-hidden="true">&laquo;</a> {/* NEXT NEWS PAGE */}
                </li>
                <li className="page-item">
                    <a className="page-link active" href="#pg1">1</a>
                </li>
                <li className="page-item">
                    <a className="page-link" href="#pg2">2</a>
                </li>
                <li className="page-item">
                    <a className="page-link" href="#pg3">3</a>
                </li>
                <li className="page-item">
                    <a className="page-link disabled" href="#" aria-hidden="true">&raquo;</a> {/* NEXT NEWS PAGE */}
                </li>
                </ul>
            </nav>
            </section>
        </main>
        </>
    );
    }
