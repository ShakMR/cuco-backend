import { join } from 'node:path';
import { access, writeFile } from 'node:fs/promises';
import Currency from '../src/__e2e__/__mocks__/currency.mock';
import PaymentType from '../src/__e2e__/__mocks__/payment-type.mock';

const basePath = join('/', 'tmp', 'e2e.db');

const fileExists = async (path: string) => {
  try {
    await access(path);
    return true;
  } catch (err) {
    return false;
  }
};

const createEntity = async (name, rawValue) => {
  try {
    const fileName = join(basePath, name);
    if (await fileExists(fileName)) {
      return;
    }

    console.log(`Creating entity ${name}`);
    await writeFile(fileName, JSON.stringify(rawValue));
  } catch (e) {
    console.error(e);
  }
};

createEntity('Currency', [Currency]).catch(console.error);
createEntity('PaymentType', [PaymentType]).catch(console.error);
