import { createContext, useContext, useState } from 'react'
import api from './api'
type User = {
  id:number
  email: string
  role: 'Administrador' | 'Asesor'
  token:String
}

type LoginResponse = { success: boolean; user?: User }

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, captchaToken:string) => Promise<LoginResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string,captchaToken: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password, captchaToken })
      const userData:User={
        id:data.id,
        email: data.email,
        role: data.role,
        token: data.token
      }
      setUser(userData)
      
      localStorage.setItem('authToken', data.token)
      return { success: true, user: userData } 
    } catch (error) {
      console.error('Login error:', error)
      return { success: false}
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    // Optional: Call logout API endpoint
    // api.post('/auth/logout')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}