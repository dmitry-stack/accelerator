# training-workspace: Training Sessions Workspace

## Goal

Provide a small workspace where a trainer can view training sessions, filter the list by status, and create a session scheduled for a future date and time.

## Users And Outcome

- **User:** A trainer managing training sessions.
- **Outcome:** The trainer can load the sessions, narrow the list by status, create a valid session, and see the new session in the list.

## Acceptance Criteria

- [ ] On opening the workspace, the user can see sessions returned through the mock request boundary. Each session shows its title, status, and start date/time.
- [ ] While the initial sessions request is pending, the workspace shows a loading state.
- [ ] The list offers an `All` filter and one status filter. Selecting the status filter shows sessions with that status; selecting `All` restores the unfiltered list.
- [ ] If the sessions request fails, the workspace shows an understandable error and a way to retry the request. A successful retry returns the user to the loaded list.
- [ ] The user can open a create-session form with a title and date/time fields.
- [ ] Submitting a title shorter than 3 characters or longer than 80 characters after trimming is rejected with a useful validation message. Titles are trimmed before creation.
- [ ] Submitting a date/time that is not in the future is rejected with a useful validation message.
- [ ] While creation is pending, duplicate submission is prevented.
- [ ] After successful creation, the new session appears in the visible list with its title, status, and start date/time.
- [ ] Session data is served through the repository's existing mock mechanism and an HTTP client or equivalent replaceable request boundary. No backend service is implemented.
- [ ] At least one behavior-level automated test covers the main flow, including filtering or successful creation.
- [ ] A manual browser check exercises the list, filter, and create flow once; the workflow record describes only what was actually observed.

## Constraints

- Use the repository's existing framework, package manager, scripts, and test stack.
- Keep mock data behind a replaceable HTTP request boundary and use the existing mock mechanism. If none exists, MSW or another conventional HTTP mock is acceptable.
- Do not implement a backend service.
- Avoid unrelated code or configuration changes and features outside the required flow.
- Report incomplete behavior and checks accurately.

## Non-Goals

- Session details, drawers, or deep links.
- Search, multiple filters, or pagination.
- A complete API contract or scenario matrix.
- Desktop/mobile screenshot sets or exhaustive responsive and accessibility validation.
- Full test coverage.
- CI, deployment, or a public URL.
- Strict TypeScript migration or unrelated refactoring.

## Facts

- The supplied task is `training-workspace` and describes a small frontend workspace for viewing, filtering, and creating sessions.
- The required flow is: open the workspace and load sessions, filter by one status, open the create form, submit a title and future date/time, and see the created session in the list.
- The task requires an automated behavior-level test and one manual browser exercise of list, filter, and create.
- The task leaves the implementation framework and tooling to the repository's existing setup.

## Assumptions

- “Recoverable request-error state” means the user can retry loading after a request failure; retry is the simplest observable recovery action consistent with the task.
- The created session should be included in the currently visible list after successful creation, including when a status filter is active. Whether the active filter changes or clears is unspecified.

## Open Questions

- Which concrete session status should the single status filter use, and what status values should the mock data contain?
- What status should newly created sessions have?
- Which timezone should govern the future date/time validation and the displayed start date/time?
- After successful creation, should the form close and/or reset? The required outcome only specifies that the created session appears in the list.
- If the current status filter excludes a newly created session, should the filter clear, change, or remain active while the session is added?

## Readiness

The goal and core observable behavior are clear enough for downstream architecture, API-contract, and UI decisions. Resolve the open questions that affect those decisions before treating the details as confirmed. No architecture or implementation plan is specified here.
