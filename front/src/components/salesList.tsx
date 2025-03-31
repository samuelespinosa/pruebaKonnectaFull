import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"

interface Sale {
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
interface SalesListProps {
  salesData: Sale[]
}

export function SalesList({salesData}:SalesListProps) {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-4xl p-4">
      
      <div className="rounded-lg border bg-background p-6 shadow-sm">
      <h2 className="mb-3 font-bold">Asesor Sales</h2>
        <div className="w-full border rounded-sm relative overflow-hidden">
        <Table className="w-full">
          <TableHeader>
          <TableRow className="font-bold bg-[#171717] text-amber-50 group hover:bg-[#171717] hover:text-amber-50">
              <TableHead className="w-[200px]">Producto</TableHead>
              <TableHead>Cupo Solicitado</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Usuario</TableHead>
            
            </TableRow>
          </TableHeader>
          <TableBody>
            
            {salesData.map((sale) => (
              
              <TableRow 
                key={sale.id}
                onClick={()=>navigate(`/sales/${sale.id}`, { state: { sale } })}
                className="cursor-pointer! hover:bg-gray-50"
                >
                <TableCell className="font-medium">{sale.product}</TableCell>
                <TableCell>${sale.requestedAmount}</TableCell>
                <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{sale.createdBy.email}</TableCell>
              </TableRow>
           
            ))}
            
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}