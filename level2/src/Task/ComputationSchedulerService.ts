import { Worker } from 'worker_threads'
import path from 'path'
import AsyncTaskException from './AsyncTaskException'

export class ComputationSchedulerService {

  public async schedule<T, R> (payload: T): Promise<R> {
    const taskFilePath = path.resolve(__dirname, './ComputationExecutor')
    
    try {
      return await this.spawnTask(taskFilePath, { ...payload })
    } catch (error) {
      if (error instanceof Error) {
        throw new AsyncTaskException(error.message)
      } else {
        console.error(error)
      }
    }
    
    throw new AsyncTaskException('Unhandled error on scheduler service.')
  }
  
  private async spawnTask<T, R>(taskFilePath: string, payload: T): Promise<R> {
    return await new Promise((resolve, reject) => {
      const worker = new Worker(taskFilePath, { workerData: { payload } })
      worker.on('message', resolve)
      worker.on('error', reject)
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`))
        }
      })
    })
  }
}
