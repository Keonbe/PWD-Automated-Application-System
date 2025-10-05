import React, { useEffect } from 'react';
import '../assets/styles/index-styles.css';
import placeholderImage from '../assets/images/dasmarinas-holder.jpg';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const HomePage = () => {
  // Scroll to services section if URL has ?scroll=services
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollTo = urlParams.get('scroll');
    if (scrollTo === 'services') {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        setTimeout(() => {
          servicesSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  // FAQ Data
  const faqData = [
    {
      question: "Who can apply for a PWD ID?",
      answer: "Any Filipino citizen with a permanent disability (physical, sensory, intellectual, or psychosocial) may apply. Eligibility references Republic Act 7277 (Magna Carta for Disabled Persons) and its amendments."
    },
    {
      question: "What documents do I need to prepare?",
      answer: `Applicants usually need:
        <ul class="mb-0 mt-2">
          <li>A recent medical certificate or assessment from a licensed physician</li>
          <li>A valid government-issued ID (or birth certificate for minors)</li>
          <li>Two recent 1x1 or 2x2 ID photos</li>
        </ul>`
    },
    {
      question: "How long does the application process take?",
      answer: "Online applications are typically processed within <strong>7-14 working days</strong>, depending on document completeness and verification speed. Local variations may apply."
    },
    {
      question: "Is there a fee for getting a PWD ID?",
      answer: "No — the PWD ID is issued free of charge. Replacement for lost IDs may incur a small processing fee, which varies by LGU (local government unit)."
    },
    {
      question: "What benefits can I get with a PWD ID?",
      answer: `PWD ID holders are entitled to discounts and exemptions as provided by law, including:
        <ul class="mb-0 mt-2">
          <li>At least 20% discount and VAT exemption on medicines</li>
          <li>Discounts on medical/dental services, public transportation fares, and selected purchases</li>
        </ul>
        Benefits are subject to implementing rules and local policies.`
    },
    {
      question: "Can I renew my PWD ID online?",
      answer: "Yes — renewals are available online for many LGUs. You will need to log in, upload updated documents, and submit a renewal request. Check our FAQ for the specific process and requirements."
    }
  ];

  // Resources Data
  const resourcesData = [
    {
      title: "Republic Act 7277",
      description: "Magna Carta for Disabled Persons",
      link: "https://lawphil.net/statutes/repacts/ra1992/ra_7277_1992.html",
      linkText: "Official text — LawPhil"
    },
    {
      title: "National Council on Disability Affairs (NCDA)",
      description: "Policy, programs, and national resources",
      link: "https://www.ncda.gov.ph/",
      linkText: "NCDA Website"
    },
    {
      title: "Department of Social Welfare and Development (DSWD)",
      description: "Social protection programs and services",
      link: "https://www.dswd.gov.ph/",
      linkText: "DSWD Website"
    },
    {
      title: "Dasmariñas LGU Office Directory",
      description: "Pickup points & partner LGUs (when available)",
      link: "https://dasmacitygov.weebly.com/city-government.html",
      linkText: "Phone Directory"
    },
    {
      title: "Cavite LGU Office of the Provincial Governor",
      description: "Office of the Provincial Persons with Disability Affairs Officer - Citizen Charter",
      link: "https://cavite.gov.ph/home/wp-content/uploads/2022/04/04-2022-Chicha-PDAO.pdf",
      linkText: "Persons with Disability Affairs Office (PDAO)"
    },
    {
      title: "Accessibility Guidelines (WCAG 2.1)",
      description: "Standards for web accessibility",
      link: "https://www.w3.org/WAI/standards-guidelines/wcag/",
      linkText: "W3C WCAG Overview"
    }
  ];

  // News Data
  const newsData = [
    {
      id: 1,
      title: "Lorem ipsum dolor sit amet",
      date: "September 26, 2025",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."
    },
    {
      id: 2,
      title: "Lorem ipsum dolor sit amet",
      date: "September 26, 2025",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
    },
    {
      id: 3,
      title: "Lorem ipsum dolor sit amet",
      date: "September 26, 2025",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero."
    },
    {
      id: 4,
      title: "Lorem ipsum dolor sit amet",
      date: "September 26, 2025",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1>City of Dasmariñas <span className="text-accent">PWD Application Portal</span></h1>
              <p className="lead">A dedicated platform for Persons with Disabilities to access services and support provided by the City of Dasmariñas.</p>
              <div className="d-grid gap-2 d-md-flex mt-4">
                <button className="btn btn-primary btn-lg me-md-2" onClick={() => window.location.href = '/apply'}>
                  <i className="fas fa-file-alt me-2"></i>Apply Now
                </button>
                <button className="btn btn-outline-light btn-lg" data-bs-toggle="modal" data-bs-target="#learnMoreModal">
                  <i className="fas fa-question-circle me-2"></i>Learn More
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img src={placeholderImage} alt="PWD Services" className="img-fluid hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      <div className="modal fade" id="learnMoreModal" tabIndex="-1" aria-labelledby="learnMoreModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="learnMoreModalLabel">About the PWD Application Portal</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-accent fw-bold">What is this Portal?</h6>
                  <p>This is the official online platform for Persons with Disabilities (PWDs) in Dasmariñas City to access government services, apply for benefits, and get support.</p>
                  
                  <h6 className="text-accent mt-4 fw-bold">Available Services</h6>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">PWD ID Application & Renewal</li>
                    <li className="list-group-item">Document Verification</li>
                    <li className="list-group-item">Support Programs</li>
                    <li className="list-group-item">Benefits Registration</li>
                    <li className="list-group-item">Service Requests</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="text-accent fw-bold">Who Can Use This?</h6>
                  <p>Residents of Dasmariñas City with permanent disabilities who are registered with the City Social Welfare and Development Office.</p>
                  
                  <h6 className="text-accent mt-4 fw-bold">Requirements</h6>
                  <ul>
                    <li>Valid government ID</li>
                    <li>Medical certificate</li>
                    <li>Proof of residency</li>
                    <li>Recent photo</li>
                  </ul>
                  
                  <div className="alert alert-info mt-3">
                    <small><i className="fas fa-info-circle me-2"></i>For assistance, visit the PWD Affairs Office at City Hall or call (046) 123-4567.</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={() => window.location.href = '/apply'}>Start Application</button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <h2 className="text-center mb-5">PWD Services</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <i className="fas fa-wheelchair service-icon"></i>
                <h4>Accessibility Programs</h4>
                <p>Programs to improve accessibility in public spaces and transportation.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <i className="fas fa-hand-holding-usd service-icon"></i>
                <h4>Financial Assistance</h4>
                <p>Financial support programs for Persons with Disabilities.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <i className="fas fa-heartbeat service-icon"></i>
                <h4>Healthcare Services</h4>
                <p>Specialized healthcare and rehabilitation services.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="process">
        <div className="container">
          <h2 className="text-center mb-5">Application Process</h2>
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="process-step">
                <div className="step-number">1</div>
                <h4>Register</h4>
                <p>Create an account on our portal</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="process-step">
                <div className="step-number">2</div>
                <h4>Apply</h4>
                <p>Fill out the application form</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="process-step">
                <div className="step-number">3</div>
                <h4>Submit</h4>
                <p>Submit required documents</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="process-step">
                <div className="step-number">4</div>
                <h4>Track</h4>
                <p>Monitor your application status</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="latest">
        <div className="container">
          <div className="mb-4">
            <div className="section-title">
              <h2 className="h2 mb-0">Latest</h2>
              <div className="accent-line" aria-hidden="true"></div>
            </div>

            <div className="section-sub">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-newspaper" viewBox="0 0 16 16">
                <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z"/>
                <path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z"/>
              </svg>
              <a href="/news" className="link-success link-underline-light">
                <span className="link-underline-light-hover">Check out the latest news and announcements.</span>
              </a>
            </div>
          </div>

          <div className="row g-4">
            {newsData.map((news) => (
              <div key={news.id} className="col-12 col-sm-6 col-md-3">
                <article className="card-post">
                  <img src="https://placehold.co/600x400" className="card-img-top" alt={`Post image ${news.id}`} />
                  <div className="mt-3">
                    <a href={`/news/${news.id}`} className="h3 link-underline-light post-title">
                      <p>{news.title}</p>
                    </a>
                    <div className="post-meta">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar2-event" viewBox="0 0 16 16">
                        <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
                        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5z"/>
                      </svg>
                      <small>{news.date}</small>
                    </div>
                    <div className="excerpt-wrap">
                      <p className="post-excerpt">{news.excerpt}</p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Resources */}
      <section className="container mb-5">
        <div className="row g-4">
          {/* FAQs */}
          <section className="col-12 col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h5 card-title">Frequently Asked Questions</h2>
                <p className="text-muted mb-3">Answers to common questions for prospective applicants.</p>

                <div className="accordion" id="faqAccordion" role="tablist">
                  {faqData.map((faq, index) => (
                    <div key={index} className="accordion-item">
                      <h3 className="accordion-header" id={`faqHeading${index}`}>
                        <button 
                          className="accordion-button collapsed" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target={`#faq${index}`} 
                          aria-expanded="false" 
                          aria-controls={`faq${index}`}
                        >
                          {faq.question}
                        </button>
                      </h3>
                      <div 
                        id={`faq${index}`} 
                        className="accordion-collapse collapse" 
                        aria-labelledby={`faqHeading${index}`} 
                        data-bs-parent="#faqAccordion"
                      >
                        <div 
                          className="accordion-body" 
                          dangerouslySetInnerHTML={{ __html: faq.answer }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="col-12 col-lg-5">
            <div className="card shadow-sm sticky-top" style={{top: '1rem'}}>
              <div className="card-body">
                <h2 className="h6 card-title">Resources</h2>
                <p className="text-muted small mb-3">Official pages and guidelines to help applicants and developers of the system.</p>

                <ul className="list-group list-group-flush mb-3">
                  {resourcesData.map((resource, index) => (
                    <li key={index} className="list-group-item">
                      <div>
                        <strong>{resource.title}</strong>
                        <div className="small text-muted">{resource.description}</div>
                        <a 
                          className="d-block mt-2 small" 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {resource.linkText}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="d-grid gap-2">
                  <a href="/resources" className="btn btn-outline-primary btn-sm">View full resources page</a>
                  <a href="/contact" className="btn btn-primary btn-sm">Contact support</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default HomePage;