LEAME — LocoProductions // PORTAL DE RAVES PSICOBRUTALISMO
Guía completa del sitio web: kit de marca, sistema de estilos, tipografías, activos, CSS, JS, backend de pagos, comandos y despliegue.

Idioma del sitio: español (locale es_GT, Guatemala)
Estilo: Brutalismo psicodélico rave (Psych-Brutalism) — negro profundo, neones ácidos, bordes duros, sombras sólidas sin desenfoque, monoespaciada
Stack: HTML5 + CSS3 (tokens puros) + JavaScript ES6 vanilla sin dependencias de runtime + Bootstrap 5.3.3 (CDN, solo base de utilidades)
Moneda: GTQ (quetzal) primario + USD de referencia (tipo de cambio fijo 7.75)
Estatutos: sitio estático autocontenido; backend de pagos opcionales en server/(Nodo sin dependencias)
1. Kit de marca
Elemento	Valor
Marca	LOCOProductions ( LOCOPRODUCTIONSen pantalla)
Título/OG	LOCOProductions // PSYCH-BRUTALISM RAVE PORTAL
Héroe del eslogan	MÚSICA QUE / REESCRIBE / LA NOCHE(tercera línea en outline)
Logo	img/LOGO.png(46×46 en encabezado, usado también como og:imagey favicon)
Favicon	img/LOGO.png( rel="icon")
Color del tema	#080808
Localidad / OG	es_GT— og:type=website,twitter:card
Voz / tono	Crudo, técnico, “terminal de rave”: mayúsculas, prefijos //, [ ETIQUETAS ], cero emoji
1.1 Paleta oficial (Colores de la marca)
Simbólico	Maleficio	Uso
--acid-green	#39FF14	Acento primario: CTA, foco, resplandor, progreso
--electric-violet	#8A2BE2	Acento secundario: gradientes, blobs
--neon-orange	#FF5F1F	Acento terciario: alertas/energía
--cyber-pink	#FF007F	Acento cuaternario: croma flotante, manchas
--neon-cyan	#00FFFF	Resaltar, aberración RGB
--neon-red	#FF073A	Errores, agotado, cerrar
--color-bg-deep	#080808	Fondo global
--color-bg-darker	#0D0B14	Paneles (checkout, pago modal)
--color-bg-card	#111111	Tarjetas
--color-border/--color-border-bright	#1A1A1A/#2A2A2A	Bordes sutiles / brillantes
--color-text-primary/secondary/muted	#FFFFFF/ #B0B0B0/#666666	Jerarquía de texto
Gradientes oficiales

--gradient-primary: 135° verde ácido → violeta eléctrico (CTA, divisores)
--gradient-secondary: 135° naranja neón → rosa cibernético
--gradient-tertiary: 135° violeta eléctrico → cian neón
--gradient-radial: verde ácido radial transparente (brillo intenso)
--gradient-noise: SVG feTurbulenceen línea al 3% (grano sobre todo el cuerpo)
1.2 Tipografías (Google Fonts)
Rol	Familia	Pesos cargados	CSS
Mostrar / titulares	Grotesco espacial	400, 500, 600, 700	--font-display
Mono / etiquetas UI	Mono de JetBrains	400, 500, 600, 700, 800	--font-mono
Cuerpo / lectura	IBM Plex Mono	400, 500, 600	--font-body
Cargadas con display=swap+ preconnect. Opciones alternativas: Syne(pantalla), Fira Code/ SF Mono(mono), system-ui.

Escala tipográfica fluida ( clamp(), de --fs-xsa --fs-5xl): 0.7rem → 8.5rem reactiva al ancho de viewport.

2. Estructura de archivos
SitioWeb/
├── index.html                    # Documento único (todas las secciones)
├── loco-theme.css                # Estilos principales (secciones 0–11)
├── design-tokens.css             # 75 variables — fuente de verdad del sistema
├── loco-engine.js                # Motor JS (módulos 1–14)
├── img/
│   └── LOGO.png                  # Logo/OG/favicon (~725 KB)
├── scripts/
│   ├── build.js                  # Validación + empaquetado → dist/ + zip
│   ├── serve.js                  # Servidor estático local (:4173)
│   ├── api-test.js               # Tests E2E del backend (15 aserciones)
│   └── headless-test.js          # Tests UI headless Edge (40 aserciones)
├── server/
│   ├── server.js                 # API de pagos + estáticos (:8787)
│   ├── gateways.js               # Adaptadores de pasarelas
│   └── .env.example              # Plantilla de configuración
├── package.json                  # Scripts npm
├── vercel.json / netlify.toml / .htaccess / robots.txt   # Despliegue
├── .gitignore / .vercelignore
├── Leeme.md                      # Este archivo
└── blueprint_elocoproductions.md # Blueprint técnico/arquitectura
Compilación resultante: dist/(6 archivos + img/) y locoproductions-dist.zip(~754 KB).

