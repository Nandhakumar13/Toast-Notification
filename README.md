# React Toast Notification System

A reusable, production-oriented toast notification system built with React. This project focuses on component architecture, predictable state management, notification lifecycle handling, queue management, accessibility, and maintainable API design.

The goal is to build a shared notification system that can be integrated into any React application without requiring each component to manage its own toast state.

> **Project status:** In development  
> **Primary focus:** React, JavaScript, state management, component architecture, and testing

## Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Notification Lifecycle](#notification-lifecycle)
- [Public API](#public-api)
- [Design Decisions](#design-decisions)
- [Implementation Plan](#implementation-plan)
- [Testing Strategy](#testing-strategy)
- [Accessibility](#accessibility)
- [Performance and Reliability](#performance-and-reliability)
- [Getting Started](#getting-started)
- [Usage Example](#usage-example)
- [Future Enhancements](#future-enhancements)
- [Learning Outcomes](#learning-outcomes)

## Overview

Toast notifications provide temporary feedback to users after an application action, such as saving a form, completing a request, encountering an error, or performing an operation successfully.

This project implements a centralized toast notification manager with a controlled visible stack and a pending notification queue.

Instead of maintaining notification state independently across multiple components, application components will use a shared API to create and dismiss notifications.

### Example scenarios

- Display a success message after saving a profile.
- Display an error message when an API request fails.
- Display a warning before a user continues an operation.
- Display informational messages for background operations.
- Queue notifications when the visible toast limit has been reached.
- Keep important notifications visible until the user dismisses them.

## Objectives

The primary objectives of this assignment are to:

- Design reusable and composable React components.
- Implement predictable state transitions using `useReducer`.
- Manage shared state using React Context.
- Separate the notification API from notification rendering.
- Implement a FIFO queue with a configurable visible-stack limit.
- Handle auto-dismiss timers and component cleanup safely.
- Validate public API inputs.
- Support persistent notifications and per-notification configuration.
- Build accessible and responsive UI components.
- Test state transitions, edge cases, and component behavior.

## Features

The following features define the intended scope of the implementation.

| Feature | Description |
|---|---|
| Notification types | Success, error, warning, and informational messages |
| Shared API | Create and dismiss notifications from different components |
| Visible-stack limit | Display no more than three notifications simultaneously |
| FIFO queue | Queue additional notifications in creation order |
| Automatic dismissal | Dismiss eligible notifications after their configured duration |
| Manual dismissal | Allow users to close individual notifications |
| Persistent notifications | Keep notifications visible until explicitly dismissed |
| Unique identifiers | Return an ID when a notification is created |
| Configurable duration | Support default and per-notification durations |
| State management | Manage notification transitions through a reducer |
| Input validation | Reject invalid messages and configuration values |
| Queue promotion | Display the oldest queued notification when a visible slot opens |
| Cleanup | Clear notification timers when appropriate |
| Accessibility | Provide appropriate live-region and keyboard behavior |
| Testing | Verify reducer logic, public API behavior, and UI interactions |

Implementation status will be tracked in the TODO checklist below.

## Architecture

The system follows a unidirectional data flow.

```text
Application Components
          |
          v
       useToast()
          |
          v
    Toast API Context
          |
          v
     API Validation
          |
          v
       Dispatch
          |
          v
     Toast Reducer
          |
          v
   Shared Notification State
      /             \
     v               v
  Visible           Pending
 Notifications      Queue
     |
     v
 Toast Container
     |
     v
 Individual Toast Components
     |
     v
 Timer / Manual Dismissal
```

### Core modules

**1. Toast Provider**

Owns the shared notification state and exposes the notification API to descendant components. It will be mounted near the root of the application.

**2. Toast API Context**

Exposes stable methods for creating and dismissing notifications. Components that only need to trigger notifications should not need to consume the complete notification state.

**3. Toast State Context**

Exposes notification state to the components responsible for rendering the toast stack.

**4. Toast Reducer**

Handles deterministic state transitions, including adding notifications, removing notifications, and promoting pending notifications.

**5. Toast Container**

Renders the currently visible notifications and maintains the notification viewport.

**6. Toast Component**

Renders one notification, handles manual dismissal, and owns its auto-dismiss timer when applicable.

**7. Custom Hook**

Provides a convenient interface to the toast API and reports a clear error if used outside the required provider.

## Project Structure

The proposed initial structure is:

```text
src/
├── components/
│   └── toast/
│       ├── Toast.jsx
│       ├── ToastContainer.jsx
│       ├── ToastContext.jsx
│       ├── toastReducer.js
│       ├── useToast.js
│       └── toast.css
├── App.jsx
└── main.jsx

README.md
package.json
```

The implementation will begin with the reducer and proceed toward the public API, rendering components, timer lifecycle, and tests. The structure can be split into additional modules if the implementation grows.

## Notification Lifecycle

A notification follows the lifecycle below.

1. An application component invokes a toast API method.
2. The API validates the supplied message and options.
3. A unique notification ID is generated outside the reducer.
4. An add action is dispatched.
5. If fewer than three notifications are visible, the notification becomes visible immediately.
6. Otherwise, the notification is appended to the pending queue.
7. A visible notification starts its auto-dismiss timer unless it is persistent.
8. A notification can be dismissed automatically or manually.
9. When a visible notification is removed, the oldest pending notification is promoted into the available slot.
10. The removed notification's timer is cleaned up as its component unmounts.

Queued notifications do not start their auto-dismiss timers until they become visible.

## Public API

The intended public API will be exposed through a custom hook.

### Notification creation

```jsx
const toast = useToast();

toast.success("Profile saved successfully");
toast.error("Unable to save the profile");
toast.warning("Please review your changes");
toast.info("A new update is available");
```

### Notification configuration

```jsx
toast.success("Profile saved successfully", {
  duration: 3000,
});

toast.error("The request failed", {
  duration: 8000,
});

toast.info("Background synchronization started", {
  persistent: true,
});
```

### Manual dismissal

```jsx
const toastId = toast.success("Changes saved");

// Dismiss a specific notification
toast.dismiss(toastId);
```

Each creation method is intended to return the ID of the notification it creates.

### Planned notification options

| Option | Purpose |
|---|---|
| `duration` | Controls the auto-dismiss delay in milliseconds |
| `persistent` | Prevents automatic dismissal when set to `true` |

The default duration will be configurable at the implementation level. Exact validation rules and default values will be documented alongside the final API.

## Design Decisions

### 1. `useReducer` for state management

The notification state contains multiple related collections. Adding, dismissing, and promoting notifications must happen consistently.

A reducer centralizes these transitions and makes them easier to test independently from React rendering.

### 2. Separate visible and pending collections

The state will contain two arrays:

- `visible`: notifications currently rendered.
- `pending`: notifications waiting for a visible slot.

This separates presentation state from queued work and makes the visible-stack limit explicit.

### 3. FIFO queue management

Notifications enter the pending queue in creation order. When a visible slot becomes available, the oldest pending notification is promoted first.

### 4. Stable notification identity

Each notification receives a unique ID when created. The ID supports targeted dismissal and stable React keys.

Duplicate IDs should not introduce duplicate notifications into the state.

### 5. Pure reducer

The reducer will not generate IDs, create timers, manipulate the DOM, or perform other side effects.

Its responsibility is to return the next state based on the current state and the dispatched action.

### 6. Timer ownership

Each visible toast component owns its auto-dismiss timer. Timer cleanup occurs when the toast is dismissed or the component unmounts.

This keeps timer lifecycle management close to the UI element it affects.

### 7. Context separation

The notification API and notification state will use separate contexts. This reduces unnecessary updates for consumers that only need to invoke stable API methods, provided the API value itself remains stable.

### 8. Idempotent dismissal

Repeated dismissal requests and dismissal of unknown IDs should be safe no-ops. This supports cases where a timer and a manual close action occur close together.

## Implementation Plan

The implementation will be developed incrementally.

### Phase 1: State management

- [ ] Define the notification data structure.
- [ ] Define the initial reducer state.
- [ ] Define action types and payload contracts.
- [ ] Implement notification creation.
- [ ] Enforce the maximum of three visible notifications.
- [ ] Implement FIFO queue insertion.
- [ ] Implement dismissal by ID.
- [ ] Promote the oldest pending notification after a visible dismissal.
- [ ] Handle duplicate IDs safely.
- [ ] Keep reducer operations pure.
- [ ] Test reducer transitions independently.

### Phase 2: Provider and public API

- [ ] Create the Toast Provider.
- [ ] Integrate the reducer using `useReducer`.
- [ ] Create separate API and state contexts.
- [ ] Implement `success`, `error`, `warning`, and `info` methods.
- [ ] Implement `dismiss(id)`.
- [ ] Generate unique IDs outside the reducer.
- [ ] Return the generated ID from creation methods.
- [ ] Validate messages and notification options.
- [ ] Provide a clear error when the hook is used outside the provider.
- [ ] Keep API methods and API context values stable where appropriate.

### Phase 3: UI components

- [ ] Build the individual Toast component.
- [ ] Build the Toast Container.
- [ ] Render the visible notification stack.
- [ ] Add type-specific visual styles.
- [ ] Implement the manual close button.
- [ ] Add responsive positioning and layout.
- [ ] Add appropriate React keys and rendering safeguards.
- [ ] Verify that pending notifications are not rendered prematurely.

### Phase 4: Timer lifecycle

- [ ] Implement automatic dismissal.
- [ ] Apply the default duration.
- [ ] Support per-notification duration overrides.
- [ ] Support persistent notifications.
- [ ] Start timers only when notifications become visible.
- [ ] Clear timers when notifications unmount.
- [ ] Verify timer behavior under React Strict Mode.
- [ ] Ensure repeated dismissal remains safe.

### Phase 5: Accessibility and user experience

- [ ] Add appropriate ARIA live-region behavior.
- [ ] Choose suitable announcement behavior for each notification type.
- [ ] Ensure close controls are keyboard accessible.
- [ ] Add visible focus styles.
- [ ] Ensure text remains readable at different viewport sizes.
- [ ] Avoid relying only on color to communicate notification type.
- [ ] Verify that animations respect reduced-motion preferences.

### Phase 6: Testing and validation

- [ ] Test initial reducer state.
- [ ] Test adding a notification to the visible stack.
- [ ] Test adding a notification when the visible stack is full.
- [ ] Test FIFO queue ordering.
- [ ] Test dismissal of a visible notification.
- [ ] Test promotion of a pending notification.
- [ ] Test dismissal of a queued notification.
- [ ] Test unknown and repeated notification IDs.
- [ ] Test duplicate notification IDs.
- [ ] Test invalid messages and duration values.
- [ ] Test default and custom auto-dismiss durations.
- [ ] Test persistent notifications.
- [ ] Test manual dismissal.
- [ ] Test simultaneous notification creation.
- [ ] Test timer cleanup and unmount behavior.
- [ ] Test provider and custom-hook integration.
- [ ] Test accessibility and keyboard interactions.
- [ ] Run linting and production build checks.

### Phase 7: Documentation and release readiness

- [ ] Verify installation and usage instructions.
- [ ] Document the final public API.
- [ ] Document defaults and validation rules.
- [ ] Add representative usage examples.
- [ ] Confirm that all TODO items reflect the actual implementation.
- [ ] Add test execution instructions.
- [ ] Verify the production build.
- [ ] Review the final code for maintainability and unnecessary complexity.

## Testing Strategy

Testing will be organized around behavior and state transitions rather than implementation details alone.

**Reducer tests**

Verify that actions produce the expected state, that the visible limit is respected, and that queued notifications are promoted in the correct order.

**API tests**

Verify that public methods create the correct notification type, return IDs, validate inputs, and handle dismissal requests safely.

**Component tests**

Verify that notifications render correctly, close controls work, and auto-dismiss behavior matches the configured options.

**Integration tests**

Verify the complete flow from a component invoking the API through reducer updates to the notification being rendered and eventually dismissed.

The final test suite should use the project's selected React testing tools and fake timers where appropriate.

## Accessibility

The notification system should communicate status changes without unnecessarily disrupting users.

Accessibility considerations include:

- Using appropriate live-region semantics.
- Choosing announcement urgency based on the notification's purpose.
- Providing keyboard-accessible close controls.
- Providing meaningful accessible names.
- Maintaining sufficient color contrast.
- Supporting reduced-motion preferences.
- Ensuring that important messages are not communicated through color alone.

Live-region behavior should be selected carefully: routine success messages generally should not interrupt users, while genuinely urgent errors may require stronger announcement semantics.

## Performance and Reliability

The implementation should prioritize correctness before premature optimization.

Key considerations include:

- Keeping reducer transitions deterministic.
- Preventing unnecessary state duplication.
- Separating API consumers from state consumers.
- Using stable API references where appropriate.
- Avoiding timers for notifications that are still queued.
- Cleaning up timers when toast components unmount.
- Using stable IDs as React keys.
- Avoiding mutations to existing state arrays and notification objects.
- Ensuring queue promotion and dismissal occur in one reducer transition.
- Keeping the initial design simple enough to maintain and test.

The pending queue will initially be unbounded to match the assignment requirements. Queue limits, deduplication policies, and additional delivery controls can be considered later if real application requirements justify them.

## Getting Started

This project is being developed as part of a React component engineering assignment.

Once the implementation is complete, clone the repository and install the project's dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
npm run dev
```

The commands above assume a Vite-based React project with the corresponding npm scripts. Adjust them if the repository uses a different setup.

## Usage Example

After the provider and public API are implemented, the intended integration will look like this:

```jsx
import { ToastProvider } from "./components/toast/ToastContext";
import ProfilePage from "./ProfilePage";

export default function App() {
  return (
    <ToastProvider>
      <ProfilePage />
    </ToastProvider>
  );
}
```

A descendant component can then invoke the notification API:

```jsx
import { useToast } from "./components/toast/useToast";

export default function ProfilePage() {
  const toast = useToast();

  function handleSave() {
    // Perform the save operation here.
    toast.success("Profile saved successfully");
  }

  return (
    <button type="button" onClick={handleSave}>
      Save Profile
    </button>
  );
}
```

These examples describe the intended interface; import paths and exported names should match the final implementation.

## Future Enhancements

The following improvements are outside the initial required scope and can be evaluated after the core functionality is complete:

- [ ] Configurable maximum visible-toast count.
- [ ] Configurable default duration.
- [ ] Custom notification content.
- [ ] Pause auto-dismiss on hover or focus.
- [ ] Entry and exit animations.
- [ ] Placement configuration.
- [ ] Notification deduplication.
- [ ] Queue limits and overflow policies.
- [ ] Action buttons within notifications.
- [ ] TypeScript definitions.
- [ ] Package build and distribution.
- [ ] Storybook examples and interaction tests.

## Learning Outcomes

This project is intended to demonstrate practical understanding of:

- React component composition.
- `useReducer` and predictable state transitions.
- React Context and shared state architecture.
- Custom hooks and public API design.
- Queue-based notification management.
- Side-effect management with `useEffect`.
- Timer cleanup and React lifecycle behavior.
- Input validation and defensive programming.
- Accessibility and responsive UI design.
- Unit testing and integration testing.
- Maintainable code organization and engineering trade-offs.

## Conclusion

This assignment aims to build more than a simple toast component. It is an exercise in designing a reusable React feature with clear responsibilities, predictable state transitions, safe lifecycle management, and a testable public API.

The implementation will be considered complete when the required behavior is implemented, tested, documented, and verified in a production build.