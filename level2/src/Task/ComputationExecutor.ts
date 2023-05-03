import { parentPort, isMainThread, workerData } from 'worker_threads'
import { Log } from '../Log'
const slowComputation = require('./lib/slowComputation')

class ComputationExecutor {

  public async execute (): Promise<Log> {
    return new Promise<Log>(async (resolve: (log: Log) => void) => {
      const { payload } = workerData as { payload: Log }
      return resolve(slowComputation.compute(payload))
    })
  }
}

(async () => {
  if (!isMainThread) {
    const taskWrapper = new ComputationExecutor()
    const computedLog = await taskWrapper.execute()
    if (parentPort !== null) {
      parentPort.postMessage(computedLog)
    }
  }
})()
