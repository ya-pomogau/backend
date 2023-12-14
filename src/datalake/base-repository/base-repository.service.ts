import { DeleteResult, UpdateResult } from 'mongodb';
import {
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
  UpdateQuery,
  type ObjectId,
} from 'mongoose';

import { POJOType } from '../../common/types/pojo.type';

export abstract class BaseRepositoryService<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async create(createEntityDto: Record<string, unknown>): Promise<POJOType<T>> {
    const entity = await this.entityModel.create(createEntityDto as T);
    return (await entity.save()).toObject();
  }

  async find(
    query: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<Array<POJOType<T>>> {
    return this.entityModel.find(
      query,
      {
        __v: false,
        ...projection,
      },
      options
    );
  }

  async findOne(
    query: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<POJOType<T>> {
    const doc = await this.entityModel
      .findOne(
        query,
        {
          __v: false,
          ...projection,
        },
        options
      )
      .exec();
    return doc ? doc.toObject() : null;
  }

  async updateOne(
    query: FilterQuery<T>,
    updateDto: UpdateQuery<unknown>,
    options: Record<string, unknown>
  ): Promise<POJOType<T>> {
    const res: UpdateResult = await this.entityModel.updateOne(query, updateDto, options);
    let doc: Document<T> | null = null;
    if (res.acknowledged) {
      doc = await this.entityModel.findOne(query).exec();
    }
    return doc ? doc.toObject() : null;
  }

  async replaceOne(
    query: FilterQuery<T>,
    replaceDoc: T,
    options: Record<string, unknown>
  ): Promise<POJOType<T>> {
    const res: UpdateResult = await this.entityModel.replaceOne(query, replaceDoc, options);
    let doc: Document<T> | null = null;
    if (res.acknowledged) {
      doc = await this.entityModel.findOne(query).exec();
    }
    return doc ? doc.toObject() : null;
  }

  async deleteOne(query: FilterQuery<T>, options: Record<string, unknown>): Promise<DeleteResult> {
    return this.entityModel.deleteOne(query, options);
  }

  async findOneAndUpdate(
    query: FilterQuery<T>,
    updateDto: UpdateQuery<unknown>,
    options: Record<string, unknown>
  ): Promise<POJOType<T>> {
    const doc: Document<T> = await this.entityModel.findOneAndUpdate(query, updateDto, {
      new: true,
      ...options,
    });
    return doc.toObject();
  }

  async findOneAndReplace(
    query: FilterQuery<T>,
    replaceDoc: T,
    options: Record<string, unknown>
  ): Promise<POJOType<T>> {
    const doc = await this.entityModel
      .findOneAndReplace(query, replaceDoc, {
        new: true,
        ...options,
      })
      .exec();
    return doc.toObject();
  }

  async findOneAndDelete(
    query: FilterQuery<T>,
    options: Record<string, unknown>
  ): Promise<POJOType<T>> {
    const doc = await this.entityModel.findOneAndDelete(query, options).exec();
    return doc.toObject();
  }

  async findById(
    id: string | ObjectId,
    projection?: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<POJOType<T>> {
    const doc = await this.entityModel
      .findById(
        id,
        {
          __v: false,
          ...projection,
        },
        options
      )
      .exec();
    return doc.toObject();
  }

  async findByIdAndUpdate(
    id: string | ObjectId,
    updateDto: UpdateQuery<unknown>,
    options: Record<string, unknown>
  ): Promise<POJOType<T>> {
    const doc = await this.entityModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
        ...options,
      })
      .exec();
    return doc.toObject();
  }

  async findByIdAndDelete(
    id: string | ObjectId,
    options?: Record<string, unknown>
  ): Promise<POJOType<T>> {
    const doc = await this.entityModel.findByIdAndDelete(id, options).exec();
    return doc.toObject();
  }

  async insertMany(
    docs: Array<T>
  ): Promise<Array<HydratedDocument<T, unknown, Record<string, unknown>>>> {
    return this.entityModel.insertMany(docs);
  }

  async updateMany(
    query: FilterQuery<T>,
    updateDto: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<Array<POJOType<T>>> {
    const res = await this.entityModel.updateMany(query, updateDto, options).exec();
    if (res.acknowledged) {
      return this.entityModel.find(
        query,
        {
          __v: false,
        },
        options
      );
    }
    return null;
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<DeleteResult> {
    return this.entityModel.deleteMany(entityFilterQuery);
  }
}
