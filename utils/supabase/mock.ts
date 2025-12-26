export const createMockClient = () => {
  const createBuilder = (dataToReturn: any = []) => {
    // We create a promise that resolves to the result
    const promise = Promise.resolve({ data: dataToReturn, error: null as any });

    // We attach the chainable methods to the promise
    // This effectively makes it a "Thenable" that also has our methods
    const builder: any = promise;

    // We ignore arguments for the chain methods
    builder.select = (_: any) => builder;
    builder.insert = (_: any) => builder;
    builder.update = (_: any) => builder;
    builder.delete = (_: any) => builder;
    builder.eq = (_: any, __: any) => builder;
    builder.or = (_: any) => builder; // Added .or()
    builder.order = (_: any, __: any) => builder;
    builder.limit = (_: any) => builder;
    builder.single = () => createBuilder(null); // Return a new builder resolving to null/single item

    return builder;
  };

  return {
    from: (table: string) => createBuilder([]),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null as any }),
      signInWithPassword: (_: any) => Promise.resolve({ data: { user: null }, error: null as any }),
      signUp: (_: any) => Promise.resolve({ data: { user: null }, error: null as any }),
      signOut: () => Promise.resolve({ error: null as any }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    channel: (name: string) => ({
      // .on can take variable arguments, so let's allow any number
      on: (...args: any[]) => ({
        subscribe: () => {},
        unsubscribe: () => {},
      }),
      subscribe: () => {},
      unsubscribe: () => {},
    }),
    removeChannel: (_: any) => {},
  };
};
