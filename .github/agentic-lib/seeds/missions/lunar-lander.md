# Mission

A JavaScript library that simulates a lunar lander descent and provides an autopilot controller.

## Physics Model (1D simplified)

- Initial altitude: 1000m, initial velocity: 40 m/s (toward surface), fuel: 25 units
- Gravity: adds 2 m/s per tick to velocity (increasing downward speed)
- Thrust: each fuel unit burned reduces velocity by 4 m/s
- Landing: altitude reaches 0. Safe if velocity ≤ 4 m/s, crash if > 4 m/s

## Core Functions

- `createLander(opts?)` — create a lander state object with configurable initial conditions (altitude, velocity, fuel). Defaults to the values above.
- `step(lander, thrust)` — advance one tick, burn `thrust` fuel units (clamped to available fuel), return a new state object. The state is immutable.
- `simulate(lander, controller)` — run to completion using a controller function `(state) => thrustUnits`. Returns an array of states (the trace).
- `autopilot(state)` — a built-in controller that lands safely. This is the algorithmically interesting part.
- `score(trace)` — score a landing: 0 for crash, higher for less fuel used + lower landing velocity.

## Requirements

- The autopilot must land safely across a range of initial conditions: altitude 500–2000m, velocity 20–80 m/s, fuel 10–50 units.
- State objects are plain objects: `{ altitude, velocity, fuel, tick, landed, crashed }`.
- Export all functions as named exports from `src/lib/main.js`.
- Comprehensive unit tests including physics correctness, autopilot safety across parameter ranges, and edge cases (zero fuel, already landed).
- README with example simulation output showing a successful landing trace.

## Acceptance Criteria

- [ ] `step()` correctly applies gravity and thrust physics
- [ ] `autopilot` lands safely with default initial conditions
- [ ] `autopilot` lands safely across at least 10 different (altitude, velocity, fuel) combinations
- [ ] `score()` returns 0 for crashes, positive for safe landings
- [ ] `simulate()` returns a complete trace from start to landing
- [ ] All unit tests pass
- [ ] README shows example simulation output
