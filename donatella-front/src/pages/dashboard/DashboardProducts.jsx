import { useEffect, useState } from "react";
import DashboardProductCard from "./DashboardProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/Modal";
import "./DashboardProducts.css";
import { useProducts } from "../../context/ProductsContext";
import { API_BASE } from "../../config/api";

function DashboardProducts() {
  const { clearAllCache } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("chocolate");
  const [image, setImage] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      // eslint-disable-next-line no-console
      console.log("Fetched products (raw):", JSON.stringify(data, null, 2));
      // Ensure all products have an id field (backend should provide id, but fallback to _id)
      const productsWithId = data.map((product, index) => {
        // Backend GET /api/items returns { id: "...", ... } format
        // But let's be safe and check both
        let id = product.id;
        if (!id && product._id) {
          id = typeof product._id === 'string' ? product._id : product._id.toString();
        }
        // eslint-disable-next-line no-console
        console.log(`Product ${index} ID mapping:`, { 
          hasId: !!product.id, 
          has_id: !!product._id,
          id: product.id,
          _id: product._id,
          finalId: id,
          fullProduct: product
        });
        return {
          ...product,
          id: id || `missing-id-${index}` // Fallback for debugging
        };
      });
      // eslint-disable-next-line no-console
      console.log("Final products array:", JSON.stringify(productsWithId.map(p => ({ id: p.id, title: p.title })), null, 2));
      setProducts(productsWithId);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error fetching products:", err);
      setError(err.message || "Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (if already small, use as-is)
    if (file.size < 500000) { // Less than 500KB
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Compress larger images
      try {
        const compressed = await compressImage(file);
        setImage(compressed);
        // eslint-disable-next-line no-console
        console.log(`Image compressed: ${file.size} → ${compressed.length} bytes`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error compressing image:", err);
        // Fallback to original
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("chocolate");
    setImage(null);
    setEditingId(null);
  };


  const handleEditProduct = (product) => {
    // eslint-disable-next-line no-console
    console.log("Editing product:", product);
    setEditingId(product.id);
    setTitle(product.title || "");
    setDescription(product.description || "");
    setCategory(product.category || "chocolate");
    setImage(product.image || null);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const id = deletingId;
    // eslint-disable-next-line no-console
    console.log("Deleting product with id:", id, "Type:", typeof id);
    if (!id) {
      setError("Invalid product ID");
      setShowDeleteModal(false);
      return;
    }
    
    try {
      setError("");
      const url = `${API_BASE}/${id}`;
      // eslint-disable-next-line no-console
      console.log("DELETE request URL:", url);
      
      const res = await fetch(url, {
        method: "DELETE",
      });
      
      const data = await res.json().catch(() => ({}));
      
      // eslint-disable-next-line no-console
      console.log("DELETE response:", { status: res.status, data });
      
      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}: Failed to delete product`);
      }
      
      // eslint-disable-next-line no-console
      console.log("Product deleted successfully:", data);
      
      // Update local state immediately
      setProducts(prev => prev.filter(p => p.id !== id));
      
      if (editingId === id) {
        resetForm();
        setShowEditModal(false);
      }
      setShowDeleteModal(false);
      setDeletingId(null);
      if (clearAllCache) clearAllCache(); // Clear cache so product pages refresh
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error deleting product:", err);
      setError(err.message || "Error deleting product");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="dashboard-products">
      <div className="products-header">
        <h2>Products</h2>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          + Add Product
        </button>
      </div>

      {error && <p className="no-products">{error}</p>}

      {loading && products.length === 0 && (
        <LoadingSpinner size="medium" text="Loading products..." />
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Product"
      >
        <form
          className="add-product-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const productPayload = {
              title,
              description,
              image,
              category,
            };

            try {
              setError("");
              // eslint-disable-next-line no-console
              console.log("Creating new product:", productPayload);
              const res = await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productPayload),
              });
              
              const data = await res.json().catch(() => ({}));
              
              if (!res.ok) {
                throw new Error(data.message || `HTTP ${res.status}: Failed to create product`);
              }
              
              // eslint-disable-next-line no-console
              console.log("Product created successfully:", data);
              // Update local state immediately
              const newProduct = {
                id: data.id || data._id?.toString() || `new-${Date.now()}`,
                title: data.title,
                description: data.description,
                category: data.category,
                image: data.image,
              };
              setProducts(prev => [newProduct, ...prev]);
              
              resetForm();
              setShowAddModal(false);
              if (clearAllCache) clearAllCache();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("Error creating product:", err);
              setError(err.message || "Error creating product");
            }
          }}
        >
          <label>
            Product Image
            <input type="file" accept="image/*" onChange={handleImage} />
            {image && <img src={image} alt="Preview" style={{ width: "100px", marginTop: "10px", borderRadius: "8px" }} />}
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="chocolate">Chocolate</option>
              <option value="powder">Powder</option>
              <option value="others">Others</option>
            </select>
          </label>

          <label>
            Product Title
            <input
              type="text"
              placeholder="Chocolate Spread"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Product Description
            <input
              type="text"
              placeholder="Rich creamy chocolate spread"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button type="submit" style={{ flex: 1 }}>
              Save Product
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              style={{ flex: 1, background: "#666" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Product"
      >
        <form
          className="add-product-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const productPayload = {
              title,
              description,
              image,
              category,
            };

            try {
              setError("");
              // eslint-disable-next-line no-console
              console.log("Updating product:", editingId, productPayload);
              const res = await fetch(`${API_BASE}/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productPayload),
              });
              
              const data = await res.json().catch(() => ({}));
              
              if (!res.ok) {
                throw new Error(data.message || `HTTP ${res.status}: Failed to update product`);
              }
              
              // Update local state immediately
              setProducts(prev =>
                prev.map(p => p.id === editingId ? { ...p, ...productPayload } : p)
              );
              
              resetForm();
              setShowEditModal(false);
              if (clearAllCache) clearAllCache();
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("Error updating product:", err);
              setError(err.message || "Error updating product");
            }
          }}
        >
          <label>
            Product Image
            <input type="file" accept="image/*" onChange={handleImage} />
            {image && <img src={image} alt="Preview" style={{ width: "100px", marginTop: "10px", borderRadius: "8px" }} />}
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="chocolate">Chocolate</option>
              <option value="powder">Powder</option>
              <option value="others">Others</option>
            </select>
          </label>

          <label>
            Product Title
            <input
              type="text"
              placeholder="Chocolate Spread"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Product Description
            <input
              type="text"
              placeholder="Rich creamy chocolate spread"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button type="submit" style={{ flex: 1 }}>
              Update Product
            </button>
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
              }}
              style={{ flex: 1, background: "#666" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingId(null);
        }}
        title="Delete Product"
      >
        <p style={{ color: "#fff", marginBottom: "20px" }}>
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleDeleteConfirm}
            style={{ flex: 1, background: "#c0392b" }}
          >
            Yes, Delete
          </button>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeletingId(null);
            }}
            style={{ flex: 1, background: "#666" }}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <div className="products-grid">
        {products.map((product) => {
          // eslint-disable-next-line no-console
          console.log("Rendering product card:", { id: product.id, _id: product._id, fullProduct: product });
          return (
            <DashboardProductCard
              key={product.id || product._id}
              product={product}
              onEdit={() => handleEditProduct(product)}
              onDelete={() => handleDeleteClick(product.id || product._id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DashboardProducts;
