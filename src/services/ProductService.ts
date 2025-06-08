import { BadRequestError } from "../errors/genericErrors";
import { handlePrismaError } from "../errors/prismaErrors";
import { IProduct } from "../interfaces/product/IProduct";
import { IProductService } from "../interfaces/product/IProductService";
import prismaService, { PrismaService } from "./prisma.service";

export class ProductService implements IProductService {
  constructor(prismaService: PrismaService) {}
  async createProduct(
    name: string,
    description: string,
    price: number
  ): Promise<IProduct | null> {
    if (!name || !description || !price) {
      throw new BadRequestError("All Fields Required!");
    }

    try {
      const newProduct = await prismaService.prisma.product.create({
        data: { name, description, price },
      });
      return newProduct;
    } catch (error) {
      handlePrismaError(error);
      return null;
    }
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
