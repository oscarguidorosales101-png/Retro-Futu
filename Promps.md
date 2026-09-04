📝PROMPT MAESTRO DE GENERACIÓN DE CÓDIGO (NUEVO ESTILO VISUAL)
Actúa como un Desarrollador Full Stack Senior especializado en React, Vite y arquitecturas modulares. Construye el proyecto web para la startup "Retro-Futuristic Tech Garage" (estudio de personalización técnica y estética de consolas, controles y hardware).

Centra el alcance exclusivamente en la experiencia cliente (catálogo, cotizador, asistente flotante) y en las herramientas del Socio 1 (Técnico / Hardware): gestión CRUD de proyectos técnicos, autenticación protegida y gráficos analíticos con recharts.

1. PALETA DE COLORES Y FONDO ANIMADO DINO-TECH
Reemplaza los colores neón/púrpura tradicionales por la siguiente paleta tecnológica Esmeralda / Ámbar Volcánico / Cian Pulse:

Fondo profundo: #030712 (Gris espacial oscuro)

Contenedores y Tarjetas: rgba(17, 24, 39, 0.85) con backdrop-filter: blur(12px)

Acentos principales: Verde Esmeralda (#10b981), Ámbar Volcánico (#f59e0b) y Cian Pulse (#06b6d4)

Líneas y Bordes: #1f2937 con resplandor esmeralda/ámbar en hover.

🎨 Componente de Fondo Animado (src/components/AnimatedBackground.jsx):
Implementa un fondo interactivo en un <canvas> posicionado en fixed al fondo (z-index: -1):

Red de Nodos y Circuitos: Partículas en movimiento que representan nodos de hardware que se conectan con líneas de circuito trazadas cuando dos puntos se aproximan.

Rejilla Cibernética: Una cuadrícula tenue dibujada en el canvas que simula un plano esquemático digital de circuito impreso (PCB).

2. ESTRUCTURA COMPLETA DE ARCHIVOS Y CARPETAS
El código debe entregarse estructurado en la siguiente jerarquía sin omitir ningún archivo:

Plaintext
retro-tech-garage/
├─ db.json                            <- Base de datos simulada (json-server)
├─ package.json                       <- Dependencias y scripts
├─ index.html
├─ vite.config.js
└─ src/
   ├─ assets/
   ├─ components/                     <- Componentes UI reutilizables
   │  ├─ Navbar.jsx
   │  ├─ Footer.jsx
   │  ├─ TarjetaMod.jsx
   │  ├─ AnimatedBackground.jsx     <- Fondo interactivo Canvas
   │  ├─ RutaProtegida.jsx
   │  └─ ChatbotTech.jsx            <- Asistente flotante VoltBot
   ├─ pages/                          <- Vistas principales de la app
   │  ├─ Inicio.jsx
   │  ├─ CatalogoMods.jsx           <- Galería y catálogo de modificaciones
   │  ├─ Cotizador.jsx                <- Herramienta para solicitar personalización
   │  ├─ Login.jsx                   <- Acceso Administrador Técnico
   │  ├─ AdminHardware.jsx            <- CRUD de Módulos / Trabajo Técnico
   │  └─ PanelEstadisticas.jsx        <- Panel de análisis con gráficos Recharts
   ├─ services/                       <- Capa de peticiones HTTP (Fetch API)
   │  ├─ modsService.js
   │  ├─ authService.js
   │  └─ cotizacionesService.js
   ├─ App.jsx                         <- Router y estados globales
   ├─ main.jsx                        <- Entrada principal
   └─ index.css                       <- Paleta Esmeralda / Ámbar Volcánico y reglas visuales
3. BASE DE DATOS Y SERVICIOS HTTP (db.json & services/)
db.json (Raíz):

modificaciones: Arreglo de trabajos (id, hardware, categoría, tipoMod, precioEstimado, tiempoDias, disponible).

usuarios: { "id": "1", "usuario": "admin", "contrasena": "retro123", "rol": "tecnico_master" }.

cotizaciones: Arreglo para almacenar solicitudes del cotizador.

Agrega en package.json el script: "server": "json-server --watch db.json --port 3001".

Capa Async Services (src/services/):

modsService.js: Funciones CRUD completas (obtenerModificaciones, crearModificacion, actualizarModificacion, eliminarModificacion).

authService.js: Validación del login técnico contra /usuarios.

cotizacionesService.js: Guardar y leer solicitudes del cotizador.

4. VISTAS Y COMPONENTES CLAVE
Navbar.jsx: Enlaces a Inicio, Catálogo, Cotizador, Métricas y Login (o Panel Admin si la sesión está activa) con logotipo iluminado en ámbar.

CatalogoMods.jsx & TarjetaMod.jsx: Tarjetas de mods con filtros dinámicos por categoría (Portátiles, Mandos, Teclados), insignias en tono ámbar y detalles de tiempos/precios.

Cotizador.jsx: Formulario interactivo para enviar solicitudes de modificación directamente a la base de datos simulada.

AdminHardware.jsx (Socio Técnico): Vista protegida para crear, editar, alternar disponibilidad o eliminar mods del catálogo.

PanelEstadisticas.jsx: Gráficos analíticos dinámicos con recharts (BarChart por categorías y AreaChart por rango de precios).

ChatbotTech.jsx: Bot flotante estilizado ("VoltBot") que guía al cliente sobre consultas frecuentes o redirige al cotizador.

5. ENTREGABLE REQUERIDO
Proporciona todo el código fuente listo para copiar y pegar en cada archivo respetando la estructura indicada, asegurándote de incluir la implementación completa del canvas animado en AnimatedBackground.jsx y las variables CSS con la paleta Esmeralda/Ámbar.

# PROMPT PARA ANTIGRAVITY — DOCUMENTACIÓN VIBE CODING

Actúa como **analista y documentador de proyectos de desarrollo web con metodología Vibe Coding**.

Quiero que analices el proyecto actual que tienes abierto en el workspace y prepares una documentación en Markdown llamada:

`DOCUMENTACION_VIBE_CODING.md`

## ⚠️ REGLA PRINCIPAL — NO MODIFICAR EL CÓDIGO

En esta tarea **NO debes modificar, eliminar, mover ni reescribir ningún archivo del proyecto**, excepto crear el archivo:

`DOCUMENTACION_VIBE_CODING.md`

No debes corregir errores de código.

No debes instalar dependencias.

No debes cambiar componentes.

No debes modificar estilos.

No debes crear funcionalidades.

No debes ejecutar cambios sobre el proyecto.

Tu trabajo en esta tarea es **ÚNICAMENTE analizar, documentar y detectar qué falta** respecto a la práctica de laboratorio proporcionada.

---

# 1. ANALIZA EL PROYECTO ACTUAL

Primero inspecciona el proyecto completo.

Revisa:

* estructura de carpetas
* páginas
* componentes
* archivos de datos
* estilos
* rutas
* formularios
* funcionalidades
* validaciones
* almacenamiento de datos
* historial
* carrito/pedidos si existe
* paneles o administración si existen
* imágenes
* configuración
* package.json
* README existente
* cualquier otra parte relevante

No cambies nada.

Quiero que entiendas primero **qué existe actualmente y qué hace cada parte**.

---

# 2. IDENTIFICA EL NEGOCIO Y EL PROBLEMA

Determina cuál es el negocio que representa actualmente la aplicación.

Explica:

* Nombre del proyecto
* Tipo de negocio
* Usuario objetivo
* Problema de negocio que intenta resolver
* Solución propuesta
* Funcionalidad principal del MVP
* Funcionalidades secundarias

Si algún dato no puede determinarse claramente desde el código, indícalo como:

> "No identificado claramente en el proyecto."

No inventes información como si fuera un hecho.

---

# 3. COMPARA EL PROYECTO CON LA PRÁCTICA

La práctica se basa en:

**Describe → Genera → Revisa → Prueba → Refina**

Y evalúa principalmente:

1. Intención clara
2. Contexto
3. Iteraciones cortas
4. Verificación humana
5. Pensamiento de sistema
6. Responsabilidad sobre el código generado por IA
7. MVP funcional
8. Valor real para el negocio
9. Bitácora de prompts
10. Reflexión final

Analiza cuánto cumple actualmente el proyecto con cada uno.

Utiliza una tabla:

| Requisito                                          | Estado     | Evidencia encontrada | Qué falta |
| -------------------------------------------------- | ---------- | -------------------- | --------- |
| Intención del proyecto                             | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Problema de negocio                                | ✅ / ⚠️ / ❌ | ...                  | ...       |
| MVP                                                | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Ciclo Describe → Genera → Revisa → Prueba → Refina | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Iteraciones                                        | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Verificación humana                                | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Validaciones                                       | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Mensajes al usuario                                | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Seguridad básica                                   | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Valor para el negocio                              | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Prueba final                                       | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Bitácora de prompts                                | ✅ / ⚠️ / ❌ | ...                  | ...       |
| Reflexión                                          | ✅ / ⚠️ / ❌ | ...                  | ...       |

Usa:

* ✅ Cumple
* ⚠️ Cumple parcialmente
* ❌ Falta

---

# 4. DOCUMENTA LO QUE YA HICIMOS

Reconstruye, hasta donde sea posible mediante los archivos actuales, qué se ha desarrollado.

No inventes prompts que no puedas comprobar.

Divide la documentación en funcionalidades.

Por ejemplo:

### Funcionalidad 1 — Estructura inicial

Explica qué se creó.

### Funcionalidad 2 — Productos

Explica qué existe actualmente.

### Funcionalidad 3 — Carrito

Explica qué permite hacer.

### Funcionalidad 4 — Checkout

Explica qué permite hacer.

### Funcionalidad 5 — Historial

Explica qué existe.

### Funcionalidad 6 — Confirmación

Explica qué existe.

Y así sucesivamente según lo que realmente encuentres.

Para cada funcionalidad indica:

* Qué se quería conseguir
* Qué existe actualmente
* Qué archivos participan
* Qué problema resuelve
* Estado actual
* Qué falta para considerarla terminada

---

# 5. ANALIZA EL CICLO DE VIBE CODING

Crea una sección específica:

# Ciclo de Vibe Coding

Explica cómo se puede identificar el proceso:

### Describe

¿Qué intención o instrucciones parecen haber guiado el desarrollo?

### Genera

¿Qué partes parecen haber sido construidas con ayuda de IA?

### Revisa

¿Qué elementos requieren revisión humana?

### Prueba

¿Qué cosas deberían probarse?

### Refina

¿Qué partes ya muestran iteración o cuáles deberían refinarse?

IMPORTANTE:

No afirmes que algo fue realizado si no existe evidencia.

Si no puedes comprobar una fase, escribe claramente:

> "No existe evidencia suficiente en el proyecto para confirmar esta fase."

---

# 6. ANALIZA LO QUE FALTA PARA ENTREGAR LA PRÁCTICA

Esta es una de las partes MÁS IMPORTANTES.

Crea una sección:

# Qué falta para cumplir completamente la práctica

Organiza las tareas por prioridad.

## 🔴 Obligatorio

Incluye todo lo necesario para cumplir la práctica y obtener una buena evaluación.

## 🟡 Recomendado

Incluye mejoras que ayudarían a subir la calidad.

## 🟢 Opcional

Incluye los retos extra de la práctica.

No programes estas cosas.

Solo documenta qué falta.

---

# 7. COMPARA CONTRA LA RÚBRICA

Analiza la rúbrica de 100 puntos:

* Solución funcional — 30 puntos
* Aplicación del ciclo — 20 puntos
* Calidad de los prompts — 15 puntos
* Verificación humana — 15 puntos
* Valor de negocio — 10 puntos
* Reflexión — 10 puntos

Crea una tabla:

| Criterio             |  Máximo | Estado actual | Estimación | Qué falta |
| -------------------- | ------: | ------------- | ---------: | --------- |
| Solución funcional   |      30 | ...           |        ... | ...       |
| Aplicación del ciclo |      20 | ...           |        ... | ...       |
| Calidad de prompts   |      15 | ...           |        ... | ...       |
| Verificación humana  |      15 | ...           |        ... | ...       |
| Valor de negocio     |      10 | ...           |        ... | ...       |
| Reflexión            |      10 | ...           |        ... | ...       |
| **TOTAL ESTIMADO**   | **100** |               |  **X/100** |           |

IMPORTANTE:

La puntuación debe ser una **estimación documental**, no una calificación oficial.

Explica por qué asignas cada puntuación.

---

# 8. BITÁCORA DE PROMPTS

Determina si existe evidencia de una bitácora de prompts.

Si existe, documenta lo encontrado.

Si NO existe, crea una sección:

## Bitácora de prompts pendiente

Explica que este entregable debe contener:

| Iteración | Prompt | Qué generó la IA | Qué revisé | Qué corregí | Resultado |
| --------- | ------ | ---------------- | ---------- | ----------- | --------- |

NO inventes los prompts históricos.

Si no están disponibles, indica que deben reconstruirse a partir del historial de trabajo real.

---

# 9. REFLEXIÓN PENDIENTE

Analiza si el proyecto contiene evidencia para responder estas preguntas:

1. ¿Cuánto tiempo habría tomado sin IA y cuánto con IA?
2. ¿En qué momento la IA se equivocó?
3. ¿Cómo se detectó el error?
4. ¿Qué parte fue responsabilidad humana?
5. ¿Qué parte realizó la IA?
6. ¿Cómo cambia esto la idea del trabajo de un desarrollador?

Si no existe información suficiente, marca estas respuestas como pendientes.

NO inventes experiencias personales.

---

# 10. PRUEBAS FINALES PENDIENTES

Crea una checklist para comprobar la aplicación.

Por ejemplo:

* [ ] La aplicación inicia correctamente.
* [ ] La funcionalidad principal funciona.
* [ ] Los datos aparecen correctamente.
* [ ] Se pueden eliminar/modificar datos cuando corresponda.
* [ ] Los formularios validan información.
* [ ] Se prueban campos vacíos.
* [ ] Se prueban datos incorrectos.
* [ ] Se prueban casos repetidos.
* [ ] La aplicación muestra mensajes claros.
* [ ] No aparecen errores en consola.
* [ ] No existen claves o datos sensibles expuestos.
* [ ] Se cumplen los 3 criterios de éxito del MVP.

Adapta esta lista a las funcionalidades reales del proyecto.

---

# 11. CRITERIOS DE ÉXITO

Determina cuáles deberían ser los 2–3 criterios de éxito del MVP basándote en el negocio actual.

Si no están definidos claramente, crea una propuesta marcada como:

> "Propuesta — pendiente de validación"

No los presentes como requisitos originales si no hay evidencia.

---

# 12. ANÁLISIS DE SEGURIDAD BÁSICA

Revisa únicamente de forma documental:

* claves API
* contraseñas
* tokens
* información bancaria
* datos personales
* credenciales
* información sensible
* variables expuestas en frontend

Indica si encontraste algo preocupante.

No corrijas nada.

Solo documenta.

---

# 13. ANÁLISIS DE CALIDAD DEL PROYECTO

Sin modificar código, analiza:

* organización
* reutilización de componentes
* claridad
* consistencia visual
* mantenibilidad
* posibles errores
* funcionalidades incompletas
* archivos innecesarios
* posibles problemas técnicos

Distingue claramente entre:

**Problemas confirmados**

y

**Posibles mejoras**

No presentes una sospecha como un error confirmado.

---

# 14. PLAN FINAL

Al final crea:

# Plan recomendado antes de entregar

Haz una lista ordenada:

1. Tarea
2. Motivo
3. Prioridad
4. Relación con la práctica
5. Qué debería comprobarse

IMPORTANTE:

Este plan es solamente una guía.

NO debes ejecutar ninguna de estas tareas.

---

# 15. CONCLUSIÓN

Termina con una conclusión breve explicando:

* Qué tan avanzado está el proyecto.
* Si ya puede considerarse un MVP.
* Qué partes cumplen la práctica.
* Qué partes faltan.
* Qué debería hacerse antes de la entrega.
* Cuáles son los puntos más importantes para demostrar el uso correcto de Vibe Coding.

La conclusión debe ser honesta.

No digas que el proyecto está "100% terminado" si existen pendientes.

---

# FORMATO DEL ARCHIVO

El resultado debe ser un Markdown profesional:

`DOCUMENTACION_VIBE_CODING.md`

Debe tener:

* Título
* Descripción
* Estado del proyecto
* Negocio
* Problema
* Solución
* Funcionalidades
* Análisis del ciclo Vibe Coding
* Comparación con la práctica
* Tabla de requisitos
* Qué falta
* Rúbrica
* Bitácora de prompts
* Pruebas
* Seguridad
* Reflexión pendiente
* Plan de trabajo
* Conclusión

Usa Markdown limpio, tablas, listas y checkboxes.

## REGLA FINAL

Antes de terminar verifica:

* [ ] Solo creaste/modificaste `DOCUMENTACION_VIBE_CODING.md`
* [ ] No modificaste código
* [ ] No eliminaste archivos
* [ ] No instalaste dependencias
* [ ] No inventaste información
* [ ] Diferenciaste hechos confirmados de recomendaciones
* [ ] Identificaste claramente qué falta para cumplir la práctica
* [ ] Comparaste el proyecto contra la rúbrica
* [ ] Documentaste el estado real del MVP

**No programes nada. No arregles nada. No cambies nada del proyecto.**

Tu único entregable en esta tarea es:

`DOCUMENTACION_VIBE_CODING.md`

---

## HISTORIAL DE INTERVENCIONES IA (BITÁCORA VIBE CODING)

### Intervención 1: Análisis y Documentación
* **Prompt:** "Actúa como analista y documentador de proyectos de desarrollo web con metodología Vibe Coding. Quiero que analices el proyecto actual que tienes abierto en el workspace y prepares una documentación en Markdown llamada: DOCUMENTACION_VIBE_CODING.md..."
* **Qué generó la IA:** Un análisis completo estático del código. Generó el archivo `DOCUMENTACION_VIBE_CODING.md` detallando el estado actual, las funcionalidades, el nivel de cumplimiento del MVP y listando las tareas pendientes críticas (seguridad, estadísticas estáticas, gestión de cotizaciones).
* **Qué se revisó:** Se verificó que el análisis reflejara fielmente el código sin inventar funcionalidades y que no modificara archivos.
* **Qué se modificó:** Ningún archivo de código, únicamente se creó la documentación.
* **Resultado:** Se obtuvo un diagnóstico claro del proyecto con un plan priorizado de las características faltantes para completar la práctica.

### Intervención 2: Completar MVP
* **Prompt:** "Quiero que completes mi proyecto VOLTGARAGE basándote ÚNICAMENTE en el análisis que ya realizaste en: DOCUMENTACION_VIBE_CODING.md..."
* **Qué generó la IA:** Modificó `Admin.jsx` (pestañas y tabla de cotizaciones), `Estadisticas.jsx` (gráficos dinámicos conectados a la API), `Cotizador.jsx` (validaciones y fechas), `App.jsx` y `Login.jsx` (persistencia de sesión en localStorage y seguridad de mensajes). Creó `Footer.jsx` y limpió archivos residuales.
* **Qué se revisó:** Se validó que las nuevas implementaciones no rompieran el diseño Cyberpunk actual ni la funcionalidad base del CRUD y que la UI de gestión de cotizaciones se integrara bien en el panel Admin.
* **Qué se modificó:** `App.jsx`, `Login.jsx`, `Navbar.jsx`, `Estadisticas.jsx`, `Admin.jsx`, `Cotizador.jsx`, `Footer.jsx`, `DOCUMENTACION_VIBE_CODING.md`, `Promps.md`. Eliminó archivos residuales.
* **Resultado:** El MVP parcial se transformó en un MVP completo, con ciclo de negocio cerrado y métricas reales.
