"use client";

import { useState, useId, useRef, useEffect, useMemo } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  UserPlus,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButton } from "./OAuthButton";
import { registerAction, type RegisterState } from "@/server/actions/auth-actions";

type Strength = { score: number; label: string; color: string };

function evaluateStrength(pw: string): Strength {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  const levels: Record<number, { label: string; color: string }> = {
    0: { label: "Muy débil", color: "bg-rose-500" },
    1: { label: "Débil", color: "bg-rose-500" },
    2: { label: "Aceptable", color: "bg-amber-500" },
    3: { label: "Buena", color: "bg-emerald-500" },
    4: { label: "Fuerte", color: "bg-emerald-500" },
    5: { label: "Muy fuerte", color: "bg-emerald-500" },
  };
  const idx = Math.max(0, Math.min(5, score));
  return { score: idx, ...levels[idx] };
}

export function RegisterForm() {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const nameRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => evaluateStrength(password), [password]);
  const localError = useMemo(() => {
    if (confirm.length === 0) return "";
    if (confirm !== password) return "Las contraseñas no coinciden";
    return "";
  }, [confirm, password]);

  useEffect(() => {
    nameRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("La contraseña debe incluir al menos una letra y un número");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      formData.set("password", password);

      const result: RegisterState = await registerAction(undefined, formData);

      if (!result.ok) {
        setError(result.error ?? "No pudimos crear tu cuenta.");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setLoading(false);
        router.push("/login");
        return;
      }

      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Sin conexión. Verifica tu internet e intenta de nuevo.");
      setLoading(false);
    }
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
            Empieza gratis
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
            Crea tu cuenta
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 font-medium">
            Sin tarjeta. Tus datos quedan contigo.
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
            <Label htmlFor={nameId}>Nombre</Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500 pointer-events-none"
                strokeWidth={2.2}
                aria-hidden
              />
              <Input
                id={nameId}
                ref={nameRef}
                type="text"
                autoComplete="name"
                enterKeyHint="next"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={50}
                className="pl-10"
              />
            </div>
          </div>

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
                autoComplete="new-password"
                enterKeyHint="next"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
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
            {password.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= strength.score ? strength.color : "bg-stone-200 dark:bg-stone-800"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 w-20 text-right">
                  {strength.label}
                </span>
              </div>
            )}
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-snug">
              Mínimo 8 caracteres, una letra y un número.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={confirmId}>Confirmar contraseña</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500 pointer-events-none"
                strokeWidth={2.2}
                aria-hidden
              />
              <Input
                id={confirmId}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                enterKeyHint="go"
                placeholder="Repite tu contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className={`pl-10 pr-10 ${
                  localError ? "border-rose-400 dark:border-rose-600" : ""
                }`}
              />
              {confirm.length > 0 && !localError && (
                <Check
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500"
                  strokeWidth={2.5}
                  aria-hidden
                />
              )}
            </div>
            {localError && (
              <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 leading-snug">
                {localError}
              </p>
            )}
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
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Crear cuenta
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
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="font-bold text-stone-900 dark:text-stone-50 hover:underline underline-offset-4"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </motion.div>
  );
}