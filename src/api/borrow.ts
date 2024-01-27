import { BorrowQueryType, BorrowType } from "@/type";
import request from "@/utils/request";
import qs from "qs"

export async function getBorrowList(params?: BorrowQueryType) {
  //api/current: 1&pageSize: 20&name=xxx&author=xxx&category=xxx
  return request.get(
    `/api/borrows?${qs.stringify(params)}`
  )

}

//post - add new borrow
export async function borrowAdd(params: BorrowType) {
  return request.post("/api/borrows", params)
}

//delete - delete borrow
export async function borrowDelete(id: string) {
  return request.delete(`/api/borrows/${id}`)
}

//put - update borrow
export async function borrowUpdate(params: BorrowType) {
  return request.put("/api/borrows", params)
}

//get - choose one to edit
export async function getBorrowDetail(id: string) {
  return request.get(`/api/borrows/${id}`)
}

//put - edit
export async function borrowBack(id: string) {
  return request.put(`/api/borrows/back/${id}`)
}