/**
 * Wishlist Module
 * Handles wishlist CRUD, multiple wishlists, sharing, and move-to-cart.
 */

import { Application, Request, Response, RequestHandler } from "express";
import * as crypto from "crypto";

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  productBrand?: string;
  productModel?: string;
  addedAt: string;
  inStock?: boolean;
  onSale?: boolean;
  salePrice?: number;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  isPublic?: boolean;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export function registerWishlistRoutes(
  app: Application,
  ctx: {
    wishlists: Map<string, Wishlist>;
    saveWishlists: () => void;
    products: Map<string, any>;
    authMiddleware: RequestHandler;
  }
) {
  app.get("/api/wishlist", ctx.authMiddleware, (req: Request, res: Response) => {
    const userWishlists = Array.from(ctx.wishlists.values()).filter(
      w => w.userId === req.userId
    ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    res.json(userWishlists);
  });

  app.get("/api/wishlist/:id", ctx.authMiddleware, (req: Request, res: Response) => {
    const wishlist = ctx.wishlists.get(req.params.id);
    if (!wishlist || wishlist.userId !== req.userId) {
      if (wishlist?.isPublic) { res.json({ ...wishlist, items: wishlist.items }); return; }
      return res.status(404).json({ error: "Wishlist not found" });
    }
    res.json(wishlist);
  });

  app.post("/api/wishlist", ctx.authMiddleware, (req: Request, res: Response) => {
    if (!req.userId) return res.status(401).json({ error: "Not authenticated" });
    const { name, productId, isPublic } = req.body;
    if (!name) return res.status(400).json({ error: "Wishlist name is required" });

    const wishlist: Wishlist = {
      id: crypto.randomUUID(), userId: req.userId, name,
      isPublic: isPublic || false, items: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };

    if (productId) {
      const product = Array.from(ctx.products.values()).find(p => p.id === productId);
      if (product) {
        wishlist.items.push({
          id: crypto.randomUUID(), productId: product.id, productName: product.name,
          productPrice: product.price, productImage: product.images?.[0],
          productBrand: product.brand, productModel: product.model,
          addedAt: new Date().toISOString(),
          inStock: product.stock > 0,
          onSale: !!product.comparePrice && product.comparePrice > product.price,
          salePrice: product.comparePrice,
        });
      }
    }

    ctx.wishlists.set(wishlist.id, wishlist);
    ctx.saveWishlists();
    res.status(201).json(wishlist);
  });

  app.post("/api/wishlist/:id/items", ctx.authMiddleware, (req: Request, res: Response) => {
    const wishlist = ctx.wishlists.get(req.params.id);
    if (!wishlist || wishlist.userId !== req.userId) return res.status(404).json({ error: "Wishlist not found" });
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "Product ID is required" });
    const existingItem = wishlist.items.find(i => i.productId === productId);
    if (existingItem) return res.status(409).json({ error: "Item already in wishlist" });

    const product = Array.from(ctx.products.values()).find(p => p.id === productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const item: WishlistItem = {
      id: crypto.randomUUID(), productId: product.id, productName: product.name,
      productPrice: product.price, productImage: product.images?.[0],
      productBrand: product.brand, productModel: product.model,
      addedAt: new Date().toISOString(),
      inStock: product.stock > 0,
      onSale: !!product.comparePrice && product.comparePrice > product.price,
      salePrice: product.comparePrice,
    };
    wishlist.items.push(item);
    wishlist.updatedAt = new Date().toISOString();
    ctx.wishlists.set(wishlist.id, wishlist);
    ctx.saveWishlists();
    res.status(201).json({ success: true, wishlist });
  });

  app.delete("/api/wishlist/:id/items/:itemId", ctx.authMiddleware, (req: Request, res: Response) => {
    const wishlist = ctx.wishlists.get(req.params.id);
    if (!wishlist || wishlist.userId !== req.userId) return res.status(404).json({ error: "Wishlist not found" });
    const idx = wishlist.items.findIndex(i => i.id === req.params.itemId);
    if (idx === -1) return res.status(404).json({ error: "Item not found" });
    wishlist.items.splice(idx, 1);
    wishlist.updatedAt = new Date().toISOString();
    ctx.wishlists.set(wishlist.id, wishlist);
    ctx.saveWishlists();
    res.json({ success: true, wishlist });
  });

  app.post("/api/wishlist/:id/items/:itemId/to-cart", ctx.authMiddleware, (req: Request, res: Response) => {
    const wishlist = ctx.wishlists.get(req.params.id);
    if (!wishlist || wishlist.userId !== req.userId) return res.status(404).json({ error: "Wishlist not found" });
    const itemIdx = wishlist.items.findIndex(i => i.id === req.params.itemId);
    if (itemIdx === -1) return res.status(404).json({ error: "Item not found" });

    const item = wishlist.items[itemIdx];
    wishlist.items.splice(itemIdx, 1);
    wishlist.updatedAt = new Date().toISOString();
    ctx.wishlists.set(wishlist.id, wishlist);
    ctx.saveWishlists();

    res.json({
      success: true,
      item: { id: item.productId, name: item.productName, price: item.productPrice, quantity: 1, image: item.productImage || "", brand: item.productBrand || "", model: item.productModel || "", category: "" },
    });
  });

  app.post("/api/wishlist/:id/move-all-to-cart", ctx.authMiddleware, (req: Request, res: Response) => {
    const wishlist = ctx.wishlists.get(req.params.id);
    if (!wishlist || wishlist.userId !== req.userId) return res.status(404).json({ error: "Wishlist not found" });
    const cartItems = wishlist.items.map(item => ({
      id: item.productId, name: item.productName, price: item.productPrice, quantity: 1,
      image: item.productImage || "", brand: item.productBrand || "", model: item.productModel || "", category: "",
    }));
    wishlist.items = [];
    wishlist.updatedAt = new Date().toISOString();
    ctx.wishlists.set(wishlist.id, wishlist);
    ctx.saveWishlists();
    res.json({ success: true, items: cartItems });
  });

  app.put("/api/wishlist/:id", ctx.authMiddleware, (req: Request, res: Response) => {
    const wishlist = ctx.wishlists.get(req.params.id);
    if (!wishlist || wishlist.userId !== req.userId) return res.status(404).json({ error: "Wishlist not found" });
    const { name, isPublic } = req.body;
    if (name) wishlist.name = name;
    if (isPublic !== undefined) wishlist.isPublic = isPublic;
    wishlist.updatedAt = new Date().toISOString();
    ctx.wishlists.set(wishlist.id, wishlist);
    ctx.saveWishlists();
    res.json(wishlist);
  });

  app.delete("/api/wishlist/:id", ctx.authMiddleware, (req: Request, res: Response) => {
    const wishlist = ctx.wishlists.get(req.params.id);
    if (!wishlist || wishlist.userId !== req.userId) return res.status(404).json({ error: "Wishlist not found" });
    ctx.wishlists.delete(req.params.id);
    ctx.saveWishlists();
    res.json({ success: true });
  });

  app.post("/api/wishlist/:id/share", ctx.authMiddleware, (req: Request, res: Response) => {
    const wishlist = ctx.wishlists.get(req.params.id);
    if (!wishlist || wishlist.userId !== req.userId) return res.status(404).json({ error: "Wishlist not found" });
    wishlist.isPublic = true;
    wishlist.updatedAt = new Date().toISOString();
    ctx.wishlists.set(wishlist.id, wishlist);
    ctx.saveWishlists();
    res.json({ success: true, shareUrl: `/wishlist/${wishlist.id}`, wishlist });
  });

  console.log("✅ Wishlist routes registered");
}
