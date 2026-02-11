import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import heroVideo from "../assets/chocolate.mp4";
import { useProducts } from "../context/ProductsContext";

// API returns products sorted by createdAt desc (newest first), so first N = newest
const NEW_ARRIVALS_COUNT = 8;
const SCROLL_AMOUNT = 400;

function Home() {
  const { products, loading } = useProducts();
  const newArrivals = products.slice(0, NEW_ARRIVALS_COUNT);
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  const scrollCarousel = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * SCROLL_AMOUNT, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollButtons();
    const el = carouselRef.current;
    if (el) el.addEventListener("scroll", updateScrollButtons);
    return () => el?.removeEventListener("scroll", updateScrollButtons);
  }, [newArrivals.length, updateScrollButtons]);

  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-brand">DONATELLA</span>

          <h1 className="hero-title">Where Chocolate Becomes Art</h1>

          <p className="hero-subtitle">
            Premium chocolates, powders, and ingredients crafted with passion.
          </p>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="new-arrivals">
        <h2 className="new-arrivals-title">New Arrivals</h2>
        <p className="new-arrivals-subtitle">Discover our latest creations</p>
        {loading ? (
          <div className="new-arrivals-loading">Loading...</div>
        ) : newArrivals.length > 0 ? (
          <div className="new-arrivals-carousel-wrapper">
            <button
              type="button"
              className="new-arrivals-nav new-arrivals-nav-prev"
              onClick={() => scrollCarousel(-1)}
              aria-label="Previous products"
              disabled={!canScrollLeft}
            >
              ‹
            </button>
            <div
              className="new-arrivals-carousel"
              ref={carouselRef}
              onScroll={updateScrollButtons}
            >
              <div className="new-arrivals-track">
                {newArrivals.map((item) => (
                  <Link
                    key={item.id}
                    to={item.category ? `/items/${item.category}` : "/items"}
                    className="new-arrivals-card"
                  >
                    <div className="new-arrivals-card-img">
                      {item.image ? (
                        <img src={item.image} alt={item.title} />
                      ) : (
                        <div className="new-arrivals-placeholder" />
                      )}
                    </div>
                    <h3>{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="new-arrivals-nav new-arrivals-nav-next"
              onClick={() => scrollCarousel(1)}
              aria-label="Next products"
              disabled={!canScrollRight}
            >
              ›
            </button>
          </div>
        ) : (
          <div className="new-arrivals-empty">
            <p>New products coming soon.</p>
          </div>
        )}
        <Link to="/items" className="new-arrivals-cta">View All Products</Link>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>OUR PRODUCTS</h2>

        <div className="category-cards">

          <Link to="/items/chocolate" className="category-card chocolate">
            <div className="category-overlay"></div>
            <h3>CHOCOLATE</h3>
            {/* <p>Rich, smooth, and indulgent flavors</p> */}
          </Link>

          <Link to="/items/powder" className="category-card powder">
            <div className="category-overlay"></div>
            <h3>POWDER</h3>
            {/* <p>Premium cocoa & specialty powders</p> */}
          </Link>

          <Link to="/items/others" className="category-card others">
            <div className="category-overlay"></div>
            <h3>OTHERS</h3>
            {/* <p>Everything that completes perfection</p> */}
          </Link>

        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="about-preview">
        <span className="about-eyebrow">OUR STORY</span>

        <h2>
          CRAFTED WITH PASSION<br />
          PERFECTED WITH CHOCOLATE
        </h2>

        <div className="gold-divider"></div>

        <p>
          Donatella is a chocolate factory devoted to craftsmanship, quality,
          and unforgettable taste. Every creation is made with precision,
          tradition, and a deep love for chocolate.
        </p>

        <blockquote>
          “Chocolate is not just a flavor — it is an experience.”
        </blockquote>

        <Link to="/about" className="btn outline gold-glow">
          Read Our Story
        </Link>
      </section>


      {/* WHY DONATELLA */}
      <section className="why">
        <h2>Why Choose Donatella</h2>

        <div className="why-grid">
          <div className="why-card ingredients">
            <span>Premium Ingredients</span>
          </div>

          <div className="why-card passion">
            <span>Crafted with Passion</span>
          </div>

          <div className="why-card production">
            <span>Modern Production</span>
          </div>

          <div className="why-card quality">
            <span>Trusted Quality</span>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
