import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@shared/ui";
import { Card } from "@shared/ui";
import { Input } from "@shared/ui";
import { Form, FormField } from "@shared/components/Form";
import { useLoginMutation } from "./hooks/useLoginMutation";
import { loginSchema } from "./schemas/login.schema";
import type { LoginSchema } from "./schemas/login.schema";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();

  function onSubmit(data: LoginSchema) {
    loginMutation.mutate(data);
  }

  return (
    <Card className="p-8 bg-white rounded-xl border border-neutral-100 shadow-xl">
      <div className="flex justify-center mb-10">
        <img src="icons/login-logo.png" alt="Logo" className="object-contain" />
      </div>
      {/* TODO: Hacer componentes de esta page */}
      <Form<LoginSchema>
        schema={loginSchema}
        onSubmit={onSubmit}
        mutation={loginMutation}
        className="space-y-6"
      >
        <FormField<LoginSchema> name="email" required>
          {(field) => (
            <Input
              {...field}
              size="lg"
              type="email"
              placeholder="Email"
              autoComplete="email"
              leftElement={<Mail size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <div className="space-y-1.5">
          <FormField<LoginSchema> name="password">
            {(field) => (
              <Input
                {...field}
                size="lg"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                autoComplete="current-password"
                leftElement={<Lock size={16} aria-hidden="true" />}
                rightElement={
                  <Button
                    variant="ghost"
                    intent="neutral"
                    size="icon"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="h-auto w-auto p-0"
                  >
                    {showPassword ? (
                      <EyeOff size={16} aria-hidden="true" />
                    ) : (
                      <Eye size={16} aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </FormField>
          <div className="flex items-center justify-end mt-4">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary-700 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          intent="primary"
          size="lg"
          className="w-full"
          isLoading={loginMutation.isPending}
        >
          Ingresar
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </Form>
    </Card>
  );
}
