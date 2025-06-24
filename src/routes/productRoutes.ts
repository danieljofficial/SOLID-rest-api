import { Router } from "express";
import { ProductService } from "../services/ProductService";
import prismaService from "../services/prisma.service";
import { ProductController } from "../controllers/ProductController";
import { RoleMiddleware } from "../middlewares/roleMiddleware";
import { RoleService } from "../services/RoleService";

const productRoutes = Router();
const productService = new ProductService(prismaService);
const productController = new ProductController(productService);
const roleMiddleware = new RoleMiddleware(new RoleService(prismaService));

productRoutes.post(
  "/",
  roleMiddleware.requireRole("admin"),
  productController.createProduct.bind(productController)
);
productRoutes.get(
  "/",
  roleMiddleware.requireAnyRole(["admin", "viewer"]),
  productController.getAllProducts.bind(productController)
);
productRoutes.get(
  "/:id",
  roleMiddleware.requireAnyRole(["admin", "viewer"]),
  productController.getProductById.bind(productController)
);
productRoutes.patch(
  "/:id",
  roleMiddleware.requireRole("admin"),
  productController.updateProduct.bind(productController)
);
productRoutes.delete(
  "/:id",
  roleMiddleware.requireRole("admin"),
  productController.deleteProduct.bind(productController)
);
export default productRoutes;
