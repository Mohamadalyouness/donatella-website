import { useState, useEffect } from "react";
import "./ContactUs.css";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    if (trimmed.name.length < 2) {
      setStatus({ type: "error", message: "Please enter your full name." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    if (trimmed.message.length < 10) {
      setStatus({ type: "error", message: "Your message is a bit short. Tell us a little more." });
      return;
    }

    // Will be connected to backend/email service later
    // eslint-disable-next-line no-console
    console.log("Form submitted:", trimmed);
    setStatus({ type: "success", message: "Thank you for your message. Our team will get back to you soon." });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  useEffect(() => {
    if (status.type === "idle") return;
    const timeout = setTimeout(() => setStatus({ type: "idle", message: "" }), 5000);
    return () => clearTimeout(timeout);
  }, [status.type]);

  return (
    <div className="contact-page">
      <section className="contact-section">
        <div className="contact-header">
          <span className="contact-eyebrow">GET IN TOUCH</span>
          <h1>Contact Donatella</h1>
          <p>
            Have a question or want to place an order? Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {status.type !== "idle" && (
          <div
            className={`contact-status contact-status--${status.type}`}
            role="status"
            aria-live="polite"
          >
            {status.message}
          </div>
        )}

        <div className="contact-layout">
          <aside className="contact-info-panel">
            <h2>We’d love to hear from you</h2>
            <p>
              Whether you’re a café, bakery, distributor, or simply a chocolate lover,
              our team is here to help you craft unforgettable experiences.
            </p>

            <ul className="contact-highlights">
              <li>Wholesale &amp; retail inquiries</li>
              <li>Custom chocolate &amp; private label</li>
              <li>Events, collaborations &amp; partnerships</li>
            </ul>

            <div className="contact-meta">
              <p><strong>Email</strong> info@donatella.com</p>
              <p><strong>WhatsApp</strong> +961 70 123 456</p>
              <p className="contact-response-time">We usually reply within one business day.</p>
            </div>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                <span>Your Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </label>
              <label>
                <span>Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </label>
            </div>

            <label>
              <span>Subject</span>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Wholesale, collaboration, feedback..."
              />
            </label>

            <label>
              <span>Message</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you have in mind..."
                rows={5}
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="btn-send">
                Send Message
              </button>
              <button
                type="button"
                className="btn-reset"
                onClick={() => {
                  setFormData({ name: "", email: "", subject: "", message: "" });
                  setStatus({ type: "idle", message: "" });
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
