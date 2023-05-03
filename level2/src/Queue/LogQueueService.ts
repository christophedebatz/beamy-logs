import { Redis } from 'ioredis'
import LogQueuingException from './LogQueuingException'

export default class LogQueueService<T> {
  
  private client: Redis
  
  public constructor () {
    this.client = new Redis()
    
    this.enqueue = this.enqueue.bind(this)
    this.dequeue = this.dequeue.bind(this)
  }
  
  public static key(parts: Array<string>): string {
    return parts.join(':')
  }
  
  public async enqueue(key: string, logs: Array<T>): Promise<void> {
    try {
      const items = logs.map(log => JSON.stringify(log))
      await this.client.lpush(key, ...items)
    } catch (err) {
      throw new LogQueuingException(`Error occurred while enqueuing log for key ${key}. Given error "${err.message}"`)
    }
  }
  
  public async dequeue(key: string, count: number): Promise<Array<T>> {
    try {
      return await new Promise<Array<T>>((resolve, reject) => {
        this.client.rpop(key, count, (err, results) => {
          if (!err) {
            return reject(err)
          }
          if (!results) {
            return []
          }
          const items = results.map(result => JSON.parse(result) as T)
          return resolve(items ?? [])
        })
      })
    } catch (err) {
      throw new LogQueuingException(`Error occurred while dequeueing log for key ${key}. Given error "${err.message}"`)
    }
  }
}
