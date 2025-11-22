# portfolio-risk-dash

im going to be interning at an actuary firm in ``chicago,il`` for **summer 2026**, i made this to get familiar and practice with thier tech stack and learn things along the way!

## Goal

**High-level idea**
Build a platform where financial analysts can:

1) Upload portfolio holdings

2) Run “risk calculations” (simplified for practice)

3) View results in an interactive dashboard

4) Manage assumptions & models

5) Store results in a SQL database and expose them via .NET APIs

This mimics:

* Risk systems

* Data pipelines

* Scenario engines

* Internal tools Milliman builds for insurers & asset managers

## System Architecture

React frontend → REST APIs → C# service layer → SQL → scheduled jobs or calculation engines

```
pgsql
                      ┌──────────────────────────┐
                      │      React (TS) UI       │
                      │ Dashboard / Upload /     │
                      │ Graphs / Scenario Editor │
                      └───────────▲──────────────┘
                                  │ REST
                                  │
                    ┌─────────────┴─────────────────┐
                    │         .NET Web API          │
                    │ Controllers, DTOs, Services   │
                    │ Business Logic Layer          │
                    │ (risk calc engines, rules)    │
                    └─────────────▲─────────────────┘
                                  │ EF Core
                                  │
                      ┌───────────┴────────────────┐
                      │        SQL Database        │
                      │ tables: portfolios,        │
                      │ positions, assumptions,    │
                      │ scenarios, results         │
                      └────────────────────────────┘
```

## Dev

* ``cd frontend/`` -> ``npm start``
* ``cd backend/backendAPI`` -> ``dotnet run``

## Project Plan/SDLC

[x] [Step 1 — Repo + Backend scaffold](https://github.com/RyanTren/portfolio-risk-dash/issues/1)

* ASP.NET Core Web API, EF Core DbContext (SQLite for local dev), models, a Portfolio CSV upload endpoint, simple GET endpoints.

* Unit tests skeleton, README.

[x] [Step 2 — Risk calculation service & results storage](https://github.com/RyanTren/portfolio-risk-dash/issues/3)

* Implement RiskCalculationService with simple VaR / stress tests, store RiskResult rows.

* Endpoint to trigger a run and to poll job status.

[x] [Step 3 — Basic React + TypeScript frontend scaffold](https://github.com/RyanTren/portfolio-risk-dash/issues/4)

* Create React app, Axios service, portfolio upload UI, portfolio list page, results page.

* Connect frontend to Step 1/2 backend.

[x] Step 4 — Visualization & UX

* Add charts (Recharts), tables (ag-Grid or MUI DataGrid), scenario editor UI, pagination/virtualization.

[ ] Step 5 — Asynchrony & job orchestration

* Use background jobs (Hangfire or Azure WebJobs) or a message queue pattern to run calculations asynchronously.
* Add job status + websockets (SignalR) or polling.

[ ] Step 6 — Tests, CI, small deployment to Azure

* Unit and integration tests, GitHub Actions CI, optional deploy to Azure App Service + Azure SQL (or free tier).

[ ] Stretch features

* Monte Carlo engine, caching (Redis), role-based security (Azure AD), multi-tenant support.

## Any Future Implementations

