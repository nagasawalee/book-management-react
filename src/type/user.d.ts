export interface UserQueryType {
  name?: string
  status?: "on" | "off"
  current?: number
  pageSize?: number
  all?: boolean
}

export interface UserType {
  name?: string
  nickName?: string
  password: string
  _id: string
  gender?: "male" | "female" | "other"
  role?: "user" | "admin"
  status?: "on" | "off"
}