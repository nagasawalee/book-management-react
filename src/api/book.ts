import { BookQueryType, BookType } from "@/type";
import request from "@/utils/request";
import qs from "qs"

export async function getBookList(params?: BookQueryType) {
  //api/current: 1&pageSize: 20&name=xxx&author=xxx&category=xxx
  return request.get(
    `/api/books?${qs.stringify(params)}`
  )

}

//post - add new book
export async function bookAdd(params: BookType) {
  return request.post("/api/books", params)
}

//delete - delete book 
export async function bookDelete(id: string) {
  return request.delete(`/api/books/${id}`)
}

//get/put - update book
export async function getBookDetail(id: string) {
  return request.get(`/api/books/${id}`)
}
export async function bookUpdate(id: string, params: BookType) {
  return request.put(`/api/books/${id}`, params)
}