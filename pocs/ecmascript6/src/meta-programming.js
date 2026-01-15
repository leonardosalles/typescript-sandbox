export const createSmartUser = () => {
  const handler = {
    get(target, prop) {
      console.log(`Accessing property "${prop}"`);
      return Reflect.get(target, prop);
    },
    set(target, prop, value) {
      if (prop === 'age' && typeof value !== 'number') {
        throw new TypeError("Age must be a number!");
      }
      console.log(`Setting "${prop}" as ${value}`);
      return Reflect.set(target, prop, value);
    }
  };

  return new Proxy({}, handler);
};
