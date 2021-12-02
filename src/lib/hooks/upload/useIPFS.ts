
import { useEffect, useState } from 'react'
import ipfsClient from 'ipfs-http-client'

let ipfs: any = null
let ipfsMessage = ''
let ipfsVersion = ''

export interface IpfsConfig {
  protocol: string
  host: string
  port: string
}
const ipfsGatewayUri = process.env.REACT_APP_IPFS_GATEWAY_URI || 'https://gateway.ipfs.io'
const ipfsNodeUri = process.env.REACT_APP_IPFS_NODE_URI || 'https://ipfs.infura.io:5001'

export default function useIPFS(config: IpfsConfig): any {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs))
  const [ipfsError, setIpfsError] = useState('')

  useEffect(() => {
    async function initIpfs() {
      if (ipfs !== null) return

      ipfsMessage = 'Checking IPFS gateway...'

      try {
        // eslint-disable-next-line require-atomic-updates
        ipfs = await ipfsClient(config)
        const version = await ipfs.version()
        ipfsVersion = version.version
        ipfsMessage = `Connected to ${config.host}`
      } catch (error: any) {
        setIpfsError(`IPFS connection error: ${error.message}`)
      }
      setIpfsReady(Boolean(await ipfs.id()))
    }

    initIpfs()
  }, [config])

  useEffect(
    () => function cleanup() {
      if (ipfs) {
        setIpfsReady(false)
        ipfs = null
        ipfsMessage = ''
        ipfsVersion = ''
        setIpfsError('')
      }
    },
    []
  )

  return {
    ipfs,
    ipfsVersion,
    isIpfsReady,
    ipfsError,
    ipfsMessage
  }
}
