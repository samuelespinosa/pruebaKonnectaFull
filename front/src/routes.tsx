import { createBrowserRouter } from 'react-router-dom' 
import { AuthProvider } from '@/shared/AuthContext'
import LoginPage from '@/pages/LoginPage'
import SalesPage from '@/pages/SalesPage'
import ProtectedRoute  from '@/shared/ProtectedRoute'
import UnauthorizedPage from './pages/UnauthorizedPage'
import SalesSinglePage from './pages/SalesSinglePage'
import SalesSingleEditPage from './pages/SalesSingleEditPage'

// Use createBrowserRouter instead of createRoutes
export default createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider> 
        <LoginPage />
      </AuthProvider>
    )
  },
  {
    path: '/unauthorized',
    element: (
      <UnauthorizedPage/>
    )
  },
  {
    path: '/sales',
    element: (
      <AuthProvider>
        <ProtectedRoute requiredRole="Administrador">
          <SalesPage />
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  
  {
    path: '/sales/:id',
    element: (
      <AuthProvider>
        <ProtectedRoute requiredRole="Administrador">
          <SalesSinglePage/>
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  {
    path: '/sales/:id/edit',
    element: (
      <AuthProvider>
        <ProtectedRoute requiredRole="Administrador">
          <SalesSingleEditPage/>
        </ProtectedRoute>
      </AuthProvider>
    )
  },
])