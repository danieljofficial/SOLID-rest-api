import { IProduct } from "../interfaces/product/IProduct";
import { IProductService } from "../interfaces/product/IProductService";
import prismaService, { PrismaService } from "./prisma.service";

export class ProductService implements IProductService {
  constructor(prismaService: PrismaService) {}
  async createProduct(
    productData: Omit<IProduct, "id" | "createdAt" | "updatedAt">
  ): Promise<IProduct> {
    const newProduct = await prismaService.prisma.product.create({
      data: productData,
    });
    return newProduct;
  }
  getAllProducts(): Promise<IProduct[]> {
    throw new Error("Method not implemented.");
  }
  getProductById(id: number): Promise<IProduct> {
    throw new Error("Method not implemented.");
  }
  updateProduct(
    id: number,
    productData: Partial<IProduct>
  ): Promise<Partial<IProduct>> {
    throw new Error("Method not implemented.");
  }
  deleteProduct(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
