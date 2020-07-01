const fs = require('fs');

export interface RetryOptions {
  attempts?: number,
  interval?: number,
  exponential?: boolean,
  onError?: any
};

export async function retry(fn: any, options?: RetryOptions): Promise<any> {
  const opts = options || {};
  const attempts = opts.attempts || 5;
  const interval = opts.interval || 1000;
  const exponential = opts.exponential || false;
  const onError = opts.onError;

  try {
    const val = await fn();

    return val;
  } catch (error) {
    if (onError) onError(error);

    if (attempts) {
      await new Promise(r => setTimeout(r, interval));

      return retry(fn, {
        attempts: attempts - 1,
        interval: exponential ? interval * 2 : interval,
        exponential
      });
    } else throw new Error('Maximum attempts reached');
  }
}

export function abortable(responsePromise: Promise<any>, request: any) {
  return cancelable(responsePromise, () => { request && request.abort(); });
}

class Canceled extends Error {
  constructor(reason: string = "") {
    super(reason);
    Object.setPrototypeOf(this, Canceled.prototype);
  }
}

interface Cancelable<T> extends Promise<T> {
  cancel(): Cancelable<T>;
}

function cancelable<T>(
  promise: Promise<T>,
  onCancel?: () => void
): Cancelable<T> {
  let cancel: (() => Cancelable<T>) | null = null;
  let cancelable: Cancelable<T>;
  cancelable = <Cancelable<T>>new Promise((resolve, reject) => {
    cancel = () => {
      try { if (onCancel) onCancel(); }
      catch (e) { reject(e); }

      return cancelable;
    };

    promise.then(resolve, reject);
  });

  if (cancel) cancelable.cancel = cancel;

  return cancelable;
}

export function readJSON(path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err: Error, data: string) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}
