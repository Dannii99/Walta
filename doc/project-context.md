# Project Context

## 1. Project Summary

Una aplicación web de control de presupuesto personal diseñada para reemplazar las hojas de cálculo con una experiencia visual, interactiva y orientada a la toma de decisiones. El producto permite a los usuarios crear presupuestos desde cero o usando plantillas, registrar ingresos y gastos categorizados, visualizar su situación financiera actual mediante gráficos e indicadores de color, evaluar si cumplen reglas financieras saludables (como distribuciones porcentuales del ingreso), y simular decisiones importantes (compra de vehículo, vivienda, metas de ahorro) para entender si son viables según su capacidad real de pago.

## 2. Problem Statement

La mayoría de las personas controlan sus finanzas personales en Excel o no las controlan de forma estructurada. Esto genera tres problemas principales:

- **Falta de claridad visual**: Los números en una tabla no permiten ver de inmediato si la situación financiera es saludable, si se está gastando de más, o cuánto dinero realmente queda disponible.
- **Dificultad para aplicar reglas financieras**: Conceptos como "gastar máximo el 50% en necesidades" o "ahorrar el 20%" son difíciles de monitorear manualmente sin errores.
- **Incertidumbre ante decisiones grandes**: Cuando una persona quiere saber si puede comprar un carro, una casa o invertir, recurre a calculadoras aisladas o suposiciones sin integrar su presupuesto real. No existe una herramienta que conecte su situación financiera diaria con la viabilidad de decisiones importantes.

## 3. Target Users

### Primary User
- **Adultos de 25 a 45 años** con ingreso fijo o variable que desean organizar sus finanzas personales sin complejidad.
- Usuarios que han intentado usar Excel pero lo abandonan por falta de tiempo o porque no les da insights.
- Personas que están considerando compras importantes (vehículo, vivienda) y necesitan validar si pueden asumirlas.

### Secondary User
- **Parejas o familias** que quieren visualizar un presupuesto conjunto (en etapas futuras).
- **Jóvenes profesionales** que empiezan a independizarse y quieren crear su primer presupuesto con guía.

## 4. Value Proposition

"Entiende tu dinero de un vistazo y toma decisiones grandes con confianza."

En lugar de ser una tabla pasiva, el producto es un **asistente financiero visual** que:
- Muestra si tu presupuesto es saludable con colores y señales claras (tipo semáforo).
- Te dice exactamente cuánto puedes destinar a cada categoría según reglas financieras probadas.
- Simula decisiones importantes usando tu presupuesto real, no estimaciones sueltas.
- Se siente moderna, rápida y motivadora, no como una obligación contable.

## 5. MVP Objective

Lanzar una aplicación web funcional que permita a un usuario:
1. Crear un presupuesto personal en menos de 5 minutos.
2. Visualizar su estado financiero actual de forma inmediata y atractiva.
3. Saber si está cumpliendo con una regla de distribución del ingreso.
4. Simular si una compra grande (vehículo) es viable según su capacidad de pago mensual.

El MVP debe demostrar que la experiencia visual + simulación es superior a Excel para este propósito.

## 6. MVP Scope

### Must Have

- **Creación de presupuesto**: Flujo inicial donde el usuario elige entre plantilla predefinida (ej. 50/30/20) o presupuesto en blanco. Debe poder personalizar categorías y montos.
- **Registro de ingresos y gastos**: Formulario simple para agregar ingresos totales mensuales y gastos categorizados (necesidades, deseos, ahorro, deudas). Edición y eliminación de ítems.
- **Dashboard visual principal**: Pantalla principal que muestre:
  - Ingreso total, gasto total, dinero disponible.
  - Gráfico de distribución del presupuesto (por categorías).
  - Indicadores visuales de salud por categoría (ej. color verde/amarillo/rojo según si respeta los porcentajes de la regla aplicada).
  - Porcentajes y números claros.
- **Regla financiera por defecto**: Implementar al menos una regla configurable (ej. 50% necesidades, 30% deseos, 20% ahorro/deuda). Mostrar alerta visual si alguna categoría excede el porcentaje recomendado.
- **Simulador de compra de vehículo**: Módulo donde el usuario ingresa:
  - Precio del vehículo o rango.
  - Cuánto puede dar de entrada.
  - Plazo deseado.
  - Tasa de interés estimada (o usar una por defecto).
  El sistema calcula la cuota mensual y la compara con el dinero disponible real del presupuesto. Muestra un veredicto visual: "Seguro", "Ajustado", "Riesgoso", "No recomendable".
