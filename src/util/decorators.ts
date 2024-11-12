export function loggedMethodKeys(keys: Array<string>) {
  return function loggedMethod<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >
  ) {
    const methodName = String(context.name);
    function replacementMethod(this: any, ...args: Args): Return {
      console.log(`LOG: Entering method '${methodName}'.`);
      const result = target.call(this, ...args);
      keys.forEach((key) => {
        console.log(`LOG: method${methodName} ${key} is `, this[key]);
      });
      console.log(`LOG: Exiting method '${methodName}'.`);
      return result;
    }
    return replacementMethod;
  };
}
export function loggedMethod<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >
) {
  const methodName = String(context.name);
  function replacementMethod(this: This, ...args: Args): Return {
    console.log(`LOG: Entering method '${methodName}'.`);
    const result = target.call(this, ...args);
    console.log(`LOG: Exiting method '${methodName}'.`);
    return result;
  }
  return replacementMethod;
}

export function loggedRunTime<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >
) {
  const methodName = String(context.name);
  function replacementMethod(this: This, ...args: Args): Return {
    const start = Date.now();
    const result = target.call(this, ...args);
    const end = Date.now();
    console.log(
      `LOG: Method '${methodName}' took ${end - start} milliseconds to run.`
    );
    return result;
  }
  return replacementMethod;
}

export function bound<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >
) {
  const methodName = context.name;
  if (context.private) {
    throw new Error(
      `'bound' cannot decorate private properties like ${methodName as string}.`
    );
  }
  context.addInitializer(function (this: any) {
    this[methodName] = this[methodName].bind(this);
  });
}

//if key is true ,return function
export function booleanReturn<This, Args extends any[], Return>(
  trueKeys: string[],
  falseKeys: string[]
) {
  return function booleanCheck<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >
  ) {
    function replacementMethod(this: any, ...args: Args) {
      for (const key of trueKeys) {
        if (this[key]) {
          throw new TypeError(
            "This method cannot be called when " + key + " is true"
          );
        }
      }
      for (const key of falseKeys) {
        if (!this[key]) {
          throw new TypeError(
            "This method cannot be called when " + key + " is false"
          );
        }
      }
      const result = target.call(this, ...args);
      return result;
    }
    return replacementMethod;
  };
}
