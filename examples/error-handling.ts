/**
 * Example 3: Error Isolation
 *
 * Demonstrates:
 * - One failing listener does not break others
 * - Errors are caught per-listener
 * - Remaining listeners still receive the event
 */

import { ServiceBus } from "../src/bus/bus.ts";

interface AppEvents {
  dataReceived: { content: string; length: number };
}

const bus = new ServiceBus<AppEvents>();

console.log("=== Error Isolation Example ===\n");

// Listener that works fine
const sub1 = bus.subscribe("dataReceived", (data) => {
  console.log(`[Handler 1] Processed: ${data.content}`);
});

// Listener that throws an error
const sub2 = bus.subscribe("dataReceived", (data) => {
  console.log(`[Handler 2] About to crash...`);
  throw new Error(`Failed to parse: ${data.content}`);
});

// Another listener that should still run after the crash
const sub3 = bus.subscribe("dataReceived", (data) => {
  console.log(`[Handler 3] Archived: ${data.length} bytes`);
});

console.log("Publishing event with a crashing listener...\n");
bus.publish("dataReceived", { content: "Important payload", length: 17 });

console.log("\n✅ Error isolation complete — handlers 1 and 3 still ran.\n");
