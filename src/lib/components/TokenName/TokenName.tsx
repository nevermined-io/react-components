import React, { Props, useEffect, useState } from 'react'
import BN from 'bn.js'
import { useNevermined } from 'lib/contexts/NeverminedProvider'

interface TokenNameProps {
  address: string
}

export const NuiTokenName = React.memo(function({address}: TokenNameProps) {
  const {services: {tokenUtils}} = useNevermined()
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(tokenUtils?.getInstantSymbol(address) || null)

  useEffect(() => {
    if (tokenSymbol === null && tokenUtils) {
      console.log('token', 1)
      tokenUtils.getSymbol(address)
        .then(value => setTokenSymbol(value || null))
    }
  }, [address, tokenUtils])

  return <>{tokenSymbol}</>

})
