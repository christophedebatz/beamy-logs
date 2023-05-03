import { Request, Response } from 'express'
import InvalidLogFormatException from './Mapping/InvalidLogFormatException.js'
import LogWriterService from './Writing/LogWriterService.js'
import LogRequestMapper from './Mapping/LogRequestMapper.js'

export default class LogController
{
  public constructor (
    private readonly mapper: LogRequestMapper,
    private readonly fileService: LogWriterService
  ) {
    this.saveLog = this.saveLog.bind(this)
  }
  
  public async saveLog(req: Request, res: Response) {
    try {
      const logs = this.mapper.map(req)
      res.sendStatus(204).end()
  
      await this.fileService.writeLog(logs)
    } catch (err) {
      console.error(err)
      return res
        .status(err instanceof InvalidLogFormatException ? 400 : 500)
        .send({ error: err.message })
    }

  }
}
