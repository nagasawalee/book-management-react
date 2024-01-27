import { CategoryQueryType, CategoryType } from "@/type";
import request from "@/utils/request";
import qs from "qs"

export async function getCategoryList(params?: CategoryQueryType) {
  //api/current: 1&pageSize: 20&name=xxx&author=xxx&category=xxx
  return request.get(
    `/api/categories?${qs.stringify(params)}`
  )

}
//post - add new category
export async function categoryAdd(params: CategoryType) {
  return request.post("/api/categories", params)
}

//delete - delete category
export async function categoryDelete(id: string) {
  return request.delete(`/api/categories/${id}`)
}

//get/put - edit/update category
export async function getCategoryDetail(id: string) {
  return request.get(`/api/categories/${id}`)
}

export async function categoryUpdate(id: string, params: CategoryType) {
  return request.put(`/api/categories/${id}`, params)
}