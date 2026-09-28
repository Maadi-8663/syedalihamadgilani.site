/* tools.js — what the Integrations page says about each tool (2026-09-29).

   Syed: "create another page as well, with the name Integrations. In there,
   list all these logos (Bigger in size) properly organized... each logo
   should have a card. On hovering it should flip and tell the detail of the
   integration we do for that app... Dont write about the past projects
   here. Just write about the that tool's integration we can do. Write
   professionally."

   So every text here is a capability — what connecting that tool does for a
   business — and none names a client, a project or a figure. The tools are
   the 38 marks of the home page's cluster (src/pictures/cluster.js has the
   evidence that each was used in real work), plus the seven the site sets
   in type because Simple Icons publishes no mark for them: OpenAI, Twilio,
   GoHighLevel, HouseCall Pro, CallRail, Skyvern and Apify. Later the same
   day he asked for more: "Add more automation platforms: Zapier, and all
   others you know. And also add a card named Custom Automations." Those
   platforms are listed at his word, as what he offers — this page is
   capabilities, where the cluster is evidence, so they are not in the
   cluster. Their marks, where Simple Icons has one, are in marks.js. A name
   here must match its label there, in the cluster and in brands.js; page.js
   throws if a marked tool has no mark, so a typo cannot ship a blank card.

   `icon` is each group's ring, drawn in the site's line style (24px, 1.5
   stroke). Groups run from the platforms that do the automating to the
   stack the custom software is built on. */

