export enum WifiAccessStatus {
  INACTIVE = 'inactive',
  REQUESTED = 'requested',
  ACTIVE = 'active',
  REJECTED = 'rejected'
}

export interface WifiAccess {
  id: number
  status: WifiAccessStatus
  reject_reason: null
  active_voucher: null
  request_details: null
  uni_verification_url: null
  created_at: Date
  updated_at: Date
  already_verified: boolean
}
