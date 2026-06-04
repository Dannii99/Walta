# Loan AI Smoke Test Output
Generated: 2026-06-04T00:43:15.314Z
Model: llama-3.3-70b-versatile

## Context
```
Income: $ 4.000.000,00
Available: $ 401.700,00
Recommended max (30%): $ 120.510,00
Active loans total: $ 2.550.000,00
Loan: VEHICLE - Carro 2026
  Principal: $ 47.000.000,00 at 17.18% EA
  Monthly payment: $ 1.018.463,50
  Progress: 20/72 (28%)
  Health: DEFAULTED (ratio > 100% del disponible)
```

## Feature A: Loan Advisor Analysis
Latency: 1411ms

### Verdict Explanation
Llevas 20 de 72 cuotas (28% completado) y has pagado $20.369.270 del capital, restando $26.630.730. Pero tu cuota de $1.018.463,50 representa 254% de tu disponible de $401.700, lo que pone este crédito en zona riesgosa.

### Recommendations
1. **[POSITIVE]** Haz un abono extra de $5.000.000 este mes
   Capital restante bajaría a $21.6M, recortarías ~8 meses del plazo y ahorrarías ~$3.8M en intereses futuros al ritmo actual.
2. **[NEUTRAL]** Considera el costo real de tener vehículo financiado
   La cuota no cubre gasolina, SOAT, seguro ni mantenimiento. En Colombia estos suman $400-700K/mes. Sin ese colchón, un imprevisto puede llevarte a mora.
3. **[NEGATIVE]** Cuidado: ya superaste tu capacidad de pago
   Tu compromiso total con otros créditos es $2.55M contra $401K disponibles. Si un mes reduces tus ingresos, quedarías sin capacidad de cubrir todas las cuotas.

### Risks
- En 52 meses restantes al 17.18% EA, pagarás $26.6M adicionales solo en intereses.
- Dos vehículos financiados eleva tu ratio deuda/ingreso a nivel que muchos bancos no aprobarían más crédito.
- La carga de deuda actual supera el 635% de tus ingresos disponibles, lo que puede llevar a problemas de liquidez.

### Alternative
Si vendes uno de los vehículos y cancelas su crédito con el dinero, liberas $1M+/mes de cuota y reduces el ratio a zona manejable.

### Raw JSON
```json
{
  "verdict_explanation": "Llevas 20 de 72 cuotas (28% completado) y has pagado $20.369.270 del capital, restando $26.630.730. Pero tu cuota de $1.018.463,50 representa 254% de tu disponible de $401.700, lo que pone este crédito en zona riesgosa.",
  "recommendations": [
    {
      "title": "Haz un abono extra de $5.000.000 este mes",
      "description": "Capital restante bajaría a $21.6M, recortarías ~8 meses del plazo y ahorrarías ~$3.8M en intereses futuros al ritmo actual.",
      "impact": "positive"
    },
    {
      "title": "Considera el costo real de tener vehículo financiado",
      "description": "La cuota no cubre gasolina, SOAT, seguro ni mantenimiento. En Colombia estos suman $400-700K/mes. Sin ese colchón, un imprevisto puede llevarte a mora.",
      "impact": "neutral"
    },
    {
      "title": "Cuidado: ya superaste tu capacidad de pago",
      "description": "Tu compromiso total con otros créditos es $2.55M contra $401K disponibles. Si un mes reduces tus ingresos, quedarías sin capacidad de cubrir todas las cuotas.",
      "impact": "negative"
    }
  ],
  "risks": [
    "En 52 meses restantes al 17.18% EA, pagarás $26.6M adicionales solo en intereses.",
    "Dos vehículos financiados eleva tu ratio deuda/ingreso a nivel que muchos bancos no aprobarían más crédito.",
    "La carga de deuda actual supera el 635% de tus ingresos disponibles, lo que puede llevar a problemas de liquidez."
  ],
  "alternative_suggestion": "Si vendes uno de los vehículos y cancelas su crédito con el dinero, liberas $1M+/mes de cuota y reduces el ratio a zona manejable."
}
```

---

## Feature B: Portfolio Insights
Latency: 569ms

### Insight
El ratio es de 635%, excede en $2.148.300, el crédito más pesado es 'Libre inversión' con $991.536,50 mensuales.