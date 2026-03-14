# Mission

A JavaScript library that simulates a lunar lander descent and provides an autopilot controller.

## Physics Model (1D simplified)

- Initial altitude: 1000m, initial velocity: 40 m/s (toward surface), fuel: 25 units
- Gravity: adds 2 m/s per tick to velocity (increasing downward speed)
- Thrust: each fuel unit burned reduces velocity by 4 m/s
- Landing: altitude reaches 0. Safe if velocity ≤ 4 m/s, crash if > 4 m/s

## Required Capabilities

- Create a lander state with configurable initial conditions (altitude, velocity, fuel). Defaults to the values above.
- Advance one tick: burn thrust fuel (clamped to available fuel), apply gravity and thrust, return a new immutable state. State objects are plain objects: `{ altitude, velocity, fuel, tick, landed, crashed }`.
- Simulate to completion using a controller function `(state) => thrustUnits` and return the full trace (array of states).
- Provide a built-in autopilot controller that lands safely. This is the algorithmically interesting part.
- Score a landing: `0` for crash, otherwise `(initialFuel - fuelUsed) * 10 + Math.max(0, (4 - landingVelocity) * 25)`. Higher is better.

## Requirements

- The autopilot must land safely across a range of initial conditions: altitude 500–2000m, velocity 20–80 m/s, fuel 10–50 units. Some combinations are physically impossible to survive (e.g. velocity 80 m/s with fuel 10) — the autopilot should return a crash trace, not throw.
- Export all public API as named exports from `src/lib/main.js`.
- Comprehensive unit tests including physics correctness, autopilot safety across parameter ranges, and edge cases (zero fuel, already landed).
- README with example simulation output showing a successful landing trace.

## Acceptance Criteria

- [ ] Stepping correctly applies gravity and thrust physics
- [ ] Autopilot lands safely with default initial conditions
- [ ] Autopilot lands safely across at least 10 different (altitude, velocity, fuel) combinations
- [ ] Scoring returns 0 for crashes, positive for safe landings using the formula `(initialFuel - fuelUsed) * 10 + Math.max(0, (4 - landingVelocity) * 25)`
- [ ] Simulation returns a complete trace from start to landing
- [ ] All unit tests pass
- [ ] README shows example simulation output
