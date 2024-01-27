import { BORROW_STATUS } from "@/constants";
import { BookType, UserType } from "."

export interface BorrowQueryType {
  borrowBook?: string
  borrowUser?: string
  status?: BORROW_STATUS

  current?: number
  pageSize?: number
}

export interface BorrowType {
  _id: string
  borrowBook: BookType
  borrowUser: UserType
  status: "on" | "off"
  borrowAt: number
  backAt?: number
}
export interface BorrowBookOptionType {
  label: string;
  stock: number;
  value: string;
}