# MANUAL DE ADMINISTRADOR Y CONTROL DEL SISTEMA - REDERAR.app
**Versión del Sistema: 1.0.0 (Edición Multilingüe / Multi-País)**
**Destinatario: Administrador General del Sistema**

---

## 1. INTRODUCCIÓN Y ARQUITECTURA DEL SISTEMA
El sistema de dimensionamiento solar **REDERAR.app** es una herramienta full-stack progresiva desarrollada en **React (TypeScript), Vite y Tailwind CSS** con un servidor de respaldo en **Node.js (Express)**.

El sistema permite calcular de manera precisa sistemas solares en base a tres tecnologías principales:
*   **On-Grid (Inyección a Red):** Dimensionamiento basado en el consumo eléctrico anual (kWh/año) y la cobertura SOLAR regional (HSP).
*   **Off-Grid (Autónomos con Baterías):** Dimensionamiento basado en un inventario detallado de cargas y artefactos diarios, días de autonomía de reserva y tecnología de baterías.
*   **Térmicos (Agua Caliente Sanitaria):** Dimensionamiento de colectores solares planos o tubos de vacío (Heat Pipe) basados en ocupantes, perfil de consumo de agua, dureza del agua y equipo de presurización.

---

## 2. FLUJO DEL USUARIO: DESDE LA DESCARGA HASTA LA COMPRA
La cadena operativa y comercial del sistema está diseñada para ser atractiva, con baja fricción al inicio y una clara llamada a la acción para adquirir licencias profesionales.

### Paso 1: Publicación y Acceso Inicial
1.  **Alojamiento en Cloud Run (Contenedores):** El sistema se compila y aloja en la nube, haciéndose público mediante una URL única (ej. `https://rederar.app` o la proporcionada por el servidor del host).
2.  **Modo de Prueba Gratuito (Trial):**
    *   Al ingresar por primera vez, el usuario se encuentra en modo **Prueba Gratuita**.
    *   El sistema le permite realizar hasta **3 cálculos de dimensionamiento gratuitos por tecnología** (3 de On-Grid, 3 de Off-Grid y 3 de Térmica).
    *   Este estado se almacena y se persiste de manera segura en el navegador del usuario utilizando `localStorage`.

### Paso 2: Bloqueo de Límite y Conversión de Compra 100% Automatizada
1.  **Llegada al Límite:** Al intentar realizar el cuarto cálculo de cualquiera de las tecnologías, el sistema bloquea los inputs e impide el cálculo, mostrando una ventana emergente de bloqueo.
2.  **Pasarelas de Pago y Arquitectura Financiera Definida:**
    
#### Matriz Resumen de Responsabilidades y Funcionamiento Comercial:
| Componente | Función Principal | Canal / Plataforma |
| :--- | :--- | :--- |
| **Frontend** | Interfaz visual, ingreso de datos, motores de dimensionamiento solar | React 18 / Tailwind CSS / Browser |
| **Backend** | Cotizador Dólar Blue, validación de códigos de créditos, alertas anti-clonación | Node.js + Express en Cloud Run |
| **Cobro Argentina** | Cobros en ARS, QR, Transferencias, Facturación AFIP | Mercado Pago |
| **Cobro Exterior** | Cobros en USD, Tarjetas Internacionales, PayPal, Taxes Globales | Freemius |
| **Retiro USD** | Transferencia de ganancias acumuladas en Freemius | PayPal / Transferencia Bancaria / Payoneer (Opcional) |
| **Cobro Billete Papel** | Conversión de USD internacional a efectivo físico en Argentina | USDT en Lemon Cash / Binance / Cueva / Financiera |
| **Licenciamiento** | Activación de créditos y Marca Blanca para instaladores | Códigos Criptográficos de 16 caracteres |

