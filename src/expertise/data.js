/* data.js — what the six expertise pages say (2026-10-04).

   Syed: "Make the pages for each expertise separately. Like when someone
   clicks the card of Automation, it should open the page of Automation, with
   the details of the tools and tech stack I know about automation and then
   all the projects I have done in Automation. Then again a booking option to
   talk about automation. Same way for all others as well." And then: "I want
   attention to detail in UI and content as well. Be professional."

   One entry per card on the home page ("What I do"). Each page has three
   parts, in his order: the stack, the projects, a booking.

   The rules the rest of the site keeps hold here, and page.js enforces them
   at build time rather than trusting this file:

     - THE STACK is evidence, not a wish list. Every tool in `stack` must be
       in the tool list of at least one project on the same page (those lists
       follow the systems' own write-ups: src/systems/data.js), or be named
       in EVIDENCE below with where it was used. What he offers beyond that
       is `also`: names only, each linking to its card on the Integrations
       page, where it is listed at his word (src/integrations/tools.js).
     - A PROJECT'S LINE says what that system shows about this expertise, and
       is drawn from the system's own page. Each carries `needs`: phrases
       that must appear, verbatim, in that system's published text. If a
       write-up changes, the build stops here instead of leaving a sentence
       that no longer has a source.
     - NO NEW FIGURES. A number in a line is one the system's page already
       prints (and is in `needs`). The figure column of each row is the
       register's own, read from work.html.

   Clients stay unnamed, as everywhere on the site. `title` is the card's
   title; `card` is that title exactly as home.html writes it. */

