import { Request, Response } from 'express'
import LogRequestMapper from './Mapping/LogRequestMapper'
import LogQueueService from './Queue/LogQueueService'
import { Log } from './Log'
import { ComputationSchedulerService } from './Task/ComputationSchedulerService'
import { isMainThread, parentPort } from 'worker_threads'

export default class LogProcessor {
  private static readonly BatchSize: number = 25
  
  public constructor (
    private readonly queueService: LogQueueService<Log>,
    private readonly schedulerService: ComputationSchedulerService
  ) {
    this.processLog = this.processLog.bind(this)
  }
  
  public async processLog() {
    const rawLogsQueueKey = LogQueueService.key(['queue', 'logs', 'raws'])
    const processedLogsQueueKey = LogQueueService.key(['queue', 'logs', 'processed'])
    let logs: Array<Log> = []
    let updatedCount: number = 0;
    
    do {
      logs = await this.queueService.dequeue(rawLogsQueueKey, LogProcessor.BatchSize)
      
      const logPromises: Array<Promise<Log>> = []
      logs.forEach(log => {
        logPromises.push(this.schedulerService.schedule<Log, Log>(log))
      })
      
      const processedLogs: Array<Log> = await Promise.all(logPromises)
      await this.queueService.enqueue(processedLogsQueueKey, processedLogs)
      updatedCount++

    } while (logs.length > 0)
    
    console.log(`Completed with ${updatedCount} updates!`)
  }
}

(async () => {
    const processor = new LogProcessor(new LogQueueService<Log>(), new ComputationSchedulerService())
    await processor.processLog()
  }
)()
