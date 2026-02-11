import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { API_BASE } from "../config/api";

const ProductsContext = createContext();

const STORAGE_PREFIX = "donatella_products_";
const STORAGE_KEYS = "donatella_products_keys";

function getStoredKeys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getFromStorage(cacheKey) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + cacheKey);
    if (raw == null) return undefined;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function setInStorage(cacheKey, products) {
  try {
    localStorage.setItem(STORAGE_PREFIX + cacheKey, JSON.stringify(products));
    const keys = getStoredKeys();
    if (!keys.includes(cacheKey)) {
      localStorage.setItem(STORAGE_KEYS, JSON.stringify([...keys, cacheKey]));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("localStorage write failed:", e);
  }
}

function removeFromStorage(cacheKey) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + cacheKey);
    const keys = getStoredKeys().filter((k) => k !== cacheKey);
    localStorage.setItem(STORAGE_KEYS, JSON.stringify(keys));
  } catch {}
}

function clearAllStorage() {
  try {
    getStoredKeys().forEach((k) => localStorage.removeItem(STORAGE_PREFIX + k));
    localStorage.removeItem(STORAGE_KEYS);
  } catch {}
}

export function ProductsProvider({ children }) {
  const [productsCache, setProductsCache] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});
  const abortControllersRef = useRef({});
  const fetchingRef = useRef({});

  // Hydrate cache from localStorage on mount
  useEffect(() => {
    const hydrated = {};
    getStoredKeys().forEach((key) => {
      const products = getFromStorage(key);
      if (products !== undefined) hydrated[key] = products;
    });
    if (Object.keys(hydrated).length > 0) {
      setProductsCache((prev) => ({ ...prev, ...hydrated }));
    }
  }, []);

  const fetchProducts = useCallback(async (category) => {
    const cacheKey = category || "all";

    // Check localStorage first
    const cached = getFromStorage(cacheKey);
    if (cached !== undefined) {
      // eslint-disable-next-line no-console
      console.log(`✅ Using stored products for ${cacheKey}:`, cached.length);
      setProductsCache((prev) => ({ ...prev, [cacheKey]: cached }));
      return cached;
    }

    // Prevent duplicate requests
    if (fetchingRef.current[cacheKey]) {
      // eslint-disable-next-line no-console
      console.log(`⏳ Already fetching ${cacheKey}, skipping...`);
      return null;
    }

    // Abort any existing request for this category
    if (abortControllersRef.current[cacheKey]) {
      abortControllersRef.current[cacheKey].abort();
    }

    fetchingRef.current[cacheKey] = true;
    setLoadingStates((prev) => ({ ...prev, [cacheKey]: true }));
    setErrorStates((prev) => ({ ...prev, [cacheKey]: "" }));

    try {
      const url = category ? `${API_BASE}?category=${category}` : API_BASE;
      // eslint-disable-next-line no-console
      console.log(`🔄 Fetching products for ${cacheKey} from ${url}`);

      const controller = new AbortController();
      abortControllersRef.current[cacheKey] = controller;
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load products`);
      }

      const data = await res.json();
      const products = Array.isArray(data) ? data : [];

      // eslint-disable-next-line no-console
      console.log(`✅ Fetched ${products.length} products for ${cacheKey}:`, products);

      setInStorage(cacheKey, products);
      setProductsCache((prev) => {
        const newCache = { ...prev, [cacheKey]: products };
        // eslint-disable-next-line no-console
        console.log(`💾 Stored ${products.length} products for ${cacheKey}`);
        return newCache;
      });
      setLoadingStates((prev) => ({ ...prev, [cacheKey]: false }));
      fetchingRef.current[cacheKey] = false;
      delete abortControllersRef.current[cacheKey];

      return products;
    } catch (err) {
      fetchingRef.current[cacheKey] = false;
      delete abortControllersRef.current[cacheKey];

      if (err.name === "AbortError") {
        // eslint-disable-next-line no-console
        console.log(`⚠️ Request aborted for ${cacheKey} (cleanup)`);
        setLoadingStates((prev) => ({ ...prev, [cacheKey]: false }));
        return null;
      }

      // eslint-disable-next-line no-console
      console.error(`❌ Error fetching ${cacheKey}:`, err);
      const errorMessage = err.message || "Failed to load products";
      setErrorStates((prev) => ({ ...prev, [cacheKey]: errorMessage }));
      setLoadingStates((prev) => ({ ...prev, [cacheKey]: false }));
      throw err;
    }
  }, []);

  const invalidateCache = useCallback((category) => {
    const cacheKey = category || "all";
    removeFromStorage(cacheKey);
    setProductsCache((prev) => {
      const newCache = { ...prev };
      delete newCache[cacheKey];
      return newCache;
    });
  }, []);

  const clearAllCache = useCallback(() => {
    clearAllStorage();
    setProductsCache({});
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        productsCache,
        loadingStates,
        errorStates,
        fetchProducts,
        invalidateCache,
        clearAllCache,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts(category) {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }

  const cacheKey = category || "all";
  const products = context.productsCache[cacheKey] || [];
  const loading = context.loadingStates[cacheKey] || false;
  const error = context.errorStates[cacheKey] || "";
  const hasFetchedRef = useRef(false);

  // Reset fetch guard when category changes (run first)
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [category]);

  useEffect(() => {
    const cached = context.productsCache[cacheKey];
    const isLoading = context.loadingStates[cacheKey];
    
    // Skip if we have cache or already loading
    if (cached !== undefined || isLoading) {
      return;
    }
    // Prevent rapid re-fetches (mobile glitch / effect loop)
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;
    context.fetchProducts(category).catch(() => {});
  }, [category]);

  // eslint-disable-next-line no-console
  console.log(`📦 useProducts render for ${cacheKey}:`, { productsCount: products.length, loading, error });

  return {
    products,
    loading,
    error,
    refetch: () => {
      context.invalidateCache(category);
      return context.fetchProducts(category);
    },
    clearAllCache: context.clearAllCache,
    invalidateCache: context.invalidateCache,
  };
}
