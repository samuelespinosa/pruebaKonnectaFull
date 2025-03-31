import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/shared/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useActionState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useRef } from 'react';

type FormState = {
  errors?: {
    email?: string[];
    password?: string[];
    captcha?: string[];
  };
  message?: {
    text: string;
    type: "success" | "error";
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        "Iniciar sesión"
      )}
    </Button>
  );
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);
  

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

  const [state, formAction] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Basic validation
      if (!email.includes("@")) {
        return {
          errors: { email: ["Correo electrónico inválido"] },
        };
      }

      // CAPTCHA validation
      if (!captchaToken) {
        captchaRef.current?.reset();
        return {
          errors: { captcha: ["Por favor complete el CAPTCHA"] },
        };
      }

      const { success, user } = await login(email, password, captchaToken);
     
      if (success) {
        switch (user?.role) {
          case 'Administrador':
            navigate('/sales');
            break;
          case 'Asesor':
            const path='/sales/'+user?.id;
            navigate(path);
            break;
          default:
            navigate('/');
        }
        return {
          message: {
            text: 'User logged in',
            type: 'success',
          },
        };
      } else {
        captchaRef.current?.reset();
        setCaptchaToken(null);
        return {
          message: {
            text: 'Credenciales incorrectas',
            type: 'error',
          },
        };
      }
    },
    { errors: {} }
  );

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          maxLength={50}
        />
        {state?.errors?.email && (
          <p className="text-sm text-destructive">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          maxLength={20}
        />
        {state?.errors?.password && (
          <p className="text-sm text-destructive">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <ReCAPTCHA
          ref={captchaRef}
          sitekey={recaptchaSiteKey}
          onChange={onCaptchaChange}
        />
      </div>
      {state?.errors?.captcha && (
        <p className="text-sm text-destructive text-center">
          {state.errors.captcha[0]}
        </p>
      )}

      <SubmitButton />

      {state?.message && (
        <Alert variant={state.message.type === "success" ? "default" : "destructive"}>
          <AlertDescription>
            {state.message.text}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}