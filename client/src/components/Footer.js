import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-logo">
        <img src="/Images/Main-logo.svg" alt="Logo" />
        <p>TalentSight</p>
      </div>
      <ul className="footer-links">
        <p>Quick Links</p>
        <li>About</li>
        <li>Privacy Policy</li>
        <li>Terms & Conditions</li>
        <li>Contacts</li>
      </ul>
      <div className="footer-social-icon">
        <p>Follow us</p>
        <div className="footer-icons-container">
          <img src="/Images/tiktok.png" alt="TikTok" />
        </div>
        <div className="footer-icons-container">
          <img src="/Images/twitter.png" alt="Twitter" />
        </div>
        <div className="footer-icons-container">
          <img src="/Images/whatsapp.png" alt="WhatsApp" />
        </div>
        <div className="footer-icons-container">
          <img src="/Images/instagram.png" alt="Instagram" />
        </div>
      </div>

      <div className="footer-contacts">
        <p className="header">Contacts</p>
        <div className="footer-contacts-container">
          <img src="/Images/home.png" alt="Location" />
          <p className="contactInfo">Nairobi, Kenya</p>
        </div>
        <div className="footer-contacts-container">
          <img src="/Images/email.png" alt="Email" />
          <p className="contactInfo">talentsight@gmail.com</p>
        </div>
        <div className="footer-contacts-container">
          <img src="/Images/old-typical-phone.png" alt="Phone" />
          <p className="contactInfo">0789452687</p>
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>&copy; {new Date().getFullYear()} - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer; 