3.  **Detalle de Pasarelas de Pago:**
    *   **Mercado Pago (Argentina - AR$):** 100% AUTOMATIZADO. El usuario en Argentina paga con su tarjeta, dinero en cuenta o transferencia via CVU. El webhook de Mercado Pago acredita los créditos en la app de forma **inmediata, automática y sin intervención manual**.
    *   **Freemius (Internacional - USD$):** 100% AUTOMATIZADO. Para usuarios fuera de Argentina, Freemius actúa como Merchant of Record (MOR) gestionando tarjetas internacionales, PayPal y cobro de impuestos globales. Cuando un cliente internacional paga, el webhook de Freemius activa los créditos en la app **de inmediato y en automático sin necesidad de contacto alguno**.
        *   *1. Claves de Integración (Completado):* En Freemius, ve a **Settings -> API y claves**. Ya se han obtenido tu **ID del producto** (`35599`), tu **Clave pública** (`pk_b47e69fa5d6b36b33dea7bf73f5d6`), tu **Clave secreta** (`sk_...`) y tu **Token de API (Bearer)**.
        *   *2. ¿Cómo pagan tus compradores internacionales?:* Tus compradores pagan directamente en la web con **Tarjeta de Crédito/Débito** o su **PayPal**. La app los procesa automáticamente en segundo plano (cero contacto con el cliente).
        *   *3. La Estrategia Más Conveniente, Redituable y Segura para Retirar tus USD (Solo con DNI Argentino):*
            *   **Conveniente (100% Online con DNI):** Te registras en **Payoneer** gratuitamente usando únicamente tu **DNI argentino** (no requiere pasaporte ni abrir empresa/LLC en EE.UU.).
            *   **Segura (100% Transparente):** Vinculas el email de tu Payoneer en Freemius (`Settings -> Payouts`). Freemius transfiere ahí tus dólares de forma automática periódicamente.
            *   **Redituable (Máxima Rentabilidad al Dólar Libre):** Desde la app de **Lemon Cash** vinculas tu cuenta Payoneer. Traes tus dólares cobrados en Freemius a Lemon Cash convertidos en **USDT / Dólar Cripto en 1 clic** al valor del dólar libre (Blue/MEP) sin que ningún banco te aplique pesificaciones ni retenciones abusivas.
        *   *4. Cobro Cripto Directo Alternativo:* Si un cliente prefiere pagar directamente en USDT, la app también incluye el canal **Lemon Cash / Cripto (USDT) Directo** con tu wallet (`0x5776d6D84C7B5D58810DbAF90B8CEb0933C71F5D`). El cliente te envía el comprobante y el sistema o admin activa los créditos.
    *   **Lemon Cash / Cripto (USDT):** Canal alternativo para conversión fluida de USD internacional a efectivo físico o saldo cripto/ARS sin fricción.
    *   **Asistencia por WhatsApp (Soporte Humano):** En todo momento, el usuario tiene un botón secundario para solicitar soporte o evacuación de dudas directamente con el WhatsApp oficial del administrador.
4.  **Mecánica de Prepago por Créditos (Consumo):**
    *   **Consumo Uno a Uno:** El sistema opera bajo un esquema estrictamente **prepago**. Cada dimensionamiento exitoso que realice el usuario consume **1 crédito** de su balance de créditos.
    *   **Acceso a Herramientas de Valor Agregado:** Mientras el usuario posea un balance de créditos mayor a cero (`credits > 0`), el sistema habilitará automáticamente todas las herramientas avanzadas para profesionales (Marca Blanca, carga de logotipo, historial de proyectos y personalización del PDF). El acceso a las funciones avanzadas está directamente vinculado a poseer saldo de créditos activo.
    *   **Bloqueo por Consumo:** Tan pronto como el contador de créditos del usuario llega a cero (`0`), las funciones de cálculo y las herramientas avanzadas se bloquean de inmediato en la sesión del usuario. El sistema le solicitará activar un nuevo código de créditos para continuar.
    *   **Clave de Bypass Administrativo:** Existe un código maestro secreto de bypass comercial (`VEKO2026TAVO`), reservado únicamente para demostraciones técnicas o de desarrollo, que desbloquea el sistema de forma ilimitada sin consumir créditos.

---

## 3. CONTROL ABSOLUTO DEL SISTEMA POR EL ADMINISTRADOR
Como administrador general, usted posee el control absoluto de la aplicación a través de las configuraciones y variables de entorno del servidor.

### A. Gestión de Marca Blanca e Instaladores (White Label)
Los instaladores y técnicos profesionales son el principal público objetivo. Cuando tienen créditos activos, el sistema les permite:
1.  **Subir su propio logotipo corporativo:** El cual se almacena localmente en su sesión.
2.  **Personalizar los datos de contacto:** Nombre de la empresa, correo y número de WhatsApp.
3.  **Resultado Profesional:** El reporte técnico descargable en PDF y los mensajes de WhatsApp que se envían a los clientes finales saldrán con el logotipo y contacto del instalador, eliminando las referencias del creador si así lo desea. Esto representa una enorme oportunidad de monetización recurrente por venta de paquetes de créditos ("Software as a Service").

### B. Personalización del Teléfono del Instalador y Enlaces de Compra
En la configuración principal (`/src/components/PhoneConfigModal.tsx` o variables del servidor), usted puede definir el número de WhatsApp oficial al cual llegarán todas las consultas de compras de licencias.

---

## 4. SISTEMA ANTI-CLONACIÓN Y ALERTAS AUTOMÁTICAS POR EMAIL
Una de las mayores preocupaciones al publicar un software web interactivo de alto valor es que terceros malintencionados clonen o copien el código fuente para alojarlo de forma privada o revenderlo. 

A continuación, detallamos el mecanismo técnico implementado para **detectar clonaciones de inmediato** y notificarle por correo electrónico de manera automática.

### A. El Algoritmo "Canario" de Detección de Dominio
El sistema de seguridad compara constantemente el dominio actual en el que se está ejecutando la aplicación con su lista de dominios autorizados (por ejemplo, `rederar.app` o su subdominio en AI Studio). 

Si el dominio no coincide, el sistema deduce que ha sido **clonado, copiado o alterado**, y ejecuta de manera silenciosa en segundo plano una alerta automatizada.

### B. Script de Alerta Automatizado (Integrado en el código)
En la inicialización del sistema (`App.tsx`), se ejecuta el siguiente algoritmo:

