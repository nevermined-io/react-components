import React, { useState, useCallback, useEffect } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Config } from '@nevermined-io/nevermined-sdk-js';

import { Web3ServiceContext } from './Web3Service'

const ERC20SymbolAbi = {
  constant: true,
  inputs: [],
  name: 'symbol',
  outputs: [
    {
      name: '',
      type: 'string'
    }
  ],
  payable: false,
  stateMutability: 'view' as const,
  type: 'function' as const,
}

const ERC20DecimalsAbi = {
  constant: true,
  inputs: [],
  name: 'decimals',
  outputs: [
    {
      name: '',
      type: 'uint8'
    }
  ],
  payable: false,
  stateMutability: 'view' as const,
  type: 'function' as const,
}

class TokenUtilsService {
  private cache: {[param: string]: {[address: string]: Promise<any> & {value?: any}}} = {}

  constructor(private web3: Web3) { }

  getInstantSymbol(address: string) {
    return this.getInstantValue<string>(address, ERC20SymbolAbi)
  }
  getSymbol(address: string) {
    return this.getValue<string>(address, ERC20SymbolAbi)
  }

  getInstantDecimals(address: string) {
    return this.getInstantValue<number>(address, ERC20DecimalsAbi)
  }
  getDecimals(address: string) {
    return this.getValue<number>(address, ERC20DecimalsAbi)
  }

  private getInstantValue<T>(address: string, abi: AbiItem): T | null {
    if (!address) {
      return null
    }
    const param = abi.name!
    if (this.cache[param]?.[address] as any) {
      return this.cache[param]?.[address].value || null
    }
    return null
  }

  private getValue<T>(address: string, abi: AbiItem): Promise<T | undefined> {
    const param = abi.name!
    if (!address) {
      return Promise.resolve(undefined)
    }
    if (!this.cache[param]) {
      this.cache[param] = {}
    }
    if (this.cache[param][address] as any) {
      return this.cache[param][address]
    }
    this.cache[param][address] = new Promise(async resolve => {
      const contract = new this.web3.eth.Contract([abi], address)
      try {
        const value = await contract.methods[param]().call()
        this.cache[param][address].value = value
        resolve(value)
      } catch {
        this.cache[param][address].value = null
        resolve(undefined)
      }
    })
    return this.cache[param][address]
  }
}

export function useTokenUtilsService(config: Config, { web3 }: Web3ServiceContext) {
  const [tokenUtilsService, setTokenUtilsService] = useState<TokenUtilsService>();

  useEffect(() => {
    if (web3) {
      setTokenUtilsService(new TokenUtilsService(web3))
    }
  }, [web3])

  return {
    tokenUtils: tokenUtilsService,
  }
}

export type TokenUtilsServiceContext = ReturnType<typeof useTokenUtilsService>
