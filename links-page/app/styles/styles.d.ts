/**
 * Next resuelve las hojas de estilo en el build, pero en sus tipos solo declara
 * los `*.module.css`. Sin esta declaración, un editor que no levante la
 * configuración del proyecto marca los `import "./algo.css"` como módulos sin
 * tipos. Declararlo acá lo deja resuelto para cualquier herramienta.
 */
declare module "*.css";
