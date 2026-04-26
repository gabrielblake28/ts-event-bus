/**
 * Example 4: Type Safety
 *
 * Demonstrates:
 * - Compile-time enforcement of event names
 * - Compile-time enforcement of payload shapes
 * - Invalid usage is caught before running
 *
 * To see type errors, uncomment the commented lines below
 * and run `npx tsc --noEmit`.
 */

import { ServiceBus } from "../src/bus/bus.ts";

interface AppEvents {
  userLogin: { userId: string; timestamp: number };
  logout: void;
}

const bus = new ServiceBus<AppEvents>();

console.log("=== Type Safety Example ===\n");

// ✅ Valid: correct event name, correct payload shape
bus.subscribe("userLogin", (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

// ✅ Valid: logout expects void
bus.subscribe("logout", () => {
  console.log("User logged out");
});

// Publish with correct types
bus.publish("userLogin", { userId: "alice", timestamp: Date.now() });
bus.publish("logout", undefined);

// ❌ Uncomment the lines below to see TypeScript errors:

// Wrong event name:
// bus.subscribe("usrLogin", (data) => {});
//                   ^ TypeScript error: Argument of type '"usrLogin"' is not assignable to parameter of type 'keyof AppEvents'

// Wrong payload shape for userLogin:
// bus.publish("userLogin", { userId: "alice" });
//                              ^ TypeScript error: Property 'timestamp' is missing

// Extra property in payload:
// bus.publish("userLogin", { userId: "alice", timestamp: 123, extra: true });
//                                                    ^ TypeScript error: Object literal may only specify known properties

// Wrong event for void payload:
// bus.publish("logout", { something: true });
//                        ^ TypeScript error: Argument of type '{ something: boolean; }' is not assignable to parameter of type 'void'

console.log("✅ Type safety verified (uncomment invalid lines to see errors).\n");
