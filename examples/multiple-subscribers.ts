/**
 * Example 2: Multiple Subscribers
 *
 * Demonstrates:
 * - Multiple listeners on the same event
 * - Each listener runs independently
 * - Unsubscribing one doesn't affect the others
 */

import { ServiceBus } from "../src/bus/bus.ts";

interface AppEvents {
  notification: { message: string; priority: number };
}

const bus = new ServiceBus<AppEvents>();

console.log("=== Multiple Subscribers Example ===\n");

// Listener 1: logs to console
const sub1 = bus.subscribe("notification", (data) => {
  console.log(`[Logger] ${data.priority}: ${data.message}`);
});

// Listener 2: sends analytics
const sub2 = bus.subscribe("notification", (data) => {
  console.log(`[Analytics] Tracked notification with priority ${data.priority}`);
});

// Listener 3: triggers UI update
const sub3 = bus.subscribe("notification", (data) => {
  console.log(`[UI] Toast: "${data.message}"`);
});

console.log("Publishing notification to 3 subscribers...\n");
bus.publish("notification", { message: "Server restarting", priority: 2 });

// Unsubscribe one
console.log("\nUnsubscribing analytics listener...");
bus.unsubscribe("notification", sub2);

console.log("\nPublishing notification again (2 subscribers)...\n");
bus.publish("notification", { message: "Update available", priority: 1 });

console.log("\n✅ Multiple subscribers complete.\n");
