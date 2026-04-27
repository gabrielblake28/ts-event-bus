# Type-Safe Event Bus

A lightweight, fully typed publish-subscribe event bus in TypeScript. It enforces valid event names and payload shapes at compile time, supports both sync and async listeners, and isolates errors so one failing handler never blocks the rest.

## What It Does

- **Typed Event Maps**: Event names and payload shapes are declared once in a single interface. The bus uses generics to make invalid event names or mismatched payloads unrepresentable at compile time.
- **Subscribe / Publish / Unsubscribe**: Register listeners by event name, emit events with typed payloads, and remove subscriptions using returned IDs.
- **Async Handler Runner**: Listeners can be synchronous or return Promises. The bus normalizes execution, waits for all listeners to settle, and returns a report of any failures.
- **Error Isolation**: Each listener runs independently. A thrown error or rejected Promise in one handler does not prevent others from receiving the event.

## Why Build It

This project was built to practice turning abstract software engineering concepts into a concrete, usable library:

- **Observer pattern in practice** — decoupling producers from consumers via an event contract.
- **Compile-time type safety** — using generic constraints and mapped types so the compiler rejects invalid usage before the code ever runs.
- **Async control flow** — managing Promises across decoupled handlers with `Promise.all` and manual settlement wrapping.
- **Error handling across boundaries** — deciding how failures in one isolated component affect the rest of the system.
- **Strong API contracts** — designing a small, predictable public surface where every parameter and return type carries meaning.

The result is a minimal, zero-dependency library that can be dropped into any TypeScript project when you need decoupled, type-safe messaging without pulling in a full message broker.
