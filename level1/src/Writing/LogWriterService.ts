import {promises} from 'fs'
import { Log } from '../Log.js'
import LogWritingException from './LogWritingException.js'

export default class LogWriterService
{
  public async writeLog(log: Log): Promise<void> {
    const filePath = this.resolveLogPath(log);
    
    try {
      await promises.writeFile(filePath, JSON.stringify(log, null, 2))
    } catch (err) {
      throw new LogWritingException(`Unable to write log, given error is "${err.message}".`)
    }
  }
  
  private resolveLogPath = (log: Log) => `./parsed/#${log.id}.json`
}
