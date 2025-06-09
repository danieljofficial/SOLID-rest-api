import { Router } from "express";
import { ProductService } from "../services/ProductService";
import prismaService from "../services/prisma.service";
import { ProductController } from "../controllers/ProductController";

const productRoutes = Router();
const productService = new ProductService(prismaService);
const productController = new ProductController(productService);

productRoutes.post(
  "/",
  productController.createProduct.bind(productController)
);
productRoutes.get(
  "/",
  productController.getAllProducts.bind(productController)
);
productRoutes.get(
  "/:id",
  productController.getProductById.bind(productController)
);
productRoutes.patch(
  "/:id",
  productController.updateProduct.bind(productController)
);
productRoutes.delete(
  "/:id",
  productController.deleteProduct.bind(productController)
);
export default productRoutes;
