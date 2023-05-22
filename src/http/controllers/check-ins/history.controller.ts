import { makeGetUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(req: FastifyRequest, res: FastifyReply) {
  const searchHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = searchHistoryQuerySchema.parse(req.query)

  const getUserCheckInsHistoryUseCase = makeGetUserCheckInsHistoryUseCase()

  const { checkIns } = await getUserCheckInsHistoryUseCase.execute({
    page,
    userId: req.user.sub,
  })

  return res.status(200).send({
    checkIns,
  })
}
