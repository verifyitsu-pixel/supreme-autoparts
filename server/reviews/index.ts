/**
 * Reviews Module
 * Handles product reviews, ratings, helpful votes, and admin moderation.
 */

import { Application, Request, Response, RequestHandler } from "express";
import * as crypto from "crypto";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verifiedPurchase: boolean;
  orderId?: string;
  isApproved: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  adminResponse?: string;
  adminResponseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export function registerReviewRoutes(
  app: Application,
  ctx: {
    reviews: Map<string, Review>;
    saveReviews: () => void;
    products: Map<string, any>;
    users: Map<string, any>;
    orders: Map<string, any>;
    authMiddleware: RequestHandler;
  }
) {
  app.get("/api/reviews", (req: Request, res: Response) => {
    const { productId } = req.query;
    let allReviews = Array.from(ctx.reviews.values()).filter(r => r.isApproved);
    if (productId) allReviews = allReviews.filter(r => r.productId === productId);
    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(allReviews);
  });

  app.get("/api/reviews/stats/:productId", (req: Request, res: Response) => {
    const productReviews = Array.from(ctx.reviews.values()).filter(
      r => r.productId === req.params.productId && r.isApproved
    );
    const totalReviews = productReviews.length;
    const averageRating = totalReviews > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    const ratingDistribution = [0, 0, 0, 0, 0];
    productReviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) ratingDistribution[r.rating - 1]++; });
    res.json({
      totalReviews, averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      reviews: productReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  });

  app.post("/api/reviews", ctx.authMiddleware, (req: Request, res: Response) => {
    if (!req.userId) return res.status(401).json({ error: "Not authenticated" });
    const { productId, rating, title, content, orderId } = req.body;
    if (!productId || !rating || !title || !content) {
      return res.status(400).json({ error: "Product ID, rating, title, and content are required" });
    }
    if (rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be between 1 and 5" });

    const product = Array.from(ctx.products.values()).find(p => p.id === productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const user = ctx.users.get(req.userId);
    let verifiedPurchase = false;
    if (orderId) {
      const order = ctx.orders.get(orderId);
      if (order && order.userId === req.userId) {
        const orderedItem = order.items?.find((item: any) => item.name === product.name || item.sku === product.sku);
        if (orderedItem) verifiedPurchase = true;
      }
    }

    const existingReview = Array.from(ctx.reviews.values()).find(
      r => r.productId === productId && r.userId === req.userId
    );
    if (existingReview) return res.status(409).json({ error: "You have already reviewed this product" });

    const review: Review = {
      id: crypto.randomUUID(), productId, userId: req.userId,
      userName: user?.name || "Anonymous", rating, title, content,
      images: [], verifiedPurchase, orderId: orderId || "",
      isApproved: true, helpfulCount: 0, unhelpfulCount: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    ctx.reviews.set(review.id, review);
    ctx.saveReviews();
    res.status(201).json(review);
  });

  app.put("/api/reviews/:id", ctx.authMiddleware, (req: Request, res: Response) => {
    const review = ctx.reviews.get(req.params.id);
    if (!review || review.userId !== req.userId) return res.status(404).json({ error: "Review not found" });
    const { rating, title, content } = req.body;
    if (rating !== undefined && (rating < 1 || rating > 5)) return res.status(400).json({ error: "Rating must be between 1 and 5" });
    if (rating !== undefined) review.rating = rating;
    if (title) review.title = title;
    if (content) review.content = content;
    review.updatedAt = new Date().toISOString();
    ctx.reviews.set(review.id, review);
    ctx.saveReviews();
    res.json(review);
  });

  app.delete("/api/reviews/:id", ctx.authMiddleware, (req: Request, res: Response) => {
    const review = ctx.reviews.get(req.params.id);
    if (!review || review.userId !== req.userId) return res.status(404).json({ error: "Review not found" });
    ctx.reviews.delete(req.params.id);
    ctx.saveReviews();
    res.json({ success: true });
  });

  app.post("/api/reviews/:id/helpful", ctx.authMiddleware, (req: Request, res: Response) => {
    const review = ctx.reviews.get(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    review.helpfulCount = (review.helpfulCount || 0) + 1;
    ctx.reviews.set(review.id, review);
    ctx.saveReviews();
    res.json({ success: true, helpfulCount: review.helpfulCount });
  });

  app.post("/api/reviews/:id/unhelpful", ctx.authMiddleware, (req: Request, res: Response) => {
    const review = ctx.reviews.get(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    review.unhelpfulCount = (review.unhelpfulCount || 0) + 1;
    ctx.reviews.set(review.id, review);
    ctx.saveReviews();
    res.json({ success: true, unhelpfulCount: review.unhelpfulCount });
  });

  // Admin review moderation
  app.get("/api/admin/reviews", (req: Request, res: Response) => {
    const allReviews = Array.from(ctx.reviews.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(allReviews);
  });

  app.put("/api/admin/reviews/:id/approve", (req: Request, res: Response) => {
    const review = ctx.reviews.get(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    review.isApproved = true;
    review.updatedAt = new Date().toISOString();
    ctx.reviews.set(review.id, review);
    ctx.saveReviews();
    res.json({ success: true });
  });

  app.put("/api/admin/reviews/:id/reject", (req: Request, res: Response) => {
    const review = ctx.reviews.get(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    review.isApproved = false;
    review.updatedAt = new Date().toISOString();
    ctx.reviews.set(review.id, review);
    ctx.saveReviews();
    res.json({ success: true });
  });

  app.put("/api/admin/reviews/:id/respond", (req: Request, res: Response) => {
    const review = ctx.reviews.get(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    const { response } = req.body;
    if (!response) return res.status(400).json({ error: "Response is required" });
    review.adminResponse = response;
    review.adminResponseDate = new Date().toISOString();
    review.updatedAt = new Date().toISOString();
    ctx.reviews.set(review.id, review);
    ctx.saveReviews();
    res.json({ success: true });
  });

  app.delete("/api/admin/reviews/:id", (req: Request, res: Response) => {
    ctx.reviews.delete(req.params.id);
    ctx.saveReviews();
    res.json({ success: true });
  });

  console.log("✅ Review routes registered");
}