- **Persistencia local**: Los datos deben guardarse para que el usuario no pierda su presupuesto al recargar (asumimos localStorage o similar para el MVP; no requiere backend obligatorio en esta etapa).

### Should Have

- **Múltiples plantillas de presupuesto**: Además de 50/30/20, ofrecer otras como 60/20/20, regla del 10% inversión, plantilla para deudas agresivas, etc.
- **Reglas financieras personalizables**: Permitir al usuario crear su propia regla de porcentajes.
- **Simulador de vivienda**: Similar al de vehículo pero para compra o arriendo de vivienda.
- **Metas de ahorro**: Permitir definir una meta (ej. "vacaciones", "fondo de emergencia") y ver el progreso visual.
- **Historial mensual**: Permitir crear presupuestos por mes y ver evolución básica.

### Could Have

- **Simulador de inversiones**: Calcular rendimiento potencial de una inversión usando el dinero disponible.
- **Comparador de modelos/marcas**: En la simulación de vehículo, sugerir rangos de marcas o modelos según el presupuesto calculado.
- **Exportar resumen a PDF o imagen**.
- **Modo oscuro/claro**.
- **Onboarding interactivo con tooltips**.

### Out of Scope

- Conexión automática con bancos o APIs financieras.
- Gestión de inversiones reales o portfolios.
- Contabilidad para negocios o freelance avanzado.
- Aplicación móvil nativa (el MVP es web responsive).
- Multiusuario o colaboración en tiempo real.
- Autenticación de usuarios con backend (el MVP puede funcionar sin login).
- Múltiples monedas o conversiones.
- Recordatorios o notificaciones push.

## 7. Main User Flows

### Flow 1: Primer Presupuesto (Onboarding)
1. El usuario llega a la aplicación.
2. Ve una pantalla de bienvenida que explica el propósito en 3 frases cortas.
3. Elige "Usar plantilla" o "Empezar en blanco".
4. Si elige plantilla, selecciona una (ej. 50/30/20) y ve las categorías prellenadas.
5. Ingresa su ingreso mensual total.
6. Revisa y ajusta los montos o porcentajes de cada categoría.
7. Guarda y llega al Dashboard.

### Flow 2: Registrar Gasto e Ir al Dashboard
1. Desde el Dashboard, el usuario hace clic en "Agregar gasto".
2. Selecciona categoría, ingresa monto, descripción opcional y fecha.
3. Guarda.
4. El Dashboard se actualiza inmediatamente: gráficos cambian, indicadores de color se ajustan, disponible se recalcula.

### Flow 3: Revisar Salud Financiera
1. El usuario está en el Dashboard.
2. Ve una sección "Regla aplicada: 50/30/20".
3. Observa barras de progreso o semáforos por categoría:
   - Necesidades: 48% (verde).
   - Deseos: 35% (rojo - excedido).
   - Ahorro: 12% (amarillo - bajo).
4. Lee una recomendación breve: "Estás gastando 5% más en deseos. Podrías redirigir $X a ahorro."

### Flow 4: Simular Compra de Vehículo
1. El usuario navega al módulo "Simulaciones".
2. Selecciona "¿Puedo comprar un vehículo?".
3. Ingresa precio del vehículo, entrada disponible, plazo (años), tasa de interés.
4. El sistema calcula cuota mensual estimada.
5. Compara la cuota con el "dinero disponible" real del presupuesto.
6. Muestra resultado visual:
   - Cuota mensual: $X.
   - Disponible actual: $Y.
   - Restaría $Z de tu disponible.
   - Veredicto: "Ajustado" (amarillo) con explicación.
7. El usuario puede guardar la simulación para revisarla luego o descartarla.

### Flow 5: Ajustar Regla Financiera
1. El usuario va a "Configuración de reglas".
2. Ve la regla actual con porcentajes editables.
3. Modifica los porcentajes (validando que sumen 100%).
4. Guarda.
5. El Dashboard recalcula todos los indicadores según la nueva regla.

## 8. Functional Requirements

1. El sistema debe permitir crear un presupuesto con al menos 3 categorías principales (necesidades, deseos, ahorro/deuda).
2. El sistema debe permitir ingresar un monto de ingreso total mensual.
3. El sistema debe permitir agregar, editar y eliminar gastos individuales con categoría, monto y descripción.
4. El sistema debe calcular automáticamente el total gastado por categoría y el dinero disponible (ingreso - gastos).
5. El sistema debe mostrar un dashboard con al menos un gráfico de distribución y números resumen claros.
6. El sistema debe implementar una regla de porcentajes sobre el ingreso y mostrar el cumplimiento visualmente (indicadores de color o barras).
7. El sistema debe alertar visualmente cuando una categoría excede el porcentaje definido por la regla.
8. El sistema debe incluir un simulador de financiamiento de vehículo que calcule cuota mensual basada en precio, entrada, plazo y tasa.
9. El simulador debe comparar la cuota mensual con el dinero disponible del presupuesto y mostrar un veredicto cualitativo (seguro, ajustado, riesgoso, no recomendable).
10. El sistema debe persistir los datos del presupuesto entre sesiones sin requerir autenticación.
11. El sistema debe permitir reiniciar o crear un nuevo presupuesto desde cero.

