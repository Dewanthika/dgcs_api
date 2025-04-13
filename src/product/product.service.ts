import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name, {
    timestamp: true,
  });
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly fileService: FilesService,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto, file: string) {
    let product: ProductDocument;
    try {
      const existingProduct = await this.productModel.findOne({
        batchCode: createProductDto.productName,
      });
      if (existingProduct) {
        throw new ConflictException('This Batch already exists');
      }

      let imageURL = '';
      if (file) {
        try {
          const uploadResult = await this.fileService.uploadBase64(
            file,
            'imgUrl',
          ); // Pass string directly
          if ('secure_url' in uploadResult) {
            console.log('Image uploaded successfully:', uploadResult);
            imageURL = uploadResult.secure_url;
          } else {
            throw new Error('File upload failed');
          }
        } catch (error) {
          this.logger.error('Error uploading image to Cloudinary:', error);
          throw new ConflictException('File processing failed');
        }
      }

      product = await this.productModel.create({
        ...createProductDto,
        imageURL,
      });
    } catch (error) {
      this.logger.error('Error creating product:', error);
      throw new ConflictException(`Error creating product: ${error.message}`);
    }

    return product;
  }

  // Get all products
  async findAll() {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      this.logger.error('Error fetching products:', error);
      throw new ConflictException('Error fetching products');
    }
  }

  // Get one product by ID
  async findOne(id: number) {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      this.logger.error('Error fetching product:', error);
      throw new ConflictException('Error fetching product');
    }
  }

  // Update a product by ID
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file: string, // changed from Express.Multer.File to base64 string
  ) {
    try {
      // Retain the existing image URL if no new image is uploaded
      let imageUrl = updateProductDto.imageURL || '';

      // If a new image file is provided (base64 string)
      if (file) {
        try {
          const uploadResult = await this.fileService.uploadBase64(
            file,
            'product-image',
          );

          if ('secure_url' in uploadResult) {
            imageUrl = uploadResult.secure_url; // Use the uploaded image URL
          } else {
            throw new Error('File upload failed');
          }
        } catch (uploadError) {
          this.logger.error(
            'Error uploading image to Cloudinary:',
            uploadError,
          );
          throw new ConflictException('File processing failed');
        }
      } else if (!imageUrl) {
        // If no new file and no image URL exists, use the previously saved image URL
        const product = await this.productModel.findById(id);
        if (!product) {
          throw new ConflictException('Product not found');
        }
        imageUrl = product.imageURL; // Use the previous image URL
      }

      // Update the product with the new or existing image URL
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        {
          ...updateProductDto,
          imgUrl: imageUrl, // Updated image URL
        },
        { new: true },
      );

      if (!updatedProduct) {
        throw new ConflictException('Product not found');
      }

      return updatedProduct;
    } catch (error) {
      this.logger.error('Error updating product:', error);
      throw new ConflictException('Error updating product');
    }
  }

  // Remove a product by ID
  async remove(id: number) {
    try {
      const product = await this.productModel.findByIdAndDelete(id);
      if (!product) {
        throw new ConflictException('Product not found');
      }
      return { message: 'Product successfully removed' };
    } catch (error) {
      this.logger.error('Error removing product:', error);
      throw new ConflictException('Error removing product');
    }
  }
}
