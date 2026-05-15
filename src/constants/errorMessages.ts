/**
 * Adenda v1 — Cambio 7
 * Mapping de códigos técnicos a mensajes amigables en español.
 * Renderizar en TransactionDetailModal cuando status === 'FALLIDO' o 'RECHAZADO'.
 */

export const ERROR_MESSAGES: Record<string, string> = {
  INSUFFICIENT_FUNDS: 'Fondos insuficientes en la cuenta del cliente',
  CARD_EXPIRED: 'Tarjeta vencida',
  CARD_DECLINED: 'Tarjeta rechazada por el banco emisor',
  INVALID_CARD: 'Datos de tarjeta incorrectos',
  FRAUD_SUSPECTED: 'Operación bloqueada por sospecha de fraude',
  NETWORK_ERROR: 'Error de comunicación con el banco',
  TIMEOUT: 'La operación expiró antes de completarse',
  INVALID_AMOUNT: 'El monto ingresado no es válido',
  LIMIT_EXCEEDED: 'Se excedió el límite diario de la tarjeta',
  UNKNOWN_ERROR: 'No se pudo procesar la transacción',
};

export function friendlyErrorMessage(code: string | undefined | null): string {
  if (!code) return ERROR_MESSAGES.UNKNOWN_ERROR;
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN_ERROR;
}
