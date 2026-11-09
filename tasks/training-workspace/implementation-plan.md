# training-workspace: Implementation Plan

## Current Behavior

`vite-project` is the repository's React 19 and TypeScript application, scaffolded with Vite. `src/App.tsx` currently renders the starter counter and Vite/React content. There is no session UI, request boundary, or test runner configured. The existing package scripts are `dev`, `build`, and `lint`.

## Intended Behavior

Replace the starter screen with a Training Sessions workspace. Load and display mock sessions through a replaceable request module; show loading and recoverable load-error states; allow All and UPCOMING filtering; validate and submit a title plus future local date/time; and show each successfully created UPCOMING session in the list. On create success, reset the form. Keep all application work within the existing `vite-project` React/TypeScript app.

## Preconditions And Confirmed Decisions

- Confirmed developer decisions: statuses are `UPCOMING` and `COMPLETED`; the single status filter is `UPCOMING`; newly created sessions default to `UPCOMING`; future-date validation uses local browser time; and the create form resets after success.
- Requirements define trimmed titles from 3 through 80 characters, rejection of non-future date/time, duplicate-submit prevention, visible creation success, and a retry action after a load error.
- The repository has no existing test stack. Add a small Vite-compatible test setup so the required behavior test can run; do not change the app framework or package manager.
- Use the existing `vite-project` app as the Application Root. No backend service is in scope.

## Ordered File Changes

1. **Add session data contracts and replaceable mock requests**
   - Create `vite-project/src/types/session.ts` for `Session` (`id`, `title`, `status`, `startsAt`) and the `UPCOMING | COMPLETED` status union.
   - Create `vite-project/src/api/sessions.ts` with asynchronous `listSessions` and `createSession` operations backed by in-memory mock data. Keep components dependent on these operations rather than mock fixtures. Return created sessions with status `UPCOMING`; expose ordinary rejected promises for request failures so UI recovery can be exercised.
2. **Build the workspace UI and request states**
   - Create `vite-project/src/components/SessionFilter.tsx` with All and UPCOMING options and a controlled selected value.
   - Create `vite-project/src/components/SessionList.tsx` to render title, status, and locally formatted start date/time, plus an empty-list message.
   - Create `vite-project/src/components/CreateSessionForm.tsx` with labeled title and `datetime-local` inputs, inline validation, pending-submit protection, and reset after successful submission. Validate the selected date/time against the current local browser time.
   - Replace `vite-project/src/App.tsx` with the workspace state owner: load sessions, render loading/error/retry states, filter the loaded sessions, open and submit the create form, and include the returned session in the visible list. Keep the UPCOMING filter semantics consistent after creation so the new default-status session remains visible.
   - Replace starter styles in `vite-project/src/App.css` and adjust `vite-project/src/index.css` only as needed for the workspace layout, form, list, and status states. Remove unused starter imports and markup.
3. **Configure and add one behavior test**
   - Add a Vite-compatible Vitest, jsdom, and React Testing Library setup to `vite-project/package.json` and `vite-project/package-lock.json`; add `vite-project/src/test/setup.ts` and the required test configuration in `vite-project/vite.config.ts`.
   - Add `vite-project/src/App.test.tsx`. Mock the replaceable session request operations and test the user flow: load the workspace, create a valid future UPCOMING session, observe it in the list, and verify the form resets. Use accessible labels and visible text for interactions and assertions.

## Contracts And Dependencies

- `Session` is the shared UI/request model: `status` is `UPCOMING | COMPLETED`, and `startsAt` is an ISO timestamp returned by the API boundary. The UI formats it for the browser's local timezone.
- `listSessions(): Promise<Session[]>` and `createSession(input: { title: string; startsAt: string }): Promise<Session>` are the only component-facing mock request operations. The create operation assigns an id and `UPCOMING` status.
- The workspace owns list loading/error/retry and filter state. The form owns input, validation, and pending state; successful submit calls the workspace callback, which updates the visible session list and resets the form.
- The behavior test replaces the API module at the request boundary and uses a fixed future local date so its outcome does not depend on real time.

## Essential Tests

- `vite-project/src/App.test.tsx`: behavior-level successful creation flow verifies an initially loaded list, UPCOMING session creation, visible created session, and reset form. This satisfies the required minimum behavior test.
- Add a `test` package script and use the configured Vitest command for the test. No test command is run as part of this planning task.

## Additional Risk-Based Tests

- Verify All/UPCOMING filtering, including COMPLETED sessions.
- Verify title trimming and 3 to 80 character boundaries, past/equal-to-now local date rejection, duplicate-submit protection, retry after list failure, and create-request failure recovery.

## Verification Commands

- Existing commands discovered in `vite-project/package.json`: `npm run build`, `npm run lint`, and `npm run dev` (the last supports the required manual browser check).
- Add `npm run test` when configuring the test runner. During implementation, run the existing build and lint checks, the behavior test, and manually exercise list, filter, and create in the browser; record only observed results.
- No verification commands are run during planning.

## Risks And Rollback

- The repository has no pre-existing test runner, so the behavior-test requirement needs a small test-only dependency/configuration addition. Keep it isolated to `vite-project` and its package manifest/lockfile.
- The mock API is intentionally in-memory and is not durable across page reloads; persistence and a backend are outside this task. No feature flag or special rollback step is required for this small workspace replacement.

