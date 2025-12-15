import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import '../../assets/styles/news-styles.css';
import { getSinglePost, formatNewsDate } from '../../api/newsApi';

/**
 * NewsArticle Component - Displays a single news article
 * 
 * Features:
 * - Dynamic routing via slug parameter
 * - Full article content with HTML rendering
 * - View counter incremented on load
 * - Responsive layout with featured image
 */

export default function NewsArticle() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const data = await getSinglePost(slug);
                setArticle(data);
            } catch (err) {
                console.error('Failed to fetch article:', err);
                setError('Article not found or unavailable.');
            } finally {
                setLoading(false);
            }
        };
        
        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    // Get image URL
    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/800x400?text=News';
        return `http://localhost/webdev_finals/PWD%20AUTOMATED%20APPLICATION%20SYSTEM/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/${path}`;
    };

    return (
        <main>
            <section id="main-content" className="container my-5" tabIndex={-1}>
                {/* Back Link */}
                <Link to="/news" className="btn btn-outline-secondary mb-4">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to News
                </Link>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading article...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading article...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="alert alert-warning text-center" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                        <div className="mt-3">
                            <Link to="/news" className="btn btn-success">
                                Browse All News
                            </Link>
                        </div>
                    </div>
                )}

                {/* Article Content */}
                {!loading && !error && article && (
                    <article className="news-article">
                        {/* Featured Image */}
                        {article.imagePath && (
                            <div className="article-image-container mb-4">
                                <img 
                                    src={getImageUrl(article.imagePath)} 
                                    alt={article.imageAlt || article.title}
                                    className="article-featured-image img-fluid rounded"
                                    style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        {/* Article Header */}
                        <header className="article-header mb-4">
                            <h1 className="article-title">{article.title}</h1>
                            <div className="article-meta text-muted">
                                <span className="me-3">
                                    <i className="fa-regular fa-calendar me-1"></i>
                                    <time dateTime={article.publishedAt?.split(' ')[0]}>
                                        {formatNewsDate(article.publishedAt)}
                                    </time>
                                </span>
                                {article.category && (
                                    <span className="me-3">
                                        <i className="fa-solid fa-tag me-1"></i>
                                        {article.category}
                                    </span>
                                )}
                                <span>
                                    <i className="fa-solid fa-eye me-1"></i>
                                    {article.viewCount || 0} views
                                </span>
                            </div>
                        </header>

                        {/* Article Excerpt */}
                        {article.excerpt && (
                            <p className="lead text-muted mb-4">{article.excerpt}</p>
                        )}

                        <hr className="my-4" />

                        {/* Article Content (HTML) */}
                        <div 
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Article Footer */}
                        <footer className="article-footer mt-5 pt-4 border-top">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link to="/news" className="btn btn-success">
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Back to All News
                                </Link>
                                <div className="text-muted small">
                                    Last updated: {formatNewsDate(article.updatedAt || article.createdAt)}
                                </div>
                            </div>
                        </footer>
                    </article>
                )}
            </section>
        </main>
    );
}
