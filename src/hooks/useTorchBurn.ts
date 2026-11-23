import { useEffect, useRef, useState } from 'react';
import { TORCH_BURN_MS, TORCH_TICK_MS } from '../constants/config';

interface Options {
  /** true only while the player is actually standing in a chamber */
  active: boolean;
  /** pause overlay / resolve lockout */
  paused: boolean;
  /** changes when a new chamber is entered - restarts the burn from full */
  resetKey: number;
  onBurn: () => void;
}

/**
 * The burn-down mechanic: a torch burns out every TORCH_BURN_MS spent inside a
 * chamber.
 *
 * The meter is driven by a 2 Hz setInterval, NOT by an Animated.timing on
 * width. A JS-driven width tween repaints every frame for the torch's whole
 * life, which never lets the window go idle - and a non-idle window makes
 * `uiautomator dump` time out, so the capture harness sees an empty view tree
 * and every text tap on the game screen fails. Two repaints a second leave
 * plenty of idle gaps.
 *
 * The interval is cleared on unmount and whenever the chamber is left, so
 * nothing keeps ticking after the screen is gone. `onBurn` is read from a ref,
 * never from a stale closure.
 */
export function useTorchBurn({ active, paused, resetKey, onBurn }: Options): number {
  const [burned, setBurned] = useState(0);
  const elapsed = useRef(0);
  const onBurnRef = useRef(onBurn);
  onBurnRef.current = onBurn;

  // Runs first on a chamber change: the next chamber always gets a full torch.
  useEffect(() => {
    elapsed.current = 0;
    setBurned(0);
  }, [resetKey]);

  useEffect(() => {
    if (!active) {
      elapsed.current = 0;
      setBurned(0);
      return undefined;
    }
    if (paused) {
      return undefined;
    }

    const id = setInterval(() => {
      elapsed.current += TORCH_TICK_MS;
      if (elapsed.current >= TORCH_BURN_MS) {
        elapsed.current = 0;
        setBurned(0);
        onBurnRef.current();
        return;
      }
      setBurned(elapsed.current / TORCH_BURN_MS);
    }, TORCH_TICK_MS);

    return () => clearInterval(id);
  }, [active, paused, resetKey]);

  return burned;
}

export default useTorchBurn;
