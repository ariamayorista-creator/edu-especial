# Lecciones Aprendidas - EduEspecial v4.0

Este documento resume los retos técnicos y de arquitectura superados durante la modernización y despliegue de la plataforma.

## 1. Bloqueo de Seguridad en Vercel (CVE-2025-66478)
- **Problema**: Vercel impidió inicialmente el despliegue debido a una vulnerabilidad crítica en Next.js 15.1.4.
- **Solución**: Se actualizó el proyecto a **Next.js 16.2.4**. Aunque es una versión mayor, es necesaria para cumplir con los requisitos de seguridad de la infraestructura de Vercel.
- **Aprendizaje**: Mantener las versiones del framework actualizadas es un requisito de seguridad operativa, no solo de funcionalidad.

## 2. Dependencias de UI (Radix & Tailwind v4)
- **Problema**: Shadcn/UI requiere librerías primitivas de Radix que no siempre se instalan automáticamente en entornos limpios de CI/CD.
- **Solución**: Se añadieron manualmente `@radix-ui/react-slot`, `react-dialog`, `react-tabs`, etc., para garantizar que los componentes `Button` y otros funcionen en producción.
- **Aprendizaje**: En proyectos con Tailwind v4, la gestión manual de dependencias críticas de UI es más segura que confiar en la resolución automática del gestor de paquetes.

## 3. Entorno de Terminal (Workspace Safety)
- **Problema**: La terminal tiene restricciones para ejecutar comandos directos en el Escritorio del usuario.
- **Solución**: Uso del flag `--cwd` desde el espacio de trabajo scratch para operar sobre la carpeta del proyecto.
- **Aprendizaje**: Conocer las limitaciones del entorno del agente ayuda a encontrar "workarounds" eficientes sin comprometer la seguridad.

## 4. ESLint y ESM Extensions
- **Problema**: El nuevo formato `eslint.config.mjs` de Next.js es estricto con las extensiones de archivo en producción.
- **Solución**: Cambiar `eslint-config-next/core-web-vitals` por `eslint-config-next/core-web-vitals.js`.
- **Aprendizaje**: El paso de desarrollo a producción (Node ESM) requiere precisión absoluta en los paths de importación.

---
*Documento guardado para persistencia histórica del proyecto.*