## 9. Business Rules

1. **Regla de porcentajes**: La suma de los porcentajes asignados a las categorías de una regla financiera debe ser exactamente 100%. El sistema debe validar esto.
2. **Cálculo de disponible**: Dinero disponible = Ingreso total - Suma de todos los gastos registrados. No puede ser negativo; si los gastos superan el ingreso, el sistema debe mostrar alerta de déficit.
3. **Veredicto del simulador de vehículo**:
   - **Seguro**: si la cuota mensual es menor o igual al 30% del dinero disponible mensual.
   - **Ajustado**: si la cuota está entre 31% y 50% del disponible.
   - **Riesgoso**: si la cuota está entre 51% y 70% del disponible.
   - **No recomendable**: si la cuota supera el 70% del disponible o si el disponible es insuficiente para cubrir la cuota.
4. **Cálculo de cuota**: Usar fórmula de amortización estándar (cuota fija) con capital = precio - entrada, tasa mensual = tasa anual / 12, número de pagos = plazo en años × 12.
5. **Categorías obligatorias**: Todo presupuesto debe tener al menos una categoría de ingreso y una de gasto. No se permite un presupuesto vacío.
6. **Edición de plantillas**: Cuando un usuario elige una plantilla, los montos sugeridos son calculados automáticamente como porcentaje del ingreso que ingrese, pero debe poder editarlos manualmente.
7. **Una sola regla activa**: En el MVP, solo puede haber una regla financiera activa por presupuesto.

## 10. Content Requirements

### Textos Fijos
- Nombre del producto: **Walta** — tagline: "Tu dinero, más claro."
- Pantalla de bienvenida: 3 frases de valor (ej. "Toma el control de tu dinero", "Visualiza tu salud financiera", "Simula decisiones importantes").
- Etiquetas del Dashboard: "Ingreso total", "Gastos totales", "Dinero disponible", "Ahorro acumulado".
- Nombres de categorías por defecto: "Necesidades", "Deseos", "Ahorro e Inversión", "Deudas".
- Mensajes de veredicto del simulador: textos explicativos para cada nivel de riesgo.
- Mensajes de alerta: "Estás excediendo el X% recomendado para [categoría]".

### Contenido Generado por el Sistema
- Valores numéricos formateados en moneda local (asumimos pesos colombianos o moneda configurable en futuro; para MVP, formato estándar $).
- Porcentajes de cumplimiento de reglas.
- Fechas de gastos.
- Resultados de simulaciones guardadas (título, fecha, veredicto).

### Contenido de Simulación
- Campos del formulario de vehículo: "Precio del vehículo", "Cuota inicial", "Plazo (años)", "Tasa de interés anual (%)", "Cuota mensual estimada", "Tu dinero disponible", "Veredicto".
- Leyenda explicativa de cómo se calcula la cuota (texto corto).

## 11. Success Criteria

1. Un usuario nuevo puede crear su primer presupuesto y ver su dashboard en menos de 5 minutos sin tutorial externo.
2. El 80% de los usuarios que completan el onboarding llegan al Dashboard (métrica de retención inicial).
3. Los indicadores visuales de salud financiera permiten identificar de un vistazo si el presupuesto está equilibrado (test de usabilidad informal).
4. El simulador de vehículo genera un veredicto coherente comparado con el presupuesto real del usuario (validación lógica).
5. Los datos persisten tras cerrar y abrir el navegador.
6. El producto se percibe como más útil y atractivo que una hoja de Excel para el mismo propósito (feedback cualitativo de 5-10 usuarios de prueba).

## 12. Assumptions

1. El usuario principal tiene ingresos y gastos en una sola moneda (no requiere multi-moneda en MVP).
2. Los usuarios prefieren no crear cuenta para probar el producto; la persistencia local es suficiente para el MVP.
3. La fórmula de amortización estándar es adecuada para las simulaciones de crédito.
4. Los usuarios entienden conceptos básicos de porcentajes y cuotas mensuales.
5. El producto será usado principalmente en escritorio, aunque debe ser usable en móvil (responsive).
6. La plantilla Excel de referencia representa una estructura estándar de presupuesto personal que es válida como base conceptual.
7. El mercado objetivo valora más la claridad visual y la simulación que la contabilidad detallada.