```typescript
const DOMINIOS_AUTORIZADOS = ["rederar.app", "localhost", "ai.studio"];

export function verificarClonacion() {
  const dominioActual = window.location.hostname;
  const esAutorizado = DOMINIOS_AUTORIZADOS.some(dom => dominioActual.includes(dom));
  
  if (!esAutorizado) {
    // 🚨 El sistema ha sido clonado o ejecutado en un servidor no autorizado.
    // Enviamos una alerta silenciosa al servidor o un webhook de correo electrónico.
    alertarAdministradorPorClonacion(dominioActual, window.location.href);
  }
}

async function alertarAdministradorPorClonacion(dominioClonado: string, urlCompleta: string) {
  try {
    // 1. Envío al backend Express propio para auditoría interna
    await fetch("/api/alerts/clone-detection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: dominioClonado,
        url: urlCompleta,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    });
  } catch (err) {
    console.error("Error en reporte de seguridad");
  }
}
```

### C. Configuración del Servidor Express para el Envío de Email
En el backend (`server.ts`), cuando se recibe la llamada a `/api/alerts/clone-detection`, el servidor procesa el envío de un correo de alerta automatizado al Administrador utilizando **SendGrid, Mailgun o EmailJS**:

```typescript
import express from "express";
import nodemailer from "nodemailer"; // Para enviar emails

const app = express();
app.use(express.json());

// Endpoint de alerta de clonación
app.post("/api/alerts/clone-detection", async (req, res) => {
  const { domain, url, userAgent, timestamp } = req.body;
  
  console.error(`🚨 ALERTA DE SEGURIDAD: Sistema REDERAR clonado en dominio: ${domain}`);
  
  // Configuración de transporte de email (SMTP)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alertas.rederar@gmail.com", // Cuenta de alertas
      pass: process.env.EMAIL_PASSWORD   // Contraseña guardada en variables de entorno seguras
    }
  });

  const mailOptions = {
    from: '"Seguridad REDERAR" <alertas.rederar@gmail.com>',
    to: "administrador.rederar@gmail.com", // SU CORREO PERSONAL
    subject: `🚨 ALERTA: REDERAR ha sido CLONADO en ${domain}`,
    html: `
      <h2>Alerta de Infracción de Propiedad Intelectual</h2>
      <p>Se ha detectado que el código de la calculadora <strong>REDERAR.app</strong> está siendo ejecutado en un servidor no autorizado.</p>
      <ul>
        <li><strong>Dominio Clonado:</strong> ${domain}</li>
        <li><strong>URL Exacta:</strong> <a href="${url}" target="_blank">${url}</a></li>
        <li><strong>Fecha de Detección:</strong> ${timestamp}</li>
        <li><strong>Dispositivo del Visitante:</strong> ${userAgent}</li>
      </ul>
      <p>Este correo constituye una prueba fehaciente de la infracción para iniciar las acciones legales pertinentes.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ status: "success", message: "Alerta enviada correctamente" });
  } catch (error) {
    console.error("Error enviando email de alerta:", error);
    res.status(500).json({ status: "error", error: "No se pudo enviar la alerta" });
  }
});
```

---

## 5. PROTOCOLO LEGAL ANTE LA DETECCIÓN DE CLONACIÓN
Si el sistema le avisa por email que el software ha sido clonado, usted se encuentra respaldado por la legislación de propiedad intelectual nacional e internacional. El protocolo a seguir es el siguiente:

1.  **Recopilación de Evidencia (Prueba Digital):**
    *   El email de alerta automática le servirá como registro inicial, incluyendo la fecha, hora, dominio infractor y URL exacta.
    *   Realice una captura de pantalla notarial o certifique digitalmente la página infractora (mediante servicios de certificación de blockchain o actas notariales web).
2.  **Notificación de Cese y Desistimiento (Cease and Desist Letter):**
    *   Envíe una carta de cese y desistimiento formal por medio de su abogado o de forma personal al titular del dominio infractor (puede buscar los datos del registrante mediante una consulta WHOIS).
    *   Exija la baja inmediata del sitio en un plazo máximo de 48 horas bajo apercibimiento de iniciar acciones legales por daños y perjuicios.
3.  **Denuncia DMCA ante el Proveedor de Hosting:**
    *   Si el infractor no responde, identifique el proveedor de hosting del dominio clonado (ej. Cloudflare, AWS, Hostinger, etc.).
    *   Presente un reclamo de infracción de derechos de autor conforme a la ley **DMCA (Digital Millennium Copyright Act)** de EE. UU. (los proveedores de hosting están obligados por ley a dar de baja el sitio de inmediato bajo riesgo de ser solidariamente responsables).
4.  **Acciones Judiciales por Derechos de Autor:**
    *   Al estar el código registrado bajo la propiedad del Tec. Gustavo A. Rodriguez o su marca, usted puede demandar judicialmente por piratería de software, violación de secretos comerciales e infracción de propiedad intelectual, exigiendo compensación económica por cada cálculo realizado ilegalmente.

---

**El sistema actual ya cuenta con todos los mecanismos de validación de país, idioma regional y seguridad. ¡Usted posee el control absoluto del software de dimensionamiento solar más sofisticado del mercado!**
