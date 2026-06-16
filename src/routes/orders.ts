import { Router, Request, Response } from "express";
import { cart, products, orders } from "../data/store";
import { Order, OrderItem } from "../types";

const router = Router();

// POST /orders - place an order from the current cart
router.post("/", (req: Request, res: Response) => {
  if (cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  // First, check stock for everything in the cart before changing anything
  for (const item of cart) {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      return res.status(404).json({ error: `Product ${item.productId} not found` });
    }

    if (product.stock < item.quantity) {
      return res.status(409).json({
        error: `Not enough stock for ${product.name}. Available: ${product.stock}`,
      });
    }
  }

  // All good — build order items, reduce stock
  const orderItems: OrderItem[] = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    product.stock -= item.quantity;

    return {
      productId: item.productId,
      name: product.name,
      quantity: item.quantity,
      priceAtPurchase: product.price,
    };
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  const newOrder: Order = {
    id: String(Date.now()),
    items: orderItems,
    total,
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  // Clear the cart
  cart.length = 0;

  res.status(201).json(newOrder);
});

// GET /orders - get all orders
router.get("/", (req: Request, res: Response) => {
  res.status(200).json(orders);
});

// GET /orders/:id - get a single order
router.get("/:id", (req: Request, res: Response) => {
  const order = orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.status(200).json(order);
});

export default router;