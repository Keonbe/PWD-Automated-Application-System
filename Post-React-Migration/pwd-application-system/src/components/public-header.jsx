import React, { useState } from 'react';
import '@assets/styles/header.css';
import logo from '@assets/images/dasma-logo-only.png';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function UserHeader() {
  /**
   * @summary Navbar expansion state for mobile menu toggle.
   * 
   * @remarks
   * Manages the collapsed/expanded state of the mobile navigation menu.
   * Required because React alone doesn't handle Bootstrap's JavaScript components.
   */
  const [expanded, setExpanded] = useState(false);

  /**
   * @summary Toggles the navbar expansion state for mobile view.
   * 
   * @remarks
   * Handles the click event for the navbar toggle button.
   * Alternates between expanded and collapsed states for mobile menu.
   */
  const handleToggle = () => {
    setExpanded(expanded ? false : true);
  };

  /**
   * @summary Closes the navbar when a navigation link is clicked.
   * 
   * @remarks
   * Ensures mobile navbar automatically collapses after navigation selection.
   * Improves user experience on mobile devices by closing menu after click.
   */
  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    /*
    Issue: Navbar collapse not working properly on small screens (toggle button not showing/hiding menu) which require Bootstrap JavaScript unlike in legacy html implementation where Bootstrap JS was included. React alone does not handle Bootstrap JS components.
    Solution: Use React-Bootstrap components and state management to manage navbar expansion/collapse. It has built-in support for Bootstrap JS components.
    Refer: https://react-bootstrap.netlify.app/docs/components/navbar/ : https://coreui.io/bootstrap-react/layout/containers/
    */

    <Navbar expand="lg"  className="navbar navbar-dark" expanded={expanded} onToggle={handleToggle}>
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleNavClick}>
          <img  src={logo}  alt="City of Dasmariñas Logo"  className="navbar-logo"/>
          City of Dasmariñas — PWD Portal 
        </Navbar.Brand>
        
        <Navbar.Toggle  aria-controls="navbarContent" onClick={handleToggle}>
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="navbarContent">
          <Nav className="ms-auto mb-2 mb-lg-0">
            <Nav.Link  as={Link}  to="/"  onClick={handleNavClick}>Home</Nav.Link>
            <Nav.Link  as={Link}  to="/news" onClick={handleNavClick}>News</Nav.Link>
            <Nav.Link  as={Link}  to="/faq"  onClick={handleNavClick}>FAQ</Nav.Link>
            <Nav.Link  as={Link}  to="/resources"  onClick={handleNavClick}>Resources</Nav.Link>
            <Nav.Link  as={Link}  to="/contact"  onClick={handleNavClick}>Contact</Nav.Link>
            <Nav.Item className="ms-2 d-flex align-items-center">
              <Link  className="btn btn-login"  to="/login" onClick={handleNavClick}>
                Login
              </Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}