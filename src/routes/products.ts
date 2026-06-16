import { Router, Request, Response } from "express";
import { products } from "../data/store";
import { Product } from "../types";

const router = Router();

// GET /products - get all products, with optional filtering + pagination
router.get("/", (req: Request, res: Response) => {
  let result = products;

  const { category, minPrice, maxPrice, page, limit } = req.query;

  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (minPrice) {
    const min = Number(minPrice);
    result = result.filter((p) => p.price >= min);
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    result = result.filter((p) => p.price <= max);
  }

  const totalItems = result.length;

  const pageNum = page ? Number(page) : 1;
  const limitNum = limit ? Number(limit) : 10;

  if (pageNum < 1 || limitNum < 1) {
    return res.status(400).json({ error: "page and limit must be positive numbers" });
  }

  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedResult = result.slice(startIndex, endIndex);

  res.status(200).json({
    data: paginatedResult,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(totalItems / limitNum),
      totalItems,
      limit: limitNum,
    },
  });
});

// GET /products/:id - get a single product
router.get("/:id", (req: Request, res: Response) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json(product);
});

// POST /products - add a new product
router.post("/", (req: Request, res: Response) => {
  const { name, description, price, category, stock, imageUrl } = req.body;

  if (!name || !description || price === undefined || !category || stock === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }

  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({ error: "Stock must be a positive number" });
  }

  const newProduct: Product = {
    id: String(Date.now()),
    name,
    description,
    price,
    category,
    stock,
    imageUrl,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /products/:id - update a product
router.put("/:id", (req: Request, res: Response) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { name, description, price, category, stock, imageUrl } = req.body;

  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }

  if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
    return res.status(400).json({ error: "Stock must be a positive number" });
  }

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;
  if (stock !== undefined) product.stock = stock;
  if (imageUrl !== undefined) product.imageUrl = imageUrl;

  res.status(200).json(product);
});

// DELETE /products/:id - delete a product
router.delete("/:id", (req: Request, res: Response) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const deleted = products.splice(index, 1)[0];
  res.status(200).json(deleted);
});

export default router;