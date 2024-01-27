import { UserType } from "@/type"
import { useEffect, useState } from "react"

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserType>()
  // const [token, setToken] = useState("")

  //获取localStorage中的用户信息
  //在client执行时
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStorage = localStorage?.getItem("user")
      if (userStorage) {
        setUser(JSON.parse(userStorage))
        //setToken(JSON.parse(userStorage).token)
      }
    }
  }, [])

  return { user }
}


