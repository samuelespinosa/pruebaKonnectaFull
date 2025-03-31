import { SalesList } from "@/components/salesList"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "@/shared/AuthContext"
import api from '../shared/api';
import { SalesListAdmin } from "@/components/salesListAdmin";

export type Sale = {
    id: number
    product: "Libranza Libre Inversión" | "Crédito de Consumo" | "Tarjeta de Crédito"
    requestedAmount: string
    franchise?: "VISA" | "MASTERCARD" | "AMEX"  
    rate?: string  
    status: "Abierto" | "Cerrado" | "En proceso"
    createdAt: string
    updatedAt: string
    createdBy: {
      id: number
      name: string
      email: string
      role: "Administrador" | "Asesor"
      createdAt: string
      updatedAt: string
    }
    updatedBy?: { 
      id: number
      name: string
      email: string
      role: "Administrador" | "Asesor"
      createdAt: string
      updatedAt: string
    }
  }
export default function SalesPage(){
 
    const { id } = useParams<{ id?: string }>()
    const [data, setData] = useState<Sale[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await api.get('/sales')
          console.log(response);
          setData(response.data)
        } catch (err) {
          setError(
            id 
              ? 'Failed to fetch sale details' 
              : 'Failed to fetch sales list'
          )
          console.error('API Error:', err)
        } finally {
          setLoading(false)
        }
      }
  
      fetchData()
    }, [id])
    return (
      user?.role ==="Administrador"?
      data && <SalesListAdmin salesData={data}/>:
      data && <SalesList salesData={data}/>
    )
    
}