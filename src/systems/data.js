/* data.js — what the fifteen system pages say (2026-09-30).

   Syed: "Why is there only one page for the project, just for the lead to
   crm. Make the pages for each and every project." Until then only the
   Lead-to-Cash CRM had a page; every other row on /work/ linked to itself.

   Every sentence here is drawn from the system's own write-up, and nothing
   else: catalog/delivered/<slug>/README.md for the nine delivered systems,
   catalog/systems/<slug>/README.md for the seven built ones, and the entry in
   catalog/catalog.mjs. Those files are private (they sit beside client
   names), so the words are carried here; if a write-up changes, change this.
   Three rules came with them and hold here:
     - no figure that was not counted, measured or attributed. The node,
       workflow, note and connection counts are not typed here at all: page.js
       counts them from graphs.json (scripts/extract-systems.mjs), which is
       counted from the JSON. A system with no export shows none.
     - a built system is not a delivered one. Each says what is proven (the
       workflows import clean) and what is not (a run against live accounts).
     - where a write-up says something is not built — clip rendering, OCR,
       WhatsApp, QuickBooks — the page says so, and the tool is not listed.
       (The register's rows, ported from the approved design, still list some
       of those; see HANDOFF.)

   Clients stay unnamed, as everywhere on the site. Endpoint paths, keys and
   access details are absent by design.

   Fields: n is the catalogue number, the order of the register's "next
   system" links. steps drive the scroll sequence ("How it runs"): t is the
   step's name on the rail, lede what happens, wf the workflow it lives in
   (its node count is read from the JSON), exit where a failure goes. */

export const GROUPS = {
  lead: 'Lead & Sales', voice: 'Voice & Phone', support: 'Customer Support', backoffice: 'Back Office',
  content: 'Marketing & Content', data: 'Data & Reporting', product: 'Product',
};

