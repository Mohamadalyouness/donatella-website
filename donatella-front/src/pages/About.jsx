import logo from "../assets/logo.png";
import chefImg from "../assets/chef.jpeg";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      {/* Hero section */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <img src={logo} alt="Donatella" className="about-hero-logo" />
          <span className="about-eyebrow">DONATELLA CHOCOLATE SPREAD</span>
          <h1>Crafted by a Chef, Loved by Professionals</h1>
          <p>
            Donatella was born in the bakery, not in a boardroom. Our founder is a working chef
            who understands what chocolatiers, pastry chefs and bakers really need: reliable
            texture, rich flavour, and ingredients that perform every single day.
          </p>
          <p>
            From Lebanon to Europe, the Middle East, Africa and the Arab world, Donatella supports
            bakeries and factories with chocolate spreads, fillings and raw materials you can trust
            in every recipe.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="about-story">
        <div className="about-section-header">
          <span className="about-eyebrow">OUR STORY</span>
          <h2>From 1987 Until Today</h2>
        </div>
        <div className="about-story-grid">
          <p>
            The Donatella journey started in{" "}
            <strong>1987</strong> with a young chef working across Lebanon and abroad, learning
            every part of the pastry, chocolate, juice and ice‑cream world. Through roles in the
            sales departments of <strong>Gemco Co.</strong> and <strong>Vresso sarl</strong>, he
            specialised in professional equipment and raw materials, helping businesses choose the
            right solutions for their production.
          </p>
          <p>
            In <strong>2002</strong> he became <strong>Head Chef</strong> at{" "}
            <strong>Chamssine Bakery</strong>, and from <strong>2015</strong> he has also served as
            <strong> Consulting Chef</strong> for <strong>Amarin Bakery</strong>, leading product
            development, training teams and elevating quality. In <strong>2021</strong> this
            lifetime of experience turned into <strong>Donatella for Trading</strong> – a brand
            dedicated to chocolate spreads, fillings and ingredients created by a chef, for
            professionals.
          </p>
        </div>
      </section>

      {/* Chef section */}
      <section className="about-chef">
        <div className="about-chef-layout">
          <div className="about-chef-photo">
            <img src={chefImg} alt="Our chef in the Donatella kitchen" />
          </div>

          <div className="about-chef-text">
            <span className="about-eyebrow">THE CHEF</span>
            <h2>38 Years of Chocolate &amp; Bakery Expertise</h2>

            <div className="about-chef-badges">
              <span>Since 1987</span>
              <span>Lebanon &amp; International</span>
              <span>Pastry · Juice · Ice Cream</span>
            </div>

            <p className="about-chef-intro">
              Our chef brings together the skills of a chocolatier, baker and technical consultant.
              His experience in both production lines and professional kitchens is what shapes the
              way Donatella products are created.
            </p>

            <ul className="about-chef-timeline">
              <li>
                <span className="about-chef-timeline-year">1987</span>
                <p>
                  Starts his journey in pastry, chocolate, juice and ice‑cream across Lebanon and
                  abroad, building a reputation for quality and reliability.
                </p>
              </li>
              <li>
                <span className="about-chef-timeline-year">Sales Expertise</span>
                <p>
                  Works with <strong>Gemco Co.</strong> and <strong>Vresso sarl</strong> in sales,
                  specialising in equipment, raw materials and solutions for factories and bakeries.
                </p>
              </li>
              <li>
                <span className="about-chef-timeline-year">2002</span>
                <p>
                  Becomes <strong>Head Chef</strong> at <strong>Chamssine Bakery</strong>, leading
                  recipes, production and product quality.
                </p>
              </li>
              <li>
                <span className="about-chef-timeline-year">2015</span>
                <p>
                  Joins <strong>Amarin Bakery</strong> as <strong>Consulting Chef</strong>, training
                  teams and developing new products.
                </p>
              </li>
              <li>
                <span className="about-chef-timeline-year">2021</span>
                <p>
                  Founds <strong>Donatella for Trading</strong>, creating chocolate spreads,
                  fillings and raw materials designed specifically for pastry and ice‑cream
                  professionals.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
