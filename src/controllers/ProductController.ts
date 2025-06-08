import { Request, Response } from "express";
import { IProduct } from "../interfaces/product/IProduct";
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
}
