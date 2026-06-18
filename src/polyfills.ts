/**
 * Polyfills necessários para bibliotecas como sockjs-client / @stomp/stompjs
 * que esperam que a variável `global` do Node.js exista no browser.
 */
(window as any).global = window;