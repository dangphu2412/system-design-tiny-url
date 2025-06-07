import { randomInt } from 'crypto';
import { ShortIdFactory } from '../tiny-url/shortid-factory';

jest.mock('crypto');

describe(ShortIdFactory.name, () => {
  let factory: ShortIdFactory;
  let mockRandomInt = randomInt as jest.Mock;

  beforeEach(() => {
    factory = new ShortIdFactory();
  });

  it('should return a 7-character string', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1749269845638); // Mock timestamp

    mockRandomInt.mockReturnValue(12345); // Mock randomness

    const id = factory.get();

    expect(typeof id).toBe('string');
    expect(id).toHaveLength(7);
  });

  it('should ensures chronological', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1716901234567);
    mockRandomInt.mockReturnValue(11111);

    const id1 = factory.get();

    jest.spyOn(Date, 'now').mockReturnValue(1716901234568);
    mockRandomInt.mockReturnValue(99999);
    const id2 = factory.get();

    expect(id1 < id2).toBeTruthy(); // same input -> same output
  });

  it('should generate different IDs with different timestamps or randomness', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1716901234567);
    mockRandomInt.mockReturnValue(12345);
    const id1 = factory.get();

    jest.spyOn(Date, 'now').mockReturnValue(1716901234568);
    mockRandomInt.mockReturnValue(54321);
    const id2 = factory.get();

    expect(id1).not.toBe(id2);
  });
});
