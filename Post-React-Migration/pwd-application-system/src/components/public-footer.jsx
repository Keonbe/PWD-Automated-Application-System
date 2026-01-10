import React from 'react';
import '@assets/styles/footer.css';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function UserFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>City of Dasmariñas</h5>
            <p>Committed to serving all citizens, including Persons with Disabilities, with excellence and compassion.</p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Contact Information</h5>
            <p><i className="fas fa-phone me-2"></i> (046) 501 2321</p>
            <p><i className="fas fa-envelope me-2"></i> info@dasmarinas.gov.ph</p>
            <p><i className="fas fa-map-marker-alt me-2"></i>Dasmariñas Bagong Bayan, Dasmariñas, Cavite 4115</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">  {/* For Scroll Behavior., Using react-router-hash-link.  Reference: https://dev.to/mindactuate/scroll-to-anchor-element-with-react-router-v6-38op */}
              <li><HashLink to="/#services">PWD Services</HashLink></li>  {/*OLD: <Link to="/#services">PWD Services</Link>*/}
              <li><Link to="/userpage">Application Status</Link></li> 
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/resources">Download Forms</Link></li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <p className="text-center mb-0">© 2025 City of Dasmariñas. All rights reserved.</p>
      </div>
    </footer>
  );
};
