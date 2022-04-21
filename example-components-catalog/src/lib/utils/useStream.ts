import axios from 'axios'
import { Logger } from '@nevermined-io/nevermined-sdk-js'

export function formatBytes(a: number, b: number): string {
  if (a === 0) return '0 Bytes'
  const c = 1024
  const d = b || 2
  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const f = Math.floor(Math.log(a) / Math.log(c))

  return `${parseFloat((a / c ** f).toFixed(d))} ${e[f]}`
}

export function arraySum(array: number[]): number {
  return array.reduce((a, b) => a + b, 0)
}

export function streamFiles(ipfs: any, files: any): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const stream = ipfs.addReadableStream({
      wrapWithDirectory: true
      // progress: (length: number) =>
      //     setFileSizeReceived(formatBytes(length, 0))
    })

    stream.on('data', (data: any) => {
      Logger.log(`Added ${data.path} hash: ${data.hash}`)
      // The last data event will contain the directory hash
      if (data.path === '') resolve(data.hash)
    })

    stream.on('error', reject)
    stream.write(files)
    stream.end()
  })
}

export async function pingUrl(url: string): Promise<boolean> {
  try {
    const response = await axios(url)
    if (response.status !== 200) Logger.error(`Not found: ${url}`)

    Logger.log(`File found: ${url}`)
    return true
  } catch (error: any) {
    Logger.error(error.message)
  }
  return false
}

export function readFileAsync(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => {
      reader.abort()
      reject(new DOMException('Problem parsing input file.'))
    }
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}
