import { RegExpGroups } from './RegExpGroup.js'
import { Log } from '../Log.js'
import express from 'express'
import InvalidLogFormatException from './InvalidLogFormatException.js'

export default class LogRequestMapper
{
  public map(req: express.Request): Log {
    if (!req.body.hasOwnProperty('log')) {
      throw new InvalidLogFormatException('Cannot find "log" path in current request.')
    }
  
    const result: Log = {}
    const lines = req.body.log as Array<string>
  
    lines.forEach(line => {
      const matches: RegExpGroups<'key' | 'value'> = line.match('(?<key>[^=]+)=(?<value>[^=]+)(?:\s|$)')
  
      if (matches === null || typeof matches.groups === 'undefined') {
        throw new InvalidLogFormatException('Given log has not the valid syntax.')
      }
  
      result[matches.groups.key] = matches.groups.value
    })
    
    if (typeof result['id'] === 'undefined') {
      throw new InvalidLogFormatException('Unknown index "id" in given log.')
    }
    
    return result
  }
}
