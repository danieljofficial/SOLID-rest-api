import { IProduct } from "./IProduct";

export interface IProductService {
  createProduct(
    name: string,
    description: string,
    price: number
  ): Promise<IProduct | null>;
  getAllProducts(): Promise<IProduct[]>;
  getProductById(id: number): Promise<IProduct | null>;
  updateProduct(
    id: number,
    productData: Partial<IProduct>
  ): Promise<Partial<IProduct> | null>;
  deleteProduct(id: number): Promise<boolean | null>;
}
