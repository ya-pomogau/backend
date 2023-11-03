import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import {
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
  QueryWithHelpers,
  UpdateQuery,
  UpdateWriteOpResult,
  type ObjectId,
} from 'mongoose';

@Injectable()
export abstract class BaseRepositoryService<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async create(
    createEntityDto: Record<string, unknown>
  ): Promise<HydratedDocument<T, unknown, Record<string, unknown>>> {
    const entity = new Model<T>(createEntityDto as T);
    return entity.save();
  }

  async find(
    query: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    HydratedDocument<T, unknown, Record<string, unknown>>[],
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'find'
  > | null> {
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
  ): Promise<QueryWithHelpers<
    HydratedDocument<T, unknown, Record<string, unknown>>[],
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'findOne'
  > | null> {
    return this.entityModel.findOne(
      query,
      {
        __v: false,
        ...projection,
      },
      options
    );
  }

  async updateOne(
    query: FilterQuery<T>,
    updateDto: UpdateQuery<unknown>,
    options: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    UpdateWriteOpResult,
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'updateOne'
  > | null> {
    return this.entityModel.updateOne(query, updateDto, options);
  }

  async replaceOne(
    query: FilterQuery<T>,
    replaceDoc: T,
    options: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    UpdateWriteOpResult,
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'replaceOne'
  > | null> {
    return this.entityModel.replaceOne(query, replaceDoc, options);
  }

  async deleteOne(
    query: FilterQuery<T>,
    options: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    DeleteResult,
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'deleteOne'
  > | null> {
    return this.entityModel.deleteOne(query, options);
  }

  async findOneAndUpdate(
    query: FilterQuery<T>,
    updateDto: UpdateQuery<unknown>,
    options: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    HydratedDocument<T, unknown, Record<string, unknown>>[],
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'findOneAndUpdate'
  > | null> {
    return this.entityModel.findOneAndUpdate(query, updateDto, {
      new: true,
      ...options,
    });
  }

  async findOneAndReplace(
    query: FilterQuery<T>,
    replaceDoc: T,
    options: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    HydratedDocument<T, unknown, Record<string, unknown>>[],
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'findOneAndReplace'
  > | null> {
    return this.entityModel.findOneAndReplace(query, replaceDoc, {
      new: true,
      ...options,
    });
  }

  async findOneAndDelete(
    query: FilterQuery<T>,
    options: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    HydratedDocument<T, unknown, Record<string, unknown>>[],
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'findOneAndDelete'
  > | null> {
    return this.entityModel.findOneAndDelete(query, options);
  }

  async findById(
    id: string | ObjectId,
    projection?: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    HydratedDocument<T, unknown, Record<string, unknown>>[],
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'findOne'
  > | null> {
    return this.entityModel.findById(
      id,
      {
        __v: false,
        ...projection,
      },
      options
    );
  }

  async findByIdAndUpdate(
    id: string | ObjectId,
    updateDto: UpdateQuery<unknown>,
    options: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    HydratedDocument<T, unknown, Record<string, unknown>>[],
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'findOneAndUpdate'
  > | null> {
    return this.entityModel.findByIdAndUpdate(id, updateDto, {
      new: true,
      ...options,
    });
  }

  async findByIdAndDelete(
    id: string | ObjectId,
    options?: Record<string, unknown>
  ): Promise<QueryWithHelpers<
    DeleteResult,
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'findOneAndDelete'
  > | null> {
    return this.entityModel.findByIdAndDelete(id, options);
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
  ): Promise<QueryWithHelpers<
    UpdateWriteOpResult,
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'updateOne'
  > | null> {
    return this.entityModel.updateMany(query, updateDto, options);
  }

  async deleteMany(
    entityFilterQuery: FilterQuery<T>
  ): Promise<QueryWithHelpers<
    DeleteResult,
    HydratedDocument<T, unknown, Record<string, unknown>>,
    Record<string, unknown>,
    T,
    'deleteOne'
  > | null> {
    return this.entityModel.deleteMany(entityFilterQuery);
  }
}
