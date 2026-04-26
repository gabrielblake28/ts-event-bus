type Listener<T> = (payload: T) => void;

type SubscriptionRegistry<TEventMap> = {
  [K in keyof TEventMap]?: { [id: string]: Listener<TEventMap[K]> };
};


export class ServiceBus<TEventMap> {

  // 1. Subscription Registry — who is listening to what
  // 2. Core Bus Engine — publish, subscribe, unsubscribe
  // 3. Async Handler Runner — runs listeners, collects promises
  // 4. Error Handling Strategy — fail one, fail all? swallow? abort?
  // 5. Middleware Chain — optional pre/post hooks
  // 6. Public API Surface — the class/function users actually instantiate
  // 7. Cleanup / Lifecycle — remove listeners, dispose the bus

  subscriptionRegistry: SubscriptionRegistry<TEventMap> = {};
  private idCounter = 0;

  subscribe<K extends keyof TEventMap>(message: K, fn: (data: TEventMap[K]) => void): string {

    const id: string = String(++this.idCounter);

    if (!this.subscriptionRegistry[message]) {
      this.subscriptionRegistry[message] = { [id]: fn };
    } else {
      this.subscriptionRegistry[message][id] = fn;
    }

    return id;
  }


  unsubscribe<K extends keyof TEventMap>(message: K, id: string): boolean {

    if (!this.subscriptionRegistry[message] || !this.subscriptionRegistry[message][id]) {
      return false;
    };

    delete this.subscriptionRegistry[message][id];
    if (Object.keys(this.subscriptionRegistry[message]).length <= 0) delete this.subscriptionRegistry[message];
    return true;
  }


  publish<K extends keyof TEventMap>(messageType: K, payload: TEventMap[K]) {

    if (!this.subscriptionRegistry[messageType]) {
      return;
    }

    for (const [id, fn] of Object.entries(this.subscriptionRegistry[messageType])) {
      try {
        fn(payload);
      } catch (e) {
        console.log(`subscription ${id} action failed`)
      }
    }
  };
}
