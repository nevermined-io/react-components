import { initializeNevermined } from '../src/catalog';
import { appConfig } from "./config";

describe('SDK Integration', () => {

  it('initialize sdk successfully', async () => {
    if(process.env.INFURA_TOKEN) {
      console.log('THERE IS A INFURA TOKEN');
    }else {
      console.error('CANNOT FOUND A INFURA TOKEN');
    }

    const response = await initializeNevermined(appConfig);
    expect(response.success).toEqual(true);
  });
});
