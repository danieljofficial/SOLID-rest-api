import { IProduct } from "./IProduct";

export interface IProductService {
  createProduct(
    productData: Omit<IProduct, "id" | "createdAt" | "updatedAt">
  ): Promise<IProduct>;
  getAllProducts(): Promise<IProduct[]>;
  getProductById(id: number): Promise<IProduct>;
  updateProduct(
    id: number,
    productData: Partial<IProduct>
  ): Promise<Partial<IProduct>>;
  deleteProduct(id: number): Promise<boolean>;
}
