import BrowserProvider from './BrowserProvider';


describe("BrowserProvider", () => {
  let provider: typeof BrowserProvider;
  beforeEach(() => {
    provider = BrowserProvider;
  })

  it("Should instantiate", () => {
    expect(provider).toBeDefined();
  });

  it("Should return null for web3-provider when instantiated", () => {
    expect(provider.getProvider()).toBeNull();
  });

  it("Should return logged in false when instantiated", async () => {
    await expect(provider.isLoggedIn()).resolves.toBe(false);
  });

  // it("should be able to login", async () => {

  //   // await expect(provider.isLoggedIn()).resolves.toBe(true);
  // })
  // it("should login", async () => {
  //   expect.assertions(3);
  //   await expect(provider.startLogin()).resolves.toBeUndefined();
  //   const web3 = provider.getProvider();
  //   console.log(web3)
  //   expect(provider.getProvider()).toEqual("jochen");
  //   await expect(provider.isLoggedIn()).resolves.toEqual(true);
  //   // const res = await provider.startLogin();
  //   // await expect(provider.isLoggedIn()).resolves.toBe(true);
  // })
})
