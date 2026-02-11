import logo from "../assets/logo.png";
import chocolate2 from "../assets/chocolate2.jpeg";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      {/* Hero section: Logo left, company intro right */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-logo-wrap">
            <img src={logo} alt="Donatella" className="about-logo" />
          </div>
          <div className="about-intro">
            <span className="about-eyebrow">OUR STORY</span>
            <h1>Where Chocolate Becomes Art</h1>
            <p>
              Donatella was born from a simple belief: that chocolate should be more than a treat—it should be an experience. 
              We craft premium chocolates, powders, and ingredients with passion, using only the finest cocoa and time-honored techniques. 
              Every bite tells a story of dedication, quality, and the love of exceptional flavor.
            </p>
          </div>
        </div>
      </section>

      {/* Chef section: Text left, photo right */}
      <section className="about-chef">
        <div className="about-chef-content">
          <div className="about-chef-text">
            <span className="about-eyebrow">THE MASTER BEHIND THE CRAFT</span>
            <h2>Meet Our Chef</h2>
            <p>
              With over two decades of experience in the art of chocolate-making, our head chef brings a blend of tradition and innovation to every creation. 
              Trained in Europe and inspired by Mediterranean flavors, they believe that the best chocolate comes from patience, precision, and a deep respect for the bean.
            </p>
            <p>
              From hand-tempered bars to silky spreads and rich powders, each product is crafted with the same care you would expect from a family recipe passed down through generations.
            </p>
          </div>
          <div className="about-chef-photo">
            <img src={chocolate2} alt="Our craft" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
