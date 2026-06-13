"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeStepProps {
  onStart: () => void;
  onQuickCreate: () => void;
}

export function WelcomeStep({ onStart, onQuickCreate }: WelcomeStepProps) {
  const phrases = [
    "Toma el control de tu dinero de forma visual",
    "Visualiza tu salud financiera al instante",
    "Simula decisiones importantes antes de tomarlas",
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <motion.h1
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Bienvenido a Walta
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Crea tu presupuesto en menos de 5 minutos
        </motion.p>
      </div>

      <div className="space-y-4">
        {phrases.map((phrase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
          >
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <p className="text-sm font-medium">{phrase}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Button size="lg" className="w-full sm:w-auto gap-2" onClick={onStart}>
          Crear mi presupuesto
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full sm:w-auto gap-2"
          onClick={onQuickCreate}
        >
          <Zap className="h-4 w-4" />
          Crear rápido
        </Button>
      </motion.div>
    </div>
  );
}
