import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  
  return (
    <div className=" w-sm mx-auto flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Acceso no autorizado</h1>
      <p>No tienes permisos para acceder a esta página</p>
      <Button onClick={() => navigate(-1)}>
        Volver atrás
      </Button>
    </div>
  )
}