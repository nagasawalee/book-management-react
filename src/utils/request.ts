import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import Router from "next/router"
import { message as AntdMessage } from "antd/lib"

//重写方法类型
interface AxiosInstanceType extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
}

export const CreateAxiosInstance = (config?: AxiosRequestConfig): AxiosInstanceType => {
  //创建axios实例
  const instance = axios.create({
    timeout: 5000,
    ...config
  })

  //请求中间件 重写request部分
  instance.interceptors.request.use(
    function (config: any) {
      const userStorage = localStorage.getItem('user')
      const user = userStorage ? JSON.parse(userStorage) : ''
      config.headers = { userToken: user._id }
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  //check user login status
  //redirect to login page if not login
  instance.interceptors.response.use(
    async function (response) {
      //判断是否登录 是否成功
      const { status, data, message } = response as any
      console.log(status);
      if (status === 200) {
        //已登录 返回数据
        return data
      } else if (status === 401) {
        //没权限or未登录 跳转登录页面
        AntdMessage.error(message)


        await Router.push("/login")
        return {}
      } else {
        //other error
        AntdMessage.error(message || "Server Error")
      }
    },
    async function (error) {
      if (error.response && error.response.status === 401) {
        await Router.push("/login")
        return {}
      }

      AntdMessage.error(error?.response?.data?.message || "Server Error")
      return Promise.reject(error)
    }
  )

  return instance

}

const request = CreateAxiosInstance({})
export default request