export const EXPERTISE = [
  /* ================================================================ */
  {
    slug: 'ai-automation', n: 1, title: 'AI Automation', card: 'AI Automation',
    lede: 'I map a process end to end, decide which steps a system should own and which stay with a person, and build the rest in n8n — with error handling, idempotency and a refusal path in place from the first node.',
    description: (c) => `AI automation by Syed Ali Hamad Gilani: n8n systems with error handling, idempotency and a refusal path. The stack, and all ${c.total} systems built this way.`,
    stack: [
      { label: 'Workflow engine', tools: [
        ['n8n', 'Sub-workflows, Code nodes, error workflows, webhooks and schedules, self-hosted or cloud. Every system on this page runs on it.'],
        ['JavaScript', 'Code nodes, for the parsing, validation and scoring that the built-in nodes cannot express.'],
      ] },
      { label: 'State and records', tools: [
        ['Google Sheets', 'The state store when the client has to be able to read it: each record carries its own stage, sequence position and timing.'],
        ['PostgreSQL', 'Where a sheet stops: the single SQL condition that decides which follow-up is due, and the search an assistant answers from.'],
        ['Google Drive', 'Documents filed to the right folder, and watched so that only what has changed is read again.'],
      ] },
      { label: 'Messages and alerts', tools: [
        ['Gmail', 'Threaded sends and reply detection, so a sequence stops by itself the moment someone answers.'],
        ['Slack', 'Approvals as signed, one-time callbacks, and an alert when spend or call volume looks wrong.'],
        ['Telegram', 'Escalations to a person, with the order’s context already attached.'],
        ['Twilio', 'SMS sent only with consent, and a booking link by text inside a minute of a missed call.'],
      ] },
      { label: 'Models in the workflow', tools: [
        ['OpenAI', 'Classification and extraction into locked schemas, so that no branch depends on parsing free text.'],
        ['Google Gemini', 'Replies drafted from data the CRM has confirmed, while the gates around the model decide what happens.'],
      ] },
      { label: 'Lead sourcing and browser automation', tools: [
        ['Apify', 'Discovery runs that are polled until they finish. A failed or partial scrape never reaches the CRM.'],
        ['Skyvern', 'A browser agent for the one step a vendor leaves without an API.'],
      ] },
    ],
    also: ['Make', 'Zapier', 'Microsoft Power Automate', 'Pipedream', 'IFTTT', 'Pabbly Connect', 'Node-RED', 'Activepieces', 'Apache Airflow', 'Workato'],
    projects: [
      ['lead-to-cash-crm', 'Eight lead sources call one hub, the only workflow allowed to write a lead. The stage is stamped before any follow-up fires, so nothing runs twice.',
        ['8 sources', 'only workflow allowed to write to the leads tab', 'last routed stage is stamped before downstream actions fire']],
      ['aesthetics-voice-agent', 'The orchestration around the voice agents: details sent while the caller is still on the phone, and every outcome written back to the CRM with no human transcription.',
        ['the details arrive while the caller is still on the phone', 'written back to the crm, with no human transcription']],
      ['shopify-support-automation', 'One Gmail trigger reads every support email. Five intents are resolved end to end against the real order, and anything else is escalated rather than guessed.',
        ['a single gmail trigger reads every support email', 'five intents are covered', 'escalate rather than guess']],
      ['lsa-lead-responder', 'New leads are polled every fifteen minutes and live conversations every five, and each lead’s last-answered message is tracked, so nothing is answered twice.',
        ['every fifteen minutes, and live conversations every five', 'no message is ever answered twice']],
      ['construction-lead-outreach', 'Discovery on Google Maps, a CRM in which each record carries its own schedule, and a four-step sequence, capped per run, that stops the moment someone replies.',
        ['finds construction businesses on google maps', 'a four-step sequence sends only what each record says is due, capped per run', 'the follow-ups stop by themselves']],
      ['labor-law-outreach', 'One four-hour cycle checks for replies and then sends what is due, so there is no window in which someone answers and is chased anyway.',
        ['every four hours', 'one cycle does both halves of the job']],
      ['linkedin-lead-pipeline', 'Keywords rotate so that every run covers new ground. A failed scrape takes its own path, and every profile is checked against the CRM before a row is written.',
        ['each run takes the next keyword in the set', 'an unsuccessful run goes down its own failure path', 'every url is checked against the existing crm before a row is written']],
      ['ai-front-desk', 'The workflows around a voice agent: overflow routing, the tools it has to call, booking, missed-call recovery and the write-back to the CRM.',
        ['inbound call router', 'agent tools & guardrails', 'missed call recovery', 'post-call write-back']],
      ['invoice-document-intake', 'From a mailbox to Xero: each invoice classified, extracted, arithmetic-checked, matched to a purchase order, and checked for a duplicate immediately before it is posted.',
        ['the mailbox is watched', 'line items plus tax must equal the stated total', 'candidate pos are scored', 'immediately before the bill is created']],
      ['knowledge-assistant', 'Ingestion that re-indexes only what has changed, every six hours, and a weekly digest of the questions it could not answer.',
        ['every six hours drive is checked for changed or deleted files, and only those are re-indexed', 'unanswered questions become a weekly digest']],
      ['client-onboarding-pipeline', 'Contract, signature, payment and provisioning, each done exactly once: Stripe’s event id is recorded before anything is created.',
        ['provisioned exactly once', 'event id is recorded before anything is provisioned']],
      ['weekly-ops-report', 'Five sources pulled separately, so one outage cannot block the rest, then upserted into one row a week in a sheet the client owns.',
        ['pull five sources', 'each pulled on its own, so one outage cannot block the rest', 'the week is upserted into a sheet the client owns']],
      ['content-repurposing-line', 'One recording becomes drafts for each platform, and the graph has exactly one path to publishing: through a person’s approval.',
        ['exactly one path to publishing', 'a backwards walk from the publish node returns exactly one path']],
      ['crm-rebuild-migration', 'A migration that runs dry by default and reserves a rollback row before each record is created, then routing and follow-up rebuilt on the new model.',
        ['dry-run flag on by default', 'each rollback row is reserved before its record is created', 'routing and follow-up rebuilt on top']],
    ],
    book: {
      h: 'Have a process that still runs by hand?',
      p: 'Book a call and walk me through it. I will tell you which steps a system should own, and which should stay with a person.',
      q: 'What should be automated?',
      ph: 'The task, how often it happens, and the tools it touches. For example: every new web lead is copied into the CRM by hand, then sent a quote.',
      subject: 'Appointment: AI automation',
    },
  },

  /* ================================================================ */
  {
    slug: 'voice-chat-agents', n: 2, title: 'Voice & Chat Agents', card: 'Voice &amp; Chat Agents',
    lede: 'Agents that answer the phone or the message, qualify and book, inbound and outbound. What must not go wrong is decided in code: eligibility, prices and bookings are re-checked outside the model.',
    description: () => 'Voice and chat agents by Syed Ali Hamad Gilani: agents that answer, qualify and book, with eligibility, prices and bookings re-checked in code.',
    stack: [
      { label: 'Voice', tools: [
        ['ElevenLabs', 'Outbound voice agents, one for each course, so that mislabelling a course is structurally impossible rather than merely unlikely.'],
        ['GoHighLevel', 'The CRM’s own voice AI answers inbound calls with the contact record in front of it: it knows who is calling.'],
        ['Twilio', 'Telephony around the agent: the business’s own line rings first, and the agent takes only what a person could not.'],
      ] },
      { label: 'Messaging', tools: [
        ['Google Gemini', 'Drafts each reply and reads the customer’s intent, choosing only from slots that have been confirmed.'],
        ['Skyvern', 'Sends the reply inside Google’s own thread, the only route Google leaves open.'],
        ['Slack', 'Questions asked and answered where the team already works. The assistant ignores its own messages.'],
        ['OpenAI', 'Answers and call summaries, held to what is in the documents or the transcript.'],
      ] },
      { label: 'Guardrails and records', tools: [
        ['n8n', 'Everything around the agent: routing, the tools it has to call, the escalation rules and the write-back.'],
        ['HouseCall Pro', 'Real technician availability before a slot is offered, and a job created only when everything is confirmed.'],
      ] },
    ],
    also: ['WhatsApp', 'Telegram', 'CallRail'],
    projects: [
      ['aesthetics-voice-agent', 'Inbound is answered by the CRM’s own voice AI, and outbound is dialled by one agent per course. Eligibility is re-checked in code and overrides the agent unless it is explicitly true.',
        ['native voice ai', 'one agent for each of four courses', 're-checks the eligibility flag and overrides the agent unless it is explicitly true']],
      ['lsa-lead-responder', 'A messaging agent for paid leads: it reads the conversation, offers only slots the field-service CRM has confirmed, and replies inside Google’s own thread.',
        ['choosing only from slots the crm confirmed', 'sends the reply the way a person would', 'replies inside google']],
      ['ai-front-desk', 'Takes the call nobody could. A price comes from a table or is not given, six triggers hand the call to a person, and a booking needs four confirmations and a re-check.',
        ['a price from the table, or none', 'six triggers', 'four confirmations, then a re-check']],
      ['knowledge-assistant', 'A chat assistant in Slack or a site widget that answers from the company’s own documents, quotes the passage it used, and refuses rather than inventing.',
        ['answers in slack or a site widget', 'quotes the passage it used, and refuses rather than inventing']],
    ],
    book: {
      h: 'Calls or messages going unanswered?',
      p: 'Book a call to go through who contacts you, what they ask for, and what an agent should and should not decide on its own.',
      q: 'What should the agent handle?',
      ph: 'Who calls or writes, what they usually want, and where bookings and customer records live today.',
      subject: 'Appointment: voice and chat agents',
    },
  },

  /* ================================================================ */
  {
    slug: 'llm-systems', n: 3, title: 'LLM Systems', card: 'LLM Systems',
    lede: 'Models put to work where the answer has to be right: structured outputs, retrieval that must quote its source, and guardrails written in code, so the model drafts and deterministic rules decide.',
    description: (c) => `LLM systems by Syed Ali Hamad Gilani: structured outputs, retrieval with citation checks and guardrails in code, across ${c.total} systems where rules decide.`,
    stack: [
      { label: 'Models', tools: [
        ['OpenAI', 'Classification, extraction and grading, each returning a structure that code can check.'],
        ['Google Gemini', 'Drafting and intent reading, from data that code has already confirmed.'],
      ] },
      { label: 'Retrieval', tools: [
        ['Supabase', 'The store an assistant answers from: chunks, embeddings and documents in a database the client owns.'],
        ['PostgreSQL', 'Similarity search with the permission filter inside the SQL, so a restricted document cannot leak through a prompt.'],
        ['Google Drive', 'The source documents, checked every six hours. Only what has changed is embedded again.'],
      ] },
      { label: 'Speech', tools: [
        ['AssemblyAI', 'Transcription into one timestamped transcript that every later step works from.'],
        ['ElevenLabs', 'Voice agents, with everything they may not decide alone placed behind a tool they have to call.'],
      ] },
      { label: 'Rules around the model', tools: [
        ['n8n', 'The gates: if, switch and filter nodes that decide whether anything happens next.'],
        ['TypeScript', 'Typed edit operations from a closed vocabulary. A change outside it is not something the model can express.'],
      ] },
    ],
    also: ['LangChain', 'Ollama', 'Python', 'FastAPI'],
    projects: [
      ['lead-to-cash-crm', 'The model drafts and never sends. On the staff dashboard the rules-based score stays in charge, and the model writes its own column beside it.',
        ['the ai drafts and never sends', 'the rules-based score stays in charge and the model writes its own column beside it']],
      ['aesthetics-voice-agent', 'Eligibility is re-checked in the orchestration layer and overrides the agent unless the flag is explicitly true: the model proposes, a check decides.',
        ['re-checks the eligibility flag and overrides the agent unless it is explicitly true']],
      ['shopify-support-automation', 'Five agents, five structured output parsers: every model call returns a locked schema, so no branch depends on parsing free text.',
        ['five agents, five structured output parsers', 'no branch depends on parsing free text']],
      ['lsa-lead-responder', 'Gemini drafts the reply and reads intent. Ten if nodes stand against four model calls, and nothing written in a prompt can book a job.',
        ['ten if nodes against four model calls', 'nothing they write there can book a job']],
      ['adwash', 'Campaigns pass a generator, an adversarial critic, a deterministic strength gate and a grounding audit. AI edits are typed operations from a closed vocabulary.',
        ['a generator, an adversarial critic, a deterministic strength gate and a grounding audit', 'operations from a closed vocabulary']],
      ['just-grade-metrics', 'Every score must quote the transcript. A validator confirms that the quote is there verbatim, and if it is not, the call is held back for a person.',
        ['every score must quote the transcript', 'a validator confirms each quote appears verbatim']],
      ['ai-front-desk', 'A price comes from a configured table, or the agent says it will not guess. Six triggers are matched in code against the running transcript, every turn.',
        ['a price comes from a configured table, or the agent says out loud that it will not guess', 'six triggers, every turn', 'matched against the running transcript']],
      ['invoice-document-intake', 'Extraction into a schema the model cannot bend, then arithmetic in code: line items plus tax must equal the stated total, or nothing posts.',
        ['into a schema the model cannot bend', 'line items plus tax must equal the stated total, within two cents, or nothing posts']],
      ['knowledge-assistant', 'The permission filter runs inside the search itself, and an answer must quote a passage that is a literal substring of what was retrieved, or it is refused.',
        ['the permission filter runs inside the sql search itself', 'literal substring of a retrieved chunk']],
      ['weekly-ops-report', 'Every ratio is computed in code and shown with its working. The model that writes the narrative has no tools connected: it can phrase a number, not produce one.',
        ['every ratio is computed upstream and shown with its working', 'it can phrase a number; it cannot produce one']],
      ['content-repurposing-line', 'The model only picks from windows already cut from the transcript, banned words are matched in code, and a person approves every draft.',
        ['the model only picks window ids', 'banned words match on word boundaries', 'nothing publishes without a tap']],
    ],
    book: {
      h: 'Need a model you can trust in production?',
      p: 'Book a call to go through what the model should read and produce, and which decisions must never be left to it.',
      q: 'What should the model do?',
      ph: 'What it would read, what it should produce, and what would go wrong if it were confidently mistaken.',
      subject: 'Appointment: LLM systems',
    },
  },

  /* ================================================================ */
  {
    slug: 'web-development', n: 4, title: 'Web Development', card: 'Web Development',
    noun: ['project', 'projects'],
    lede: 'Sites and web applications built by hand on Next.js, React and Node: fast, accessible and maintainable, with no page builders and no plugin sprawl.',
    description: () => 'Web development by Syed Ali Hamad Gilani: sites and applications on Next.js, React and TypeScript, from live multi-tenant platforms to this zero-JavaScript site.',
    stack: [
      { label: 'Framework and language', tools: [
        ['Next.js', 'App Router applications, from the public pages to the authenticated product, in one codebase.'],
        ['React', 'Interfaces for the people who run the system: dashboards, review queues and screens that differ by role.'],
        ['TypeScript', 'One language from the API routes to the screen: 45,148 lines of it in one product, counted on 2026-09-08.', { adwash: ['45,148 lines of typescript', 'counted 2026-09-08'] }],
      ] },
      { label: 'Styling and static sites', tools: [
        ['Tailwind CSS', 'Consistent, responsive interfaces, with no bespoke stylesheet to maintain.'],
        ['Astro', 'Static sites that ship no JavaScript. This one is built with it.'],
      ] },
      { label: 'Data behind the pages', tools: [
        ['PostgreSQL', 'The database behind both platforms. In one of them, row-level security decides what each role can read.', { 'just-grade-metrics': ['row-level security'] }],
        ['Prisma', 'Schema, migrations and typed queries: 21 models and 27 migrations in one product.', { adwash: ['21 prisma models', '27 migrations'] }],
        ['Supabase', 'Postgres with row-level security, and edge functions that keep the model’s key off the web server.', { 'just-grade-metrics': ['all model access lives in edge functions'] }],
      ] },
    ],
    also: ['JavaScript', 'Vite', 'Node.js', 'Express', 'Flask'],
    projects: [
      ['adwash', 'A Next.js application in TypeScript: 63 API routes and 27 pages in one codebase, counted from the repository on 2026-09-08.',
        ['63 api routes', '27 pages', 'counted 2026-09-08']],
      ['just-grade-metrics', 'Four role-based surfaces on one multi-tenant product. An agent sees their own calls and can contest a grade, and never sees a colleague’s.',
        ['four role-based surfaces', 'an agent sees their own calls and can contest a grade', 'cross-tenant']],
    ],
    /* not a system in the register: the site itself, which the card's picture
       draws. Its one figure ("0 KB JavaScript"; the old Web Development picture printed it too, until 2026-10-06),
       held by the zero-JavaScript check that CLAUDE.md runs on every build. */
    self: {
      name: 'This site', sub: 'syedalihamadgilani.site · static, built with Astro',
      line: 'It ships no JavaScript: every effect is CSS, and every word is in the HTML from the first paint.',
      fig: '0 KB JavaScript', src: 'measured on the built pages', tools: ['Astro'], texts: ['CSS'],
    },
    book: {
      h: 'Need a site or an application built?',
      p: 'Book a call to talk through what it is for, who will use it, and what it has to connect to.',
      q: 'What are you building?',
      ph: 'What it is for, who will use it, and anything it has to integrate with.',
      subject: 'Appointment: web development',
    },
  },

  /* ================================================================ */
  {
    slug: 'platform-engineering', n: 5, title: 'Platform Engineering', card: 'Platform Engineering',
    noun: ['platform', 'platforms'],
    lede: 'Multi-tenant products built end to end as the sole engineer: accounts and roles, plans and billing, job queues, and isolation enforced by the database rather than by the interface.',
    description: (c) => `Platform engineering by Syed Ali Hamad Gilani: ${c.word} live multi-tenant products built end to end, with row-level security, job queues, plans and billing.`,
    stack: [
      { label: 'Data and isolation', tools: [
        ['PostgreSQL', 'Row-level security, so a query for another tenant’s data is refused by the database itself, and a job queue with claim, retry and dead-letter semantics.',
          { 'just-grade-metrics': ['refused by the database', 'a postgres job queue with claim, retry and dead-letter semantics'] }],
        ['Supabase', 'Postgres, its policies and edge functions. The model’s key lives in an edge function, never on the web server.',
          { 'just-grade-metrics': ['the model’s key is never on the web server'] }],
        ['Prisma', 'The schema as code: 21 models and 27 migrations in one product, counted on 2026-09-08.', { adwash: ['21 prisma models', '27 migrations', 'counted 2026-09-08'] }],
      ] },
      { label: 'Application', tools: [
        ['Next.js', 'The product itself, from the public pages to the authenticated screens, in one codebase.'],
        ['TypeScript', 'One language across the API routes, the background work and the interface.'],
      ] },
      { label: 'Billing and the outside world', tools: [
        ['Stripe', 'Subscription plans, each carrying the limits that the product enforces.', { adwash: ['campaigns pause at the plan'] }],
        ['Google Ads', 'A production API integration: spend is ingested from it, and every mutation is validate-only unless a flag says otherwise.',
          { adwash: ['real spend is ingested from the google ads api', 'every google ads mutation is validate-only'] }],
      ] },
    ],
    also: ['Node.js', 'Docker', 'NGINX', 'GitHub'],
    projects: [
      ['adwash', 'Built as its only engineer: a multi-tenant product whose plans hold real spend to a ceiling, whose automation can undo itself, and whose deploys assert their own outcome.',
        ['as its only engineer', 'multi-tenant', 'campaigns pause at the plan', 'the automation can undo itself', 'deploys assert their own outcome']],
      ['just-grade-metrics', 'Row-level security on 31 tables, tested by attempting cross-tenant reads, and a Postgres job queue with claim, retry and dead-letter semantics.',
        ['row-level security on 31 tables', 'tested by attempting cross-tenant reads', 'a postgres job queue with claim, retry and dead-letter semantics']],
    ],
    book: {
      h: 'Building a product with accounts and billing?',
      p: 'Book a call to go through tenants, roles and plans, and what already exists.',
      q: 'What is the product?',
      ph: 'Who the customers are, what they pay for, what each role should see, and what exists today.',
      subject: 'Appointment: platform engineering',
    },
  },

  /* ================================================================ */
  {
    slug: 'crm-api-integration', n: 6, title: 'CRM & API Integration', card: 'CRM &amp; API Integration',
    lede: 'Systems that were never designed to talk to each other, made to do exactly that: CRMs, ad platforms, payment and accounting systems, with a defined behaviour for the moment one of them fails.',
    description: (c) => `CRM and API integration by Syed Ali Hamad Gilani: CRMs, ad platforms, payments and accounting connected across ${c.total} systems, each with defined failure behaviour.`,
    stack: [
      { label: 'CRM and field service', tools: [
        ['HubSpot', 'A migration with a dry run and a rollback log, and deals read for the weekly numbers.'],
        ['GoHighLevel', 'The CRM behind a voice system: the contact records an inbound agent reads, and the call outcomes written back.'],
        ['HouseCall Pro', 'Availability read before a slot is offered, jobs created only when everything is confirmed, and booked jobs matched back to the click.'],
      ] },
      { label: 'Ads and attribution', tools: [
        ['Google Ads', 'Local Services leads read by API, won jobs returned as offline conversions, and mutations that are validate-only by default.'],
        ['Meta', 'Won jobs returned as offline conversions, and spend pulled for the weekly number.'],
        ['CallRail', 'Tracked calls, as a lead source and as a weekly volume to watch.'],
      ] },
      { label: 'Commerce, payments and accounts', tools: [
        ['Shopify', 'Orders read, checked and changed only after the customer has been matched to the real order.'],
        ['Stripe', 'Signed webhooks that survive key rotation, with each event id claimed before anything is provisioned.'],
        ['Xero', 'Bills posted once: the ledger is searched for the same supplier and invoice number immediately before the write.'],
        ['PandaDoc', 'Contracts generated from the deal’s real values and sent for signature exactly once.'],
      ] },
      { label: 'The connective layer', tools: [
        ['n8n', 'Webhooks, schedules and sub-workflows between the systems, with one hub that every source has to call.'],
        ['Twilio', 'Calls and SMS tied to the CRM: a person’s line rings first, and a texted STOP is written back.'],
        ['Gmail', 'Mail through the API: replies sent with their threading headers, inside the customer’s own thread.'],
        ['Google Sheets', 'A CRM the client can read, in which the appended row itself decides the lead’s reference.'],
      ] },
    ],
    also: ['Airtable', 'Notion', 'Google Calendar', 'WhatsApp'],
    projects: [
      ['lead-to-cash-crm', 'Eight lead sources into one hub, and won jobs pushed back to Google Ads and Meta as offline conversions.',
        ['eight lead sources into one hub', 'offline conversions']],
      ['aesthetics-voice-agent', 'Two vendor platforms around one CRM. Every call outcome is written back, and every change to a live agent is backed up, written dry, then re-fetched and compared field by field.',
        ['vendor platforms', 'its outcome is written back to the crm', 'backed up, written dry by default, then re-fetched and compared field by field']],
      ['shopify-support-automation', 'Every action is checked against the real Shopify order first, and a replacement is created only after the order is re-fetched and re-checked.',
        ['must match the name on the shopify order before anything else happens', 'created only after the original order is re-fetched and re-checked']],
      ['lsa-lead-responder', 'The Google Ads API for the leads, HouseCall Pro for real availability, and a browser agent for the one step Google leaves without an API.',
        ['pulled from the google ads api', 'the next seven days come from housecall pro', 'google leaves no api route for replies']],
      ['adwash', 'Production reads and writes against the Google Ads API, where a failed read is never treated as an empty result, and a two-way sync with HouseCall Pro and ServiceTitan.',
        ['a failed read is not an empty result', 'two-way sync with housecall pro and servicetitan']],
      ['ai-front-desk', 'Twilio, the voice agent and HouseCall Pro joined by webhooks: the slot is checked again before the job is created, and every call is summarised into the CRM.',
        ['tool webhook', 'then the slot is checked again, and only then is the job created', 'every call is summarised into the crm']],
      ['invoice-document-intake', 'Bills posted to Xero once: the ledger is searched for the same supplier and invoice number immediately before the write. Approvals arrive as signed Slack callbacks.',
        ['the ledger is searched for the same supplier and invoice number immediately before the bill is created', 'the webhook checks slack']],
      ['client-onboarding-pipeline', 'PandaDoc, Stripe, Drive and Slack joined by signed webhooks. A second delivery of the same Stripe event exits as already done.',
        ['a signed webhook', 'a second delivery of the same event exits as already done']],
      ['weekly-ops-report', 'Google Ads, Meta, HubSpot, Stripe and CallRail reconciled into one row a week, with leads and bookings counted from the CRM alone.',
        ['google ads, meta, the crm, stripe and callrail', 'hubspot-shaped', 'leads and bookings come from the crm']],
      ['crm-rebuild-migration', 'A HubSpot migration whose dry run shows the exact payload it would write, with a rollback row reserved before each record is created, and intake that normalises exactly as the migration does.',
        ['the destination is hubspot', 'emits the exact payload it would write', 'each rollback row is reserved before its record is created', 'intake normalises exactly like the migration']],
    ],
    book: {
      h: 'Systems that should be talking to each other?',
      p: 'Book a call to go through what should move between them, and what should happen when one of them fails.',
      q: 'Which systems need connecting?',
      ph: 'The tools involved, what should move between them, and what goes wrong today.',
      subject: 'Appointment: CRM and API integration',
    },
  },
];

/* Tools in a stack that are not in the tool list of a project on that page,
   and where each was used. page.js asserts what it can of these. */
export const EVIDENCE = {
  /* the n8n Code nodes: counted, per page, from src/systems/graphs.json */
  'JavaScript': 'code-nodes',
  /* Next.js is React: both platforms */
  'React': ['Next.js'],
  /* AdWash's and Just Grade Metrics' package.json (src/pictures/cluster.js,
     read 2026-09-29), so it stands wherever both platforms are listed */
  'Tailwind CSS': ['adwash', 'just-grade-metrics'],
  /* this site: its own package.json, which page.js reads */
  'Astro': 'package.json',
};