export const GROUPS = [
  {
    id: 'automation', title: 'Automation platforms',
    icon: '<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7.5 12h3.5l5.5-5.3M11 12l5.5 5.3"/>',
    tools: [
      ['n8n', 'End-to-end workflows on n8n, self-hosted or cloud: webhooks, schedules, sub-workflows and custom code, with error handling, retries and duplicate protection built in, so a failed step is caught and recovered, never silently lost.'],
      ['Make', 'Scenarios in Make for teams that prefer a visual builder: routers, filters and iterators moving data between your apps, with error routes and schedules set up so the scenario can be maintained without a developer.'],
      ['Zapier', 'Zaps across the apps your team already uses: multi-step workflows with paths, filters and formatting, built so a non-technical team can read and adjust them, and documented step by step at hand-over.'],
      ['Microsoft Power Automate', 'Flows inside Microsoft 365: approvals in Teams and Outlook, files routed to SharePoint and OneDrive, Excel and Dataverse kept in step, and connectors out to the rest of your stack.'],
      ['Pipedream', 'Code-first workflows on Pipedream: event-driven steps in Node.js or Python between any APIs, for integrations that need custom logic without running a server of your own.'],
      ['IFTTT', 'IFTTT applets for small, everyday automations: a single trigger and action between common apps and smart devices, for jobs too small to justify a full workflow.'],
      ['Pabbly Connect', 'Pabbly Connect workflows for flat-price automation: triggers, routers and filters moving data between your apps, set up and documented so your team can run them day to day.'],
      ['Node-RED', 'Flow-based automation on Node-RED for devices, sensors and internal systems: lightweight, self-hosted flows that watch, transform and route events as they happen.'],
      ['Activepieces', 'Open-source automation on Activepieces, self-hosted so the data stays on your servers: flows with branches, loops and AI steps that your team can maintain after hand-over.'],
      ['Apache Airflow', 'Scheduled data pipelines on Apache Airflow: workflows that extract, transform and load data between your systems on a timetable, with retries, dependencies and a record of every run.'],
      ['Workato', 'Workato recipes for larger organisations: governed integrations between ERP, CRM, finance and HR systems, with error handling, logging and role-based access.'],
      ['Custom Automations', 'When no platform fits: automations written as code around your process — Python or Node.js services, scheduled jobs, webhooks and AI agents — hosted on your servers or in the cloud, with logging and alerts so no failure goes unseen.'],
    ],
  },
  {
    id: 'ai', title: 'AI, agents & voice',
    icon: '<path d="M12 3.5c.6 4.3 2.9 6.6 7.2 7.2-4.3.6-6.6 2.9-7.2 7.2-.6-4.3-2.9-6.6-7.2-7.2 4.3-.6 6.6-2.9 7.2-7.2z"/><path d="M18.5 16.5v4M16.5 18.5h4"/>',
    tools: [
      ['OpenAI', 'GPT models inside your workflows: classifying and routing inbound messages, extracting fields from emails and documents, drafting replies and transcribing calls with Whisper, with structured outputs validated before anything acts on them.'],
      ['Google Gemini', 'Gemini for high-volume and multimodal steps: reading PDFs, images and long documents, summarising threads and extracting data at low cost, with rules checked in code wherever a model’s answer decides an outcome.'],
      ['ElevenLabs', 'Voice agents that answer and place calls in a natural voice: qualifying leads, answering questions and booking appointments, with each call’s outcome written to your CRM and a hand-off to a person when needed.'],
      ['LangChain', 'Retrieval-augmented assistants built with LangChain that answer from your own documents — policies, manuals, knowledge bases — and cite the passage they used, so staff can check an answer rather than trust it.'],
      ['Ollama', 'Private AI on your own hardware: open models served through Ollama for reading, classifying and drafting when data must not leave your network, suited to healthcare, legal and financial work.'],
      ['Skyvern', 'Browser automation for portals without an API: an AI agent that logs in, fills forms and downloads reports from supplier, insurer and government sites, with every run recorded for review.'],
    ],
  },
  {
    id: 'messaging', title: 'Messaging, email & calls',
    icon: '<path d="M4 5h16v11H9.5L4 20z"/><path d="M8 9h8M8 12h5"/>',
    tools: [
      ['WhatsApp', 'WhatsApp Business Platform automations: instant replies to new enquiries, booking confirmations and reminders sent from approved templates, order updates, and two-way conversations routed to your team and logged in the CRM.'],
      ['Gmail', 'Gmail automation through its API: inbound enquiries and invoices parsed and routed, messages labelled and filed, personalised follow-up sequences sent, and every sequence stopped the moment a recipient replies.'],
      ['Telegram', 'Telegram bots for internal alerts and approvals: new leads, failed payments and system errors posted to the right chat, with buttons that let a manager approve, assign or reply without opening another app.'],
      ['Twilio', 'SMS and voice through Twilio: instant text-backs for missed calls, appointment reminders, two-way SMS synced to your CRM, and call flows that route each caller to the right person.'],
      ['CallRail', 'Call tracking tied to your pipeline: every tracked call and form creates or updates a lead with its source campaign, and qualified calls return to Google Ads as offline conversions, so spend follows real bookings.'],
    ],
  },
  {
    id: 'crm', title: 'CRM & field service',
    icon: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5c.8-3.4 3-5 5.5-5s4.7 1.6 5.5 5"/><path d="M16.5 7.5h4.5M16.5 11.5h4.5M18 15.5h3"/>',
    tools: [
      ['HubSpot', 'HubSpot integration: contacts, companies and deals created and updated from your forms, calls and inboxes, pipeline stages advanced by events, and duplicates merged so the CRM stays the single source of truth.'],
      ['GoHighLevel', 'GoHighLevel automations for agencies and local businesses: lead capture into pipelines, SMS and email follow-up, calendar booking and voice AI, extended with custom webhooks where the built-in workflows stop.'],
      ['HouseCall Pro', 'Field-service automation around HouseCall Pro: new leads turned into customers and jobs, technician availability checked before a booking is offered, and job status pushed to your CRM and to the customer by text.'],
    ],
  },
  {
    id: 'workspace', title: 'Workspace & data',
    icon: '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10"/>',
    tools: [
      ['Google Sheets', 'Google Sheets as a live operations layer: leads, orders and job logs written row by row as they happen, lookups and duplicate checks before anything is added, and scheduled reports built from the data.'],
      ['Google Drive', 'Document workflows on Google Drive: files saved to the right client folder automatically, contracts and invoices generated from templates, and incoming documents read and indexed as they arrive.'],
      ['Google Calendar', 'Scheduling on Google Calendar: availability checked before a slot is offered, bookings created from forms, calls and chats, and confirmations, reminders and reschedules sent without anyone touching the calendar.'],
      ['Airtable', 'Airtable bases as lightweight back offices: records created and updated from your other tools, linked tables kept in sync, and automations triggered the moment a status changes.'],
      ['Notion', 'Notion as the team’s hub: databases filled from forms, CRMs and meeting notes, pages created from templates for each new client or project, and status changes pushed back to the tools where work happens.'],
    ],
  },
  {
    id: 'growth', title: 'Advertising & lead sourcing',
    icon: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
    tools: [
      ['Google Ads', 'Google Ads tied to real outcomes: offline conversions uploaded from your CRM so bidding optimises for booked jobs rather than clicks, lead-form submissions routed instantly, and performance reports delivered on schedule.'],
      ['Meta', 'Facebook and Instagram lead ads in real time: each lead lands in your CRM within seconds, gets an instant reply and carries its campaign, while conversions are sent back to Meta to sharpen targeting.'],
      ['Google Maps', 'Lead sourcing from Google Maps: businesses in a region and category collected with their public details, then verified and deduplicated against your CRM before any outreach begins.'],
      ['Google Search', 'Search-driven research: target companies and pages found through Google’s search API, enriched with public information and filtered before anything reaches your pipeline.'],
      ['Apify', 'Web data at scale with Apify: ready-made and custom scrapers for directories, marketplaces and public profiles, scheduled to run and delivering clean, deduplicated records to your sheets or CRM.'],
    ],
  },
  {
    id: 'commerce', title: 'Commerce & payments',
    icon: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    tools: [
      ['Shopify', 'Shopify automations through the Admin API: order, refund and tracking questions answered from live order data, support inboxes triaged, and orders, inventory and customer records kept in sync with your other systems.'],
      ['Stripe', 'Stripe payments wired into your operations: invoices and payment links sent automatically, subscription changes and failed payments handled by workflow, and each payment matched to the right customer record.'],
    ],
  },
  {
    id: 'backend', title: 'Databases & back ends',
    icon: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    tools: [
      ['PostgreSQL', 'PostgreSQL designed for automation: clean schemas, job queues and audit tables that let workflows run reliably at volume, with row-level security where several clients share one system.'],
      ['Supabase', 'Supabase back ends for portals and SaaS products: Postgres, authentication, storage and row-level security, with database triggers and edge functions feeding your automations.'],
      ['Prisma', 'Type-safe data access with Prisma: schemas, migrations and queries for Node.js and Next.js applications, so the database and the code that uses it cannot drift apart.'],
      ['Node.js', 'Node.js services for work that outgrows a workflow tool: API integrations, background jobs and webhook receivers that handle volume, retries and custom logic.'],
      ['Express', 'Lightweight APIs on Express: secure webhook receivers for third-party events, internal endpoints that expose your data to automations, and small self-contained web apps.'],
      ['Python', 'Python for data-heavy steps: PDF and document processing, OCR, data cleaning and enrichment, and scripts that move or transform records in bulk.'],
      ['FastAPI', 'FastAPI services for AI and document pipelines: typed, documented endpoints that wrap models, OCR and business rules, deployable on your own servers.'],
      ['Flask', 'Flask web apps and internal tools: dashboards, form handlers and admin screens that sit alongside your automations.'],
    ],
  },
  {
    id: 'apps', title: 'Apps & infrastructure',
    icon: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18"/><path d="M6.5 6.5h.01M9.5 6.5h.01"/>',
    tools: [
      ['Next.js', 'Next.js applications on top of your automations: client portals, internal dashboards, booking pages and full SaaS products, fast and search-friendly.'],
      ['React', 'React interfaces for internal tools: dashboards, review queues and admin panels where your team approves, corrects and monitors what the automations do.'],
      ['TypeScript', 'TypeScript across the stack, so integrations, APIs and interfaces share one set of types and a renamed field is caught when the code is built, not in production.'],
      ['JavaScript', 'JavaScript where no-code stops: custom code steps inside n8n and Make for parsing, validation and transformations the built-in nodes cannot handle.'],
      ['Tailwind CSS', 'Tailwind CSS for fast, consistent interfaces: responsive dashboards, portals and landing pages built to your brand, with no bespoke stylesheet to maintain.'],
      ['Vite', 'Vite for fast front-end builds: single-page tools and prototypes that load quickly and are simple to ship.'],
      ['Docker', 'Docker packaging for dependable deployments: self-hosted n8n, databases and custom services that run the same on a laptop, a VPS or your own server.'],
      ['NGINX', 'NGINX in front of self-hosted services: HTTPS, reverse proxying and routing for n8n, APIs and dashboards on your own infrastructure.'],
      ['GitHub', 'Version control and delivery on GitHub: every workflow, script and application kept in a repository with history and documentation, so your systems can be handed over and maintained.'],
    ],
  },
];

/* The tools set in type: no published mark, so their card shows the name. */
export const TYPESET = new Set(['OpenAI', 'Skyvern', 'Twilio', 'CallRail', 'GoHighLevel', 'HouseCall Pro', 'Apify',
  'Microsoft Power Automate', 'Pipedream', 'Pabbly Connect', 'Activepieces', 'Workato']);

/* Cards that are not a vendor's tool, with the line icon their front shows
   in place of a mark (2026-09-29, his request: "add a card named Custom
   Automations"). They are not counted in a group's tools. */
export const CUSTOM = {
  'Custom Automations': '<path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 5l-3 14"/>',
};
