import React  from "react";
import { Link } from "react-router-dom";
import '../../assets/styles/contact-styles.css';
/*No Font Awesome Icons - Install/Import here*/

export default function Contact() {
    return (
        <>
        {/* Breadcrumb / Page Header */}
        <section className="mt-5 page-header">
            <div className="bg-light py-5">
            <div className="container">
                <div className="d-flex justify-content-between">
                <h1 className="fw-bold">Contact us</h1>
                <nav className="pt-3" aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Contact
                    </li>
                    </ol>
                </nav>
                </div>
            </div>
            </div>
        </section>

        {/* Main Contact Section */}
        <main>
            <div className="container py-5">
            <div className="row g-5">
                {/* Contact Info */}
                <div className="col-xl-6">
                <div className="row row-cols-md-2 g-4">
                    <div className="aos-item" data-aos="fade-up" data-aos-delay="200">
                    <div className="aos-item__inner">
                        <div className="bg-light hvr-shutter-out-horizontal d-block p-3">
                        <div className="d-flex justify-content-start">
                            <i className="fa-solid fa-envelope h3 pe-2"></i>
                            <span className="h5">Email</span>
                        </div>
                        <span>example@domain.com</span>
                        </div>
                    </div>
                    </div>

                    <div className="aos-item" data-aos="fade-up" data-aos-delay="400">
                    <div className="aos-item__inner">
                        <div className="bg-light hvr-shutter-out-horizontal d-block p-3">
                        <div className="d-flex justify-content-start">
                            <i className="fa-solid fa-phone h3 pe-2"></i>
                            <span className="h5">Phone</span>
                        </div>
                        <span>+0123456789, +9876543210</span>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="aos-item mt-4" data-aos="fade-up" data-aos-delay="600">
                    <div className="aos-item__inner">
                    <div className="bg-light hvr-shutter-out-horizontal d-block p-3">
                        <div className="d-flex justify-content-start">
                        <i className="fa-solid fa-location-pin h3 pe-2"></i>
                        <span className="h5 mb-0">Office location</span>
                        </div>
                        <span>New City Hall Complex, DBB-1, Cavite, Philippines</span>
                    </div>
                    </div>
                </div>

                <div className="aos-item" data-aos="fade-up" data-aos-delay="800">
                    <div className="mt-4 w-100 aos-item__inner"> {/* Google Map Embed: Satellite */}
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7429.297414415808!2d120.9539612336753!3d14.331711743606277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d5007ca6431d%3A0x93afca2e48b83877!2sDasmari%C3%B1as%20City%20Hall!5e1!3m2!1sen!2sph!4v1759673542488!5m2!1sen!2sph" 
                        width="600" 
                        height="450" 
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                    </div>
                </div>
                </div>

                {/* Contact Form */}
                <div className="col-xl-6 contact-form">
                <h2 className="pb-4">Leave a message</h2>

                <div className="row g-4">
                    <div className="col-6 mb-3">
                    <label htmlFor="fname" className="form-label">
                        First Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="fname"
                        placeholder="Juan"
                    />
                    </div>

                    <div className="col-6 mb-3">
                    <label htmlFor="lname" className="form-label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="lname"
                        placeholder="De La Cruz"
                    />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                    Email
                    </label>
                    <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                    Phone
                    </label>
                    <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="+1234567890"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                    Message
                    </label>
                    <textarea
                    className="form-control"
                    id="message"
                    rows="3"
                    placeholder="Type your message here..."
                    ></textarea>
                </div>

                <button type="button" className="btn btn-contact">
                    Send Message
                </button>
                </div>
            </div>
            </div>
        </main>
        </>
    );
}
