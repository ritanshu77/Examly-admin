type Listener = (count: number) => void;

let activeCount = 0;
const listeners = new Set<Listener>();

export function incrementLoader() {
  activeCount += 1;
  notify();
}

export function decrementLoader() {
  activeCount = Math.max(0, activeCount - 1);
  notify();
}

export function subscribeLoader(listener: Listener) {
  listeners.add(listener);
  listener(activeCount);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener(activeCount));
}

