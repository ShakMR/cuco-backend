import { MemoryDBService, MemoryNotFound } from '../memory-db.service';
import { MemoryDbRepository } from '../memory-db.repository';

type Schema = {
  id: number;
  uuid: string;
  name: string;
  type: string;
  created_at: Date;
};

describe('MemoryDBService', () => {
  let memoryDB: MemoryDBService<Schema>;
  const record1: Schema = {
    id: 1,
    uuid: 'uuid',
    name: 'name',
    type: 'common',
    created_at: new Date(),
  };
  const record2: Schema = {
    id: 2,
    uuid: 'uuid2',
    name: 'name2',
    type: 'common',
    created_at: new Date(),
  };

  beforeEach(() => {
    memoryDB = new MemoryDBService<Schema>(new MemoryDbRepository());
    memoryDB.init('testTable');
    memoryDB.initData([record1, record2]);
  });

  describe('find', () => {
    it('should return a matching element when filter provided', async () => {
      const record = await memoryDB.find({ name: 'name' });

      expect(record).toEqual(record1);
    });

    it('should return undefined when filters do not match', async () => {
      const record = await memoryDB.find({ name: 'nonexistent' });

      expect(record).toBeUndefined();
    });

    it('should return matching element with multiple filters', async () => {
      const record = await memoryDB.find({ uuid: 'uuid2', name: 'name2' });

      expect(record).toEqual(record2);
    });
  });

  describe('findAll', () => {
    it('should return multiple matching element when filter provided', async () => {
      const records = await memoryDB.findAll({ type: 'common' });

      expect(records.length).toBe(2);
    });

    it('should return single matching element in an array', async () => {
      const records = await memoryDB.findAll({ uuid: 'uuid' });

      expect(Array.isArray(records)).toBeTruthy();
      expect(records.length).toBe(1);
    });

    it('should return empty array if no match', async () => {
      const records = await memoryDB.findAll({ type: 'none' });

      expect(records.length).toBe(0);
    });
  });

  describe('findSet', () => {
    it('should return multiple elements', async () => {
      const records = await memoryDB.findSet('name', ['name', 'name2']);

      expect(records.length).toBe(2);
    });

    it('should return none if no value in array', async () => {
      const records = await memoryDB.findSet('name', ['no-name', 'no-name2']);

      expect(records.length).toBe(0);
    });
  });

  describe('getAll', () => {
    it('should return all', async () => {
      const records = await memoryDB.getAll();

      expect(records.length).toBe(2);
    });
  });

  describe('getBy', () => {
    it('should fail if theres no match', async () => {
      await expect(memoryDB.getBy({ name: 'non-existing' })).rejects.toThrow(
        MemoryNotFound,
      );
    });

    it('should return single entry matching filter', async () => {
      const record = await memoryDB.getBy({ uuid: 'uuid' });
      expect(record).toEqual(record1);
    });
  });

  describe('getById', () => {
    it("should throw if id doesn't exist", async () => {
      await expect(memoryDB.getById(20342)).rejects.toThrow(MemoryNotFound);
    });

    it('should return single entry matching id', async () => {
      const record = await memoryDB.getById(1);

      expect(record).toEqual(record1);
    });
  });

  describe('init', () => {
    it('should store tableName', () => {
      memoryDB.init('tableName');
      expect(memoryDB.getTableName()).toBe('tableName');
    });
  });

  describe('save', () => {
    it('should save entry', async () => {
      const newRecord: Partial<Schema> = {
        uuid: 'uuid-3',
        name: 'newRecord',
        type: 'common',
        created_at: new Date(),
      };

      const record = await memoryDB.save(newRecord, true);

      expect(record).toEqual({ id: 3, ...newRecord });

      const foundRecord = await memoryDB.getById(3);
      expect(foundRecord).toEqual(record);
    });
  });
});