3. Sistema de estilos (CSS)
3.1 Arquitectura
design-tokens.cssse importa con @import url("design-tokens.css")como primera línea de loco-theme.css→ cambiar un token actualiza todo el sitio.
Reset global propio ( box-sizing, márgenes en 0), bodycon grano --gradient-noise, ::selectionverde ácido, barra de desplazamiento personalizada.
Radio de frontera global = 0 (brutalismo puro); sombras sólidas desplazadas ( 4px 4px 0), nunca borrosas para bordes.
3.2 Mapa de secciones deloco-theme.css
#	Sección	Contenido clave
0	SERVICIOS PÚBLICOS	Utilidades tipográficas/de color
1	TICKET EN DIRECTO	Barra fija superior con cuenta regresiva del próximo evento
2	ENCABEZAMIENTO	Fijo, 80px, navegación + menú móvil + estado is-scrolled/is-glide
3	HÉROE	Título gigante, resplandor radial, grid de fondo, reproductor de radio, estadísticas
4	SECCIONES	Calendario de eventos, botones, acordeón base.
5	PÓNGASE EN FILA	Grid de artistas, filtros por género, revela información del conjunto
6	NIVELES / ENTRADAS	Tarjetas de nivel, selector de cantidad, checkout sticky, modal de pago
7	GALERÍA	Experiencias/galería filtrable + aftermovie 21:9
8	PIE DE PÁGINA	Protocolo, políticas (acordeón), lista de invitados, créditos
9	MODAL	Fondo + diálogo genérico
10	REVELAR AL DESPLAZARSE	Entrada 3D rotateX+ desvanecimiento
11	CINEMA FX	Lienzo, cursor, inclinación, progreso, croma (ver §6)
3.3 Capas (índice z)
Capa	índice z	Simbólico
Saltar enlace	2000	—
Efectos de cursor	1200	—
Barra progreso scroll	1100	—
Cotización en directo	1000	--z-ticker
Encabezamiento	900	--z-header
Modal pago + Modal genérico	900	calc(--z-modal + 100)(Gana el que va después en el DOM)
Lienzo FX (pantalla)	4	—
Menú desplegable/información sobre herramientas	600/700	--z-dropdown/--z-tooltip
3.4 Responsividad y accesibilidad
Clave de puntos de interrupción: móvil ≤767.98px(pagar 1 col, métodos 2×n), tableta, escritorio.
prefers-reduced-motion: reduce: anula transiciones (tokens a 0ms), revela estático visible, FX desactivados.
@media (pointer: coarse): cursor oculto FX en tacto.
Foco visible global 2px solid --accent-primary; ARIA en ticker ( aria-live), pestañas de filtros/métodos ( role=tab), modal ( role=dialog, aria-modal).
4. Contenido y datos
4.1 Eventos (sección #eventos)
Evento	Precio	Estado
CIRCUITO DE NEÓN // VOL.07	DESDE Q450	Activo
FESTIVAL CEREBRO SINTÉTICO	DESDE Q680	Activo
CONSECUENCIAS: RITUAL DE CLAUSURA	—	AGOTADO
4.2 Lineup (renderizado por JS, 10 artistas)
Filtros: TODO / TECHNO / HARD TECHNO / PSYTRANCE / INDUSTRIAL / MELODIC & AFTERS(clase .is-hiddenpara ocultar).

Artistas: VOLTAGE_KR, NEURON, HELLGRID, MASCHINE, AETHER WAVE, DEAD CIRCUIT, PSYCHOGLIDE, RHYTHM_Ø, NULL POINTER, LUCID DRIFT — cada uno con género, escenario (MAINFRAME/CORTEX/REACTOR/SUNSET), horario y frecuencia raíz para su vista previa de audio sintetizado.

4.3 Gradas / Boletos (sección #tickets)
ID de nivel	Nombre	Precio GTQ	Ref. USD	Estado
early	PÁJARO TEMPRANO	Q290	~$37	AGOTADO
tier1	TIER 1 GENERAL (recomendado)	Q450	~$58	Activo
vip	VIP / ENTRE BASTIDORES	Q950	~$123	Activo
after	PASE PARA FUERA DEL HORARIO HABITUAL	Q300	~$39	Activo
Cantidad 1–10. Total se muestra en GTQ ( #coTotal) + USD ( #coTotalUsd) con tasa 7.75.

4.4 Otras secciones
Experiencias ( #experiencias): galería filtrable por color + aftermovie teaser 21:9 con botón play simulado.
Footer/Protocolo ( #protocolo): políticas en acordeón (acceso, confirmación, pagos y reembolsos con FEL y métodos), guestlist secreta (valida email/teléfono), contacto guestlist@locoproductions.gt/ pagos@locoproductions.gt.
Héroe de estadísticas : contadores animados (eventos, artistas, asistentes, ciudades).
5. JavaScript — loco-engine.js(módulos 1–14)
IIFE única, cero dependencias, API pública: LOCO = { countdown, Modal, cinema }.

#	Módulo	Función
1	CUENTA ATRÁS	Ticker en vivo + estados (próximo drop)
2	ENCABEZADO + NAVEGACIÓN	Menú móvil, scroll-spy, estadois-scrolled
3	MOTOR DE AUDIO	Web Audio API sintetizado (kick/bass/hihat por frecuencia; sin archivos de audio)
4	RADIO HÉROE	Loop de 45s sintetizado + forma de onda animada + reproducir/pausa
5	PÓNGASE EN FILA	Render de artistas, filtros por género, vista previa de audio por artista
6	ENTRADAS	Selector de nivel/cantidad, finalizar compra, getState()→{selected, qty, total}
6B	PAGO	Modal #pagoSeguro: métodos, validación Luhn/exp/CVV/titular/email, flujo runFlow()demo/live, folios LOC-GT-AAAAMMDD-XXXX, closePay()(Escape/backdrop/botón)
7	ACORDEÓN	Políticas
8	REVELAR	Observador de intersecciones →.is-visible
9	CONTADORES	Estadísticas animadas
10	PELÍCULA POSTERIOR	Alternar el avance
11	LISTA DE INVITADOS	Formulario con validación (email/teléfono) + confirmación modal
12	MODAL	Modal genérico accesible
13	CINEMA FX	Efectos psicodélicos (ver §6)
14	CIERRE	Pausa audio al perder foco de pestaña
Configuración de pago (línea ~33):

const PAY = { modo: 'demo', endpoint: '/api/pago' };
modo: 'demo'→ flujo local (sin red) con modal “APROBADO (DEMO)” honesto.
modo: 'live'→ fetch POST endpointestafa {tier, qty, amount, currency:'GTQ', method, email}; si la respuesta trae checkoutUrlredirige a la pasarela; si trae referencemuestra manual de referencia.
6. FX Cinemáticas (PSYCH-BRUTALISMO FX)
Implementados en el módulo 13 (JS) + sección 11 (CSS):

Lienzo aurora #fxCanvas — fijo, mix-blend-mode: screen, z=4; 3 blobs orbitando que siguen al puntero (tonos 130/275/330) + ~90 partículas atraídas al mouse; intensidad ligada a la velocidad del mouse y scroll.
Cursor psicodélico — ring + dot con lerp, mix-blend-mode: difference, crece sobre elementos interactivos ( .is-hot).
Tilt 3D en tarjetas ( .event-card, .artist-card, .tier-card, .aftermovie, .manifesto) — rotateX/rotateY+ brillo radial que sigue --gx/--gy.
Ratón de paralaje : variables globales --mx/--my/--mxn/--myn(brillo de héroe, cuadrícula de fondo, aberración RGB del título).
Scroll — barra arcoíris #scrollProgress(z=1100), --sy(paralaje), encabezado is-glidepor velocidad.
Revelar 3D — perspective(1100px) rotateX(16deg)→ none.
Chroma hover en títulos + divisor con gradiente animado ( dividerFlow).
Guardas: desactivados con prefers-reduced-motiono puntero grueso.

7. Backend de pagos ( server/)
7.1 Puntos finales
Método	Ruta	Descripción
CONSEGUIR	/api/health	{ ok, gateway }
CORREO	/api/pago	{tier, qty, amount, currency:'GTQ', method, email}→{ok, folio, checkoutUrl | reference}
CORREO	/api/webhook/:gw	Webhook firmado HMAC-SHA256 ( x-loco-signature) → 200/401
*	/...	Estáticos desde dist/(fallback a raíz)
Métodos: TARJETA | PAYPAL | ZIGI | TRANSFERENCIA | QR(últimos dos → manual de referencia).

7.2 Seguridad
Precio siempre recalculado del lado del servidor desde la lista blanca de niveles (monto falsificado → 400 MONTO_NO_COINCIDE; nivel agotado → 403).
Nunca cobro desde el navegador: solo se devuelve checkoutUrlhospedada/tokenizada.
Idempotencia (15 min) por Idempotency-Key, rate-limit por IP (10 tokens), límite de cuerpo 64 KB.
Webhooks HMAC-SHA256 con comparación de sincronización segura; WEBHOOK_SECRETobligatorio.
CORS opcional ( CORS_ALLOW_ORIGIN) si el backend va en otro dominio.
7.3 Adaptadores ( server/gateways.js)
Adaptador	Estado	Notas
demo	Listo	Sandbox interno, no cobra
paypal	Real (Órdenes v2)	Caja de arena/en vivo; cobra USD equivalente (GTQ→USD ÷ 7.75) porque PayPal no soporta GTQ
qpaypro	Andamio GT	Pago alojado: poblarQPAYPRO_*
zigi	Andamio GT	PoblarZIGI_*
pagadito	Andamio GT	PoblarPAGADITO_*
recurrente	Andamio GT	PoblarRECURRENTE_*
Sin credenciales → 503con mensaje honesto ( *_NO_CONFIGURADO).

7.4 Configuración
Copiar server/.env.example→ server/.env:

PORT=8787
PUBLIC_URL=https://tu-dominio.gt
GATEWAY=demo            # demo|qpaypro|zigi|paypal|pagadito|recurrente
WEBHOOK_SECRET=<hex 32 bytes>
RATE_GTQ_PER_USD=7.75
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID= / PAYPAL_CLIENT_SECRET=
# + QPAYPRO_*, ZIGI_*, PAGADITO_*, RECURRENTE_*
Para vivir: GATEWAY=<pasarela> + credenciales + loco-engine.js→ PAY.modo = 'live'+ HTTPS obligatorio + probar en sandbox primero.

8. Activos
Activo	Ruta	Uso
LOGO.png	img/LOGO.png(~725 KB)	Encabezado (46×46), og:image, favicon
Audio	—	No hay archivos : todo el audio es sintetizado con Web Audio API
Gradiente de ruido	URI de datos SVG en línea	Grano psicodélico sobre el cuerpo.
Iconos	Texto/ASCII ( [ X ], //)	Terminal estética, sin librería de iconos
Externos (CDN con SRI): Bootstrap 5.3.3 CSS+JS, Google Fonts.

9. Comandos
Comando	Qué hace
npm run check	Valida JS/HTML/CSS/IDs/refs (41 IDs requeridos)
npm run build	Valida + genera dist/+locoproductions-dist.zip
npm run serve	Servidor estático local enhttp://localhost:4173
npm run backend	Backend de pagos enhttp://localhost:8787
npm run test:api	15 pruebas E2E de la API (pago, webhooks, estáticos)
npm run test:ui	40 pruebas en Edge sin interfaz gráfica (FX, modal, validación, responsive)
Requisito: Nodo ≥ 18. Las pruebas UI usan Edge headless local y no requieren red.

10. Despliegue
Paquete: subir contenido de dist/(o el zip) — sitio 100% estático.
Vercel: vercel.json ( cleanUrls, caché de activos 86400s inmutable); .vercelignoreexcluye scripts/, server/, docs.
Netlify: netlify.toml (redirecciones/encabezados equivalentes).
Apache: .htaccess (HTTPS, compresión, caché, encabezados de seguridad).
SEO: robots.txt + meta descripción + tarjetas OG/Twitter completas.
Backend: correr node server/server.jsen un Nodo host (VPS/Render/Railway) apuntando PUBLIC_URLal dominio; si va en otro origen, establezca PAY.endpointla URL completa + CORS_ALLOW_ORIGIN.
11. Verificación continúa
test:api(15/15): checkout demo, idempotencia, rechazo de monto falsificado/tier agotado/moneda USD, transferencia→referencia, PayPal 503 sin credenciales, webhook firma válida/inválida/ausente, estáticos.
test:ui(40/40): FX (canvas pintado, inclinación, --mx, progreso de scroll), modal (abre/cierra/Escape/backdrop/foco/bloqueo de scroll), validación de tarjeta (rechaza inválida, aprueba demo con folio), precios GTQ/USD, filtros, acordeón, 0 referencias MX, 0 jsErrors, overflow móvil ≤ 0.
Convenciones: UI y comentarios en español; sin emoji en archivos no-Markdown; YAML con un solo final de nueva línea; cero dependencias del tiempo de ejecución.
