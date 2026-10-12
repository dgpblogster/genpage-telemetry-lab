# Generative Page Telemetry Lab

## A Companion Lab for The Workbench

Prove that a published **generative page** reports its own page loads, crashes and data
calls to **Azure Application Insights**, with no telemetry code in the page: one page, one
Application Insights resource, one deliberately broken button, and four queries.

Companion to the post *The Page That Reports Itself* on
[The Workbench](https://www.theworkbench.blog).

Sources of truth:

- [Generate a page using natural language](https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-pages), section *Monitor a generative page with Application Insights (preview)*
- [Create and edit generative pages with AI code generation tools](https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-page-external-tools)
- [Export data to Application Insights](https://learn.microsoft.com/power-platform/admin/set-up-export-application-insights)

---

## What Gets Recorded

Per the generative pages documentation (preview; availability might vary by environment
while it rolls out):

| Activity | Application Insights table | Details |
|---|---|---|
| Page load | `pageViews` | Page ID, page name, app, host type, load duration, navigation origin |
| Unhandled error | `exceptions` | Unhandled page-rendering errors and unhandled promise rejections |
| Data API operation | `dependencies` | Duration and result of `dataApi` create, update, delete, retrieve and query |
| Navigation | `pageViews` | Navigation started from a generative page, with source and target page |

---

## Repo Structure

```
genpage-telemetry-lab/
├── README.md                         # This file
├── page/
│   ├── generation-prompt.md          # Example prompt for the demo page
│   └── break-me-button.tsx           # The deliberate unhandled promise rejection
└── queries/
    ├── 01-reconnaissance.kql         # Run first: see what actually arrives
    ├── 02-page-load-performance.kql  # Loads, p50 and p95 per page
    ├── 03-exceptions.kql             # Crashes grouped, with distinct users
    └── 04-dataapi-dependencies.kql   # dataApi calls, failures, p95
```

---

## Prerequisites

Each of these can stop you cold, so read them before you start:

- A **Managed Environment**. The Application Insights export is supported for Managed
  Environments only.
- **Power Platform administrator** or **Dynamics 365 administrator** at the tenant level,
  **and** **environment administrator** or **system administrator** in the Dataverse
  environment itself. Without both, the docs say the integration doesn't work.
- An **Application Insights** resource dedicated to this environment, on which you hold
  **Contributor** or **Owner**, with **local authentication** left enabled.
- For the in-browser page designer: an environment in the **United States, Great Britain,
  Australia or Singapore**. Elsewhere, build the page with the AI code generation tools
  route instead; the telemetry works the same either way.

---

## Steps

1. **Create the export.** In the [Power Platform admin center](https://admin.powerplatform.microsoft.com)
   go to **Manage** > **Data export** > **App Insights** tab > **New data export**.
2. **Name it and pick the data type.** The generative pages articles do not say which data
   type carries their telemetry. Model-driven app telemetry is documented under
   **Dataverse diagnostics and performance**, so that is the one to select. Treat that as
   an inference until the docs say otherwise.
3. **Finish the wizard.** Choose filters and the source environment, select **Next**,
   choose the subscription, resource group and Application Insights resource, select
   **Next**, then **Create**.
4. **Generate the page.** At [make.powerapps.com](https://make.powerapps.com) open a
   model-driven app for editing, select **Add page** > **Generative page** >
   **Describe a page**, select **Add data** > **Add table** > **Account**, and use the
   prompt in [`page/generation-prompt.md`](page/generation-prompt.md). Select
   **Generate page**.
5. **Break it on purpose.** On the **Code** tab select **Edit**, paste the button from
   [`page/break-me-button.tsx`](page/break-me-button.tsx), and select **Save**.
6. **Publish.** Select **Save and Publish**. Only published pages send telemetry; a page
   you have only previewed in the designer stays silent.
7. **Use it.** Open the app as a normal user, load the page several times, page through
   some records, select a few rows, and click **Break me** twice.
8. **Wait.** Exported telemetry can take up to 24 hours to start arriving. An empty table
   on the first afternoon is not a failure.
9. **Query, in order.** Open the Application Insights resource > **Logs** and run the
   files in [`queries/`](queries) starting with `01-reconnaissance.kql`.

---

## Where to Run the Queries

The queries use the classic Application Insights table and column names (`pageViews`,
`timestamp`, `cloud_RoleInstance`, `customDimensions`). Run them from **Logs on the
Application Insights resource**, where those names are supported for backward
compatibility.

If you query the underlying **Log Analytics workspace** directly, the same data lives under
different names, for example `AppPageViews`, `AppExceptions` and `AppDependencies`, with
`TimeGenerated`, `AppRoleInstance`, `DurationMs` and `Properties`. Note that `success` is a
**string** in the classic `dependencies` table and a **bool** (`Success`) in
`AppDependencies`; query 04 uses `tobool(success)` so it is correct either way. Full
mapping: [Migrate to workspace-based Application Insights resources](https://learn.microsoft.com/azure/azure-monitor/app/apm-tables).

---

## Known Gaps

Stated as gaps, because that is what they are:

- **Which export data type.** Not documented for generative pages (see step 2).
- **Which key holds the page ID and page name.** The docs name the information but not the
  column or `customDimensions` key. Query 01 exists so you find out from your own data;
  query 02 shows how to switch its grouping once you know.
- **Which `type` value marks a `dataApi` call.** Not documented, and Dataverse's own
  server-side calls also land in `dependencies`. Query 04 deliberately runs unfiltered
  first.

These queries have **not** been validated against live generative page telemetry. They
follow the documented tables and the documented `cloud_RoleInstance == "CDS Data Export"`
marker ([common fields](https://learn.microsoft.com/power-platform/admin/overview-integration-application-insights#common-fields)).
If your data disagrees with them, your data wins.

---

## Not Here Yet

An **Azure Monitor workbook** charting the three tables side by side is the natural fourth
piece. It belongs here once the real column names are confirmed against live data, not
before.

---

## Clean Up

Remove the **Break me** button before you share the page with anyone, and delete the data
export in the admin center if you created it only for this lab.
