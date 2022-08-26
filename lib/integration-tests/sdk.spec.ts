import { initializeNevermined } from '../src/catalog';
import { appConfig } from "./config";

describe('SDK Integration', () => {

  it('initialize sdk successfully', async () => {
    const response = await initializeNevermined(appConfig);
    expect(response.success).toEqual(true);
  });
});
