import "./ProductCard.css";

function ProductCard({ title, description, image }) {
  return (
    <div className="product-card">
      <div className="img-wrapper">
        <img src={image} alt={title} />
      </div>

      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ProductCard;
