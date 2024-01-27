import { UserQueryType, UserType } from "@/type";
import request from "@/utils/request";
import qs from "qs"

export async function getUserList(params?: UserQueryType) {
  //api/current: 1&pageSize: 20&name=xxx&author=xxx&category=xxx
  return request.get(
    `/api/users?${qs.stringify(params)}`
  )

}

//post - add new user
export async function userAdd(params: UserType) {
  return request.post("/api/users", params)
}

//delete - delete user
export async function userDelete(id: string) {
  return request.delete(`/api/users/${id}`)
}


//get - edit/update user
export async function getUserDetail(id: string) {
  return request.get(`/api/users/${id}`)
}
//put 
export async function userUpdate(id: string, params: UserType) {
  return request.put(`/api/users/${id}`, params)
}


//user login  post user data to check
export async function login(params: Pick<UserType, "name" | "password">) {
  return request.post("/api/login", params)
}
//user logout  clear session
export async function logout() {
  return request.get("/api/logout")
}