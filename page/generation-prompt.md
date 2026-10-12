# Generation prompt

An example prompt for the demo page. Any page works, as long as it reads Dataverse
data through `dataApi`, because that is what produces rows in the `dependencies` table.
This one is deliberately ordinary: a list you can page through and a detail view, which
gives you page loads, queries and retrieves to look at in the telemetry.

In the app designer, select **Add page** > **Generative page** > **Describe a page**,
then select **Add data** > **Add table** and link **Account** before you paste this.

```text
Build a page that lists Account records in a table showing account name, main phone,
city and website, 25 rows at a time, with Next and Previous buttons to move between
pages. Add a search box above the table that filters the list by account name. When I
select a row, show that account's details (name, phone, website, address and
description) in a panel on the right side of the page. Use a clean modern look.
```

After the page generates, add the button from [`break-me-button.tsx`](break-me-button.tsx)
on the **Code** tab, then **Save and Publish**. Only published pages send telemetry.

Nothing in this prompt asks for logging or telemetry, on purpose. The point of the demo
is that the platform does the instrumenting, so the next regeneration of the page cannot
remove it.
