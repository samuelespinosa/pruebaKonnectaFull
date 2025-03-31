"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import api from "@/shared/api"
export default function SalesSinglePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const sale = location.state?.sale

  if (!sale) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sale Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No sale data available.</p>
            <Button 
              onClick={() => navigate(-1)} 
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  async function deleteHandler(){
    const action='/sales/'+sale.id
    const response=await api.delete(action);
    console.log(response);
    navigate("/sales", { replace: true })
  }
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
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
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="font-medium">{sale.product}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requested Amount</p>
              <p className="font-medium">${sale.requestedAmount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">
                {new Date(sale.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created By</p>
              <p className="font-medium">{sale.createdBy.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={() => navigate(`/sales/${sale.id}/edit`, { state: { sale } })}
              variant="outline"
              className="mr-2"
            >
              Edit Sale
            </Button>
            <Button 
              variant="destructive"
              onClick={deleteHandler}
            >
              Delete Sale
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}