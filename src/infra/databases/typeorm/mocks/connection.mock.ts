import { IMemoryDb, newDb } from 'pg-mem';

export const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db: IMemoryDb = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/databases/typeorm/entities/*.entity.ts'],
  });
  await connection.synchronize();
  return db;
};
