import { randomInt } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShortIdFactory {
  private static toBase62(num: number): string {
    const BASE62 =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let str = '';
    while (num > 0) {
      str = BASE62[num % 62] + str;
      num = Math.floor(num / 62);
    }
    return str || '0';
  }

  get(): string {
    const timestamp = Date.now() % 1e8; // last 8 digits of timestamp (~27 bits)
    const random = randomInt(0, 62 ** 3); // ~18 bits of randomness
    const idNumber = timestamp * 62 ** 3 + random; // combine both

    return ShortIdFactory.toBase62(idNumber).padStart(7, '0').slice(0, 7); // trim to 7 chars
  }
}
