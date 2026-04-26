/**
 * Example 1: Basic Usage
 *
 * Demonstrates:
 * - Creating a ServiceBus with an event map
 * - Subscribing to events
 * - Publishing events with typed payloads
 * - Unsubscribing using the returned ID
 */

import { ServiceBus } from "../src/bus/bus";

// Define what events exist and what data they carry
interface AppEvents {
  userLogin: { userId: string; timestamp: number };
  logout: void;
}

const bus = new ServiceBus<AppEvents>();

console.log("=== Basic Usage Example ===\n");

// Subscribe to userLogin — listener receives typed payload
const loginSub = bus.subscribe("userLogin", (data) => {
  console.log(`[userLogin] User ${data.userId} logged in at ${data.timestamp}`);
});

// Subscribe to logout — listener receives void (no data)
const logoutSub = bus.subscribe("logout", () => {
  console.log("[logout] User logged out");
});

// Publish events
console.log("Publishing userLogin...");
bus.publish("userLogin", { userId: "alice", timestamp: Date.now() });

console.log("\nPublishing logout...");
bus.publish("logout", undefined);

// Unsubscribe
console.log("\nUnsubscribing login listener...");
bus.unsubscribe("userLogin", loginSub);

// Publish again — only logout listener fires
console.log("\nPublishing userLogin again (should be silent)...");
bus.publish("userLogin", { userId: "bob", timestamp: Date.now() });

console.log("\n✅ Basic usage complete.\n");
