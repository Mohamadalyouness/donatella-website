function DashboardProductCard({ product, onEdit, onDelete }) {
  const { title, description, image, category } = product;

  return (
    <div className="dashboard-product-card">
      {image && <img src={image} alt={title} />}
      <div className="dashboard-product-info">
        <h4>{title}</h4>
        <p>{description}</p>
        <small>{category?.toUpperCase()}</small>
      </div>
      <div className="dashboard-product-actions">
        <button type="button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default DashboardProductCard;
