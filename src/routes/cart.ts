import { Router, Request, Response } from "express";
import { cart, products } from "../data/store";

const router = Router();

// Helper: build cart response with calculated prices and totals
function buildCartResponse() {
  const items = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const price = product ? product.price : 0;
    const name = product ? product.name : "Unknown Product";
    const subtotal = price * item.quantity;

    return {
      productId: item.productId,
      name,
      price,
      quantity: item.quantity,
      subtotal,
    };
  });

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return { items, total };
}

// GET /cart - get the cart with subtotals and total
router.get("/", (req: Request, res: Response) => {
  res.status(200).json(buildCartResponse());
});

// POST /cart - add an item to the cart
router.post("/", (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "productId and a positive quantity are required" });
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (product.stock < quantity) {
    return res.status(409).json({ error: "Not enough stock available" });
  }

  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  res.status(201).json(buildCartResponse());
});

// PUT /cart/:productId - update quantity of an item
router.put("/:productId", (req: Request, res: Response) => {
  const { quantity } = req.body;

  if (typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "A positive quantity is required" });
  }

  const item = cart.find((i) => i.productId === req.params.productId);

  if (!item) {
    return res.status(404).json({ error: "Item not found in cart" });
  }

  const product = products.find((p) => p.id === req.params.productId);

  if (product && product.stock < quantity) {
    return res.status(409).json({ error: "Not enough stock available" });
  }

  item.quantity = quantity;
  res.status(200).json(buildCartResponse());
});

// DELETE /cart/:productId - remove an item
router.delete("/:productId", (req: Request, res: Response) => {
  const index = cart.findIndex((i) => i.productId === req.params.productId);

  if (index === -1) {
    return res.status(404).json({ error: "Item not found in cart" });
  }

  cart.splice(index, 1);
  res.status(200).json(buildCartResponse());
});

// DELETE /cart - clear the cart
router.delete("/", (req: Request, res: Response) => {
  cart.length = 0;
  res.status(200).json(buildCartResponse());
});

export default router;