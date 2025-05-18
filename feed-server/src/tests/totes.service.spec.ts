import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { In, Repository } from 'typeorm';
import { TotesService } from '../totes/totes.service';
import { ToteEntity } from '../totes/entities/tote.entity';

describe(TotesService.name, () => {
  let totesService: TotesService;
  let repository: Repository<ToteEntity>;
  let cache: Cache;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TotesService,
        {
          provide: getRepositoryToken(ToteEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            mget: jest.fn(),
            set: jest.fn(),
            mset: jest.fn(),
          },
        },
      ],
    }).compile();

    totesService = moduleRef.get(TotesService);
    repository = moduleRef.get(getRepositoryToken(ToteEntity));
    cache = moduleRef.get(CACHE_MANAGER);
  });

  describe('findAll', () => {
    it('should fetch totes from DAL and store to cache', async () => {
      const sampleDate = new Date();
      const response = [
        {
          id: '1',
          name: 'name1',
          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
        {
          id: '2',
          name: 'name2',
          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
      ];
      jest.spyOn(cache, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'find').mockResolvedValue(response);

      expect(await totesService.findAll(1, 10)).toEqual(response);
      expect(repository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(cache.set).toHaveBeenCalledWith(
        'totes:1:10',
        ['totes:1', 'totes:2'],
        10000,
      );
      expect(cache.mset).toHaveBeenCalledWith([
        {
          key: 'totes:1',
          value: {
            id: '1',
            name: 'name1',
            createdAt: sampleDate,
            updatedAt: sampleDate,
          },
          ttl: 10000,
        },
        {
          key: 'totes:2',
          value: {
            id: '2',
            name: 'name2',
            createdAt: sampleDate,
            updatedAt: sampleDate,
          },
          ttl: 10000,
        },
      ]);
    });

    it('should hit full cached posts from cache store', async () => {
      const sampleDate = new Date();
      const response = [
        {
          id: '1',
          name: 'name1',

          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
        {
          id: '2',
          name: 'name2',

          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
      ];
      jest.spyOn(cache, 'get').mockResolvedValue(['totes:1', 'totes:2']);
      jest.spyOn(cache, 'mget').mockResolvedValue([
        {
          id: '1',
          name: 'name1',

          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
        {
          id: '2',
          name: 'name2',

          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
      ]);

      expect(await totesService.findAll(1, 10)).toEqual(response);
      expect(cache.get).toHaveBeenCalledWith('totes:1:10');
      expect(cache.mget).toHaveBeenCalledWith(['totes:1', 'totes:2']);
    });

    it('should hit partially cached posts from cache store and then merge the patches from DAL', async () => {
      const sampleDate = new Date();
      const response = [
        {
          id: '1',
          name: 'name1',

          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
        {
          id: '2',
          name: 'name2',

          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
      ];
      jest.spyOn(cache, 'get').mockResolvedValue(['totes:1', 'totes:2']);
      // Get details only hit first post
      jest.spyOn(cache, 'mget').mockResolvedValue([
        {
          id: '1',
          name: 'name1',

          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
        null,
      ]);
      // Call database to get missing cached
      jest.spyOn(repository, 'find').mockResolvedValue([
        {
          id: '2',
          name: 'name2',
          createdAt: sampleDate,
          updatedAt: sampleDate,
        },
      ]);

      expect(await totesService.findAll(1, 10)).toEqual(response);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          id: In(['2']),
        },
      });

      expect(cache.get).toHaveBeenCalledWith('totes:1:10');
      expect(cache.mget).toHaveBeenCalledWith(['totes:1', 'totes:2']);
      expect(cache.set).toHaveBeenCalledWith(
        'totes:1:10',
        ['totes:1', 'totes:2'],
        10000,
      );
      expect(cache.mset).toHaveBeenCalledWith([
        {
          key: 'totes:1',
          value: {
            id: '1',
            name: 'name1',

            createdAt: sampleDate,
            updatedAt: sampleDate,
          },
          ttl: 10000,
        },
        {
          key: 'totes:2',
          value: {
            id: '2',
            name: 'name2',

            createdAt: sampleDate,
            updatedAt: sampleDate,
          },
          ttl: 10000,
        },
      ]);
    });
  });
});
