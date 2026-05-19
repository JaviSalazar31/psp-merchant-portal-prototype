import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInactivityTimerOptions {
  /** Tiempo sin actividad antes de mostrar el modal, en ms. */
  inactivityMs: number;
  /** Duración del countdown una vez abierto el modal, en ms. */
  countdownMs: number;
  /** Cuando expira el countdown total se ejecuta este handler (logout). */
  onExpire: () => void;
}

interface UseInactivityTimerResult {
  /** Está visible el modal de advertencia. */
  modalOpen: boolean;
  /** Segundos restantes del countdown una vez abierto el modal. */
  remainingSeconds: number;
  /** El usuario eligió seguir conectado: reinicia el contador. */
  stayConnected: () => void;
  /** El usuario eligió cerrar sesión ahora: dispara onExpire sin esperar al countdown. */
  logoutNow: () => void;
}

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const;

/**
 * Hook de timer de inactividad post-login.
 *
 * Comportamiento:
 *  1. Si pasa `inactivityMs` sin actividad del usuario, abrimos el modal.
 *  2. Una vez abierto, corre un countdown de `countdownMs`.
 *  3. Si el countdown expira sin acción, llamamos a `onExpire` (logout).
 *  4. Si el usuario hace clic en "Sí, seguir conectado", reiniciamos.
 *  5. Si el usuario hace clic en "Cerrar sesión ahora", `logoutNow` dispara onExpire.
 *
 * No queda registrado cuando el modal está abierto (no se reinicia automáticamente al
 * mover el mouse) — el usuario debe responder explícitamente.
 */
export function useInactivityTimer({
  inactivityMs,
  countdownMs,
  onExpire,
}: UseInactivityTimerOptions): UseInactivityTimerResult {
  const [modalOpen, setModalOpen] = useState(false);
  const [remainingMs, setRemainingMs] = useState(countdownMs);

  const idleTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const expireTimerRef = useRef<number | null>(null);

  const clearAllTimers = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (expireTimerRef.current) {
      window.clearTimeout(expireTimerRef.current);
      expireTimerRef.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setRemainingMs(countdownMs);
      setModalOpen(true);
    }, inactivityMs);
  }, [inactivityMs, countdownMs]);

  // Effect 1: contar la inactividad mientras el modal está cerrado.
  useEffect(() => {
    if (modalOpen) return;

    const reset = () => startIdleTimer();
    startIdleTimer();
    ACTIVITY_EVENTS.forEach(ev => window.addEventListener(ev, reset, { passive: true }));

    return () => {
      ACTIVITY_EVENTS.forEach(ev => window.removeEventListener(ev, reset));
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [modalOpen, startIdleTimer]);

  // Effect 2: cuando el modal abre, arrancamos countdown + expire timer.
  useEffect(() => {
    if (!modalOpen) return;

    const startedAt = Date.now();
    setRemainingMs(countdownMs);

    countdownIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setRemainingMs(Math.max(0, countdownMs - elapsed));
    }, 250);

    expireTimerRef.current = window.setTimeout(() => {
      setModalOpen(false);
      clearAllTimers();
      onExpire();
    }, countdownMs);

    return () => {
      if (countdownIntervalRef.current) {
        window.clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      if (expireTimerRef.current) {
        window.clearTimeout(expireTimerRef.current);
        expireTimerRef.current = null;
      }
    };
  }, [modalOpen, countdownMs, onExpire, clearAllTimers]);

  const stayConnected = useCallback(() => {
    setModalOpen(false);
  }, []);

  const logoutNow = useCallback(() => {
    setModalOpen(false);
    clearAllTimers();
    onExpire();
  }, [clearAllTimers, onExpire]);

  return {
    modalOpen,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    stayConnected,
    logoutNow,
  };
}
