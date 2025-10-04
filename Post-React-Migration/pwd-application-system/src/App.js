import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import heroImage from "./assets/images/homepage/dasmarinas-holder.jpg";

const App = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1>
                City of Dasmariñas{" "}
                <span className="text-accent">PWD Application Portal</span>
              </h1>
              <p className="lead">
                A dedicated platform for Persons with Disabilities to access
                services and support provided by the City of Dasmariñas.
              </p>
              <div className="d-grid gap-2 d-md-flex mt-4">
                <button
                  className="btn btn-primary btn-lg me-md-2"
                  onClick={() => (window.location.href = "/consent")}>
                  <i className="fas fa-file-alt me-2"></i> Apply Now
                </button>
                <button
                  className="btn btn-outline-light btn-lg"
                  data-bs-toggle="modal"
                  data-bs-target="#learnMoreModal">
                  <i className="fas fa-question-circle me-2"></i> Learn More
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src={heroImage}
                alt="PWD Services"
                className="img-fluid hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Other sections go here: Services, Process, News, FAQ, Resources... */}

      <Footer />
    </>
  );
};

export default App;
