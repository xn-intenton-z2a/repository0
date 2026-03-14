# Mission

A JavaScript planning engine that implements partial-order planning with constraint satisfaction and belief revision. The engine reads a committed plan file, finds proceedable actions, assembles agents from capabilities, executes them, witnesses the results, and iterates — all within a budget of compute.

## Background

The engine draws on three interconnected disciplines:

- **Knowledge representation** — event calculus for tracking what conditions are initiated and terminated over time, plus truth maintenance for assumption management
- **Constraint satisfaction** — matching agents to actions based on capabilities and resource requirements, finding non-conflicting sets of actions to execute in parallel
- **Planning** — partial-order planning (POP) where actions have preconditions and effects, linked by causal chains that can be threatened by other actions

## Required Capabilities

### The Plan File

A committed markdown file with YAML front matter that persists across engine cycles:

- **Front matter**: cycle count, realization score (0.0–1.0), iteration and token budgets
- **Actions table**: each action has an ID, description, preconditions, effects, assigned agent, status (`open`/`ready`/`in-progress`/`achieved`/`failed`), and resource paths
- **Causal links**: action A provides condition C that action B needs — forming a dependency chain
- **Threats**: action X might undo condition C that a causal link protects, with a resolution strategy
- **Assumptions**: beliefs held by the system with justification, strength, and what depends on them
- **Open conditions**: conditions needed but not yet provided by any action (explicit gaps)
- **Observations**: event calculus entries recording what happened, what conditions were initiated/terminated
- **Witness log**: per-cycle realization score with evidence

The engine must parse this plan, serialize it back losslessly (round-trip fidelity), and update it after each engine step.

### The Engine Loop (7 steps)

1. **Assess** — Read current state: plan + source files + logs + agent definitions + capabilities
2. **Plan** — Refine the planning artifact (add actions, resolve threats, close open conditions)
3. **Solve** — Find proceedable actions via constraint satisfaction (met preconditions, no unresolved threats, no resource conflicts)
4. **Assemble** — Match or compose agents from capabilities for each proceedable action
5. **Execute** — Run agents in parallel (within concurrency limit), each producing changes
6. **Witness** — Assess realization (0.0–1.0), record observations
7. **Iterate** — If budget remains and realization is below threshold, loop back to Assess

### Constraint Solver

An action is **proceedable** when:
- All preconditions are satisfied (conditions initiated by achieved actions or initial state)
- No unresolved threats exist against causal links providing those preconditions
- Its resource paths don't conflict with other actions in the same batch

### Belief Revision

When an observation contradicts an assumption:
1. Find the weakest-justified contradicted assumption
2. Retract it
3. Cascade: re-evaluate all dependents — any action whose sole support was the retracted assumption reverts to `open`
4. When an action is achieved, propagate its effects as available preconditions for blocked actions

### Agent Assembly

Given an action's requirements, find an agent definition whose capabilities cover the needs. If no existing agent matches, compose one from the minimum set of capabilities that provides all needed tools (constraint satisfaction over the capability set).

## Requirements

- Export all public API as named exports from `src/lib/main.js`.
- The plan file format must survive parse → serialize → parse round-trips losslessly.
- The constraint solver must handle preconditions, threats, and resource conflicts correctly.
- Belief revision must cascade retractions to dependent actions.
- No external runtime dependencies.
- Comprehensive unit tests for plan parsing/serialization, constraint solving, belief revision, and agent assembly.
- README documenting the planning model, engine loop, and plan file format.

## Acceptance Criteria

- [ ] Plan file parses from markdown with YAML front matter into a structured object
- [ ] Plan file serializes back to markdown losslessly (round-trip)
- [ ] Constraint solver identifies proceedable actions (all preconditions met, no threats)
- [ ] Constraint solver excludes actions with unmet preconditions
- [ ] Constraint solver excludes actions with resource conflicts against the current batch
- [ ] Belief revision retracts the weakest-justified contradicted assumption
- [ ] Belief revision cascades: actions depending solely on a retracted assumption revert to `open`
- [ ] Agent assembly matches an agent definition to an action based on capabilities
- [ ] Agent assembly composes a novel agent when no existing definition matches
- [ ] Engine loop iterates through all 7 steps and terminates on budget exhaustion or realization threshold
- [ ] All unit tests pass
- [ ] README documents the planning model and engine loop
