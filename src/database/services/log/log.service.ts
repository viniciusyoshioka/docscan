import type { Transaction } from '../../database'
import type { LogType } from '../../entities'
import type { LogRepository } from '../../repositories'


export class LogService {


  constructor(
    private readonly logRepository: LogRepository,
  ) {}


  async create(
    params: {
      logType: LogType
      message: string | string[]
      stackTrace?: string
    },
    transaction?: Transaction,
  ): Promise<void> {
    if (!transaction) {
      await this.logRepository.transaction(async tx => {
        await this.create(params, tx)
      })
      return
    }

    const { logType, message, stackTrace } = params

    const messageAsArray = Array.isArray(message)
      ? message
      : [message]

    const joinedMessage = messageAsArray
      .map(line => line.trim())
      .filter(line => !!line)
      .join(' ')

    if (!joinedMessage.length) {
      throw new Error('Cannot log an empty message')
    }

    const txLogRepository = this.logRepository.withinTransaction(transaction)

    await txLogRepository.insertLog({
      type: logType,
      message: joinedMessage,
      stackTrace,
    })
  }
}
