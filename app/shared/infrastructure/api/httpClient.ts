import axios from 'axios'

// API 기본 URL (실제 환경에서는 환경변수로 설정)
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.handi.com' 
  : 'http://localhost:3001/api'

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
httpClient.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
httpClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 401 에러 시 로그인 페이지로 리다이렉트
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
) 