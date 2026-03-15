import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@shared/ui/Button/Button";
import { Card } from "@shared/ui/Card/Card";
import { Input } from "@shared/ui/Input/Input";
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
    <Card className="rounded-xl border border-neutral-100 bg-white p-8 shadow-xl">
      <div className="mb-10 flex justify-center">
        <img src="icons/login-logo.png" alt="Logo" className="object-contain" />
      </div>

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
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? (
                      <EyeOff size={16} aria-hidden="true" />
                    ) : (
                      <Eye size={16} aria-hidden="true" />
                    )}
                  </button>
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
