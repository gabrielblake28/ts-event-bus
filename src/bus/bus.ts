import { v4 as uuidv4 } from "uuid";

type Listener<T> = (payload: T) => void;

type SubscriptionRegistry<TEventMap> = {
  [K in keyof TEventMap]?: { [id: string]: Listener<TEventMap[K]> };
};


class ServiceBus<TEventMap> {

  // 1. Subscription Registry — who is listening to what
  // 2. Core Bus Engine — publish, subscribe, unsubscribe
  // 3. Async Handler Runner — runs listeners, collects promises
  // 4. Error Handling Strategy — fail one, fail all? swallow? abort?
  // 5. Middleware Chain — optional pre/post hooks
  // 6. Public API Surface — the class/function users actually instantiate
  // 7. Cleanup / Lifecycle — remove listeners, dispose the bus

  private subscriptionRegistry: SubscriptionRegistry<TEventMap> = {};

  private subscribe<K extends keyof TEventMap>(message: K, fn: (data: TEventMap[K]) => {}) {

    const id: string = uuidv4();

    if (!this.subscriptionRegistry[message]) {
      this.subscriptionRegistry[message] = { [id]: fn };
    } else {
      this.subscriptionRegistry[message][id] = fn;
    }

    return id;
  }


  private unsubscribe<K extends keyof TEventMap>(message: K, id: string) {

    if (!this.subscriptionRegistry[message] || !this.subscriptionRegistry[message][id]) {
      return;
    };


    delete this.subscriptionRegistry[message][id];
    console.log(this.subscriptionRegistry[message])
  }


  private publish<K extends keyof TEventMap>(message: K, payload: TEventMap[K]) {

    if (!this.subscriptionRegistry[message]) {
      throw new Error(`Message type: ${message as string} not found`);
    }

    Object.values(this.subscriptionRegistry[message]).forEach((fn) => {
      fn(payload);
      // what happens if one of these fails?
    })



  }
}
