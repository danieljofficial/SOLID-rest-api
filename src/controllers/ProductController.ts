import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  constructor(private productService: ProductService) {}
  async createProduct(req: Request, res: Response) {
    const { name, description, price } = req.body;
    const newProduct = await this.productService.createProduct(
      name,
      description,
      price
    );
    res.status(201).json(newProduct);
  }

  async getAllProducts(req: Request, res: Response) {
    const products = await this.productService.getAllProducts();
    res.status(200).json(products);
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.productService.getProductById(parseInt(id));
    res.status(200).json(product);
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const updatedProduct = await this.productService.updateProduct(
      parseInt(id),
      req.body
    );
    res.status(200).json(updatedProduct);
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const isDeleted = await this.productService.deleteProduct(parseInt(id));
    res.status(200).json({ success: isDeleted });
  }
}
