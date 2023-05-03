import { Request, Response } from 'express'
import LogRequestMapper from './Mapping/LogRequestMapper'
import LogQueueService from './Queue/LogQueueService'
import { Log } from './Log'

export default class LogController
{
  public constructor (
    private readonly mapper: LogRequestMapper,
    private readonly queueService: LogQueueService<Log>,
  ) {
    this.queueLog = this.queueLog.bind(this)
  }
  
  public async queueLog(req: Request, res: Response) {
    const log: Log = this.mapper.map(req)
    
    try {
      await this.queueService.enqueue(LogQueueService.key(['queue', 'raw', 'logs']), [log])
      res.status(204).send()
    } catch (err) {
      res
        .status(500)
        .send({ error: err.message })
    }
  }
}