export const SYSTEMS = [
  /* ================================================================ */
  {
    slug: 'aesthetics-voice-agent', n: 2, group: 'voice',
    name: 'AI Voice Agent System for a Training Academy',
    seoTitle: 'AI Voice Agents for a Training Academy',
    sub: 'Medical aesthetics training · London',
    prov: 'delivered', source: 'reported',
    figs: [['5', 'agents'], ['2', 'vendor platforms'], ['12', 'automations']],
    description: 'Delivered: five AI voice agents for a London training academy, on ElevenLabs and GoHighLevel, with eligibility re-checked in code. Figures are client-reported.',
    problem: [
      'An agent that improvises a price, or tells an unqualified caller they are eligible, creates a compliance problem — not just a bad call.',
      'The academy sells five training programmes, including Ofqual-regulated qualifications with fixed fees and strict entry requirements. Inbound calls went unanswered outside office hours, thousands of CRM records were never called at all, and follow-up depended on someone remembering to send the details later.',
    ],
    steps: [
      { t: 'Answer inbound', g: 'phone', lede: 'Inbound calls are answered by the CRM’s native voice AI, which has direct access to the contact records — it knows who is calling.', meta: 'inbound · the CRM’s own voice AI' },
      { t: 'Dial by course', g: 'split', lede: 'Outbound calls run on ElevenLabs, with one agent for each of four courses: the agent dialling for one course has no representation of the others.', meta: 'outbound · ElevenLabs · four agents' },
      { t: 'Re-check eligibility', g: 'shield', lede: 'The orchestration layer re-checks the eligibility flag and overrides the agent unless it is explicitly true.', meta: 'in code, not in the prompt', exit: 'not explicitly true → no advanced booking link' },
      { t: 'Send details mid-call', g: 'message', lede: 'Follow-up messages fire during the call, so the details arrive while the caller is still on the phone.', meta: 'while the call is live' },
      { t: 'Write it back', g: 'db', lede: 'When the call ends, its outcome is written back to the CRM, with no human transcription.', meta: 'post-call · the only thing that path does' },
    ],
    guards: [
      { t: 'Eligibility is decided in code', g: 'shield', d: 'A model slip cannot send an advanced booking link to a beginner. For a regulated qualification that is the difference between a bad call and a compliance incident.' },
      { t: 'One outbound agent per course', g: 'split', d: 'A single agent would have to decide which course a call is about, inside a language model. Four agents make mislabelling a course structurally impossible rather than merely unlikely.' },
      { t: 'Details arrive during the call', g: 'message', d: 'Sending them afterwards means a queue, and a queue means a caller who was promised something and never received it.' },
      { t: 'A live change must prove it changed nothing else', g: 'diff', d: 'Every change to a live agent is backed up, written dry by default, then re-fetched and compared field by field. It has caught two silent regressions a status-200 check would have passed — one nulled the text-to-speech model across all 33 language presets.' },
    ],
    limits: [
      'The figures are the client’s own. No workflow export was supplied, so nothing on this page was counted independently.',
      'Two vendor platforms mean two sets of changes that can break a live system. Each was chosen on its merits, and the diff before every deployment exists because vendors do change things silently.',
      'The eligibility rules are this academy’s entry requirements. Another academy’s rules are different rules, and re-scoping that check is real work, not configuration.',
    ],
    tools: ['ElevenLabs', 'GoHighLevel', 'n8n', 'Twilio', 'WhatsApp'],
  },

  /* ================================================================ */
  {
    slug: 'shopify-support-automation', n: 3, group: 'support',
    name: 'Shopify Support Inbox, Handled End to End',
    seoTitle: 'Shopify Support Automation in n8n',
    sub: 'E-commerce · Shopify store',
    prov: 'delivered', source: 'export', mini: 4,
    extraFigs: [['5', 'intents resolved end to end']],
    flows: [
      ['Intent — Order Status', '“where is my order”, fanned out over tags, fulfilment, days since shipping and carrier status'],
      ['Intent — Damage Claim', 'evidence, then a replacement'],
      ['Intent — Address Change', 'changing an order that may already be moving'],
      ['Intent — Missing Tracking', 'not shipped, or shipped and lost'],
      ['Main — Classify & Route', 'the single entry point: read the mail, classify it, route it'],
      ['Intent — Other', 'escalate rather than guess'],
    ],
    description: 'Delivered: n8n and OpenAI read every Shopify support email, check the real order, then answer, update, replace or escalate. Six workflows, 158 nodes, counted.',
    problem: [
      'Where is my order. I never got tracking. My item arrived broken. I entered the wrong address.',
      'A store buried in repetitive support email, all of it handled by hand — and all of it answerable from data the store already has.',
    ],
    steps: [
      { t: 'One way in', g: 'mail', wf: 4, lede: 'A single Gmail trigger reads every support email, checking labels across the whole thread rather than the one message.' },
      { t: 'Classify', g: 'spark', lede: 'An OpenAI classifier with a locked output schema names what the customer wants and routes the email to its specialist.', meta: 'five agents, five structured output parsers' },
      { t: 'Verify the customer', g: 'user', lede: 'In every branch, the name on the email must match the name on the Shopify order before anything else happens.', exit: 'no match → a person' },
      { t: 'Resolve', g: 'route', wf: 0, lede: 'Order Status alone chooses between seven routes — including a parcel with no carrier scan for five days or more.' },
      { t: 'Replace, once', g: 'box', wf: 1, lede: 'A replacement is a fully discounted draft order, created only after the original order is re-fetched and re-checked.' },
      { t: 'Reply in the thread', g: 'send', lede: 'Each reply waits fifteen minutes, then goes out as raw MIME with its threading headers, inside the customer’s own thread.', meta: '14 wait nodes' },
      { t: 'Escalate with context', g: 'bell', wf: 5, lede: 'Anything that needs judgement goes to a person on Telegram, with the order context already attached.', meta: '18 Telegram nodes' },
    ],
    guards: [
      { t: 'Identity before action', g: 'user', d: 'Support automation that acts on an unverified claim is an account-takeover vector, not a convenience. Every branch checks the name against the real order first.' },
      { t: 'A replacement cannot be issued twice', g: 'box', d: 'Checking at the start of a workflow and acting at the end is a race. Re-reading the order at the moment of the write is what closes it.' },
      { t: 'Replies are held, then threaded', g: 'clock', d: 'A support reply that arrives in four seconds tells the customer a machine answered, whatever the text says. The 14 wait nodes are that decision, made visible.' },
      { t: 'The trigger reads the whole thread', g: 'mail', d: 'A customer replying deep in an existing conversation is still caught, and sent mail and drafts are never treated as new support.' },
      { t: 'Every model call returns a locked schema', g: 'spark', d: 'Five agents, five structured output parsers: no branch depends on parsing free text.' },
      { t: 'Where the answer is unknowable, it stays small', g: 'route', d: 'Order Status is 48 nodes because the answer is knowable. Other is 5: it recognises that it does not know, and hands over.' },
    ],
    limits: [
      'Five intents are covered and everything else goes to a person. How much of an inbox falls into those five decides how much is automated, and it is worth measuring per store.',
      'The stalled-parcel rule keys on days since the last carrier scan, so it is only as good as what the carrier reports.',
      'Endpoint paths, credentials and access details are deliberately absent: this is a client’s live production system.',
    ],
    tools: ['n8n', 'OpenAI', 'Shopify', 'Gmail', 'Telegram'],
  },

  /* ================================================================ */
  {
    slug: 'lsa-lead-responder', n: 4, group: 'lead', sector: true,
    name: 'Google Local Services Ads Lead Responder',
    seoTitle: 'Google Local Services Ads Responder',
    sub: 'Home services',
    prov: 'delivered', source: 'export', mini: 0,
    flows: [
      ['Active Leads', 'the main responder: conversation state, availability, booking'],
      ['New Leads', 'the first reply to a lead nobody has answered yet'],
      ['Trigger For New Leads', 'polls every 15 minutes'],
      ['Trigger For Active Leads', 'polls every 5 minutes'],
    ],
    description: 'Delivered: answers paid Google Local Services Ads leads in minutes, offers only real Housecall Pro slots and replies inside Google’s thread. 63 nodes, counted.',
    problem: [
      'Contractors lose paid Local Services leads for one reason: nobody replies fast enough.',
      'The lead is already bought and already interested. Every minute it sits unanswered, the customer works down the list Google gave them.',
    ],
    steps: [
      { t: 'Poll', g: 'clock', lede: 'New leads are pulled from the Google Ads API every fifteen minutes, and live conversations every five.', meta: 'two schedules, two rates' },
      { t: 'Read the conversation', g: 'hash', lede: 'Each lead is tracked by its ID and its last-answered message, so no message is ever answered twice.' },
      { t: 'Build real slots', g: 'calendar', wf: 0, lede: 'The next seven days come from Housecall Pro and become two-hour slots inside working hours, with weekends and booked times removed.' },
      { t: 'Draft the reply', g: 'spark', lede: 'Google Gemini drafts the reply and reads the customer’s intent, choosing only from slots the CRM confirmed.', meta: 'four Gemini nodes' },
      { t: 'Send inside Google’s thread', g: 'browser', lede: 'Google exposes these conversations as read-only data, so a Skyvern browser agent signs in and sends the reply the way a person would.', meta: 'the only route Google leaves open' },
      { t: 'Commit, then book', g: 'shield', lede: 'A job is created only when the time, the booking, the address and the technician are all confirmed.', exit: 'anything missing → no job' },
    ],
    guards: [
      { t: 'Availability is real, not claimed', g: 'calendar', d: 'The agent cannot offer a slot that does not exist: it only ever chooses from slots the field-service CRM confirmed.' },
      { t: 'Four confirmations before a booking', g: 'shield', d: 'Time confirmed, booking accepted, address given, technician agreed — all four, or nothing is created. An enthusiastic model cannot produce a job on its own.' },
      { t: 'No message answered twice', g: 'hash', d: 'On a five-minute poll against a conversation, that is the difference between a responsive business and one that appears to be malfunctioning.' },
      { t: 'Replies stay in the official thread', g: 'browser', d: 'Replies sent elsewhere do not count towards the LSA response-time metric — the number the whole system exists to move.' },
      { t: 'Two poll rates, not one', g: 'clock', d: 'A customer who has just replied is mid-conversation, so live threads are checked three times as often as new leads: a fifteen-minute gap there reads as being ignored.' },
      { t: 'The guards are in the gates, not the prose', g: 'route', d: 'Ten if nodes against four model calls. The prompts carry a note inviting the client to edit the tone; nothing they write there can book a job.' },
    ],
    limits: [
      'Sending depends on browser automation, because Google leaves no API route for replies. An interface change can break sending in a way an API contract would not.',
      'Two of the four workflows are schedule triggers held on standby: the responders can also be driven directly.',
      'Endpoint paths, credentials and access details are deliberately absent: this is a client’s live production system.',
    ],
    tools: ['n8n', 'Google Ads', 'Google Gemini', 'Skyvern', 'Housecall Pro', 'Google Sheets'],
  },

  /* ================================================================ */
  {
    slug: 'construction-lead-outreach', n: 5, group: 'lead', sector: true,
    name: 'Construction Lead Generation & Email Outreach',
    seoTitle: 'Construction Lead Generation & Outreach',
    sub: 'Construction · outbound',
    prov: 'delivered', source: 'none',
    description: 'Delivered: n8n and Apify find construction businesses on Google Maps, then a four-step Gmail sequence, capped per run, stops itself when someone replies.',
    problem: [
      'Outbound that depends on a person remembering who got which email, and who is due a follow-up.',
      'The state lives in someone’s head, so it degrades the moment they are busy — and busy is the normal condition of whoever owns outbound at a contracting business.',
    ],
    steps: [
      { t: 'Target from a sheet', g: 'sheet', lede: 'Search parameters live in Google Sheets and pass into an Apify job that finds construction businesses on Google Maps.' },
      { t: 'Finish the scrape', g: 'loop', lede: 'Each run is captured, waited on and checked; only a finished dataset is processed.' },
      { t: 'Keep a real CRM', g: 'db', lede: 'Qualified prospects land in a structured CRM, each record carrying its own sequence position, email status and timing.' },
      { t: 'Send what is due', g: 'send', lede: 'A four-step sequence sends only what each record says is due, capped per run.' },
      { t: 'Stop on a reply', g: 'stop', lede: 'Every message is tied to its Gmail thread, so a reply is matched to its prospect and the follow-ups stop by themselves.' },
    ],
    guards: [
      { t: 'A reply stops the sequence', g: 'stop', d: 'Chasing someone who has already answered is what gets a sender marked as spam, and why manual outbound quietly stops working.' },
      { t: 'Sends are capped per run', g: 'filter', d: 'A scheduled run that clears a backlog in one burst is a deliverability event: the domain gets flagged, and every email the business sends suffers.' },
      { t: 'A scrape is finished before it is used', g: 'loop', d: 'A discovery step that proceeds on an incomplete result writes a short list that looks exactly like a complete one.' },
      { t: 'The schedule comes from the record', g: 'db', d: 'What is due is derived from each prospect’s own state, not from when the job happened to run.' },
    ],
    limits: [
      'Throttling prevents self-inflicted spikes. It does nothing for domain reputation, authentication records or copy that reads like bulk mail.',
      'Discovery is only as good as the listings: map data carries stale entries and missing contacts.',
      'A prospect who answers from a different address is not matched.',
    ],
    tools: ['n8n', 'Apify', 'Google Sheets', 'Gmail'],
  },

  /* ================================================================ */
  {
    slug: 'labor-law-outreach', n: 6, group: 'lead',
    name: 'Labor Law Firm Outreach & Follow-Up',
    sub: 'Legal services · outbound',
    prov: 'delivered', source: 'none',
    description: 'Delivered for a labor law firm: every four hours, n8n checks Gmail for replies first, then sends only the follow-ups due, with each prospect’s state in a sheet.',
    problem: [
      'A prospect list, a four-step sequence and no reliable way to know who had replied.',
      'Follow-ups either stopped too early or — worse — kept arriving after someone had already answered. A prospect still being chased after replying forms a view of how the firm handles process.',
    ],
    steps: [
      { t: 'Every four hours', g: 'clock', lede: 'One cycle does both halves of the job, so there is no window between a reply and the next send.' },
      { t: 'Check for replies', g: 'mail', lede: 'Gmail threads are read for replies first; a reply updates the CRM and takes that prospect out of the sequence.' },
      { t: 'Work out what is due', g: 'list', lede: 'Each prospect’s next step is decided by where they are in the sequence, not by the calendar.' },
      { t: 'Fill the template', g: 'pen', lede: 'The message for that step is filled from the CRM: name, company, city and state.' },
      { t: 'Record it', g: 'sheet', lede: 'Sequence and email state are written back to the sheet, where the firm can see every prospect without opening the automation.' },
    ],
    guards: [
      { t: 'Replies are checked in the same cycle as sends', g: 'loop', d: 'Splitting them into separate schedules is what creates the window where someone replies and is chased anyway.' },
      { t: 'A reply ends the automation for that prospect', g: 'stop', d: 'Nobody has to notice and stop it by hand.' },
      { t: 'Position, not the calendar', g: 'list', d: 'A prospect who joined late gets step one, not whichever step the run happens to be on.' },
      { t: 'The state is legible to the client', g: 'eye', d: 'When a follow-up lands badly the question is never “is the logic correct”; it is “show me what it sent and to whom”. A system that can answer that survives.' },
    ],
    limits: [
      'A reply that arrives just after a cycle is seen up to four hours later — right for an email sequence, wrong for anything conversational.',
      'A reply from a different address, or from a colleague it was forwarded to, is not matched.',
      'A sheet as the state store is a deliberate trade-off: legible to the firm, but not a database. Concurrent edits and deleted rows are real risks, and the firm is told so.',
    ],
    tools: ['n8n', 'Google Sheets', 'Gmail'],
  },

  /* ================================================================ */
  {
    slug: 'linkedin-lead-pipeline', n: 7, group: 'lead',
    name: 'LinkedIn Lead Generation Pipeline',
    sub: 'B2B outbound',
    prov: 'delivered', source: 'none',
    description: 'Delivered: LinkedIn prospecting in n8n with rotating keywords, monitored Apify runs, two-provider email enrichment and deduplication against the CRM.',
    problem: [
      'Automated prospecting fails silently in two ways.',
      'It scrapes the same people on every scheduled run, so the list grows without the coverage growing — or it loses a prospect entirely because one enrichment provider had no email for them. Neither shows up as an error.',
    ],
    steps: [
      { t: 'Rotate the keywords', g: 'loop', lede: 'Targeting is read from Google Sheets, and each run takes the next keyword in the set, so successive runs cover different segments.' },
      { t: 'Discover', g: 'search', lede: 'Apify jobs, started from the workflow, find the profiles for the current keyword.' },
      { t: 'Watch the run', g: 'clock', lede: 'Each job is polled until it finishes; an unsuccessful run goes down its own failure path.', exit: 'failed run → failure path, not the CRM' },
      { t: 'Enrich, twice if needed', g: 'mail', lede: 'Profiles are enriched one at a time; when the first provider has no email, a second, independent one tries the same URL.' },
      { t: 'Dedupe, then write', g: 'hash', lede: 'Every URL is checked against the existing CRM before a row is written, and a run with nothing new exits on its own path.' },
    ],
    guards: [
      { t: 'Every run covers new ground', g: 'loop', d: 'A scheduled job that repeats one search returns the same people every morning. The rotation is what makes the schedule worth having.' },
      { t: 'A failed scrape never reaches the CRM', g: 'stop', d: 'Without the failure path, the CRM step writes a partial result that looks exactly like a complete one.' },
      { t: '“No email” means two providers failed', g: 'mail', d: 'One provider is a single point of failure dressed up as a feature; two is a recovery layer.' },
      { t: 'Deduplication happens before the write', g: 'hash', d: 'Duplicates never enter the CRM, so nobody has to clean them out.' },
    ],
    limits: [
      'The match rate was never measured. Two providers improve coverage by design; by how much on a given list is unknown, so no percentage is quoted.',
      'The fallback runs on every profile the first provider misses, so the cost follows how good the first provider is on that list.',
      'Automated collection of profile data sits in a contested area of platform terms. That is a conversation to have before a build, not after.',
    ],
    tools: ['n8n', 'Apify', 'Google Search', 'Google Sheets'],
  },

  /* ================================================================ */
  {
    slug: 'adwash', n: 8, group: 'product',
    name: 'AdWash — Autonomous Google Ads Management',
    seoTitle: 'AdWash: Google Ads Automation SaaS',
    sub: 'Built at Yelu Marketing · live SaaS · adwash.ai',
    link: ['https://adwash.ai', 'adwash.ai'],
    prov: 'delivered', source: 'production',
    provLine: 'Delivered — measured against the live production database, 2026-09-04',
    figs: [['23', 'workspaces'], ['90', 'campaigns'], ['202', 'AI generations'], ['2,393', 'automation events'], ['~$234K', 'ad spend tracked']],
    extra: 'Codebase, counted 2026-09-08: 45,148 lines of TypeScript · 63 API routes · 27 pages · 21 Prisma models · 27 migrations.',
    description: 'AdWash, Yelu Marketing’s live multi-tenant SaaS, built by its only engineer: it writes Google Ads campaigns, bids on the weather and tracks ~$234K of ad spend.',
    problem: [
      'When a heat wave crosses 95°F, emergency AC searches spike within hours. A campaign adjusted next Tuesday has already missed it.',
      'A contractor spending $5–20K a month on Google Ads can hire an agency and receive a monthly PDF explaining last month, or run it themselves and lose their evenings. Neither reacts to what actually drives the demand.',
    ],
    steps: [
      { t: 'Write the campaign', g: 'pen', lede: 'A business profile becomes a complete Search campaign — ad groups, keywords, headlines, sitelinks, negatives — checked against Google’s own field limits.' },
      { t: 'Critique it', g: 'shield', lede: 'A generator, an adversarial critic, a deterministic strength gate and a grounding audit all run before anything reaches a real ad account.' },
      { t: 'Bid on the weather', g: 'weather', lede: 'Service areas are watched against live forecasts and classified per trade; budgets and bid modifiers move, then unwind when conditions normalise.' },
      { t: 'Hold spend to plan', g: 'card', lede: 'Real spend is ingested from the Google Ads API, and campaigns pause at the plan’s ceiling.' },
      { t: 'Suggest, and wait', g: 'bell', lede: 'Rules over performance data raise suggestions with a concrete action attached; nothing is applied without an opt-in.' },
      { t: 'Attribute revenue', g: 'target', lede: 'Two-way sync with Housecall Pro and ServiceTitan matches booked jobs back to the click that produced them.' },
    ],
    guards: [
      { t: 'A failed read is not an empty result', g: 'alert', d: 'A malformed query once reported “no campaigns exist”, and a caller archived 75 live campaigns on it. Success is now reported separately from results, and callers that write abort instead.' },
      { t: 'The automation can undo itself', g: 'undo', d: 'The weather engine keeps a ledger of its own writes and resets only values that still match what it put there. Anything a person has changed since is left alone.' },
      { t: 'AI edits are typed operations', g: 'lock', d: 'The model emits operations from a closed vocabulary, applied to a clone of the live plan. A deep comparison refuses the whole change if anything moved that no operation claimed.' },
      { t: 'Success requires evidence of work', g: 'check', d: 'A mutation that returns “ok” while matching nothing live is reported as a failure, not “Done”. Nobody investigates a cheerful success.' },
      { t: 'Writes are off by default', g: 'key', d: 'Without an explicit flag, every Google Ads mutation is validate-only, so a misconfigured environment cannot spend anyone’s money.' },
      { t: 'Deploys assert their own outcome', g: 'eye', d: 'The build ID is present, the restart counter advanced, the homepage returns 200 and an authenticated endpoint 401 — or the deploy exits non-zero.' },
    ],
    limits: [
      'AdWash is Yelu Marketing’s product, built in my employed role as its only engineer. The engineering is mine; the product is not.',
      'The headline numbers on adwash.ai — ROAS, time-to-live, the named testimonials — are promotional copy, not telemetry. None of them is on this page.',
      'Weather bidding is a forecast-driven heuristic, not a demand model. It does not predict revenue.',
      'Revenue attribution needs the CRM connected and the click ID to survive the journey. A call to a number that was never tracked cannot be matched.',
    ],
    tools: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Google Ads', 'Stripe'],
  },

  /* ================================================================ */
  {
    slug: 'just-grade-metrics', n: 9, group: 'product',
    name: 'Just Grade Metrics — AI Call Quality Assurance',
    seoTitle: 'Just Grade Metrics: AI Call-QA SaaS',
    sub: 'Built for a client · live SaaS · justgrademetrics.com',
    link: ['https://justgrademetrics.com', 'justgrademetrics.com'],
    prov: 'delivered', source: 'production',
    provLine: 'Delivered — measured against production, isolation tested by cross-tenant reads',
    figs: [['31', 'tables under row-level security'], ['~⅓', 'of real uploads held back for a person']],
    description: 'Just Grade Metrics, a live AI call-QA SaaS built under contract: every call graded against the customer’s scorecard, every score backed by a verbatim quote.',
    problem: [
      'Contact centres record every call, then score one or two per cent of them by hand.',
      'The sample is too small to be representative, scoring drifts between reviewers, and when an agent disputes a mark there is rarely anything to point at.',
    ],
    steps: [
      { t: 'Upload and queue', g: 'upload', lede: 'A recording is chunked and handed to a PostgreSQL job queue with claim, retry and dead-letter semantics — each stage a row.' },
      { t: 'Transcribe', g: 'wave', lede: 'Each chunk is transcribed and the transcript assembled with speakers attributed: exactly from dual-channel audio, inferred from mono.' },
      { t: 'Grade', g: 'check', lede: 'The call is graded against the tenant’s own scorecard, and every score must quote the transcript.' },
      { t: 'Check the quote', g: 'quote', lede: 'A validator confirms each quote appears verbatim; if it does not, the call is held back and routed to a person.', exit: 'quote not found → human review' },
      { t: 'Publish by role', g: 'users', lede: 'Scores appear on four role-based surfaces; an agent sees their own calls and can contest a grade — never a colleague’s.' },
    ],
    guards: [
      { t: 'No evidence, no score', g: 'quote', d: 'A QA score a supervisor cannot trace to something someone actually said is worthless in a dispute. The check holds back roughly a third of real uploads — that is it working.' },
      { t: 'Uncertainty shrinks the score', g: 'filter', d: 'When speaker attribution on a mono recording is not confident, criteria that depend on who spoke are marked not applicable rather than guessed.' },
      { t: 'PostgreSQL enforces isolation', g: 'lock', d: 'Row-level security on 31 tables, so an agent querying a colleague’s call is refused by the database, not filtered by the interface — tested by attempting cross-tenant reads.' },
      { t: 'The model’s key is never on the web server', g: 'key', d: 'All model access lives in edge functions, so compromising the web server exposes no spend-capable credential.' },
      { t: 'A published scorecard is frozen, prompt included', g: 'doc', d: 'A score disputed months later can be answered with the exact instructions that were in force at the time.' },
      { t: 'A human override keeps the original', g: 'diff', d: 'Both scores are retained. The gap between them is the only measure of whether the model can be trusted.' },
    ],
    limits: [
      'Just Grade Metrics is a client’s product, built under contract from the first commit. The engineering is mine; the product is not.',
      'About a third of uploads go to a person rather than straight to a score. Budget for reviewers, not full automation on day one.',
      'Mono recordings are weaker than dual-channel: speaker attribution is inferred, and criteria that depend on who spoke may come back not applicable.',
    ],
    tools: ['Next.js', 'Supabase', 'PostgreSQL', 'TypeScript', 'OpenAI'],
  },

  /* ================================================================ */
  {
    slug: 'ai-front-desk', n: 10, group: 'voice', sector: true,
    name: 'AI Front Desk — Missed Calls, After Hours and Booking',
    seoTitle: 'AI Front Desk for Missed Calls',
    sub: 'Home services · Clinics · Salons · Dental · Legal',
    prov: 'built', source: 'json', mini: 1,
    flows: [
      ['Inbound Call Router', 'overflow detection, hours, the call handed on'],
      ['Agent Tools & Guardrails', 'the price table, the escalation list, the tool router'],
      ['Availability & Booking', 'real slots, the commitment gate, the re-check'],
      ['Missed Call Recovery', 'a booking link by SMS, inside a minute'],
      ['Post-Call Write-Back', 'signed webhook, summary, CRM'],
    ],
    description: 'Built in n8n, not yet deployed: an AI voice agent answers the calls staff miss, prices only from a table, escalates on six triggers and books the job. 64 nodes.',
    problem: [
      'Every missed call is a lead that was already paid for, and the caller reaches the next result in under a minute.',
      'A service business misses a large share of inbound calls while staff are on a job, at lunch or gone for the day. An answering service costs by the minute, cannot see the calendar and books nothing.',
    ],
    steps: [
      { t: 'Ring the real line first', g: 'phone', wf: 0, lede: 'Twilio reaches the system only after the business’s own line has rung out — a person always gets first refusal.' },
      { t: 'Decide the hours once', g: 'clock', wf: 0, lede: 'Whether the business is open is decided in code and handed to the agent as a fact, never reasoned about.' },
      { t: 'Answer, within limits', g: 'mic', wf: 1, lede: 'The voice agent takes the call; everything it may not decide alone sits behind a tool webhook it has to call.' },
      { t: 'Price from a table', g: 'list', wf: 1, lede: 'A price comes from a configured table, or the agent says out loud that it will not guess.' },
      { t: 'Escalate on six triggers', g: 'alert', wf: 1, lede: 'Gas, flood, electrical, a vulnerable household, a complaint, or asking for a person: any one hands the call to a human.' },
      { t: 'Confirm, re-check, book', g: 'calendar', wf: 2, lede: 'A slot, an address, a name and a real phone number — then the slot is checked again, and only then is the job created.' },
      { t: 'Recover and record', g: 'message', wf: 3, lede: 'A caller who hangs up gets a booking link by SMS inside a minute, and every call is summarised into the CRM.' },
    ],
    guards: [
      { t: 'The agent is the overflow, never the front door', g: 'phone', d: 'Twilio reaches the workflow only as the dial action URL, after the human line has finished ringing; a call a person answered exits at once.' },
      { t: 'Hours travel as a boolean', g: 'clock', d: 'A model that can reason about the time can reason its way into a Sunday appointment. Out of hours it still answers, with a link.' },
      { t: 'A price from the table, or none', g: 'list', d: 'A prompt saying “do not quote prices you are unsure of” is a request; a lookup that returns a refusal is a control.' },
      { t: 'Six triggers, every turn, fixed words', g: 'alert', d: 'Matched against the running transcript, not left to the model to notice — and answered with fixed wording, because a gas call is the worst moment to improvise a handoff.' },
      { t: 'Four confirmations, then a re-check', g: 'shield', d: 'Without the gate the agent books on “yeah, maybe Tuesday”. The slot was free when offered; two minutes later it may not be.' },
      { t: 'If it was not said, it stays empty', g: 'doc', d: 'The summariser writes only what is in the transcript. An address guessed from an area code looks exactly as confident as one the caller gave.' },
    ],
    limits: [
      'Built, not yet deployed. The five workflows import clean and every connection resolves; no real call has flowed through them end to end.',
      'The voice agent itself — its prompt, voice and turn-taking — is configured in the vendor’s console. These workflows are everything around it: the routing, the tools and the write-back.',
      'The field-service CRM is Housecall Pro. Jobber or ServiceTitan means rewriting the booking workflow, and the slot builder assumes one shared calendar.',
      'There is no call-recording consent announcement yet. Two-party-consent jurisdictions need one before it goes live.',
    ],
    tools: ['n8n', 'Twilio', 'ElevenLabs', 'Housecall Pro', 'OpenAI', 'Google Sheets', 'Slack'],
  },

  /* ================================================================ */
  {
    slug: 'invoice-document-intake', n: 11, group: 'backoffice', sector: true,
    name: 'Invoice & Document Intake into Your Accounting System',
    seoTitle: 'Invoice Processing Automation for Xero',
    sub: 'Construction · Wholesale · Professional services · Property · Logistics',
    prov: 'built', source: 'json', mini: 1,
    flows: [
      ['Watch Mailbox & Classify', 'watch the mailbox, classify, route'],
      ['Extraction & Validation', 'the locked schema, the arithmetic check'],
      ['PO Matching', 'scored matching, four outcomes'],
      ['Approval Queue', 'the register, a Slack card, a signed callback'],
      ['Post to Accounting', 'duplicate guard, post, file, notify'],
    ],
    description: 'Built in n8n, not yet deployed: invoices from a mailbox are extracted, arithmetic-checked, matched to a purchase order and posted to Xero once. 78 nodes.',
    problem: [
      'Someone opens each PDF, reads it and keys the same six fields into the accounting system.',
      'Supplier invoices, receipts and delivery notes arrive as attachments in a mailbox. It is high volume, entirely mechanical, and the cost of doing it by hand is already on the payroll.',
    ],
    steps: [
      { t: 'Watch and classify', g: 'mail', wf: 0, lede: 'The mailbox is watched, and each document is classified before anything else touches it.', exit: 'no text layer → exceptions' },
      { t: 'Extract to a locked schema', g: 'doc', wf: 1, lede: 'Supplier, number, date, currency, line items, tax and total — into a schema the model cannot bend.' },
      { t: 'Check the arithmetic', g: 'sum', wf: 1, lede: 'Line items plus tax must equal the stated total, within two cents, or nothing posts.', exit: 'does not add up → exceptions' },
      { t: 'Match a purchase order', g: 'search', wf: 2, lede: 'Candidate POs are scored on supplier, amount and date; when two come close, a person chooses.' },
      { t: 'Approve the exceptions', g: 'user', wf: 3, lede: 'Unmatched or over-limit invoices wait in Slack for a signed, one-time approval.' },
      { t: 'Post, once', g: 'shield', wf: 4, lede: 'The ledger is searched for the same supplier and invoice number immediately before the bill is created.' },
      { t: 'File, then label', g: 'folder', wf: 4, lede: 'The original is filed and the right person told; the email is labelled last, so any earlier failure simply retries.' },
    ],
    guards: [
      { t: 'The arithmetic has no human bypass', g: 'sum', d: 'An approver can clear “no matching PO” or “over the limit”. Nothing clears a number that does not add up, because approving it would not make it correct.' },
      { t: 'Scored matching, not first-match', g: 'search', d: 'Supplier name alone scores 60 against a floor of 75, so it must be corroborated by the amount or the date. A PO dated after the invoice scores nothing on date.' },
      { t: 'Ambiguity exits as unmatched', g: 'route', d: 'If the top two candidates are within 10 points, a person chooses. A coin toss dressed as a decision is worse than an honest handoff.' },
      { t: 'Approvals are signed, and re-read', g: 'lock', d: 'The webhook checks Slack’s signature, its freshness and that a secret is configured at all. Status is re-read at decision time, because a Slack button stays clickable after it is pressed.' },
      { t: 'The duplicate check sits right before the write', g: 'shield', d: 'Against the ledger, not a local log: the gap between checking and writing is exactly where a double entry happens.' },
    ],
    limits: [
      'Built, not yet deployed. Every file imports cleanly; there has been no successful run against a real Xero account yet.',
      'The accounting system is Xero. QuickBooks means rewriting the posting workflow; the other four are vendor-neutral.',
      'OCR is not included. A scanned document with no text layer goes to exceptions rather than being guessed at.',
      'The auto-approve limit (2,500) and the PO tolerance (2%, or 2 currency units) live in the node: editable, not yet configuration.',
    ],
    tools: ['n8n', 'Gmail', 'Google Drive', 'OpenAI', 'Xero', 'Google Sheets', 'Slack'],
  },

  /* ================================================================ */
  {
    slug: 'knowledge-assistant', n: 12, group: 'support',
    name: 'Company Knowledge Assistant That Cites Its Sources',
    seoTitle: 'AI Knowledge Assistant with Citations',
    sub: 'Professional services · Agencies · Healthcare · Manufacturing · SaaS',
    prov: 'built', source: 'json', mini: 3,
    flows: [
      ['Change Detection & Re-Index', 'every six hours, only what changed'],
      ['Gap-Log Digest', 'the weekly list of what it could not answer'],
      ['Ingest & Index', 'Drive, PDFs and tickets: chunk, embed, store'],
      ['Slack Answer Path', 'a question in, a cited answer or a refusal out'],
      ['Web Widget Answer Path', 'the same, for a site widget'],
    ],
    description: 'Built, not yet deployed: answers in Slack or a site widget from company documents, quotes the passage it used, and refuses rather than inventing. 95 nodes.',
    problem: [
      'A confidently wrong answer about your own refund policy is more expensive than no answer at all.',
      'The same questions get asked every week, and the answers live in SOPs, a shared drive, old tickets and one person’s head. A generic chatbot bolted onto that makes it worse.',
    ],
    steps: [
      { t: 'Ingest', g: 'doc', wf: 2, lede: 'Drive documents, PDFs and resolved tickets are chunked, embedded and stored in a Supabase database the client owns.' },
      { t: 'Keep it current', g: 'loop', wf: 0, lede: 'Every six hours Drive is checked for changed or deleted files, and only those are re-indexed.' },
      { t: 'Ask', g: 'chat', wf: 3, lede: 'A question arrives in Slack, or from a widget on the client’s site.' },
      { t: 'Retrieve what the asker may see', g: 'lock', lede: 'The permission filter runs inside the SQL search itself; an asker it does not recognise sees public documents only.' },
      { t: 'Answer with a quote', g: 'quote', lede: 'The model answers, names the source document and quotes the passage it relied on.' },
      { t: 'Check the quote', g: 'shield', lede: 'Code confirms the quote is a literal substring of a retrieved chunk. If it is not, the answer is refused.', exit: 'quote not found → refusal, and a person' },
      { t: 'Log the gaps', g: 'list', wf: 1, lede: 'Unanswered questions become a weekly digest — in practice, the list of SOPs to write next.' },
    ],
    guards: [
      { t: 'No verbatim quote, no answer', g: 'quote', d: 'Case, whitespace and curly quotes are normalised, then the quote must appear in what was retrieved. A failed check routes to a refusal, never to a softened answer.' },
      { t: 'Default-deny, inside the search', g: 'lock', d: 'Permissions are applied inside the similarity search, not checked on the answer afterwards, so a restricted document cannot leak through a prompt.' },
      { t: 'Unchanged documents are never re-embedded', g: 'hash', d: 'A content hash is compared first, so re-reading a folder that has not changed costs nothing.' },
      { t: 'Old text goes before new text arrives', g: 'undo', d: 'A changed document’s old chunks are deleted before its new ones are written, or it would answer with both versions and nobody could tell which.' },
      { t: 'Deleted at the source, deleted here', g: 'stop', d: 'A file trashed in Drive loses its record and chunks, so nothing cites a file that no longer exists.' },
      { t: 'The assistant ignores itself', g: 'chat', d: 'Messages from bots are dropped first — the classic loop of a Slack bot replying to its own answer, forever.' },
    ],
    limits: [
      'Built, not yet deployed. The workflows pass the importability checks; they have not run end to end against live Supabase, OpenAI and Slack accounts.',
      'WhatsApp is not built. Slack and a site-widget webhook are; WhatsApp would be a new trigger into the same retrieval and quote check.',
      'Tickets are read from a table a separate export has to fill; there is no Zendesk, Freshdesk or Intercom connector here.',
      'The model’s confidence is logged, not gated: a low-confidence answer that passes the quote check still posts.',
    ],
    tools: ['n8n', 'Supabase', 'PostgreSQL', 'OpenAI', 'Slack', 'Google Drive'],
  },

  /* ================================================================ */
  {
    slug: 'client-onboarding-pipeline', n: 13, group: 'backoffice',
    name: 'Client Onboarding — Signature to Kickoff without Chasing',
    seoTitle: 'Client Onboarding Automation in n8n',
    sub: 'Agencies · Consultancies · Professional services · Coaching',
    prov: 'built', source: 'json', mini: 2,
    flows: [
      ['Proposal Accepted to Contract', 'the real deal values, a send-once guard'],
      ['Signature to Payment Link', 'a signed webhook, the deposit link'],
      ['Payment to Provisioning', 'the event-ID claim, then everything'],
      ['Intake Chaser', 'the stop first, then the ladder'],
      ['Status Record', 'credit per section, a patience budget per stage'],
    ],
    description: 'Built, not yet deployed: contract, signature, Stripe deposit, folder, Slack channel and welcome email, provisioned exactly once. 68 nodes, five workflows.',
    problem: [
      'Between yes and the work starting, someone chases a signature, a deposit, an intake form, a folder, a kickoff call and a welcome email.',
      'It is the least skilled work in the business, and it is done by the most expensive person in it — because they are the one who noticed it was stuck.',
    ],
    steps: [
      { t: 'Contract from the deal', g: 'doc', wf: 0, lede: 'When a proposal is accepted, the contract is generated from the deal record’s real values and sent for signature — once.' },
      { t: 'Signed, then a link', g: 'pen', wf: 1, lede: 'The signature webhook creates the deposit link, carrying the deal’s ID in Stripe’s metadata.' },
      { t: 'Claim the payment', g: 'card', wf: 2, lede: 'Stripe’s event ID is recorded before anything is provisioned, so a second delivery of the same event exits as already done.' },
      { t: 'Provision', g: 'folder', wf: 2, lede: 'Project folder, CRM stage, kickoff invite from real availability, internal channel — and the welcome email last.' },
      { t: 'Chase the intake', g: 'mail', wf: 3, lede: 'Each unanswered section chases itself after 2, 3, 4, 7, 7 and 7 days, and stops the moment it is answered.', exit: 'six chases → a person rings them' },
      { t: 'One status line', g: 'sheet', wf: 4, lede: 'Every client has one status line and every stage a patience budget, so the only rows anyone reads are the stuck ones.' },
    ],
    guards: [
      { t: 'The event ID is claimed before provisioning', g: 'card', d: 'Stripe retries, and can deliver the same event twice when nothing is wrong. Without the claim, a client’s first impression is two folders, two channels and two welcome emails.' },
      { t: 'Signatures that survive key rotation', g: 'key', d: 'During a rotation Stripe sends more than one signature; any match is accepted, inside a five-minute window, and a missing secret fails closed.' },
      { t: 'The contract is built from the deal', g: 'doc', d: 'The figure the client signs and the figure they are billed are the same figure by construction. A deal with no amount throws rather than produce a contract for zero.' },
      { t: 'Signature and payment are separate', g: 'split', d: 'They are separate events, minutes or days apart. A client who signs and never pays should not have a folder, a channel and a kickoff invite waiting.' },
      { t: 'The stop is computed before the ladder', g: 'stop', d: 'Suppression is not a filter further down that someone can reorder: every section answered means the record exits.' },
      { t: 'Only the missing sections are named', g: 'list', d: 'Someone who filled in three of four and gets the whole form again reads it as “you did not notice”.' },
    ],
    limits: [
      'Built, not yet deployed. Every file imports cleanly; no real signature and payment has flowed through it.',
      'The e-signature vendor is PandaDoc. DocuSign means rewriting the first two workflows.',
      'The event-ID claim is as atomic as a Google Sheet allows. On a busy account it belongs in PostgreSQL with a unique constraint — a one-node swap.',
      'There is no refund or chargeback path yet: a refunded payment changes nothing.',
    ],
    tools: ['n8n', 'PandaDoc', 'Stripe', 'Google Drive', 'Google Sheets', 'Gmail', 'Slack'],
  },

  /* ================================================================ */
  {
    slug: 'weekly-ops-report', n: 14, group: 'data', sector: true,
    name: 'The Weekly Number, Assembled and Sent',
    seoTitle: 'Weekly Ad Spend and Revenue Report',
    sub: 'Agencies · Home services · E-commerce · SaaS',
    prov: 'built', source: 'json', mini: 0,
    flows: [
      ['Pull Sources', 'Google Ads, Meta, the CRM, Stripe and CallRail, each on its own'],
      ['Reconcile & Upsert', 'one row per week: update or append, never both'],
      ['Compute Derived Metrics', 'the ratios and deltas, em-dash-guarded'],
      ['Narrative & Delivery', 'the arithmetic shown to a model with no tools'],
      ['Anomaly Watcher', 'every four hours, on its own schedule'],
    ],
    description: 'Built in n8n, not yet deployed: Google Ads, Meta, HubSpot, Stripe and CallRail reconciled into one row a week, with every ratio computed in code. 50 nodes.',
    problem: [
      'The numbers that decide things — cost per booked job, close rate by source — are never computed at all.',
      'The raw numbers live in five places. Someone spends a morning a week copying them into a deck nobody has read by Thursday, and anything that needs two of those places joined never gets made.',
    ],
    steps: [
      { t: 'Pull five sources', g: 'download', wf: 0, lede: 'Every week: Google Ads, Meta, the CRM, Stripe and CallRail, each pulled on its own, so one outage cannot block the rest.' },
      { t: 'One row per week', g: 'sheet', wf: 1, lede: 'The week is upserted into a sheet the client owns: updated if it exists, appended if not, never both.' },
      { t: 'Compute what decides', g: 'sum', wf: 2, lede: 'Cost per booked job, close rate by source, revenue per source and week-on-week change — in code, with an em-dash wherever a denominator is zero.' },
      { t: 'Narrate, without arithmetic', g: 'pen', wf: 3, lede: 'A model phrases the numbers it is handed. It has no tools connected, so it cannot produce one.' },
      { t: 'Watch in between', g: 'alert', wf: 4, lede: 'Every four hours: a spend spike, spend with no clicks, or calls dropping to zero goes straight to Slack.' },
    ],
    guards: [
      { t: 'The model is not allowed to do arithmetic', g: 'lock', d: 'Every ratio is computed upstream and shown with its working, and the agent that writes the narrative has zero tools connected. It can phrase a number; it cannot produce one.' },
      { t: 'The em-dash contract', g: 'sum', d: 'A zero denominator gives an em-dash — never Infinity, NaN or a fabricated $0.00 — and a change measured against last week’s em-dash stays an em-dash.' },
      { t: 'One source of truth for leads', g: 'db', d: 'The ad platforms contribute spend and clicks only. Leads and bookings come from the CRM, so two disagreeing counts never share a row.' },
      { t: 'Nothing is silently dropped', g: 'filter', d: 'An unknown lead source is counted as “other”, and a charge with no matching deal is kept as unattributed revenue — an ugly line beats a hidden mismatch.' },
      { t: 'A week is counted by the calendar', g: 'calendar', d: 'The previous week is found by subtracting seven real days. Some years have 53 ISO weeks, and string arithmetic breaks once a year.' },
      { t: 'Three alarms, not one', g: 'alert', d: 'A spend spike, spend with no clicks and dead call volume are three different failures — and a quiet night outside business hours is not one of them.' },
    ],
    limits: [
      'Built, not yet deployed. The importability checks pass and every Code node’s logic was run against mocked data; it has not run against live Google Ads, Meta, HubSpot, Stripe and CallRail accounts.',
      'The CRM side is HubSpot-shaped. Another CRM means swapping one request and its field names; everything after it is CRM-agnostic.',
      'Only one page is read from Stripe and HubSpot — fine below about a hundred charges or deals a week.',
      'Amounts are assumed to be in US dollars.',
    ],
    tools: ['n8n', 'Google Ads', 'Meta', 'HubSpot', 'Stripe', 'CallRail', 'Google Sheets', 'OpenAI', 'Slack'],
  },

  /* ================================================================ */
  {
    slug: 'content-repurposing-line', n: 15, group: 'content',
    name: 'Content Repurposing Line with a Human Approval Gate',
    seoTitle: 'Content Repurposing with Human Approval',
    sub: 'Agencies · Coaching · Media · SaaS · Personal brands',
    prov: 'built', source: 'json', mini: 4,
    flows: [
      ['Ingest & Transcribe', 'form or manual in, transcribe, one canonical record'],
      ['Segment & Rank', 'windows cut, the model picks IDs, anchored, top five'],
      ['Draft & Rules Check', 'the brand rules in, drafts out, a check in code'],
      ['Approval Queue', 'the review card, and a nudge at 48 hours'],
      ['Approve / Reject Callback', 'the signed callback: publish, or learn'],
    ],
    description: 'Built, not yet deployed: a recording becomes posts, captions and a newsletter draft, with exactly one path to publishing: a person approves in Slack. 70 nodes.',
    problem: [
      'You record one good thing a week. The clips, posts, captions and newsletter never get made, because each one is 20 minutes of unrewarding work.',
      'The tools that promise to fix this auto-post — which is how a brand account ends up with something nobody wanted on it.',
    ],
    steps: [
      { t: 'Transcribe', g: 'mic', wf: 0, lede: 'A video, a podcast or a long post comes in and becomes one timestamped transcript.' },
      { t: 'Find the moments', g: 'scissors', wf: 1, lede: 'Windows are cut from the real transcript; the model only picks window IDs, and anything it cannot anchor is dropped.' },
      { t: 'Keep the best five', g: 'list', wf: 1, lede: 'At most five moments per source, because a review queue of 40 is not reviewed — it is ignored.' },
      { t: 'Draft against the rules', g: 'pen', wf: 2, lede: 'Copy for each platform is drafted from the brand rules file, then checked in code for banned words and claims that need review.', exit: 'banned word → blocked, never queued' },
      { t: 'A person approves', g: 'user', wf: 3, lede: 'Every draft waits in Slack with its full copy showing; nothing publishes without a tap.' },
      { t: 'The only way out', g: 'send', wf: 4, lede: 'A verified signature, a status re-read from the sheet, the approved branch: the one path to publishing.' },
      { t: 'Learn from a no', g: 'undo', wf: 4, lede: 'A rejection note is meant to be appended to the brand rules, so the same correction applies from the next run.' },
    ],
    guards: [
      { t: 'One path to publishing', g: 'route', d: 'A backwards walk from the publish node returns exactly one path, and every step of it is a gate. That is a property of the graph, not a promise about it.' },
      { t: 'The model never writes a timestamp', g: 'clock', d: 'It cannot count seconds. It picks a window already cut from the transcript, and the clip’s text is the window’s own words, not a paraphrase.' },
      { t: 'The rules check is code', g: 'shield', d: 'A prompt asking the model not to use a banned word is a request. Banned words match on word boundaries — “cure” does not fire on “accurate” — and one blocked draft blocks the whole moment.' },
      { t: 'A rules file that will not parse stops everything', g: 'alert', d: 'A silently empty ban list would pass every check.' },
      { t: 'Signed, then re-read', g: 'lock', d: 'The callback verifies Slack’s signature and its freshness, and re-reads the draft’s status, because a Slack button stays clickable after it is pressed.' },
    ],
    limits: [
      'Built, not yet deployed. Every file imports cleanly and the single path to publishing was verified by walking the graph; there has been no run against real Slack and Buffer accounts.',
      'Clip rendering is not built. The pipeline produces verified start and end times; rendering vertical clips needs FFmpeg on a host, or a paid render API — a decision with cost.',
      'Only the first draft of a set is published, through Buffer. Fanning out per platform is one node’s work, once the platforms are known.',
      'Transcription is AssemblyAI. The rejection-note loop is wired but not yet fed: the approval card still needs a field for the note.',
    ],
    tools: ['n8n', 'AssemblyAI', 'OpenAI', 'Google Drive', 'Google Sheets', 'Slack', 'Buffer'],
  },

  /* ================================================================ */
  {
    slug: 'crm-rebuild-migration', n: 16, group: 'lead', sector: true,
    name: 'CRM Rebuild & Migration, with the Automations on Top',
    seoTitle: 'CRM Rebuild and HubSpot Migration',
    sub: 'Home services · Agencies · B2B services · Real estate',
    prov: 'built', source: 'json', mini: 2,
    flows: [
      ['Source Profiler & Audit', 'fill rates, distinct values, duplicate clusters'],
      ['Dedupe + Mapping Engine', 'normalise, score, merge, map, stage'],
      ['Migrate (Dry Run + Live)', 'validate, then diff or write, with a rollback log'],
      ['Rollback Executor', 'a confirmed undo; the unresolved go to a person'],
      ['Routing + Stage Follow-Up', 'intake, grading, the 3/5/7/14/21/30 ladder'],
    ],
    description: 'Built in n8n, not yet deployed: a CRM audited, deduplicated and migrated to HubSpot, dry run by default, with routing and follow-up rebuilt on top. 80 nodes.',
    problem: [
      'You cannot automate on top of a data model that does not exist.',
      'The CRM is a spreadsheet, or three. Or it is a HubSpot nobody configured, and the real state of every deal is in one person’s inbox. Every automation proposal dies there.',
    ],
    steps: [
      { t: 'Audit', g: 'search', wf: 0, lede: 'Fill rate per field, distinct values and duplicate clusters — measured before anything is designed.' },
      { t: 'Dedupe and map', g: 'merge', wf: 1, lede: 'Identities are normalised, pairs scored and merged, and every record mapped to the agreed object model.' },
      { t: 'Dry run', g: 'eye', wf: 2, lede: 'The migration runs with its dry-run flag on by default, and emits the exact payload it would write — and every field it would leave empty.' },
      { t: 'Live, with a rollback log', g: 'db', wf: 2, lede: 'Each rollback row is reserved before its record is created and confirmed after it.' },
      { t: 'Roll back, if needed', g: 'undo', wf: 3, lede: 'Undoing a run means typing ROLLBACK- and that run’s own ID.' },
      { t: 'Automate on top', g: 'route', wf: 4, lede: 'Intake, grading by a rule table anyone can read, and a 3/5/7/14/21/30-day follow-up ladder that stops on a reply.' },
    ],
    guards: [
      { t: 'The dry run is the default', g: 'eye', d: 'Forgetting to switch it off wastes a run; forgetting to switch it on writes thousands of records into a live CRM. Every write sits past that one branch.' },
      { t: 'The dry run shows the payload, not a count', g: 'doc', d: '“1,842 contacts would be created” proves nothing. The exact JSON, and the fields left empty, is where a bad mapping shows.' },
      { t: 'Reserve, create, confirm', g: 'db', d: 'A crash midway leaves a known unknown a person can resolve, instead of an orphan record nothing knows about.' },
      { t: 'Rollback asks for the run by ID', g: 'undo', d: 'Not a checkbox: the thing typed is the thing destroyed, so the wrong run cannot be confirmed from muscle memory.' },
      { t: 'Intake normalises exactly like the migration', g: 'merge', d: 'Otherwise new leads start recreating the duplicates the migration just spent a week removing.' },
      { t: 'Suppression lives in the same query', g: 'stop', d: 'Whether someone has replied is part of the same SQL condition that decides what is due, so no later step can reorder or forget it.' },
    ],
    limits: [
      'Built, not yet deployed. Every file imports cleanly; there has been no successful run against a live HubSpot portal.',
      'The destination is HubSpot. GoHighLevel or Pipedrive means rewriting the migration, the rollback and the create step.',
      'Contact-to-deal associations are not created yet. On a real engagement that is a further workflow.',
      'Rollback deletes what the migration created. It does not restore records changed in place — and the migration changes none.',
    ],
    tools: ['n8n', 'HubSpot', 'PostgreSQL', 'Google Sheets', 'Gmail', 'Slack'],
  },
];

/* The one ported system page, so the register's "next" chain can pass
   through it; it is not built from this file. */
export const PORTED = { slug: 'lead-to-cash-crm', n: 1, name: 'Lead-to-Cash CRM for Three Contractors' };
