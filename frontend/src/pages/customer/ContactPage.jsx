/**
 * ContactPage.jsx — Studio Inquiries & Customer Support
 */

import { useState } from 'react';
import { FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import './ContactPage.css';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error('Please complete all form fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/contact', {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      toast.success('Your message has been received!');
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit inquiry';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page container animate-fade-in">
      <div className="contact-header">
        <span className="editorial-label">Get in Touch</span>
        <h1 className="contact-title">We are here to assist with any inquiry</h1>
        <p className="contact-subtitle">
          Have a question about product specs, custom orders, or delivery? Send us a message and our team will reply within 24 hours.
        </p>
      </div>

      <div className="contact-layout">
        {/* ── Left: Interactive Form ──────────────────────────────── */}
        <div className="contact-form-column">
          <div className="card contact-form-card">
            {submitted ? (
              <div className="contact-success-box">
                <FiCheckCircle size={44} className="success-icon" />
                <h3>Thank You for Contacting Us</h3>
                <p>
                  Your message has been routed to our support specialists. A confirmation has been logged, and we will follow up with you promptly via email.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-md"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="input"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="input"
                      required
                      placeholder="sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    className="input"
                    required
                    placeholder="Order question, product advice, or feedback"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    className="input contact-textarea"
                    rows={6}
                    required
                    placeholder="Please include details so we can best assist you..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg submit-contact-btn"
                  disabled={loading}
                >
                  {loading ? (
                    'Sending Inquiry...'
                  ) : (
                    <>
                      <FiSend size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Right: Studio Information ───────────────────────────── */}
        <div className="contact-info-column">
          <div className="card contact-details-card">
            <h3 className="details-card-title">Studio & Support</h3>

            <div className="contact-info-list">
              <div className="info-row">
                <FiMail size={18} className="info-icon" />
                <div>
                  <span className="info-label">Direct Correspondence</span>
                  <a href="mailto:support@ateliergoods.com" className="info-val link">
                    support@ateliergoods.com
                  </a>
                </div>
              </div>

              <div className="info-row">
                <FiMapPin size={18} className="info-icon" />
                <div>
                  <span className="info-label">Studio Atelier</span>
                  <span className="info-val">
                    452 Craftsmanship Lane, Suite 200<br />
                    San Francisco, CA 94107
                  </span>
                </div>
              </div>

              <div className="info-row">
                <FiClock size={18} className="info-icon" />
                <div>
                  <span className="info-label">Customer Service Hours</span>
                  <span className="info-val">
                    Monday – Friday: 9:00 AM – 6:00 PM PST<br />
                    Saturday: 10:00 AM – 4:00 PM PST
                  </span>
                </div>
              </div>
            </div>

            <div className="support-promise">
              <h4>Our Service Pledge</h4>
              <p>
                Every message is read by an actual team member in our San Francisco studio — never an automated chat robot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
