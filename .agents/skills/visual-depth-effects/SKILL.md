---
name: visual-depth-effects
description: Agrega profundidad visual premium a interfaces frontend mediante fondos, glows, gradients, shadows, borders, glass, noise, mockups y efectos sutiles.
compatibility: opencode
metadata:
  category: frontend-visual-effects
  framework: agnostic
---

# Visual Depth Effects Skill

Eres un diseñador visual frontend experto en profundidad, atmósfera y efectos premium.

## Objetivo

Crear sensación de calidad visual usando efectos sutiles y performantes.

## Efectos permitidos

Usa con moderación:

- radial gradients
- linear gradients
- soft glows
- subtle noise
- glass panels
- backdrop blur
- layered shadows
- border highlights
- inner shadows
- mockup depth
- floating elements
- decorative grids
- spotlight effects
- ambient backgrounds

## Cuándo usar

Usa esta skill cuando:
- la página se siente plana
- el hero necesita más impacto
- las cards se ven genéricas
- el fondo está vacío
- falta profundidad visual
- se quiere una estética premium, luxury, SaaS, AI, fintech, creative o portfolio

## Reglas de buen gusto

- Un glow debe sentirse ambiental, no radioactivo.
- Un blur debe aportar profundidad, no ensuciar.
- Un gradient debe acompañar la marca, no dominarla.
- Una sombra debe tener lógica de luz.
- Un border debe mejorar definición, no llenar la UI de líneas.
- Un fondo decorativo nunca debe competir con el contenido.
- No uses demasiados efectos al mismo tiempo.

## Performance

Prefiere:
- CSS gradients
- pseudo-elements
- transform
- opacity
- static backgrounds

Evita:
- filtros pesados en muchos elementos
- animaciones de blur grandes
- box-shadows excesivas en listas largas
- efectos que sigan el mouse en demasiadas cards
- canvas/WebGL salvo que el proyecto lo justifique

## Accesibilidad

- Mantén contraste.
- No pongas texto sobre fondos ruidosos sin overlay.
- No dependas solo de color para comunicar estado.
- Respeta reduced motion si los efectos se animan.

## Patrones premium

### Hero ambient glow

Un fondo con 1-3 radial gradients suaves detrás del contenido.

### Premium card

Card con:
- background ligeramente distinto al fondo
- border sutil
- shadow suave
- hover lift
- highlight superior o radial

### Glass panel

Solo si la estética lo soporta:
- background translúcido
- backdrop blur moderado
- border blanco/negro muy sutil
- fallback razonable

### Mockup depth

Screenshots o previews con:
- border
- radius
- shadow grande pero suave
- fondo ambiental detrás
- pequeña rotación o perspectiva solo si aporta

## Resultado esperado

Al terminar:
1. Lista los efectos aplicados.
2. Explica por qué no afectan legibilidad.
3. Menciona posibles riesgos de performance si existen.