import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '../api/use-api'

export interface MyCode {
  code: string
  royalty: number
  referralsCount: number
}

export interface MyCodesResponse {
  codes: Array<MyCode>
}



export interface Referral {
  referralsCount: number
  telegramId: number
  lvl: number
  nickname: string
  photoUrl: string
  time: number
}

export interface MyReferralsResponse {
  countVoucherReferrals0: number
  countVoucherReferrals1: number
  referrals: Array<Referral>
}

export interface MyReferralsParams {
  limit?: number
  page?: number
}

export interface SendGiftPayload {
  friendId: number
  time: number
}

export interface SendGiftResponse {
  message: string
  timeSent: number
  timeBefore: number
  timeCurrent: number
}

export interface NewCodeResponse {
  created: number
  limit: number
  available: number
  accountId: number
  code: string
  royalty: number
}

export const useReferrals = (
  params: MyReferralsParams = { limit: 100, page: 1 },
) => {
  const { get, post } = useApi()
  const queryClient = useQueryClient()

  const myCodes = useQuery<MyCodesResponse, Error>({
    queryKey: ['myCodes'],
    queryFn: async () => {
      const response = await get('/referral/get_my_codes')
      if (!response) {
        throw new Error('No response from server for get_my_codes')
      }
      return response as MyCodesResponse
    },
  })

  const myReferrals = useQuery<MyReferralsResponse, Error>({
    queryKey: ['myReferrals', params.page, params.limit],
    queryFn: async () => {
      const response = await get(
        `/referral/get_my_referrals?limit=${params.limit}&page=${params.page}`,
      )
      if (!response) {
        throw new Error('No response from server for get_my_referrals')
      }
      return response as MyReferralsResponse
    },
    enabled: !!params.limit && !!params.page, // only run if params are provided
  })

  const generateNewCode = useMutation<NewCodeResponse, Error, void>({
    mutationFn: async () => {
      const response = await post('/referral/generate_new_code')
      if (!response) {
        throw new Error('No response from server for generate_new_code')
      }
      return response as NewCodeResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCodes'] })
    },
  })

  const sendGiftToFriend = useMutation<SendGiftResponse, Error, SendGiftPayload>({
    mutationFn: async payload => {
      const response = await post('/referral/send_gift_to_friend', payload)
      if (!response) {
        throw new Error('No response from server for send_gift_to_friend')
      }
      return response as SendGiftResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReferrals'] })
    },
  })

  return {
    myCodes: myCodes.data?.codes,
    isLoadingMyCodes: myCodes.isLoading,
    myCodesError: myCodes.error,
    myReferrals: myReferrals.data,
    isLoadingMyReferrals: myReferrals.isLoading,
    myReferralsError: myReferrals.error,
    generateNewCode,
    sendGiftToFriend,
  }
}
