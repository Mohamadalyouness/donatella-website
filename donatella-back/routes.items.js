import express from "express";
import mongoose from "mongoose";
import { Item } from "./models.Item.js";

export const itemsRouter = express.Router();

// Simple in-memory cache for better performance
const cache = {
  data: {},
  timestamps: {},
  TTL: 300000, // kept for reference, but we no longer expire automatically
};

function getCacheKey(category) {
  return category || "all";
}

function getCached(category) {
  const key = getCacheKey(category);
  const cached = cache.data[key];
  const timestamp = cache.timestamps[key];

  if (cached !== undefined) {
    // eslint-disable-next-line no-console
    console.log(`⚡ Cache hit for ${key}:`, Array.isArray(cached) ? `${cached.length} items` : 'non-array', `cachedAt=${new Date(timestamp).toISOString()}`);
    return cached;
  }
  // eslint-disable-next-line no-console
  console.log(`❌ Cache miss for ${key} (no cached entry)`);
  return null;
}

function setCache(category, data) {
  const key = getCacheKey(category);
  cache.data[key] = data;
  cache.timestamps[key] = Date.now();
}

function clearCache() {
  // eslint-disable-next-line no-console
  console.log(`🗑️ Clearing all cache`);
  cache.data = {};
  cache.timestamps = {};
}

// GET /api/items?category=chocolate
itemsRouter.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    // eslint-disable-next-line no-console
    console.log(`📥 GET /api/items request - category: ${category || "all"}`);
    
    // Check cache first
    const cached = getCached(category);
    if (cached !== null && cached !== undefined) {
      // eslint-disable-next-line no-console
      console.log(`⚡ Returning cached data: ${Array.isArray(cached) ? cached.length : 'non-array'} items`);
      return res.json(cached);
    }
    
    const query = {};
    if (category) {
      query.category = category;
    }
    
    // eslint-disable-next-line no-console
    console.log(`🔍 Querying database with:`, JSON.stringify(query));
    
    // Optimized query: only select needed fields, use lean() for speed
    // Note: _id is always included by MongoDB even if not in select
    // createdAt: -1 = newest first (used for "New Arrivals" on home page)
    const items = await Item.find(query)
      .select('_id title description category image createdAt')
      .sort({ createdAt: -1 })
      .lean()
      .maxTimeMS(5000); // 5 second max query time
    
    // eslint-disable-next-line no-console
    console.log(`📦 Found ${items.length} items for category: ${category || "all"}`);
    // eslint-disable-next-line no-console
    if (items.length > 0) {
      console.log(`📋 Sample item IDs:`, items.slice(0, 3).map(i => ({ _id: i._id?.toString(), title: i.title })));
    } else {
      // eslint-disable-next-line no-console
      console.log(`⚠️ No items found in database for query:`, query);
      // Check total count in database
      const totalCount = await Item.countDocuments({});
      // eslint-disable-next-line no-console
      console.log(`📊 Total items in database: ${totalCount}`);
    }
    
    // Transform _id to id for frontend compatibility
    const itemsJson = items.map(item => {
      const id = item._id ? item._id.toString() : null;
      if (!id) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ Item missing _id:`, item);
      }
      return {
        id: id,
        title: item.title,
        description: item.description,
        category: item.category,
        image: item.image,
        createdAt: item.createdAt,
      };
    });
    
    // Cache the result (even if empty array)
    setCache(category, itemsJson);
    // eslint-disable-next-line no-console
    console.log(`💾 Cached ${itemsJson.length} items for category: ${category || "all"}`);
    
    res.json(itemsJson);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("❌ Error fetching items:", err);
    res.status(500).json({ message: "Failed to fetch items", error: err.message });
  }
});

// GET /api/items/:id
itemsRouter.get("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    // eslint-disable-next-line no-console
    console.log(`🔍 Looking up item by ID: ${itemId}`);
    
    // Also log all existing IDs for debugging
    const allItems = await Item.find({}).select('_id title').lean();
    // eslint-disable-next-line no-console
    console.log(`📋 All items in database:`, allItems.map(i => ({ _id: i._id.toString(), title: i.title })));
    
    const item = await Item.findById(itemId);
    if (!item) {
      // eslint-disable-next-line no-console
      console.log(`❌ Item ${itemId} not found. Available IDs:`, allItems.map(i => i._id.toString()));
      return res.status(404).json({ message: "Item not found", availableIds: allItems.map(i => i._id.toString()) });
    }
    res.json(item.toJSON());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching item by ID:", err);
    res.status(400).json({ message: "Invalid item id", error: err.message });
  }
});

// POST /api/items
itemsRouter.post("/", async (req, res) => {
  try {
    const { title, description, category, image } = req.body;
    const item = await Item.create({ title, description, category, image });
    
    // Clear cache when new item is added
    clearCache();
    
    // eslint-disable-next-line no-console
    console.log(`✅ Created new item:`, { id: item._id.toString(), title: item.title });
    const itemJson = item.toJSON();
    // eslint-disable-next-line no-console
    console.log(`📤 Returning item JSON:`, itemJson);
    res.status(201).json(itemJson);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error creating item:", err);
    res.status(400).json({ message: "Failed to create item", error: err.message });
  }
});

// PUT /api/items/:id
itemsRouter.put("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const { title, description, category, image } = req.body;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      // eslint-disable-next-line no-console
      console.log(`❌ Invalid ObjectId format: ${itemId}`);
      return res.status(400).json({ message: "Invalid item ID format" });
    }
    
    // eslint-disable-next-line no-console
    console.log(`✏️ Attempting to update item ${itemId}`);
    
    const item = await Item.findByIdAndUpdate(
      itemId,
      { title, description, category, image },
      { new: true, runValidators: true }
    );
    
    if (!item) {
      // eslint-disable-next-line no-console
      console.log(`❌ Item ${itemId} not found`);
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Clear cache when item is updated
    clearCache();
    
    // eslint-disable-next-line no-console
    console.log(`✅ Updated item ${itemId}`);
    res.json(item.toJSON());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error updating item:", err);
    res.status(400).json({ message: "Failed to update item", error: err.message });
  }
});

// DELETE /api/items/:id
itemsRouter.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    // eslint-disable-next-line no-console
    console.log(`🗑️ Attempting to delete item ${itemId}`);
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      // eslint-disable-next-line no-console
      console.log(`❌ Invalid ObjectId format: ${itemId}`);
      return res.status(400).json({ message: "Invalid item ID format" });
    }
    
    // First check if item exists
    const existingItem = await Item.findById(itemId);
    // eslint-disable-next-line no-console
    console.log(`🔍 Item lookup result:`, existingItem ? `Found (${existingItem._id})` : "Not found");
    
    if (!existingItem) {
      // eslint-disable-next-line no-console
      console.log(`❌ Item ${itemId} not found in database`);
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Delete the item
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      // eslint-disable-next-line no-console
      console.log(`❌ Failed to delete item ${itemId}`);
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Clear cache when item is deleted
    clearCache();
    
    // eslint-disable-next-line no-console
    console.log(`✅ Deleted item ${itemId}`);
    res.json({ message: "Item deleted", id: item._id.toString() });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error deleting item:", err);
    res.status(400).json({ message: "Failed to delete item", error: err.message });
  }
});

