import { BadRequestError, NotFoundError } from "../errors/genericErrors";
import { handlePrismaError } from "../errors/prismaErrors";
import { IProduct } from "../interfaces/product/IProduct";
import { IProductService } from "../interfaces/product/IProductService";
import { PrismaService } from "./prisma.service";

export class ProductService implements IProductService {
  constructor(private prismaService: PrismaService) {}
  async createProduct(
    name: string,
    description: string,
    price: number
  ): Promise<IProduct | null> {
    if (!name || !description || !price) {
      throw new BadRequestError("All Fields Required!");
    }

    try {
      const newProduct = await this.prismaService.prisma.product.create({
        data: { name, description, price },
      });
      return newProduct;
    } catch (error) {
      handlePrismaError(error);
      return null;
    }
  }

  async getAllProducts(): Promise<IProduct[]> {
    let products = await this.prismaService.prisma.product.findMany();
    return products;
  }

  async getProductById(id: number): Promise<IProduct> {
    const product = await this.prismaService.prisma.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError("User does not exist");
    }

    return product;
  }

  async updateProduct(
    id: number,
    productData: Partial<IProduct>
  ): Promise<Partial<IProduct> | null> {
    try {
      const updatedProduct = await this.prismaService.prisma.product.update({
        where: { id },
        data: productData,
      });
      return updatedProduct;
    } catch (error) {
      handlePrismaError(error);
      return null;
    }
  }

  async deleteProduct(id: number): Promise<boolean | null> {
    try {
      await this.prismaService.prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      handlePrismaError(error);
      return null;
    }
  }
}