## 13. Risks

1. **Riesgo de percepción**: Los usuarios pueden seguir viendo a Excel como "suficiente" y no percibir el valor agregado de la visualización y simulación. *Mitigación*: enfocar el onboarding en mostrar inmediatamente el veredicto visual y una simulación, no solo tablas.
2. **Riesgo de precisión financiera**: Si las tasas de interés usadas en simulaciones difieren mucho de la realidad del mercado local, el veredicto puede ser engañoso. *Mitigación*: usar tasas referenciales claras, indicar que son estimaciones, y permitir al usuario ajustar la tasa.
3. **Riesgo de complejidad del simulador**: Incluir demasiados parámetros en la simulación puede hacerla tan compleja como una calculadora financiera. *Mitigación*: mantener el simulador del MVP con máximo 4 campos.
4. **Riesgo de abandono temprano**: Si el onboarding es largo o confuso, el usuario puede abandonar antes de ver valor. *Mitigación*: permitir ingresar solo ingreso total y un gasto estimado para generar el primer dashboard en 2 pasos.
5. **Riesgo técnico de persistencia local**: Si el usuario limpia su navegador, pierde los datos. *Mitigación*: aceptable para MVP, pero debe planificarse migración a backend/autenticación en futuro.

## 14. Open Questions

1. ¿Cuál es la moneda principal del mercado objetivo? (pesos colombianos, dólares, etc.) Esto afecta formatos, simuladores y tasas de interés de referencia.
2. ¿Se requiere que el simulador de vehículo sugiera marcas/modelos reales o solo rangos de precio genéricos? (implica investigación de datos o integraciones futuras).
3. ¿Existe interés en compartir el presupuesto con una pareja o asesor financiero? (afecta prioridad de multiusuario).
4. ¿Qué tan detallado debe ser el registro de gastos? ¿Diario, semanal, o solo montos mensuales agregados?
5. ¿Debe el producto ofrecer consejos financieros personalizados o solo mostrar datos y alertas?
6. ¿Cuál es el modelo de negocio objetivo? (gratuito, freemium, suscripción). Esto afecta qué poner en Should vs Could Have.

## 15. Handoff Notes for Frontend Architect

### Lo que debe preservarse
- **Experiencia visual primero**: El valor del producto está en que un no-experto entienda su situación financiera sin leer tablas. Cualquier arquitectura debe priorizar renderizado rápido de gráficos, indicadores de color y números grandes.
- **Flujo de onboarding corto**: La primera interacción debe ser lo más corta posible. El arquitecto debe diseñar un flujo de 2-3 pasos para tener un presupuesto funcional.
- **Simulador integrado**: El simulador no es una calculadora aislada; debe leer el "dinero disponible" del presupuesto activo. Esto implica que el estado del presupuesto debe ser accesible globalmente o por un servicio de estado compartido.
- **Sin backend obligatorio para MVP**: La persistencia puede ser local. El arquitecto no debe asumir necesidad de API REST, autenticación o base de datos remota en la primera versión, aunque debe dejar la puerta abierta para migrar a backend más adelante.

### Lo que debe clarificarse
- **Formato de moneda y localización**: Definir si se usará una librería de internacionalización desde el inicio o un formato fijo para el MVP.
- **Gráficos**: Se requieren gráficos de torta/dona y barras. El arquitecto debe evaluar opciones livianas que no comprometan el bundle inicial.
- **Estado global**: El presupuesto, las reglas y las simulaciones deben compartirse entre vistas. El arquitecto debe proponer una estrategia de gestión de estado acorde al framework elegido.
- **Validaciones en tiempo real**: Al editar porcentajes de reglas o ingresar gastos, los cálculos y gráficos deben actualizarse sin recarga. Esto requiere un modelo reactivo de datos.

### Restricciones técnicas a respetar
- No elegir tecnología aún. El arquitecto debe decidir basado en estas necesidades.
- No implementar autenticación ni backend para el MVP a menos que el arquitecto considere que una solución serverless simplifica el despliegue.
- El producto debe funcionar offline después de la primera carga (es un buen diferenciador frente a soluciones web tradicionales).

### Diferenciador clave a proteger
La combinación de **presupuesto visual + veredicto de simulación** es el core. El arquitecto debe asegurar que la transición entre "ver mi dinero" y "probar una compra" sea fluida, con los números del presupuesto siempre visibles como contexto.
