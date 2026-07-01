"use client";

import { useState, useId, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButton } from "./OAuthButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailId = useId();
  const passwordId = useId();
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    emailRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        remember: remember ? "true" : "false",
      });

      if (!result) {
        setError("No pudimos contactar al servidor. Intenta de nuevo.");
        setLoading(false);
        return;
      }

      if (result.error) {
        setError("Email o contraseña incorrectos.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Sin conexión. Verifica tu internet e intenta de nuevo.");
      setLoading(false);
    }
  };

  const handleForgot = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="space-y-6">
        <div className="space-y-1.5 text-center md:text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Bienvenido de vuelta
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
            Inicia sesión en tu cuenta
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 font-medium">
            Continúa donde lo dejaste.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 p-3 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={2.3} />
              <span className="font-medium leading-snug">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={emailId}>Email</Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500 pointer-events-none"
                strokeWidth={2.2}
                aria-hidden
              />
              <Input
                id={emailId}
                ref={emailRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={passwordId}>Contraseña</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500 pointer-events-none"
                strokeWidth={2.2}
                aria-hidden
              />
              <Input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                enterKeyHint="go"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" strokeWidth={2.2} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={2.2} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 dark:border-stone-600 text-stone-900 dark:text-stone-50 focus:ring-2 focus:ring-stone-400 focus:ring-offset-1 dark:focus:ring-offset-stone-900 cursor-pointer"
              />
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Recordarme
              </span>
            </label>
            <button
              type="button"
              onClick={handleForgot}
              className="font-semibold text-stone-500 dark:text-stone-400 cursor-not-allowed"
              title="Próximamente"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar sesión
              </>
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-stone-200/80 dark:border-stone-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              o continúa con
            </span>
          </div>
        </div>

        <OAuthButton provider="google" className="w-full" />

        <p className="text-center text-sm text-stone-600 dark:text-stone-400">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="font-bold text-stone-900 dark:text-stone-50 hover:underline underline-offset-4"
          >
            Crear cuenta
          </a>
        </p>
      </div>
    </motion.div>
  );
}