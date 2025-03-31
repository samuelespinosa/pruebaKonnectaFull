import {LoginForm } from "@/components/loginform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex place-items-center h-screen">
      <div className="max-md w-md mx-auto">
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}