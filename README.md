# portfolio-risk-dash

practice for milliman

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

>## Dev
``frontend/`` -> ``npm start``
``backend/`` -> ``dotnet run``