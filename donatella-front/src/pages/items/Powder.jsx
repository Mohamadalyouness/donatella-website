import ProductCard from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useProducts } from "../../context/ProductsContext";

function Powder() {
  const { products, loading, error } = useProducts("powder");

  if (error) {
    return (
      <div className="product-grid">
        <p className="no-products">{error}</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Loading powder products..." />;
  }

  if (products.length === 0) {
    return (
      <div className="product-grid">
        <p className="no-products">No products added yet for this category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>
  );
}

export default Powder;
