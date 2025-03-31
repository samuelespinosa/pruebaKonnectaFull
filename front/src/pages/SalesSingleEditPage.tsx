import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import api from "@/shared/api"
import { ArrowLeft } from "lucide-react"

export enum ProductType {
  CONSUMER_CREDIT = 'Credito de Consumo',
  PAYROLL_LOAN = 'Libranza Libre Inversión',
  CREDIT_CARD = 'Tarjeta de Credito'
}

export enum Franchise {
  AMEX = 'AMEX',
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD'
}

export enum SaleStatus {
  OPEN = 'Abierto',
  IN_PROGRESS = 'En Proceso',
  FINISHED = 'Finalizado'
}

export default function EditSalePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sale, setSale] = useState({
    product: undefined,
    requestedAmount: 0,
    franchise: undefined,
    rate: undefined,
    status:undefined,
  })
  const [isLoading, setIsLoading] = useState(true)

 
  useEffect(() => {
    async function loadSale() {
      try {
     
        const response = await api.get(`sales/${id}`);
        const data = await response.data;
        setSale({
          product: data.product,
          requestedAmount: data.requestedAmount,
          franchise: data?.franchise,
          rate: data?.rate,
          status: data.status,
        })
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false)
      }
    }
    loadSale()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Only send the changed fields if you want partial updates
      const payload = {
        product: sale.product,
        requestedAmount: Number(sale.requestedAmount),
        franchise: sale.franchise, // will be undefined if not set
        rate: Number(sale.rate),           // will be undefined if not set
        status: sale.status
      };
  
      const response = await api.patch(`sales/${id}`, payload);
      console.log(response);
      if (response.status !== 200) {
        throw new Error("Failed to update sale");
      }
      const { data } = await api.get(`sales/${id}`);
      setSale({
        product: data.product,
        requestedAmount: data.requestedAmount,
        franchise: data.franchise,
        rate: data.rate,
        status: data.status,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSale(prev => ({
      ...prev,
      [name]: name.includes("Amount") || name.includes("rate") 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  if (isLoading) return <div className="p-8 text-center">Loading sale data...</div>

  return (
    <div className="flex place-items-center h-screen">
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sale Details</CardTitle>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium">Product</label>
                <Select
                  value={sale.product}
                  onValueChange={(value:any) => setSale({...sale, product: value})}
                >
                  <SelectTrigger>
                    <SelectValue className="w-5" placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="mx-auto w-sm">
                    {Object.values(ProductType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Requested Amount */}
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  name="requestedAmount"
                  value={sale.requestedAmount}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>

              {/* Franchise (only for credit cards) */}
              {sale.product === ProductType.CREDIT_CARD && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Franchise</label>
                  <Select
                    value={sale.franchise || ""}
                    onValueChange={(value: any) => setSale({...sale, franchise:value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select franchise" />
                    </SelectTrigger>
                    <SelectContent className="mx-auto w-sm">
                      {Object.values(Franchise).map((franchise) => (
                        <SelectItem key={franchise} value={franchise}>
                          {franchise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Rate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Rate (%)</label>
                <Input
                  type="number"
                  name="rate"
                  value={sale.rate || ""}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Status</label>
                <Select
                  value={sale.status}
                  onValueChange={(value:any) => setSale({...sale, status: value})}
                >
                  <SelectTrigger className="w-[180px]!">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="mx-auto w-sm">
                    {Object.values(SaleStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}