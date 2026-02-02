const Signal = {};
Signal.subtle = {};

let CURRENT = null;

class State {
  constructor(value, options = {}) {
    this._value = value;
    this._subs = new Set();
    this.equals = options.equals ?? Object.is;
  }

  get() {
    if (CURRENT) this._subs.add(CURRENT);
    return this._value;
  }

  set(v) {
    if (this.equals(this._value, v)) return;
    this._value = v;
    this._subs.forEach((s) => s._notify());
  }
}

class Computed {
  constructor(cb) {
    this._cb = cb;
    this._value = undefined;
    this._dirty = true;
    this._subs = new Set();
  }

  _compute() {
    const prev = CURRENT;
    CURRENT = this;
    this._value = this._cb.call(this);
    CURRENT = prev;
    this._dirty = false;
  }

  _notify() {
    this._dirty = true;
    this._subs.forEach((s) => s._notify());
  }

  get() {
    if (CURRENT) this._subs.add(CURRENT);
    if (this._dirty) this._compute();
    return this._value;
  }
}

class Watcher {
  constructor(notify) {
    this._notifyFn = notify;
  }

  _notify() {
    this._notifyFn.call(this);
  }

  watch(...signals) {
    signals.forEach((s) => s._subs.add(this));
  }

  unwatch(...signals) {
    signals.forEach((s) => s._subs.delete(this));
  }
}

Signal.State = State;
Signal.Computed = Computed;
Signal.subtle.Watcher = Watcher;

Signal.subtle.untrack = (cb) => {
  const prev = CURRENT;
  CURRENT = null;
  const r = cb();
  CURRENT = prev;
  return r;
};

window.Signal = Signal;
