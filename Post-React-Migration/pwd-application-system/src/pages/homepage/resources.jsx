import React from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../assets/styles/resources-styles.css';
/*No Font Awesome Icons - Install/Import here*/

export default function Resources() {
    return (
        <main className="container my-5">

            <section id="header" className="mb-5">
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <h1 className="display-5 fw-bold text-success mb-3" id="resources-header">PWD Resources & Documents</h1>
                        <p>Essential resources, forms, and links for Persons with Disabilities in Dasmariñas City</p>
                        <div className="row justify-content-center mt-4">
                            <div className="col-md-8">
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    All resources are provided by the City Government of Dasmariñas and relevant national agencies.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="row mb-5">
                <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <i className="fas fa-file-pdf text-danger display-6 mb-3"></i>
                            <h5 className="card-title">Download Forms</h5>
                            <p className="card-text">Application forms, requirements checklist, and other documents</p>
                            <a href="#forms" className="btn btn-success">View Forms</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <i className="fas fa-link text-primary display-6 mb-3"></i>
                            <h5 className="card-title">Useful Links</h5>
                            <p className="card-text">Government agencies, support organizations, and online services</p>
                            <a href="#links" className="btn btn-success">View Links</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <i className="fas fa-phone text-warning display-6 mb-3"></i>
                            <h5 className="card-title">Contact & Schedule</h5>
                            <p className="card-text">Contact information and scheduling details for PWD services</p>
                            <a href="#contact" className="btn btn-success">View Contact Info</a>
                        </div>
                    </div>
                </div>
            </section>


            <section id="forms" className="mb-5">
                <div className="row">
                    <div className="col-12">
                        <h2 className="h3 text-success mb-4 border-bottom pb-2">
                            <i className="fas fa-file-alt me-2"></i>Application Forms & Documents
                        </h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">PWD ID Application</h5>
                            </div>
                            <div className="card-body">
                                <p className="card-text">Forms and requirements for PWD Identification Card application</p>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <i className="fas fa-file-pdf text-danger me-2"></i>
                                        <button type="button" className="text-decoration-none btn btn-link p-0" aria-label="Open PWD Application Form">PWD Application Form</button>
                                        <small className="text-muted d-block">(PDF, 120KB)</small>
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-file-pdf text-danger me-2"></i>
                                        <button type="button" className="text-decoration-none btn btn-link p-0" aria-label="Open Medical Certificate Template">Medical Certificate Template</button>
                                        <small className="text-muted d-block">(PDF, 120KB)</small>
                                    </li>
                                    <li>
                                        <i className="fas fa-list text-info me-2"></i>
                                        <button type="button" className="text-decoration-none btn btn-link p-0" aria-label="Open Requirements Checklist">Requirements Checklist</button>
                                        <small className="text-muted d-block">(PDF, 120KB)</small>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">Benefits & Privileges Forms</h5>
                            </div>
                            <div className="card-body">
                                <p className="card-text">Forms for availing PWD discounts and privileges</p>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <i className="fas fa-file-pdf text-danger me-2"></i>
                                        <button type="button" className="text-decoration-none btn btn-link p-0" aria-label="Open Discount Availment Form">Discount Availment Form</button>
                                        <small className="text-muted d-block">(PDF, 120KB)</small>
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-file-pdf text-danger me-2"></i>
                                        <button type="button" className="text-decoration-none btn btn-link p-0" aria-label="Open Medicines Discount Form">Medicines Discount Form</button>
                                        <small className="text-muted d-block">(PDF, 120KB)</small>
                                    </li>
                                    <li>
                                        <i className="fas fa-file-pdf text-danger me-2"></i>
                                        <button type="button" className="text-decoration-none btn btn-link p-0" aria-label="Open Funeral and Burial Services Discount Form">Funeral and Burial Services Discount Form</button>
                                        <small className="text-muted d-block">(PDF, 120KB)</small>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section id="links" className="mb-5">
                <div className="row">
                    <div className="col-12">
                        <h2 className="h3 text-success mb-4 border-bottom pb-2">
                            <i className="fas fa-external-link-alt me-2"></i>Useful Links & Resources
                        </h2>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">Local Government Units</h5>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    <li className="mb-3">
                                        <i className="fas fa-city text-success me-2"></i>
                                        <a href="https://dasmacitygov.weebly.com/city-government.html" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold">City of Dasmariñas Official Website</a>
                                        <small className="text-muted d-block">Official website of Dasmariñas City Government</small>
                                    </li>
                                    <li className="mb-3">
                                        <i className="fab fa-facebook text-primary me-2"></i>
                                        <a href="https://www.facebook.com/pio.lgudasma/" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold">Dasmariñas City Government Facebook</a>
                                        <small className="text-muted d-block">Latest updates and announcements</small>
                                    </li>
                                    <li className="mb-3">
                                        <i className="fas fa-map-marker-alt text-danger me-2"></i>
                                        <a href="https://cavite.gov.ph" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold">Province of Cavite Official Website</a>
                                        <small className="text-muted d-block">Provincial government services and programs</small>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">National Government Agencies</h5>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    <li className="mb-3">
                                        <i className="fas fa-university text-warning me-2"></i>
                                        <a href="https://dswd.gov.ph" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold">Department of Social Welfare and Development (DSWD)</a>
                                        <small className="text-muted d-block">Social welfare programs and services</small>
                                    </li>
                                    <li className="mb-3">
                                        <i className="fas fa-heartbeat text-danger me-2"></i>
                                        <a href="https://doh.gov.ph" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold">Department of Health (DOH)</a>
                                        <small className="text-muted d-block">Health services and medical assistance</small>
                                    </li>
                                    <li className="mb-3">
                                        <i className="fas fa-gavel text-dark me-2"></i>
                                        <a href="https://ncda.gov.ph/" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold">National Council on Disability Affairs (NCDA)</a>
                                        <small className="text-muted d-block">National policies and programs for PWDs</small>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" className="mb-5">
                <div className="row">
                    <div className="col-12">
                        <h2 className="h3 text-success mb-4 border-bottom pb-2">
                            <i className="fas fa-phone-alt me-2"></i>Contact Information
                        </h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3">
                        <div className="card">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">Dasmariñas City PWD Office</h5>
                            </div>
                            <div className="card-body">
                                <p className="mb-2"><i className="fas fa-map-marker-alt me-2 text-danger"></i> <strong>Address:</strong> New City Hall Complex, DBB-1, Cavite, Philippines</p>
                                <p className="mb-2"><i className="fas fa-phone me-2 text-primary"></i> <strong>Telephone:</strong> (046) 123-4567</p>
                                <p className="mb-2"><i className="fas fa-mobile-alt me-2 text-info"></i> <strong>Mobile:</strong> 0998-123-4567</p>
                                <p className="mb-0"><i className="fas fa-envelope me-2 text-warning"></i> <strong>Email:</strong> pwd@dasmarinas.gov.ph</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-3">
                        <div className="card">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">Office Hours</h5>
                            </div>
                            <div className="card-body">
                                <p className="mb-2"><strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM</p>
                                <p className="mb-2"><strong>Saturday:</strong> 8:00 AM - 12:00 PM</p>
                                <p className="mb-0"><strong>Sunday:</strong> Closed</p>
                                <p className="mb-0 text-secondary"><small><i className="fas fa-info-circle me-1"></i> Closed on holidays</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
