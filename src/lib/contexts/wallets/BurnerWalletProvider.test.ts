import React from "react";
import web3 from "web3";

import BurnerWalletProvider from './BurnerWalletProvider';


describe("BurnerWalletProvider", () => {
  let provider: BurnerWalletProvider;
  beforeEach(() => {
    provider = new BurnerWalletProvider("nodeUri");
  })

  it("Should instantiate", () => {
    expect(provider).toBeDefined();
  });

  it("Shoudld return null for web3-provider", () => {
    expect(provider.getProvider()).toBeNull();
  })
  it("should return logged in false when instantiated", async () => {
    await expect(provider.isLoggedIn()).resolves.toBe(false);
  });

  it("should login", async () => {
    await expect(provider.isLoggedIn()).resolves.toBe(false);
    // const res = await provider.startLogin();
    // await expect(provider.isLoggedIn()).resolves.toBe(true);
  })
})
