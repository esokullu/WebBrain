# Changelog

All notable changes to WebBrain are documented in this file.

This changelog was generated from the repository Git history and release tags. Versions without a Git tag are inferred from version-bump commits and the current `package.json` / browser manifest versions.

## [28.1.4] - 2026-08-11

### Changed
- version up
- fix: harden runtime mode recovery and trace diagnostics
- Apply suggestions from code review
- fix: localize Cloud Sync settings
- dist: rebuild submission zips for v28.1.2
- chore: release v28.1.2
- fix: preserve rich-text editor appends
- dist: rebuild submission zips for v28.1.1
- chore: release v28.1.1
- version up
- fix: enforce complete thread read coverage
- Fix restored compact tool details
- fix: honor complete thread read intent
- fix: require complete thread reads
- 28
- ci: make cloud smoke manual-only
- fix: toggle vision for custom local providers
- fix: detect vision for custom local providers
- fix: preserve local model capability identity
- feat: detect vision support for local providers
- Fix Ollama vision slash toggle
- Detect Ollama vision capabilities
- fix: address post-merge review findings
- feat: harden coupon domain refresh
- fix: call window.focus() before inputEl.focus() for focus-input command
- fix: use storage.onChanged for command dispatch instead of runtime.sendMessage
- docs: correct tab grouping visibility model
- fix(firefox): change focus-input shortcut from Ctrl+Slash to Ctrl+Period
- fix(firefox): add browser-level keyboard shortcuts via commands API
- test: preserve runner line endings
- test: cover automatic tab grouping opt-out
- feat(settings): add Firefox tab grouping preference
- feat(i18n): add zh Firefox tab grouping labels
- feat(i18n): add vi Firefox tab grouping labels
- feat(i18n): add uk Firefox tab grouping labels
- feat(i18n): add tr Firefox tab grouping labels
- feat(i18n): add tl Firefox tab grouping labels
- feat(i18n): add th Firefox tab grouping labels
- feat(i18n): add ru Firefox tab grouping labels
- feat(i18n): add pt Firefox tab grouping labels
- feat(i18n): add pl Firefox tab grouping labels
- feat(i18n): add nl Firefox tab grouping labels
- feat(i18n): add ms Firefox tab grouping labels
- feat(i18n): add ko Firefox tab grouping labels
- feat(i18n): add ja Firefox tab grouping labels
- feat(i18n): add id Firefox tab grouping labels
- feat(i18n): add hi Firefox tab grouping labels
- feat(i18n): add he Firefox tab grouping labels
- feat(i18n): add fr Firefox tab grouping labels
- feat(i18n): add fa Firefox tab grouping labels
- feat(i18n): add es Firefox tab grouping labels
- feat(i18n): add en Firefox tab grouping labels
- feat(i18n): add de Firefox tab grouping labels
- feat(i18n): add bn Firefox tab grouping labels
- feat(i18n): add ar Firefox tab grouping labels
- feat(settings): add Firefox tab grouping preference
- feat(settings): add Firefox tab grouping preference
- feat(settings): honor Firefox tab grouping preference
- feat(settings): honor Firefox tab grouping preference
- feat(settings): honor Firefox tab grouping preference
- feat(i18n): add zh tab grouping labels
- feat(i18n): add vi tab grouping labels
- feat(i18n): add uk tab grouping labels
- feat(i18n): add tr tab grouping labels
- feat(i18n): add tl tab grouping labels
- feat(i18n): add th tab grouping labels
- feat(i18n): add ru tab grouping labels
- feat(i18n): add pt tab grouping labels
- feat(i18n): add pl tab grouping labels
- feat(i18n): add nl tab grouping labels
- feat(i18n): add ms tab grouping labels
- feat(i18n): add ko tab grouping labels
- feat(i18n): add ja tab grouping labels
- feat(i18n): add id tab grouping labels
- feat(i18n): add hi tab grouping labels
- feat(i18n): add he tab grouping labels
- feat(i18n): add French tab grouping labels
- feat(i18n): add Persian tab grouping labels
- feat(i18n): localize Chrome tab grouping preference
- feat(settings): add Chrome tab grouping preference
- feat(settings): update Chrome agent tab grouping
- feat(settings): add tab grouping opt-out
- test: cover pinduoduo adapter
- agent: mirror pinduoduo adapter in firefox
- agent: add adapter for pinduoduo
- test: preserve run.js line endings
- ci: keep patch release changelog in sync
- test: cover patch release changelog ordering
- docs: backfill patch release changelog
- fix(captcha): serialize Cloudflare gate hydration
- fix(captcha): ignore unrelated response tokens
- fix(captcha): make English matcher additive
- fix(captcha): revalidate cleared token state
- fix(captcha): retire post-solve read inference
- fix(captcha): detect Cloudflare challenge pages
- ux improvements
- feat: generate coupon merchant coverage
- feat: add verified coupon code action
- documentation enhanced
- chore: rebuild dist zips
- chore: bump version
- updates to lm studio plugin
- fix: hide empty assistant placeholders
- chore: rebuild dist zips
- chore: bump version
- fix: mark timed-out plan history even when no terminal text rendered
- chore: rebuild dist zips
- chore: bump version
- Fix assistant response bubble width
- chore: rebuild dist zips
- chore: bump version
- Normalize empty tool arguments
- fix: keep timed-out plan reviews recoverable across restores
- Report every API-mutation grant in the transcript
- documented mcp
- chore: rebuild dist zips
- chore: bump version
- version up
- Remove sidepanel UI from Chrome and Firefox extensions
- Fix blog post: replace missing mcp-diagram.png with ASCII diagram, remove headless MCP comparison section
- Add blog post: WebBrain MCP server introduction for Claude Code, OpenCode, Codex, Cursor
- Keep staged screenshots until delivery is confirmed included
- Charge the screenshot budget only for delivered viewport inspections
- Fail closed when a child frame URL cannot identify one descriptor
- Do not stage a full-page screenshot the privacy scan could not prepare
- Fix screenshot redaction fail-open paths and staged attachment recovery
- Meter dedicated vision provider costs
- Exclude WebBrain Cloud from cost limits
- Retain workflow claims through cleanup
- Restore staged redacted screenshot copies
- Fix teacher submit capture and workflow cleanup
- Bind viewport redaction to captured pixels
- Apply suggestions from code review
- Scope redaction coverage to rendered frames
- Fix full-page redaction capture ordering
- Restore attachments cancelled before validation
- Preserve screenshots through terminal delivery
- Fail closed on redaction collector overflow
- Persist staged screenshot pixels durably
- Fail closed on incomplete screenshot privacy data
- Pass trace run options in both browsers
- Fail closed on redaction region overflow
- Persist staged screenshot state safely
- Bind screenshot redaction to capture time
- Prevent teacher capture during automated runs
- Add value-free teacher mode
- Preserve attachments during workflow replay
- Preserve unknown attachment delivery
- Improve screenshot and attachment handling
- Add user-approved workflow locator healing
- Allow automatic i18n for AMO links
- Add saved workflow manager
- mcp server
- updated changelog
- 27.0.0 mcp
- fix(bridge): poll runs before deadline sleeps
- fix(lmstudio): bound extension waits by deadline
- fix(cloud): enforce ask mutation and timeout bounds
- Include done summaries in planner context
- fix(bridge): reject web-page WebSocket origins
- fix(bridge): keep ask runs read-only
- Address planner and completion review feedback
- fix(bridge): preserve runs across disconnects
- fix(cloud): retract temporary API authorization
- Localize tool completion status labels
- fix(mcp): include initial commands in deadlines
- Fix Act follow-up intent routing
- fix(mcp): close run lifecycle gaps
- fix(mcp): bound run polling and expose abort
- fix(mcp): harden bridge startup and polling
- fix(mcp): complete browser run recovery paths
- fix(mcp): address Codex review — packaging, duration parsing, Firefox claim
- feat(mcp): MCP server + LM Studio browser delegation over the existing bridge
- Reject duplicate cloud run identifiers
- Use secure cloud run identifiers
- Preserve false schemas and public URL values
- Close OTP and schema detection gaps
- Close navigation URL and schema gaps
- Preserve cloud output schema semantics
- Harden cloud schema and URL evidence
- Close strict cloud secret registry gaps
- chore: rebuild dist zips
- chore: bump version
- Address latest WebBrain Cloud review findings
- Harden WebBrain Cloud security boundaries
- fix persistent API permission review findings
- feat: add persistent API mutation setting
- Add a $schema discriminator; state what strict mode actually guarantees
- Register request-body credentials; stop blanking valid strict results
- Redact strict terminal fields and non-string secret leaves
- Redact strict runs by value, not by update type
- Fail closed on unapplied session settings; tighten schema detection
- Enforce advertised schema keywords and nullable optionals
- Close strict-secret leaks and fix done_json schema handling
- Watch cloud background in smoke workflow
- Preserve strict structured public results
- Scope cloud scheduled job reads
- Enforce strict structured cloud output
- Extend manual cloud smoke timeout
- Retry CodeQL after service outage
- Redact strict cloud form verification
- Tighten scheduled smoke verification
- Finish cloud smoke review fixes
- Add scheduled Google Forms cloud scenario
- Finish cloud CI review fixes
- Add NYTimes and YouTube cloud scenarios
- Fix cloud CI request evidence
- docs: document promote_iframe
- 26.2.1
- Add WebBrain Cloud CI integration
- fix iframe promotion and verification safety
- fix: make iframe form control fail closed
- dist: rebuild submission zips for v26.2.0
- chore: release v26.2.0
- fix: repair minor release workflow ordering
- chore: rebuild dist zips
- chore: bump version
- test(compact): enforce upload helper parity
- fix(compact): make upload_file self-targeting
- Parse whole-response tool call arrays
- docs(blog): compare Qwen and Laguna Vision
- chore: rebuild dist zips
- chore: bump version
- Make Mail.tm UI-first and validate fetch headers
- Fix form submission and rich-text targeting
- chore: rebuild dist zips
- chore: bump version
- Preserve clarification step result pairing
- Fix clarification timeline ordering
- updated changelog
- version update
- fix: bound toolbar safety captures per turn
- fix: preserve live sibling toolbar obligations
- fix: stop toolbar ancestry alone blocking prose, bound classifier spend
- fix: correct six defects found reviewing the toolbar guard
- fix: only accept a bare tool call that stands alone on its line
- test: cover the upload retry that recovery enables
- fix(compact): make upload_file recoverable and attachment-only
- dist: rebuild submission zips for v26.0.11
- fix: harden agent reliability and recovery persistence
- fix(agent): recover past an unbalanced opener too
- fix: recover tool calls after an unbalanced brace
- fix(media): require LinkedIn permalink IDs
- fix(agent): skip invalid JSON candidates
- fix: parse nested bare JSON tool calls
- docs(blog): announce DeepSeek V4 Flash vision support
- docs updated
- fix: address rich-text guard review findings
- refactor: consolidate rich-text toolbar guard
- documented vision models
- feat(compact): expose upload_file
- Fail navigation on terminal browser errors
- Gate attachment guidance on available tools
- Wait for terminal navigation state
- Reconcile attachment upload hardening
- Keep attachment handles unique across runs
- Expose every accepted attachment handle
- Verify navigation with top-frame commits
- Accept committed round-trip redirects
- Reuse user attachments and verify navigation commits
- Keep upload recovery gated after inspection
- Fix ambiguous file uploads
- fix: keep toolbar debt and its state in agreement across navigation
- fix: close toolbar fixture and session ID gaps
- fix: stabilize the rich-text toolbar guard and contain its blast radius
- test: make promotion assertions locale-aware
- agent: add adapter for Lazada
- fix: harden toolbar frame coordination
- fix: bind toolbar recovery dispatch targets
- test: align toolbar vision benchmark
- fix: persist toolbar recovery state
- fix: guard toolbar keyboard retries
- fix: scope toolbar recovery guards
- fix: guard toolbar recovery identity
- fix: align selector toolbar context
- fix: identify composed toolbar regions
- fix: deduplicate toolbar recovery obligations
- fix: fail closed on toolbar audit fallbacks
- fix: preserve trusted focused typing
- fix: exempt compact native composers
- fix: bind focused iframe traversal
- fix: bind focused editor mutations
- fix: scope toolbar recovery deduplication
- fix: retain toolbar recovery obligations
- fix: bind toolbar preflight targets
- fix: exclude compact editor bodies
- fix: correlate toolbar recovery text
- fix: prioritize toolbar search semantics
- fix: recover ref-less editor targets
- fix: honor toolbar screenshot limits
- fix: scope trace captures to tool attempts
- fix: cover conventional toolbar variants
- fix: settle toolbar probe geometry
- fix: retain ambiguous editor recovery debt
- fix: audit native toolbar selects
- fix: reject ambiguous iframe toolbar targets
- fix: audit contenteditable toolbar controls
- fix: scope nested iframe toolbar recovery
- fix: audit remaining toolbar inputs
- fix: exempt ordinary toolbar searches
- fix: audit labeled shadow toolbar controls
- fix: verify corrected toolbar edits
- fix: bind toolbar recovery to exact iframe
- fix: exclude top frame from iframe typing
- fix: resolve deeply focused toolbar targets
- fix: follow assigned slots in toolbar probes
- fix: keep selection popup within viewport
- fix: preserve Humanizer selection routing on retry
- fix: scope toolbar recovery to original route
- fix: mirror toolbar fallback in vision benchmark
- fix: keep toolbar guard active without screenshots
- fix: align shadow toolbar probe and benchmark
- x
- fix: preserve toolbar recovery safety state
- fix: audit every toolbar target during recovery
- fix: traverse shadow toolbar ancestry
- fix: preserve toolbar recovery across navigation
- fix: classify offscreen iframe toolbar targets
- Preserve fenced code languages in history
- fix: resolve toolbar labels inside shadow roots
- fix: retain toolbar recovery proof across rerenders
- Avoid duplicate newline after code blocks
- fix: preserve toolbar debt through completion
- fix: constrain iframe toolbar typing to audited frame
- Fix chat history formatting
- fix: audit toolbar edits inside frames
- fix: preserve toolbar recovery across continuation
- fix: tighten toolbar formatting value checks
- fix: align toolbar resets and trace probes
- fix: close toolbar audit shadow and navigation gaps
- Avoid duplicate planner failure cards
- fix: validate style and link toolbar values
- fix: validate rich-text font family presets
- fix: address rich-text toolbar retry feedback
- fix: harden rich-text toolbar preflight recovery
- Use Gecko semicolon metadata
- chore: rebuild dist zips
- chore: bump version
- Support semicolon page shortcuts
- Honor file path when download ID is invalid
- chore: rebuild dist zips
- chore: bump version
- Potential fix for pull request finding 'CodeQL / Insecure randomness'
- Apply suggestions from code review
- Potential fix for pull request finding 'CodeQL / Insecure randomness'
- Apply suggestions from code review
- fix: make Turkish deasciification opt-in
- feat(skills): bundle Humanizer as a default skill with webmail preactivation
- Add target-only toolbar vision mode
- Add rich-text toolbar vision probe
- Guard rich-text editor toolbar targeting
- Add target-only toolbar vision mode
- Add rich-text toolbar vision probe
- Guard rich-text editor toolbar targeting
- fix(web): simplify blog and clarify active navigation
- chore: rebuild dist zips
- chore: bump version
- fix(adapters): harden workflow profile enumeration
- Delete WHATS_NEW_IN_V24.md
- chore: rebuild dist zips
- chore: bump version
- Improve email thread and GitHub adapter guidance
- chore: rebuild dist zips
- chore: bump version
- Preserve terminal replay recovery
- chore: rebuild dist zips
- chore: bump version
- Sync independent scope changes
- Block trailing captures in selection scope
- Block capture commands in selection scope
- Refresh scope for scheduled runs
- Preserve scope during reconnect uncertainty
- Reconcile inherited scope failures
- Enforce scope before active modes
- Fix selection scope review issues
- Localize the run-progress replay-gap notice
- Fix selected-text conversation scope
- Fix false run replay compaction notices
- feat(adapters): add structured workflow profiles
- agent: add adapter for Leboncoin
- agent: add adapter for Traveloka
- agent: add adapter for Zomato
- fix: make Flipkart seller checks conditional
- fix: recognize Shopee Cambodia recommendations
- feat(blog): add archive search and pagination
- agent: add adapter for Ozon
- test: compare Inkling Small and GLM vision
- agent: add adapter for Shopee
- agent: add adapter for Flipkart
- Address 58.com verification review
- agent: add adapter for Xianyu
- agent: add adapter for Kuaishou
- agent: add adapter for Douyin
- agent: add adapter for Dianping
- agent: add adapter for Qunar
- agent: add adapter for 58.com
- agent: add adapter for BOSS Zhipin
- agent: add adapter for Amap
- chore: rebuild dist zips
- chore: bump version
- agent: cover the 12306 payment host and tighten the adapter assertions
- fix(agent): address Ctrip adapter review
- agent: correct Zhihu profile routing and trim guidance
- agent: add Taobao shop hosts and name the in-shop search toggle
- agent: add adapter for Zhihu
- fix(adapters): scope Baidu search handoffs
- agent: add adapter for Weibo
- agent: add adapter for Ctrip
- docs: require adapter host coverage to match what the notes describe
- agent: add adapter for Baidu Search
- agent: cover Taobao shop/mobile/Tmall hosts and add verification-wall guidance
- agent: add adapter for 12306
- Apply suggestions from code review
- agent: add adapter for Taobao
- agent: broaden JD adapter host coverage and soften login-redirect claim
- agent: add adapter for JD
- fix(captcha): consume response token state
- chore: rebuild dist zips
- chore: bump version
- Correct Inkling Small parameter count
- Address delivery checkpoint review feedback
- Enforce terminal delivery checkpoints
- 26.0.2
- Expand frontier benchmark to thirteen models
- Add consensus benchmark of ten frontier models
- chore: rebuild dist zips
- chore: bump version
- fix(marktplaats): allow trusted bank handoff
- agent: add adapter for Takealot
- docs: add community and discord setup guides and improve docs formatting
- agent: add adapter for Marktplaats
- web: document scrolling and tab switching
- removed artifacts
- agent: add adapter for Allegro
- Refresh brand and website social assets
- Bind claimed prompts to source tabs
- Invalidate pre-clear handoff generations
- Retry stale tab chat clears
- Release claims on preflight exits
- Invalidate cleared chat handoff snapshots
- Retry initial handoff ownership
- Retry tab chat ownership reconciliation
- Preserve handoff ownership across clears
- Release context claims on preflight abort
- Release claims on initial visibility exit
- Handle handoff and claim retry races
- Fix sidepanel refresh and claim races
- Reject expired context-menu reservations
- Release claim after final visibility loss
- Fix transcript handoff barrier race
- Close side panel handoff race gaps
- Refine Product Hunt browser and model slides
- Fix side panel handoff review issues
- Refresh Product Hunt gallery assets
- Fix context-menu run ownership races
- assets: add thumbnail-safe explainer gallery (2026 v5)
- Preserve read_page continuation options
- Paginate read_page article text
- assets: add typographic explainer gallery (2026 v4)
- assets: say "Chromium browsers and Firefox" on v3 hero
- assets: add logo-free explainer gallery (2026 v3)
- assets: add light-background hero and plan slides
- Preserve retained search query state
- Harden completion search form classification
- Fix localized completion form classification
- assets: add social proof slide to webstore explainer
- fix(skills): reject structural plain scalars
- fix: keep runtime trace config attributable for unlimited and tabless runs
- fix(captcha): preserve active frame visibility
- Apply suggestions from code review
- agent: add adapter for Rakuten Ichiba
- agent: add adapter for Coupang
- agent: add adapter for WeChat Official Accounts
- docs: fix site adapter matcher API name
- Announce the planner failure card and stop duplicating its Retry
- Classify planner failures on the shapes providers actually emit
- Fix planner intent recovery and cancellation context
- feat: add runtime config to traces
- Add recovery actions for planner provider failures
- fix(captcha): detect active challenge frames
- fix(skills): enforce Agent Skills trust boundary
- Docs: truth-up packaged skills catalog and 23 UI locales.
- Add Frankfurter FX as an opt-in packaged skill.
- Add GPT4All as a built-in local OpenAI-compatible provider.
- fix(chrome): repair Wikipedia skill tools JSON so tools parse
- fix(firefox): harden global shortcuts against AltGr, IME, and pickers
- agent: cut generic e-commerce bullets from Mercado Libre adapter
- docs: sync Firefox upload parity artifacts
- Add exchars parameter to Wikipedia API request
- agent: tighten Mercado Libre adapter notes
- Potential fix for pull request finding
- feat(skills): add opt-in Wikipedia packaged skill
- docs: correct Firefox upload_file parity in tool matrix and TODOs
- fix(firefox): implement documented global keyboard shortcuts
- agent: add adapter for Mercado Libre
- fix(skills): preserve unsupported YAML frontmatter
- chore: rebuild dist zips
- chore: bump version
- 26
- Honor descendant CAPTCHA visibility overrides
- Keep ambiguous CAPTCHA observations gated
- Match hidden CAPTCHA evidence precisely
- fix(agent): re-arm duplicate-submit window on acknowledged resubmit
- refactor(agent): freeze shared image budget defaults
- refactor(agent): extract image budget helpers
- Refine background screenshot compatibility
- Reject blank full-page background captures
- fix(captcha): fail closed when the DOM rescan cannot disprove a tree-observed challenge
- Verify inactive Firefox tabs before completion
- Make local browser runs background-safe
- some changes
- feat(traces): add offline OTLP converter
- feat(skills): support Agent Skills frontmatter
- feat: add ATIF trace converter
- fix(firefox): block rapid duplicate submits
- refactor(agent): extract text tool-call parser
- fix(captcha): report response token state
- docs: put every chapter back in the readme demo gif, and fix an orphaned card
- docs: lead the READMEs with a product demo gif
- change dropdown language order
- chore: rebuild dist zips
- chore: bump version
- Fix CapSolver key enablement migration
- chore: rebuild dist zips
- chore: bump version
- Fix New conversation confirmation in Vivaldi
- chore: rebuild dist zips
- chore: bump version
- recognize branded CAPTCHA dialogs
- web: update the WebBrain vs Claude comparison videos
- allow CAPTCHA gate abandonment
- refine CAPTCHA challenge labels
- verify CAPTCHA gates across frames
- clear CAPTCHA gate after manual completion
- fix CAPTCHA preflight frame visibility
- fix CAPTCHA gate recovery edge cases
- web: hard-cut the demo's preroll cards instead of cross-dissolving
- harden CAPTCHA challenge correlation
- chore: rebuild dist zips
- chore: bump version
- fix CAPTCHA gate review findings
- ui: fade the chat nav pill when idle, link the settings title
- web: reframe the vertical demo's GitHub and YouTube chapters
- fix CAPTCHA dialog label detection
- recaptcha enterprise fixes
- web: let the demo's music fade out, and close a gap in the blur
- web: blur the prompt text in the demo's Bumble chapter
- web: replace the hero demo with the re-cut 79s version
- chore: rebuild dist zips
- chore: bump version
- fix: explain the selection-only boundary to the model
- harden captcha response field injection
- fail closed on ambiguous captcha frames
- fix opaque captcha targeting
- preserve explicit captcha token fallback
- web: label the feature toggle "Show more features"
- fix captcha field and mode conflicts
- fix: isolate saved workflows from selection scope
- target selected captcha response fields
- fix: isolate independent runs from selection scope
- harden captcha injection targets
- fix: handle scoped compact and attachments
- reconcile ancestor captcha loaders
- fix: clear unanchored selection scopes
- fix captcha marker and redirect visibility
- fix: close grounded selection escape paths
- keep hidden captcha candidates below visible widgets
- fix: preserve grounded selection follow-ups
- web: rework landing page around trust, and shorten the feature wall
- fix explicit Turnstile token injection
- fix captcha fragment and blank-frame injection
- fix: isolate selection-only model history
- docs: simplify the three READMEs and split reference material into docs
- allow explicit keys for Turnstile challenges
- reject conflicting captcha candidate parameters
- fix: let grounded shortcuts bypass attachment reads
- reject conflicting captcha actions
- fix opaque captcha frame handling
- fix captcha ancestor frame visibility
- fix: isolate selected-text model context
- fix frame-aware captcha solving
- chore: rebuild dist zips
- chore: bump version
- refactor(agent): finish the loop-detector extraction
- refactor(agent): test production loop detector
- fix(ui): match the full-screen start message to banner visibility
- docs: document --hide-recording-indicator in translated READMEs
- chore: rebuild dist zips
- chore: bump version
- chore: release v25.9.0
- fix(ui): hide invalid slash enter actions
- fix(ui): show full-screen recording indicator
- fix(agent): correct captcha version/edition detection and error triage
- fix(agent): parse action parameters with URL.searchParams to preserve decoded characters
- fix: disable mode-pill animation for prefers-reduced-motion
- fix(agent): scope Enterprise script detection and cross-reference v3 script render tags for anchor iframes
- fix(watch): close helper tabs, tolerate transient failures, harden beep dedupe
- fix: address review — guard test, de.js revert, firefox utils dedup
- fix(agent): prioritize rendered iframe anchors over script loader tags in URL candidate detection
- fix(agent): recognize declarative v3 markup with data-action on non-invisible DOM elements
- fix(agent): pre-flight check pageAction for v3 and do not infer v3 from data-action on DOM elements
- Apply suggestions from code review
- fix(agent): support Enterprise solution mapping in Chrome and restrict action lookup to widget
- fix(agent): handle Enterprise script detection before iframe render and v3 pageAction extraction
- fix(agent): scope Enterprise widget detection and expose isEnterprise in solve_captcha schema
- chore: add WebBrain Cloud interface strings and microphone permission messages to all locales
- fix(agent): support reCAPTCHA Enterprise and invisible URL parameter detection in CapSolver
- feat: centralize text sanitization and UI utilities while standardizing provider message logic
- docs: explain export and workflow formats
- fix(workflows): recover from start scope mismatch
- fix(watch): address polling review feedback
- rtl
- version update
- fix resize
- firefox parity
- new style for sidepanel tabs
- chore: rebuild dist zips
- chore: bump version
- Fix detached side panel window routing
- Update docs sidebars: rename Discord link and add Chinese community section
- chore: rebuild dist zips
- chore: bump version
- Fix store submission automation
- chore: rebuild dist zips
- chore: bump version
- Fix duplicate normalized streamed answers
- docs: add Discord support link to sidebar
- Keep composer locked while clearing
- Bound unavailable stop-state probes
- Wait for stopped run follower before clearing
- Suppress updates from cleared runs
- chore: rebuild dist zips
- chore: bump version
- Cancel schedules after active runs settle
- Scope New Chat aborts to their tab
- Discard queued prompts before clearing chats
- Redact JSON-shaped streaming secrets
- Guard Stop fallback with active run state
- Preserve Ask streaming trace order
- Keep stopped runs guarded until terminal state
- chore: rebuild dist zips
- chore: bump version
- Trace interactive Ask streaming lifecycle
- Fix evroc icon and add provider counts
- Settle local run follower before clearing chat
- Wait for direct runs before clearing chats
- verify find_text selection advancement
- Stop active runs before starting new chats
- preserve pending upload evidence
- fix find_text selection verification
- Add 76 LLM providers and Ask streaming
- dist: rebuild submission zips for v25.8.0
- chore: release v25.8.0
- polish sidepanel pickers and language menu
- add Inkling planner benchmark
- fix locale dropdown initialization and ordering
- Document Mistral stream usage requirement
- Avoid retrying terminal Ask stream errors
- missing piece from nl de add
- new languages de and nl
- Meter Mistral Ask streaming usage
- Keep Alibaba Ask non-streaming
- Enable Ask streaming across providers
- docs: sync documentation with recent changes
- docs: add z.ai GLM to provider lists
- chore: rebuild dist zips
- chore: bump version
- chore: rebuild dist zips
- chore: bump version
- Fix provider search result ranking
- Preserve streamed Markdown across panel restores
- chore: rebuild dist zips
- chore: bump version
- chore: rebuild dist zips
- chore: bump version
- Finalize restored streamed responses
- Reveal store review prompts over reading mode
- Preserve explicit chat reading positions
- Fix streamed Markdown rendering
- Keep Continue prompt clear of chat navigation
- Keep chat navigation visually floating
- Polish long-reply navigation controls
- Restore chats to the newest message
- chore: rebuild dist zips
- chore: bump version
- Reveal new questions before streaming
- Document release 25.7.8
- Purge retired release skill records
- Resume follow after forced chat jumps
- Show navigation for clipped replies
- Keep slash command output visible
- Remove orphaned release setup and routing
- Keep blocking prompts visible in reading mode
- Remove Chrome Web Store release from skills
- 25.7.8
- Add reading-first navigation for long replies
- chore: rebuild dist zips
- chore: bump version
- Reject historical refs in workflow text
- Harden portable workflow imports
- chore: rebuild dist zips
- chore: bump version
- wording fix
- chore: rebuild dist zips
- chore: bump version
- Require durable proof before continuing
- Restore cost-limit retry cards
- Render streamed allowance terminal cards
- Enrich restored allowance terminal events
- Add portable workflow transfer
- Preserve restored chat durability proof
- Route allowance cards from terminal state
- Keep allowance continuations resumable
- Preserve trusted field dispatch failures
- Use retry for pre-turn allowance stops
- Fix trusted contenteditable submissions
- chore: rebuild dist zips
- chore: bump version
- Update OpenAI model picker
- chore: rebuild dist zips
- chore: bump version
- Add sidepanel cost allowance bump
- fix(linkedin): reach shadow-DOM composer — pierce interop shell, hoist shadow dialogs, match Quill placeholders
- chore: rebuild dist zips
- chore: bump version
- Force tracing for cloud source runs
- chore: rebuild dist zips
- chore: bump version
- translate Hindi Portuguese Vietnamese Bengali and Persian locales
- Redact workflow updates before truncation
- Redact encoded workflow parameters
- Add cloud saved workflow bridge
- fix locale loading and language routing
- fix(screenshots): mechanical image→CSS click conversion + hi-DPI tabs-fallback alignment
- Add hi, pt, vi, bn, fa translations to Firefox, Chrome, and web locales
- Add missing st.skills.cws.* translations to all 15 Chrome locale files
- docs: add Ai2 response to Molmo2 benchmark
- dist: rebuild submission zips for v25.7.0
- chore: release v25.7.0
- chore: rebuild dist zips
- chore: bump version
- ui refinement
- ui refinement
- 25.6.1
- minor changes
- Fix planner fallback and answer delivery
- dist: rebuild submission zips for v25.6.0
- chore: release v25.6.0
- 25.5.2
- Add Ask-only OpenAI Responses streaming
- Add Nanbeige 4.2 planner benchmark
- dist: rebuild submission zips for v25.5.0
- chore: release v25.5.0
- drag'n drop reordering of steps in planner
- Capture plan editor scroll before input
- Keep plan step editing scroll stable
- 25.4.5
- Fix plan review scroll and run label
- chore: rebuild dist zips
- chore: bump version
- Harden mixed plan editor modes
- fix: distinguish find_text scan progress
- Preserve multiline plan step edits
- fix: search embedded frames with find_text
- Strip canonical plan tool suffixes
- fix: ground selection actions and page text search
- Preserve collapsed raw plan approvals
- Preserve raw plan edits after review
- chore: rebuild dist zips
- chore: bump version
- Improve plan review with structured in-place editing
- docs(watch): surface poll state and guarantees
- feat(watch): alert on distinct successful events
- fix(workflows): close review gaps for save, replay, and telemetry
- feat(watch): run conditional scheduler polls
- fix(webmcp): harden root-nav discovery and child enable lifecycle
- feat(watch): define slash command syntax
- fix: add missing z_ai.svg icon to firefox providers directory
- provider: add z.ai GLM-5.2 as a cloud provider
- fix(workflows): reject brittle selector replay
- fix(workflows): guard replay by page scope
- feat(workflows): replay saved actions safely
- feat(workflows): save and manage traced runs
- feat(workflows): add safe saved workflow schema
- Complete protected store recovery
- Scope Chrome indexes to blocking dialogs
- Preserve shadow keys and modal scope
- Track Chrome Web Store request dispatch
- fix(webmcp): close remaining lifecycle and discovery races
- Handle no-body offscreen responses
- Require inspection before store publish
- fix: scope modal select suppression
- fix(webmcp): harden frame permission and discovery races
- Fix Chrome Web Store release safeguards
- Scope interactive indexes to active modals
- fix: address PR review findings
- Harden native select text matching
- fix(cost): price OpenAI included cache writes
- fix: close agent runtime and persistence edge cases
- bugfix
- kimi3 rundown
- Add Chrome Web Store release workflow
- docs(cost): explain prompt cache estimation
- fix(cost): count streaming usage once
- feat(settings): configure prompt cache pricing
- fix(providers): preserve prompt cache usage
- fix(cost): account for prompt cache usage
- fix(webmcp): close discovery races cleanly
- fix(webmcp): bound frame discovery fanout
- bugfix
- fix(webmcp): scope removals to owning sessions
- fix(webmcp): retain reported execution contexts
- fix(webmcp): complete child-session discovery lifecycle
- fix(webmcp): aggregate out-of-process frame sessions
- kimi3 rundown
- fix(webmcp): discover pre-registered frame tools
- ci(webmcp): run real Chrome smoke coverage
- test(webmcp): bound real browser smoke phases
- test(webmcp): exercise cross-frame tool lifecycle
- test(webmcp): cover extension agent gates
- test(webmcp): exercise unpacked extension client
- test(webmcp): harden real Chrome smoke test
- chore: rebuild dist zips
- chore: bump version
- chore: drop unused runOptions arg from _prepareClarificationAuthorizationForRun call sites
- chore: rebuild dist zips
- chore: bump version
- Add Laguna M.1 planner benchmark
- Randomize WebBrain social promotion actions
- fix: preserve clarification guards across retries
- Add Laguna S 2.1 planner benchmark
- fix: isolate terminal scheduled actions
- fix: persist timeout guard before continuing
- fix(cloud): fail authorization-stopped runs
- fix(agent): block guarded plain completions
- fix(agent): preserve clarification-required run status
- fix: settle scheduled authorization stops
- fix: preserve stopped authorization boundaries
- fix: allow explicit scheduled retries
- fix: keep authorization stops durable
- fix: preserve scheduled clarification stops
- Block captcha solves after clarification timeouts
- Fix WebMCP invocation permission bypass
- webbrain citation for papers
- Keep clarification authorization unresolved across turns
- feat: gate WebMCP behind experimental setting
- Guard actions after clarification timeouts
- clear page loop state on route revisits
- reset document loop state on revisits
- scope navigation loop history to runs
- dist: rebuild submission zips for v25.4.0
- chore: release v25.4.0
- fix same-route document loop resets
- fix: catch navigation ping-pong loops and keep post-batch screenshots on early interrupts
- Round-trip automatic progress policy
- dist: rebuild submission zips for v25.3.0
- chore: release v25.3.0
- feat: use gpt-5.4-nano-2026-03-17 with max_completion_tokens
- Preserve reviewed submit requirements
- feat: switch from GitHub Models to OpenAI API directly (curl + OPENAI_SECRET)
- Add initial release note for WebBrain
- dist: rebuild submission zips for v25.2.0
- chore: release v25.2.0
- fix: revert to gpt-4o, remove max-completion-tokens
- Carry submit verification across continuations
- fix: add max-completion-tokens to avoid deprecated max_tokens error with gpt-5-mini
- fix: correct GitHub Models model ID to gpt-5-mini
- Identify WebBrain E2E control requests
- fix: switch changelog prompt from .prompt.yml to plain text files to avoid YAML parse error with release context substitution
- Diagnose Gnippets E2E HTTP failures
- Keep validation failures blocking completion
- Tighten submit completion evidence
- Scope short completion signals to trusted UI
- fix: add missing YAML separator to changelog prompt; default model to gpt-5.4-mini
- Require final form completion evidence
- Harden completion success evidence
- Track planner submission requirements
- Gate pending forms on submit attempts
- Ignore persisted verification placeholders
- Limit form completion guards to mutation tasks
- Preserve uncertain submit dispatch state
- Reconcile submit state from screenshot URLs
- Stop stale calls after completion page blocks
- Prevent completion guard loops
- chore: rebuild dist zips
- chore: bump version
- Preserve screenshots across batch interruptions
- Scope failed action loops to page state
- Disable action prompts in unattended CI runs
- chore: rebuild dist zips
- chore: bump version
- Accept camelCase final URLs in CI grading
- chore: rebuild dist zips
- chore: bump version
- Clear recovered action failure scopes
- Handle cloud run IDs and required skips
- Apply suggestions from code review
- Apply suggestions from code review
- Raise fetch_url default window to 7000
- Recover drafts after browser loop failures
- Harden small-model browser actions
- Validate mountain heights in CI rubric
- Harden set_checked marker identity
- Add recorded cloud E2E suite
- Teach compact agents idempotent checkbox use
- Require verified checkbox navigation loss
- Preserve checkbox navigation outcomes
- Make extension run recovery action-safe
- Preserve invalid checkbox identities
- Settle checkable click state
- Keep detached starts cancellation-safe
- Verify checkbox after route changes
- Harden source fetching and trace completion
- Refresh scope for form field refs
- Fail closed across incomplete run recovery
- Target invalid checkbox recovery
- Scope reconnect snapshots to their request
- Keep detached run starts active in the UI
- Make form recovery refs actionable
- Reconnect after runtime channel closures
- Track checkbox-triggered navigation
- Honor cancellation before retrying starts
- Settle checkbox and radio state reads
- Keep reconnect recovery safe on stop and quota errors
- Harden checkbox recovery verification
- Preserve fresh chat payload on recovery
- Address checkbox review edge cases
- Preserve run journal sequence on resume
- Use secure entropy for checkbox markers
- Fix idempotent checkbox state handling
- Prevent duplicate uncertain run starts
- Preserve detached run preflight errors
- Reconnect interrupted extension runs
- Fix sidepanel auto-scroll during streaming
- chore: rebuild dist zips
- chore: bump version
- test: assert full firefox parity for foodpanda adapter
- Enforce planned scheduling completion
- Fix AMO uploads and unsafe navigation
- Apply suggestions from code review
- 25.1.0
- Treat default shadow buttons as native submits
- agent: add adapter for foodpanda
- Scope validation evidence to submit context
- Gate Enter validation on form context
- Preflight unattended custom submits
- Preserve CDP submit evidence strength
- Allow heuristic custom submit validation
- Keep polling redirected validation pages
- Inspect iframe validation for selector submits
- feat: add experimental WebMCP CDP integration
- Detect persistent errors after corrections
- Narrow heuristic submit label fallback
- Keep heuristic submit probes weak
- Distinguish strong custom submit preflights
- Track ARIA corrections and script submits
- Skip validation for explicit non-submit buttons
- Release protocol picker guards after consume
- Reset residual picker guards before CDP
- Respect corrective button submit metadata
- Distinguish strong native submit evidence
- Intercept trusted file chooser dialogs
- Cover unattended iframe validation
- Suppress closed and delayed file pickers
- agent: add adapters for Bilibili and Xiaohongshu
- Detect validation errors after redirects
- Avoid validation probe code scanning alerts
- Cover delayed file picker activations
- Handle corrected validation retry state
- Recover page-world picker guards safely
- Tighten form validation resubmit detection
- Guard file pickers in the page world
- Surface ARIA validation error messages
- Block direct file picker activations
- Add handler-level test for import_config_patch storage merge
- Cover additional validation submit paths
- Resolve Chrome uploads inside shadow roots
- Handle validation retries across redirects
- Clarify provisioning config routing
- Guard trusted upload control fallback
- Allow corrected set_field validation retries
- Avoid picker guard waits during navigation
- Preserve managed cloud provider during sparse import
- Handle deferred upload picker activations
- Handle form validation failures reliably
- Add sparse provisioning config import
- Prevent stale file upload dialogs
- Fix slash command Enter actions after flags
- chore: rebuild dist zips
- chore: bump version
- Fix stale Stop WebBrain indicator
- chore: rebuild dist zips
- chore: bump version
- preserve indented title examples
- replace repaired streamed done summaries
- repair accepted done display summaries
- require valid closing fences in display repair
- reject unsafe page-title layout escapes
- preserve list-prefixed fenced title examples
- handle plain JSON-quoted page titles
- Release 25.0.0 with localized WebBrain post action
- repair JSON-quoted page titles
- address CodeQL URL assertion suggestions
- add suggested action: tweet webbrain
- Scope accessibility refs to page routes
- Normalize rich editor field verification
- Redact failed sensitive field readbacks
- Use canonical AX names for broad click guard
- Fix false agent stops and stale AX clicks
- Harden accessibility action verification
- Preserve permission hint source tab
- fix: self-verify scheduled task results
- Teach users how to skip permission prompts
- fix: keep Compact Dev blocked
- fix double-escaped assistant text
- fix: track iframe target dispatch
- fix: tighten completion action evidence
- fix: distinguish captcha preflight failures
- fix: resume trusted acted obligations
- fix: preserve restored obligation session keys
- fix: protect runtime obligation metadata
- fix: preserve terminal obligation state
- fix: normalize protected progress row keys
- fix: distinguish input preflight failures
- fix: reject stale batch obligation evidence
- fix: require model-visible screenshot evidence
- fix: mark click_ax preflight failures
- fix: allow observed non-success obligations
- fix: allow trusted preexisting target skips
- fix: ignore pre-dispatch click failures
- fix: align compact Dev and streamed completion UX
- fix: narrow completion observations to state reads
- fix: close remaining completion evidence gaps
- fix: stop stale calls after blocked completion
- fix: require prior-turn evidence for obligations
- test: align completion invariants with merged guards
- fix: close completion invariant review gaps
- feat: enforce runtime completion invariants
- Clear rejected plan-only stream text before recovery
- Drop allows_future_tense_result planner flag
- dist: rebuild submission zips for v24.4.0
- chore: release v24.4.0
- Skip stale calls after invalid done
- Make plain terminal recovery language neutral
- Align planner copy and replace streamed failures
- Preserve requested future-tense results
- Use complete escaping in dynamic test regexes
- Count explicitly requested app-state tools
- Keep promise guard for structured results
- Preserve structured blocker outcomes
- Harden mixed plans and streamed continuations
- Carry execution evidence across trusted continuations
- Preserve requested planner-shaped markdown
- Harden locale and poll safety gates
- Disable execution guard for managed cloud runs
- Use captured bounds for screenshot redaction
- Expose structured blockers in compact mode
- Keep native disclosures synthetic-only
- Preserve requested planner-shaped results
- Reject empty-step planner terminals
- Apply adapter policy to agent screenshots
- Exclude meta evidence and preserve plain blockers
- Address final trusted click review gaps
- Use page URLs in screenshot filenames
- Tighten mutation evidence and recovery status
- Add Save As to screenshot results
- Make plain final rejection explicit
- Avoid applying screenshot DPR twice
- Replace rejected streamed plans with failure status
- Harden trusted click fallback for merge
- Use structured planner intent for Act routing
- Keep execution guard on for negated approval waits
- Address remaining trusted-click review comments
- Treat question-form plan requests as plan-only
- Use adapter policies for infinite screenshots
- Bound infinite screenshot capture in MV3
- Close residual trusted click gaps
- Handle lazy full-page growth and fallback warnings
- Use actual viewport for full-page screenshots
- Fix full-page screenshot CDP metrics
- Harden trusted click fallback verification
- Trim compact plan execution guidance
- Enforce plan-to-execution handoff
- Address trusted click review feedback
- Add guarded CDP click fallback
- Reject plan-only terminal responses and continue into execution
- chore: rebuild dist zips
- chore: bump version
- Align Chrome pin coachmark
- bugfix
- fix: reserve recording session while saving to disk
- Fix provider picker CSS, a11y, and CodeQL URL sniffing
- fix: harden recording save path resolution
- Add provider brand icons and improve provider picker UX
- fix: report resolved download paths
- feat: improve first-install pin guidance
- chore: rebuild dist zips
- chore: bump version
- 24.2.1
- Preserve one-time Firefox downloads
- Honor GET-selected Firefox filenames
- Skip unnecessary Firefox filename probes
- Add first-install extension pinning guide
- Preserve Firefox download filenames
- Make download directory configurable
- dist: rebuild submission zips for v24.2.0
- chore: release v24.2.0
- Scope Kimi reasoning to active tool loops
- Gate Kimi reasoning replay by model
- Scope reasoning replay to compatible providers
- Persist provider key warnings across renders
- Scope Ollama guidance to WebBrain origin
- Preserve Kimi reasoning across tool loops
- Remove unsafe wildcard Ollama origin
- Fix provider activation key warning
- Fix Kimi temperature compatibility
- Fix Ollama origin guidance
- Fix Kimi transcription provider selection
- Improve provider setup guidance
- Add Kimi provider support
- Apply suggestions from code review
- chore: update URLs and references across doc and source files
- fix: exclude API mutations from delivery checkpoints
- fix: improve session delivery reliability
- chore: rebuild dist zips
- chore: bump version
- i18n: translate image-budget settings strings in all non-en locales
- fix(agent): validate image-budget storage and save full-res screenshots
- fix(chrome): image-budget review nits (indent, default select, compress budget)
- fix(agent): coord-aligned side-only budget + maxScreenshotsPerTurn skip signal
- feat(firefox): port image budget controls and close review items 1/4/5
- feat(chrome): image budget controls for screenshot quality + per-turn capture (issue #311)

## [28.1.2] - 2026-08-11

### Changed
- fix: preserve rich-text editor appends

## [28.1.1] - 2026-08-11

### Changed
- version up
- fix: enforce complete thread read coverage
- Fix restored compact tool details
- fix: honor complete thread read intent
- fix: require complete thread reads
- 28
- ci: make cloud smoke manual-only
- fix: toggle vision for custom local providers
- fix: detect vision for custom local providers
- fix: preserve local model capability identity
- feat: detect vision support for local providers
- Fix Ollama vision slash toggle
- Detect Ollama vision capabilities
- fix: address post-merge review findings
- feat: harden coupon domain refresh
- fix: call window.focus() before inputEl.focus() for focus-input command
- fix: use storage.onChanged for command dispatch instead of runtime.sendMessage
- docs: correct tab grouping visibility model
- fix(firefox): change focus-input shortcut from Ctrl+Slash to Ctrl+Period
- fix(firefox): add browser-level keyboard shortcuts via commands API
- test: preserve runner line endings
- test: cover automatic tab grouping opt-out
- feat(settings): add Firefox tab grouping preference
- feat(i18n): add zh Firefox tab grouping labels
- feat(i18n): add vi Firefox tab grouping labels
- feat(i18n): add uk Firefox tab grouping labels
- feat(i18n): add tr Firefox tab grouping labels
- feat(i18n): add tl Firefox tab grouping labels
- feat(i18n): add th Firefox tab grouping labels
- feat(i18n): add ru Firefox tab grouping labels
- feat(i18n): add pt Firefox tab grouping labels
- feat(i18n): add pl Firefox tab grouping labels
- feat(i18n): add nl Firefox tab grouping labels
- feat(i18n): add ms Firefox tab grouping labels
- feat(i18n): add ko Firefox tab grouping labels
- feat(i18n): add ja Firefox tab grouping labels
- feat(i18n): add id Firefox tab grouping labels
- feat(i18n): add hi Firefox tab grouping labels
- feat(i18n): add he Firefox tab grouping labels
- feat(i18n): add fr Firefox tab grouping labels
- feat(i18n): add fa Firefox tab grouping labels
- feat(i18n): add es Firefox tab grouping labels
- feat(i18n): add en Firefox tab grouping labels
- feat(i18n): add de Firefox tab grouping labels
- feat(i18n): add bn Firefox tab grouping labels
- feat(i18n): add ar Firefox tab grouping labels
- feat(settings): add Firefox tab grouping preference
- feat(settings): add Firefox tab grouping preference
- feat(settings): honor Firefox tab grouping preference
- feat(settings): honor Firefox tab grouping preference
- feat(settings): honor Firefox tab grouping preference
- feat(i18n): add zh tab grouping labels
- feat(i18n): add vi tab grouping labels
- feat(i18n): add uk tab grouping labels
- feat(i18n): add tr tab grouping labels
- feat(i18n): add tl tab grouping labels
- feat(i18n): add th tab grouping labels
- feat(i18n): add ru tab grouping labels
- feat(i18n): add pt tab grouping labels
- feat(i18n): add pl tab grouping labels
- feat(i18n): add nl tab grouping labels
- feat(i18n): add ms tab grouping labels
- feat(i18n): add ko tab grouping labels
- feat(i18n): add ja tab grouping labels
- feat(i18n): add id tab grouping labels
- feat(i18n): add hi tab grouping labels
- feat(i18n): add he tab grouping labels
- feat(i18n): add French tab grouping labels
- feat(i18n): add Persian tab grouping labels
- feat(i18n): localize Chrome tab grouping preference
- feat(settings): add Chrome tab grouping preference
- feat(settings): update Chrome agent tab grouping
- feat(settings): add tab grouping opt-out
- test: cover pinduoduo adapter
- agent: mirror pinduoduo adapter in firefox
- agent: add adapter for pinduoduo
- test: preserve run.js line endings
- ci: keep patch release changelog in sync
- test: cover patch release changelog ordering
- docs: backfill patch release changelog
- fix(captcha): serialize Cloudflare gate hydration
- fix(captcha): ignore unrelated response tokens
- fix(captcha): make English matcher additive
- fix(captcha): revalidate cleared token state
- fix(captcha): retire post-solve read inference
- fix(captcha): detect Cloudflare challenge pages
- ux improvements
- feat: generate coupon merchant coverage
- feat: add verified coupon code action
- documentation enhanced

## [28.1.0] - 2026-08-11

### Fixed
- Required complete communication-thread requests to read every page or expanded message before finishing, with multilingual intent handling and deterministic recovery across Chrome and Firefox.
- Restored compact tool-step **Details** controls after side-panel transcripts reload, including synchronized accessible expanded state in both browser builds.

### Tests
- Added mirrored coverage for complete-thread classification and pagination, premature-completion guards, bounded read windows, trace metadata, and restored compact detail toggles.

## [27.1.5] - 2026-08-08

### Changed
- Updated the LM Studio plugin for the current browser-delegation protocol.
- Added model-bound vision capability detection for llama.cpp, LM Studio, and LocalAI, with Auto / Force on / Off settings and fail-closed Chrome/Firefox request routing.

### Fixed
- Hid empty assistant placeholders until response content is ready to render.

## [27.1.4] - 2026-08-08

### Fixed
- Kept timed-out plan reviews visible and added an explicit retry path.

## [27.1.3] - 2026-08-08

### Fixed
- Corrected assistant response bubble width in the side panel.

## [27.1.2] - 2026-08-08

### Changed
- Expanded MCP setup and usage documentation.

### Fixed
- Reported API-mutation grants in the transcript and removed stale authorization presentation.

## [27.1.1] - 2026-08-08

### Changed
- Hardened CI integration and release security checks for the 27.1 series.

## [27.1.0] - 2026-08-08

### Added
- Added a value-free teacher mode (`/teach --start <name>` / `/teach --end`) that records a user's demonstrated clicks, field completions, checkbox/radio toggles, Enter submissions, and navigations into a tab-scoped session. The capture code never reads field values — only semantic identity — and every field action becomes a runtime parameter at the capture boundary. The session persists across navigation and compiles into the same `webbrain-workflow/1` format as successful runs. Automated runs are blocked while a teacher session is active for a tab.
- Added an interactive saved workflow manager (`/workflow`) to list, run, rename, export, and delete saved workflows in Chrome and Firefox.
- Added user-approved workflow locator healing: when a saved workflow target no longer matches uniquely, up to five independently replayable semantic candidates are presented for explicit single-selection. Approved replacements are applied atomically against the workflow's previous `updatedAt` value, so a concurrent edit wins instead of being overwritten; concurrent edits, unattended answers, and duplicate candidates can never authorize a healing.
- Added a WebBrain MCP server introduction blog post covering setup for Claude Code, OpenCode, Codex, and Cursor, the loopback security model, and how WebBrain MCP differs from headless browser tools.

### Changed
- Excluded WebBrain Cloud from per-run cost limits and metered dedicated vision provider costs separately, so vision-heavy WebBrain Cloud work does not count against the local/router cost allowance (Chrome and Firefox parity).
- Merged Cloud Bridge (MCP/LM Studio browser delegation) settings into Settings → General → Advanced → Cloud bridge, with synchronized setup guidance and the three bridge ports (MCP `17374`, LM Studio `17375`, WebBrain Cloud `17373`).
- Hardened screenshot and attachment handling: staged screenshots persist durably until delivery is confirmed at every call site, the per-turn screenshot budget charges only when a model actually receives the capture (vision description or attachment), redaction binds to capture time and scopes to rendered frames, and a child frame URL that cannot identify exactly one descriptor fails closed instead of risking mis-paired redaction regions.
- Did not stage a full-page screenshot when the capture-time privacy scan cannot prepare redaction geometry; the capture now reports `redactionUnavailable`, explains the blocker, and skips staging while still rendering the preview and save button (Chrome only).
- Removed the sticky API mutation badge from the Chrome and Firefox side panels. The `/allow-api` override now confirms once in the transcript instead of as a persistent composer badge.
- Passed trace run options through both Chrome and Firefox builds at startup.
- Allowed automatic i18n for AMO links and updated slash-command documentation across locales.

### Fixed
- Stopped sending automatic screenshots to text-only Ollama models by resolving the selected model's native `/api/show` vision capability before each run, with model- and case-sensitive-endpoint-bound caching, cancellable three-second metadata reads, legacy metadata fallbacks, live localized Auto / Force on / Off status, and Chrome/Firefox parity.
- Fixed a screenshot redaction fail-open path: the deferred full-page redaction now refuses the send when the snapshot had regions but `_redactScreenshotDataUrl` returned the bytes unchanged.
- Fixed `mergeRedactionFrameRegions` to return `null` under `requireCompleteFrameCoverage` when an object/embed subdocument or unpaired child frame has no DOM descriptor, instead of reporting the snapshot as complete.
- Fixed `loadStagedScreenshots` and `clearStagedScreenshots` to enumerate keys per-tab instead of reading all of `storage.local`, preventing 16 MB record churn on tab switch and reconnect.
- Fixed `consumePendingAttachmentsForTab` to key on `stagedAttachmentId` instead of object identity, preventing stale chips from wedging the composer after a rejection reconciled from storage.
- Fixed `reconcilePersistedStagedScreenshots` to only delete durable pixels on confirmed inclusion, preserving the user's only copy when delivery fails through a torn-down service worker.
- Fixed teacher submit capture and workflow cleanup to retain workflow claims and prevent stale submissions from clearing run claims prematurely.
- Preserved screenshots and attachments through terminal delivery, reconnect, and workflow replay, including cancelled-before-validation and unknown-delivery cases.

### Tests
- Added mirrored Chrome/Firefox coverage for teacher mode: value-free demonstration capture, session store normalization, automated-run rejection, Enter-as-submit semantics, and cross-browser slash-command wiring.
- Added mirrored coverage for the saved workflow manager, user-approved locator healing, atomic healing persistence with concurrent-update rejection, and workflow run-claim lifecycle.
- Added mirrored coverage for screenshot redaction fail-closed behavior, staged attachment recovery, viewport budget charging, full-page capture refusals, Cloud Bridge settings placement, and the WebBrain Cloud cost-limit exclusion.
- Updated `test/run.js` with the API badge removal assertions and the sidepanel authorization state checks.

## [27.0.0] - 2026-08-07

### Added
- Added the WebBrain MCP server so Claude Code, Codex, Cursor, OpenClaw, and other MCP clients can delegate Ask or Act tasks to an already-authenticated Chromium session through the local browser bridge, with tools for connection checks, status polling, clarification responses, and aborting runs.
- Updated the LM Studio plugin with the same authenticated-browser delegation through `browser_task`, `browser_status`, `browser_respond`, and `browser_abort`, while retaining its standalone `fetch_url` and `research_url` tools.
- Added a default-off persistent setting for API mutations and strict JSON Schema output support for WebBrain Cloud runs.

### Changed
- Hardened local bridge task handling across MCP and LM Studio with bounded command and run deadlines, resumable status polling, disconnect recovery, explicit run aborts, and actionable connection diagnostics.
- Improved Act follow-up routing and planner continuity so completed-step summaries remain available to later turns, and localized tool-completion status labels across Chrome and Firefox.

### Fixed
- Kept Ask-mode bridge runs read-only, rejected web-page WebSocket origins, preserved active runs across bridge disconnects, and prevented temporary API authorization or timeout state from leaking into later requests.
- Tightened WebBrain Cloud structured-output validation, secret redaction, public-URL handling, scheduled-job scoping, and run-ID generation without discarding valid schema-shaped results.
- Made iframe form automation fail closed on ambiguous targets and improved promoted-frame navigation, submission, and persisted-value verification in Chrome and Firefox.

### Tests
- Added MCP and LM Studio bridge suites covering connection handshakes, concurrent commands, polling, timeouts, clarification, aborts, disconnect recovery, and clean shutdown.
- Expanded WebBrain Cloud smoke scenarios and mirrored Chrome/Firefox regressions for structured output, privacy boundaries, iframe recovery, Act follow-ups, and localized completion states.

## [26.2.0] - 2026-08-06

### Changed
- Repaired minor release workflow ordering to ensure consistent build/publish sequencing.
- Rebuilt distribution zips for Chrome/Edge/Firefox to match the corrected release workflow.

### Fixed
- Fixed minor release workflow ordering issues that could lead to out-of-order release artifacts.

### Tests
- Updated `test/run.js` to align with the corrected minor release workflow behavior.

## [26.1.0] - 2026-08-05

### Added
- Added a Chrome and Firefox rich-text editor safety system that identifies formatting controls before text entry, uses visual confirmation when available, and requires a corrected, verified editor-body edit before a run can complete.

### Changed
- Unified toolbar classification across content scripts, DevTools Protocol targeting, iframe dispatch, and recovery so the same control is judged consistently through navigation and extension reinjection.
- Bounded safety captures within the configured per-turn screenshot budget while reserving the first guarded edit for structural or visual inspection.

### Fixed
- Prevented ordinary toolbar searches, compact composers, trusted focused fields, and labelled controls from being mistaken for formatting targets without supporting editor evidence.
- Kept recovery obligations attached to the correct editor, route, and frame across rerenders and navigation while preserving distinct live sibling frames.
- Failed closed on ambiguous cross-frame responses, conflicting geometry claims, and page-owned classifier substitutions without stranding a run in unrecoverable toolbar debt.

### Tests
- Expanded mirrored Chrome/Firefox regression and vision-probe coverage for toolbar variants, shadow DOM, nested iframes, navigation, screenshot limits, recovery deduplication, and verified corrected edits.

## [26.0.11] - 2026-08-05

### Changed
- Routed advice and drafting follow-ups through response-only handling when trusted conversation context is sufficient, even while Act mode is selected.
- Closed built-in tool schemas and made the runtime mode authoritative during execute tasks.
- Kept Turkish deasciification opt-in and instruction-only, with skill instructions loadable only from the enabled catalog after explicit conversion intent.
- Bounded Chrome and Firefox conversation, chat, and run-replay session snapshots so live work can continue safely when recovery persistence is unavailable.

### Fixed
- Rejected undeclared tool arguments and mixed click targets before dispatch with structured `invalid_tool_arguments` / `noDispatch` results.
- Suppressed planner-shaped JSON beside tool calls, retried planner-shaped terminals once, and replaced raw execute-protocol failures with a user-facing unverified-completion message.
- Prevented unknown required form values from being represented by empty focus, clear, or write actions.
- Normalized nested and object-shaped failures before UI, trace, and dedupe handling so `[object Object]` is never rendered.
- Made assistant-message Copy controls idempotent, added a localized **Copy message** label, and collapsed rejected `done` retries into one visible diagnostic row.
- Preserved acknowledged replay boundaries without false warnings while deduplicating genuine discarded-event gaps per request.
- Retried quota failures with compact snapshots, marked unrecoverable runs non-durable, warned once, and prevented consequential action replay after connection loss without deleting other tab/session data.

### Tests
- Added mirrored Chrome/Firefox coverage for closed schemas, disabled skill arguments, Act/planner enforcement, nested errors, Copy deduplication, replay boundaries, multi-tab quota exhaustion, attachment/screenshot compaction, and fail-closed reconnect durability.


## [26.0.10] - 2026-08-04

### Added
- Added a rich-text toolbar safety preflight that stops the agent from typing document text into an editor's formatting controls (font size, font family, style preset, colour, link). The target is scored structurally, confirmed against an annotated screenshot where a vision model is available, and blocked before dispatch; the run cannot report success until the edit is redone in the editor body and verified.

### Changed
- Text-entry tools now report verification as a positive proof only. `type_text`, `set_field`, and `iframe_type` mark an edit `verified` when the field's final value proves it landed and stay silent otherwise, instead of reporting an unproven edit as refuted. Masked inputs, `maxlength` truncation, framework-reformatted fields, and whitespace-normalising rich-text bodies no longer register as failed actions.
- `iframe_type` now binds its dispatch to a single resolved frame when a toolbar recovery is pending, and reports the candidate frame URLs so a `urlFilter` can disambiguate them. Ordinary calls keep the previous all-frames behaviour, so pages with repeated same-origin frames continue to work unchanged.
- Moved the toolbar heuristic into one shared module used by both browser builds and by the DevTools Protocol probe, so an element scores the same whichever dispatch route reaches it.

### Fixed
- Fixed the toolbar preflight taking a screenshot that was then discarded, which cost an extra capture and vision call on every guarded edit.
- Fixed the toolbar preflight treating `[role="toolbar"]` ancestry as evidence on its own. An ordinary labelled field in an app toolbar scored high enough to escalate, so with no vision model available the guard blocked prose typed into it and held the run open on a recovery that could never be discharged. A control now also needs a formatting label, a numeric preset value, or a toolbar whose editor body resolves.
- Fixed the append verification rescanning a field's full contents at every candidate position with arbitrary-precision arithmetic, which could stall a page holding a large rich-text document.
- Fixed the cross-frame geometry handshake accepting whichever frame answered first; a second frame claiming the same exchange now fails it closed.
- Fixed toolbar classifier screenshots escaping the per-turn screenshot budget. They now share the cap with the captures the model sees, so the number you configure bounds the vision spend. The first safety capture of a turn is still reserved, so a low cap degrades the check to structural scoring rather than blinding it on the first guarded edit, and both the reserved capture and the fall-back are surfaced.
- Fixed a navigation during an open toolbar recovery stranding the debt without the state that discharges it, which left the guard inactive for the rest of the run while completion stayed blocked and no corrected edit could clear it. An editor whose only recovery handle was a page-scoped ref now carries across as unknown-target recovery instead of being dropped.
- Fixed selector preflights trusting a page-owned toolbar-classifier global; the DevTools Protocol path now captures only the packaged classifier and fails closed when that source cannot be loaded.
- Fixed navigation and extension-recovery paths duplicating one semantic editor obligation or reinjecting `content.js` without its toolbar classifier. Child-frame scope survives navigation while live sibling frames remain distinct.

### Tests
- Added mirrored Chrome/Firefox coverage for the verification contract, the `iframe_type` fallback, the toolbar heuristic's false positives, and the recovery contract, and pinned the heuristic to a single implementation across both builds and the DevTools Protocol probe.
- Added mirrored Chrome/Firefox coverage for the debt and state maps agreeing across a navigation, in both directions: an obligation that loses its ref stays dischargeable, and a debt nothing can discharge is dropped with its state.

## [26.0.0] - 2026-07-26

### Added
- Added non-blocking local browser runs: regular Chrome and Firefox tasks stay pinned to their original tab without activating it or stealing window focus, while `/foreground [prompt]` provides a one-run compatibility escape hatch for sites that must render visually in the foreground.
- Added offline converters for exported traces in Agent Trajectory Interchange Format (ATIF) and OpenTelemetry Protocol (OTLP), with documentation and regression coverage.
- Added an accessible in-panel **New conversation** confirmation that works when Vivaldi Web Panels suppress native browser dialogs.

### Changed
- Rebuilt CAPTCHA handling around frame-aware challenge detection and targeted response injection for reCAPTCHA, hCaptcha, and Turnstile, including branded-dialog and ancestor-loader recognition, cross-frame verification, manual-completion recovery, explicit gate abandonment, and fail-closed handling for ambiguous or conflicting candidates.
- Isolated selected-text context from independent, scheduled, cloud, and saved-workflow runs while preserving grounded follow-ups, attachments, compaction, and shortcuts within the originating selection conversation.
- Extended the rapid duplicate-submit guard to Firefox and made acknowledged resubmits re-arm the protection window in both browsers.
- Refreshed and reorganized the English, French, and Chinese documentation, landing-page demos, language ordering, and agent/skills/slash-command references.
- Polished the floating chat-navigation control, linked Settings title behavior, full-screen recording status, and slash-command keyboard actions.
- Extracted shared loop-detection, image-budget, and text tool-call parsing helpers without changing their browser parity.

### Fixed
- Rejected blank Chrome full-page captures, improved background screenshot compatibility, and verified inactive Firefox tabs before declaring a run complete.
- Fixed CapSolver key migration so valid saved `CAP-` keys enable solving consistently while malformed keys remain disabled.
- Fixed selection-scoped history, workflow, attachment, and navigation paths that could leak context into unrelated runs.
- Fixed CAPTCHA frame visibility, challenge correlation, response-field targeting, token fallback, and recovery after redirects or manual completion.
- Fixed the full-screen recording message so it matches whether the recording indicator is actually visible.

### Tests
- Added mirrored Chrome/Firefox regression coverage for background runs, inactive-tab capture, CAPTCHA gating and injection, selection-scope isolation, duplicate-submit protection, trace conversion, and the updated UI flows.

## [25.9.0] - 2026-07-25

### Added
- Added 76 new LLM providers (icons, docs, and README updates across English, French, and Chinese) alongside interactive Ask-mode streaming support for the expanded provider list.
- Added a `/watch` slash command with conditional scheduler polling, alerts on distinct successful events, dedupe-aware helper-tab cleanup, transient-failure tolerance, and locale/docs coverage.
- Added reCAPTCHA Enterprise support to the Chrome CapSolver agent tool, including v3/Enterprise widget and script detection across DOM, URL, and iframe paths, an `isEnterprise` schema field, and clearer parameter-vs-dispatch error triage.
- Restyled sidepanel tabs in Chrome and Firefox, with resize and RTL layout fixes.
- Published workflow export/import format documentation.

### Changed
- Centralized text sanitization and shared UI utilities and standardized provider message logic across Chrome and Firefox, including a Firefox utils dedup follow-up.
- Hardened interactive Ask streaming: traced the streaming run lifecycle, preserved trace ordering, redacted JSON-shaped streaming secrets, and fixed duplicate normalized streamed answers.
- Hardened chat/run clearing and cancellation: kept the composer locked while clearing, bounded unavailable stop-state probes, waited for stopped/local/direct run followers before clearing, suppressed updates from cleared runs, guarded the Stop fallback and stopped runs until a terminal state, scoped New Chat aborts to their originating tab, discarded queued prompts before clearing, stopped active runs before starting new chats, and cancelled schedules once active runs settle.
- Added WebBrain Cloud interface strings and microphone permission messages to all locales, refreshed the evroc provider icon and provider counts, and updated Discord links and added a Chinese community section to the docs sidebars.
- Disabled the mode-pill animation for `prefers-reduced-motion`.

### Fixed
- Fixed detached side panel window routing in Chrome.
- Recovered workflow replay from a start-scope mismatch.
- Parsed action parameters with `URL.searchParams` to preserve decoded characters.
- Preserved pending upload evidence and fixed `find_text` selection verification and advancement.
- Fixed store submission automation.

### Tests
- Added mirrored Chrome/Firefox coverage for CapSolver Enterprise version/edition/action detection and error triage, `/watch` polling and dedupe behavior, and the centralized UI/text-sanitization utilities.

## [25.8.0] - 2026-07-23

### Added
- Added Inkling planner benchmark (OpenRouter default, Chrome thinkingmachines/inkling frozen fixtures) and published the corresponding benchmark docs/blog page.

### Changed
- Improved sidepanel UI polish for picker controls and the language menu.
- Added new UI locales for **de** and **nl**, including flag assets, and updated locale ordering/initialization to match expected dropdown behavior in both **Chrome and Firefox**.
- Updated provider/model documentation and synced docs with recent streaming requirements (including explicit Mistral stream usage guidance).
- Enabled Ask streaming behavior updates across providers while aligning provider-specific streaming/usage expectations.
- Rebuilt distribution zips for Chrome/Edge/Firefox.

### Fixed
- Fixed locale dropdown initialization and ordering issues (including missing locale pieces for **nl**/**de**).
- Avoided retrying terminal Ask stream errors to prevent incorrect fallback behavior.
- Corrected provider streaming usage handling for Mistral Ask (ensuring required usage/stream events are used as documented).
- Preserved provider-specific streaming compatibility rules (e.g., keeping Alibaba Ask non-streaming where required).

### Tests
- Added Inkling planner benchmark result fixtures to the test suite (Chrome thinkingmachines/inkling frozen set).

## [25.7.12] - 2026-07-23

### Changed
- Expanded interactive Ask streaming from GPT-5.6 to documented streaming- and function-calling-capable official OpenAI models, while keeping GPT-5.5 Pro and other unsupported variants non-streaming.
- Routed Responses-only GPT-5 Pro variants through the Responses API and retained Chat Completions streaming for other supported OpenAI models.
- Enabled interactive Ask streaming for Anthropic, Azure OpenAI, Gemini, DeepSeek, xAI, Mistral, Nvidia NIM, Groq, Together AI, Fireworks, z.ai, OpenRouter, WebBrain Cloud, llama.cpp, Ollama, LM Studio, Jan, vLLM, SGLang, and LocalAI with provider-specific terminal-event validation.
- Generalized the Advanced streaming control and made safe transport/protocol fallback silent: the affected generation retries non-streaming once, then streaming stays disabled for the rest of that run.

### Fixed
- Treat premature official OpenAI Chat Completions stream EOF as an interrupted generation, clearing partial text and retrying once through the non-streaming path.
- Normalized GPT-5 Pro reasoning effort to its supported `high` value.
- Propagated explicit Chat Completions, Anthropic, and Azure in-stream API error events instead of accepting a later terminal sentinel as success; HTTP/API errors never trigger the silent fallback.
- Rejected OpenAI-compatible and Azure streams that finish with `content_filter`, clearing any partial text instead of persisting a filtered response or retrying it non-streaming.
- Added the documented `gpt-5.2-chat-latest` model to official OpenAI Ask streaming capability detection.
- Hardened llama.cpp streaming with readable-body, malformed-frame, explicit-error, usage, reasoning, and terminal `[DONE]` handling before enabling its silent non-streaming fallback.
- Added z.ai's required `tool_stream` request option for streaming generations that expose agent tools.
- Preserved Groq token usage delivered in the provider-specific `x_groq` streaming envelope.
- Rejected z.ai streams that finish with `sensitive`, `network_error`, or `model_context_window_exceeded` instead of persisting partial output as a successful response.
- Kept Alibaba Cloud Ask calls non-streaming because DashScope rejects its required `tools` payload when `stream: true`.
- Requested Mistral streaming usage events explicitly so interactive Ask turns remain included in cloud cost allowances.
- Preserved in-progress streamed Markdown across side-panel/sidebar closes, reloads, and reconnects in Chrome and Firefox.
- Rebuilt restored streams from the background-owned UI journal without duplicating deltas, losing Markdown structure, or leaving an unfinished stream in its incremental render state.

### Tests
- Added mirrored Chrome/Firefox coverage for OpenAI streaming capability detection, GPT-5.4 Pro routing, Chat Completions completion sentinels, and transport fallback.
- Added mirrored capability, terminal-event, malformed-frame, explicit-error, content-filter, and silent one-time fallback coverage for the newly enabled providers.
- Added mirrored regression coverage for persisted streamed text, reconnect replay, restored finalization, and journal size limits.

## [25.7.11] - 2026-07-23

### Fixed
- Ranked provider Settings search results by exact provider name/ID, then prefix, then substring matches while preserving the configured provider order for ties.

### Tests
- Added Chrome and Firefox provider-search ranking coverage.

## [25.7.10] - 2026-07-23

### Fixed
- Rendered streamed assistant output as Markdown while deltas arrive and finalized the same message when the terminal response is received.
- Replaced rejected or corrected streamed terminal content instead of appending a duplicate response.
- Finalized restored streamed responses consistently after reconnect.

## [25.7.9] - 2026-07-23

### Changed
- Refined reading-first navigation so new questions remain visible while long responses grow, explicit reader positions are preserved, and restored chats return to the latest turn.
- Added floating **Follow response**, **Jump to latest**, and **Back to question** controls for clipped long replies.

### Fixed
- Kept Continue bars, plan/clarification prompts, store-review prompts, new questions, and slash-command output visible when they require attention.
- Resumed live follow after an explicit jump to the response edge without overriding deliberate reading positions.

## [25.7.8] - 2026-07-23

### Added
- Added reading-first navigation for long replies across Ask, Act, and Dev modes in Chrome and Firefox.

### Removed
- Removed the packaged Chrome Web Store release skill, its privileged upload/publish routing, setup UI, dashboard adapter, protected-page exception, and previously seeded local skill records.

### Fixed
- Kept blocking prompts and slash-command output visible without losing live follow when a run resumes.
- Kept the navigation control available whenever response content extends below the viewport.

### Tests
- Added mirrored long-reply navigation, localization, restored-turn, and instant auto-follow regression coverage.

## [25.7.6] - 2026-07-22

### Added
- Added portable saved workflow JSON export and import commands with Chrome and Firefox parity.

### Changed
- Updated the official OpenAI model picker to list current dated model variants.
- Portable workflow imports are normalized, size-bounded, assigned fresh local identity, and rejected when unsafe or over the saved-workflow limits.

### Tests
- Added mirrored portable workflow parsing, file transfer, redaction, fresh-identity, and account-limit coverage.

## [25.7.0] - 2026-07-22

### Added
- Added safe saved workflow schema and UI support for saving and managing traced runs (Chrome and Firefox parity).

### Changed
- Updated workflow replay to use the new safe saved workflow schema, improving reliability and reducing brittle replay behavior (Chrome and Firefox parity).
- Updated documentation for privacy/data flow and security model to reflect saved workflow/replay behavior.

### Fixed
- Guarded workflow replay by page scope to prevent cross-page/brittle replays.
- Rejected brittle selector replay during saved workflow replay to avoid incorrect actions.
- Improved workflow replay safety by replaying saved actions in a more controlled manner.
- Closed workflow gaps for save, replay, and telemetry to ensure consistent end-to-end behavior (Chrome and Firefox parity).

### Tests
- Updated test runner (`test/run.js`) to align with the saved workflow/replay changes.

## [25.6.0] - 2026-07-22

### Added
- Added Ask-only OpenAI Responses streaming for interactive Ask-mode chats (Chrome and Firefox parity).

### Changed
- Updated planner benchmark coverage by adding Nanbeige 4.2 planner benchmark results to the repo.

### Fixed
- Improved structured plan review/editor stability by preserving editor scroll position across input and keeping step editing scroll stable (Chrome and Firefox parity).

### Tests
- Added Nanbeige 4.2 planner benchmark fixtures/results to the test suite.

## [25.5.0] - 2026-07-22

### Added
- Added a default-on Advanced setting to disable OpenAI Ask response streaming immediately and return new chats to the established non-streaming provider path.
- Improved plan review with structured, in-place editing (Chrome and Firefox parity).

### Changed
- Official OpenAI Responses calls now stream visible text for interactive Ask-mode chats while retaining the detached `chat_start` lifecycle, reconnect journal, and image/text attachment handling.
- Tool calls and assistant-history persistence remain buffered until `response.completed`; Act, Dev, scheduled, cloud, and Continue runs remain on `provider.chat()`.
- Drag-and-drop reordering of planner steps.
- Hardened mixed plan editor modes to keep editing behavior consistent.
- Preserved multiline plan step edits during editing and review flows.
- Preserved collapsed raw plan approvals through review.
- Preserved raw plan edits after review.
- Stripped canonical plan tool suffixes for cleaner plan tool display.

### Fixed
- Interrupted OpenAI Ask transports now clear their partial visible text, open a per-run circuit breaker, and retry through `provider.chat()` without accepting incomplete tool calls or persisting an incomplete assistant turn; terminal HTTP, API, and `response.incomplete` errors propagate without a duplicate fallback request.
- Live Ask text deltas remain immediate while durable reconnect snapshots are coalesced on a short trailing interval, avoiding a full journal clone and `storage.session` write for every SSE chunk; terminal updates and tool checkpoints still flush immediately.
- Fixed plan review scroll behavior and the run label during plan review/editing.
- Kept plan step editing scroll stable while interacting with the editor.
- Captured plan editor scroll before input to prevent scroll jumps.

### Tests
- Added mirrored Chrome/Firefox coverage for streaming scope, attachment delivery, terminal tool-call gating, coalesced reconnect persistence, detached lifecycle wiring, the kill switch, and transport-only non-streaming fallback.
- Updated test runner (`test/run.js`) to align with the new plan editor/review behaviors.

## [25.4.2] - 2026-07-22

### Added
- Added a default-disabled packaged Chrome Web Store release skill with trusted status, ZIP upload, and publish tools backed by the official v2 API in Chrome and Firefox.
- Added skill-scoped setup for user-owned Google OAuth credentials, publisher/item IDs, and an explicitly selected local release ZIP.

### Changed
- Added a Chrome Web Store dashboard adapter that routes enabled runs to the release skill instead of protected DOM controls.

### Fixed
- Added an always-on Chrome protected-page guard for the Chrome Web Store Developer Dashboard so DOM tools fail immediately and non-retryably instead of entering wait/read retry loops.

### Security
- Kept OAuth tokens and release ZIP bytes in extension-local storage and out of model prompts, tool arguments, traces, and tool results; upload and publish remain behind consequential-action permission and submission gates.

## [25.4.0] - 2026-07-21

### Added
- Added round-trip automatic progress policy to improve completion reliability across the full submit → completion → evidence loop.

### Changed
- Updated OpenAI model invocation to use `gpt-5.4-nano-2026-03-17` with `max_completion_tokens`.
- Preserved reviewed submit requirements across continuations to keep validation consistent when a run resumes.
- Hardened submit completion evidence requirements (including final-form completion evidence) to reduce false positives.
- Improved submit-state reconciliation by carrying submit verification across continuations and reconciling from screenshot URLs.
- Updated Chrome and Firefox builds to reflect the above completion/submit policy changes for parity.

### Fixed
- Prevented completion guard loops and stopped stale calls after completion-page blocks.
- Tightened completion success evidence to avoid accepting incomplete or uncertain outcomes.
- Improved handling of validation failures so they remain blocking for completion.
- Fixed CI/release robustness issues related to changelog prompt parsing and release-context substitution.

### Tests
- Added/expanded CI grading and E2E coverage to diagnose Gnippets HTTP failures and validate cloud E2E control requests.
- Added CI robustness improvements for unattended runs (disabling action prompts) and tightened grading inputs (e.g., accepting camelCase final URLs in CI grading).

## [25.3.0] - 2026-07-21

### Added
- Added initial release note scaffolding for WebBrain.

### Changed
- Updated OpenAI model usage to **gpt-5.4-nano-2026-03-17** and switched to `max_completion_tokens` for completion limits.
- Switched WebBrain Cloud provider integration from **GitHub Models** to direct **OpenAI API** calls (using `OPENAI_SECRET` via curl), improving consistency across providers.
- Updated Chrome and Firefox builds to reflect the provider/model changes and associated configuration/UI updates.

### Fixed
- Resolved model-parameter compatibility issues by ensuring `max_completion_tokens` is used where required (avoids deprecated `max_tokens` errors).
- Corrected prior provider model ID handling during the transition away from GitHub Models.
- Improved release/changelog generation robustness by avoiding YAML parsing issues in the release prompt pipeline.

### Tests
- Added/expanded CI grading and E2E infrastructure coverage to better diagnose HTTP failures and validate cloud E2E control requests.
- Added CI robustness improvements for unattended runs (disabling action prompts) and tightened grading inputs (e.g., accepting camelCase final URLs).

## [25.2.0] - 2026-07-21

### Added

### Changed

### Fixed

### Tests
- Comprehensive test suite established for validating core functionality and browser compatibility.

## [25.0.0] - 2026-07-19

### Added
- Added runtime completion invariants in Chrome and Firefox that track consequential actions, require a fresh successful observation before accepting a success claim, and preserve verification obligations across batched calls, trusted continuations, restored runs, and scheduled tasks.
- Added localized permission education after repeated action prompts, with an onboarding note and a safe action that inserts `/dangerously-skip-permissions` for the specific pending prompt without overwriting an existing draft.
- Added a permanent, fully localized **Tweet about WebBrain** recommended action that opens X's visible composer, publishes reviewed language-specific copy without asking the model to write or translate it, then verifies and reports the post URL when available.

### Changed
- Action runs now reject plan-only, empty-step, promise-only, and premature terminal replies and continue into execution; explicitly requested plans and Markdown plus honest structured blockers remain valid results.
- Completion enforcement now distinguishes real dispatch from preflight failures, accepts only model-visible state observations, self-verifies successful scheduler writes, and preserves the intended Compact Dev and managed-cloud execution boundaries.

### Fixed
- Prevented stale tool calls from running after a rejected `done`, cleared rejected streamed plan text before recovery, preserved terminal obligation and session metadata, and rejected stale or same-batch completion evidence.
- Repaired high-confidence double-escaped assistant Markdown returned by OpenAI-compatible backends without rewriting legitimate code, paths, or escape-sequence examples.
- Hardened accessibility actions with document- and SPA-route-scoped refs, fresh-target and visibility checks, canonical accessible names, iframe dispatch tracking, and safer guarded-click progress detection, preventing stale clicks and false agent stops.
- Made `set_field` wait for controlled and rich-text editors to settle and require an exact normalized readback before submitting; failed sensitive-field readbacks no longer expose typed values.
- Corrected false completion blocks for denied, skipped, or pre-dispatch actions; pre-existing targets; input and CAPTCHA preflight failures; screenshots not visible to the model; observed non-success outcomes; and self-verified scheduled tasks.

### Tests
- Expanded mirrored Chrome and Firefox regression coverage for plan-to-execution handoffs, completion-invariant state and recovery, permission education and tab scoping, assistant-text repair, accessibility refs and field verification, and exact localized WebBrain post copy.

## [24.4.0] - 2026-07-18

### Changed
- Add guarded CDP click fallback + full screenshot bugfix

## [24.3.1] - 2026-07-18

### Changed
- Chrome `click_ax` stays synthetic-first and may issue one guarded CDP trusted-click fallback only after no observable progress on safe generic targets (visibility, hit-test, interactive-descendant, form/download/mutating/stateful exclusions).
- Trusted-click progress proof ignores whole-page text churn and blur-only focus loss; safety vetoes skip automatic retry without rewriting working clicks to failure.

### Fixed
- Removed invalid CDP `Input.enable` usage; trusted mouse events dispatch directly.
- Observation windows for fallback candidates poll progressively so slower SPA handlers can still prove progress before a second click.

### Tests
- Added unit and fixture coverage for eligibility gates, one-shot fallback accounting, network/beacon vetoes, and post-CDP target-state verification.

## [24.3.0] - 2026-07-17

### Changed
- Replaced the first-install fake toolbar walkthrough with a real **Open Side Panel** action in Chromium and **Open Sidebar** action in Firefox.
- Added an accessible Chromium first-open coachmark that points to the browser's actual side-panel pin, mirrors its arrow for left-side layouts such as Vivaldi, and clearly distinguishes that pin from the toolbar icon it adds.
- Kept Firefox guidance aligned with its native Extensions menu and refreshed the install flow across all 16 supported locales.
- Report the browser-resolved absolute path after WebBrain screenshots, recordings, transcripts, and run captures finish saving, including configured subfolders and uniquified filenames.

### Fixed
- Removed non-interactive toolbar and extension-menu illustrations that looked clickable but could not complete setup.
- Sequenced the Chromium pin coachmark before the existing model and safety onboarding so first-time setup has one clear action at a time.
- Kept keyboard focus inside the pin coachmark while it is open and added an explicit **Skip this step** exit so first-run setup cannot strand the user.
- Prevented early install-page clicks from disappearing, kept first-open tabs in the normal WebBrain panel group, and replaced premature success styling with browser-specific recovery guidance.

### Tests
- Added Chrome and Firefox coverage for real panel opening, first-install coachmark state, modal focus handling, explicit dismissal paths, left/right arrow layout, native Firefox wording, responsive behavior, reduced motion, and locale parity.

## [24.2.0] - 2026-07-17

### Changed
- Add Kimi provider support

## [24.1.0] - 2026-07-16

### Changed
- import/export configs

## [24.0.2] - 2026-07-16

### Added
- Added `/export --config` to download a portable JSON snapshot of settings and `/import <json>` or `/import --file` to restore one in Chrome and Firefox.
- Included provider, vision, transcription, and CAPTCHA API keys in configuration snapshots, with an explicit plaintext-secret warning before export and import.

### Changed
- Limited configuration snapshots to settings-backed state, excluding device-bound sync identifiers and tokens, conversations, traces, jobs, and usage counters.

### Tests
- Added mirrored coverage for configuration schema completeness, round trips, validation failures, file selection, slash-command routing, and background import/export handlers.

## [24.0.1] - 2026-07-16

### Added
- Added hidden trailing `/record [--save-as <filename>]` and `/screenshot [--save-as <filename>]` prompt suffixes. Recording now wraps a Chrome run and saves automatically; screenshot capture saves timestamped or custom-named before/after PNGs in Chrome and Firefox. The suffixes remain intentionally absent from `/help` and autocomplete.

### Fixed
- Kept agent-created reference tabs in the background so Chrome and Firefox runs remain visibly attached to their original tab.
- Detected Firefox-protected Mozilla domains before blocked DOM or network reads, used one active-tab screenshot fallback where possible, and stopped equivalent non-retryable attempts instead of looping.
- Treated Responses streams that end without `response.completed` as incomplete instead of persisting partial output as a successful turn.
- Preserved unsaved custom request-body JSON drafts across provider search, filtering, and card re-renders, including temporarily invalid JSON while editing.
- Re-activate the originating run tab before the after screenshot when a run opens another tab.
- Restored Mozilla Add-ons developer adapter matching after the hostname-hardening matcher rename.
- Rebuilt the Chrome, Edge, and Firefox 24.0.1 archives from the final source tree.

### Tests
- Added regression coverage for background tab ownership, Firefox restricted-domain handling, bounded read retries, premature Responses stream termination, and compatibility JSON draft persistence.
- Added mirrored parser, filename sanitization, lifecycle ordering, Downloads saving, Chrome recorder identity, and Firefox unsupported-recording coverage for hidden run capture.

## [24.0.0] - 2026-07-16

### Added
- First-class **GPT-5.6** support for official OpenAI: default model `gpt-5.6-terra`, UI suggestions for Terra / Sol / Luna, and a **1,050,000**-token context window for the `gpt-5.6*` family.
- Official OpenAI GPT-5.6 routes through the **Responses API** (`/v1/responses`) with encrypted reasoning replay (`response_items`), function-call conversion, streaming, and usage normalization. Older models and custom/proxy base URLs stay on Chat Completions.
- **Advanced model compatibility** settings on every provider card: preset (Auto / OpenAI / Qwen / DeepSeek / OpenRouter / Custom), reasoning effort, system vs developer role, max-token field, and safe custom request-body JSON.
- Shared `provider-compatibility.js` layer (Chrome + Firefox) that maps roles, token fields, reasoning knobs, and merges protected extra body fields for OpenAI-compatible, Azure OpenAI, and llama.cpp request builders.
- Documented the release in `WHATS_NEW_IN_V24.md` at the repository root.

### Changed
- OpenAI-compatible request building is centralized so compatibility presets apply consistently without mutating stored chat history.
- OpenAI default cost metadata migrates safely when upgrading from earlier shipped defaults.

### Tests
- Added / retained coverage for Responses routing, reasoning replay, streaming, provider-compatibility merges, GPT-5.6 context windows, and default-model migration.

## [23.3.6] - 2026-07-15

### Added
- Added a default-on **Help Improve WebBrain** control at the bottom of the visible Settings → General area in Chrome and Firefox. WebBrain Cloud requests now send the current choice as `X-WebBrain-Help-Improve: 1` or `0`; local-model and bring-your-own API requests never receive that header.

### Changed
- Updated the public privacy policy and developer data-flow documentation to disclose selected WebBrain Cloud interaction retention and model-improvement use, the future-interaction opt-out, a 12-month raw-data limit, and a five-year limit for de-identified datasets.
- Added opaque per-conversation WebBrain Cloud session grouping across main, planner, compaction, intent, memory, and vision generations, with permanent opt-out tainting and no collection metadata on local or bring-your-own providers.
- Added encrypted, compressed, text-and-tool-only Cloud improvement storage with image omission, authenticated session browsing, de-identified JSONL export, 12-month pruning, and isolated OpenRouter logging/no-logging key routing.

### Tests
- Added mirrored coverage for the default-on UI, persistence and live provider reload, Cloud-only request headers, locale completeness, and privacy-policy retention language.

## [23.3.3] - 2026-07-15

### Changed
- Clarify timeout slider semantics: **0 = Instant** (always auto-select the first option), **1–1200s = wait then auto-select**, and **above 1200s (slider max / Off) = wait indefinitely**. Existing stored `0` (old Off) migrates once to Off.
- Instant clarify auto-selects use `source=auto` and tell the agent to continue (intentional unattended policy, e.g. headless); only waited `source=timeout` keeps the non-confirmation warning.

### Tests
- Updated Chrome and Firefox clarify-timeout coverage for Instant / Off slider endpoints, one-shot semantics migration, and Instant vs waited-timeout agent notes.

## [23.3.2] - 2026-07-15

### Added
- Added a configurable clarify auto-timeout (default 60s, 0–1200s under Settings → General → Advanced) for Chrome and Firefox. Unanswered `clarify` prompts auto-select the first option (or a timeout marker when options are empty); permission and form-submit confirmations stay untimed.

### Changed
- Documented that timeout auto-selects are not real user confirmations in the `clarify` tool schema and system prompts, and kept timeout answers out of user-memory extraction.

### Fixed
- Cleared scheduled-job `needs_user_input` / `pendingClarify` on clarify auto-timeout without replaying a start-of-run `running` event that could orphan the original assistant bubble.
- Restarted clarify countdown metadata after sidepanel restore/rebind so closed panels do not leave stale open cards.

### Tests
- Added Chrome and Firefox regression coverage for clarify timeout settings, schema/prompt guidance, scheduler wait-state cleanup, restore countdown metadata, and memory exclusion of timeout sources.

## [23.3.1] - 2026-07-15

### Changed
- Added bounded canonical semantic intents to the shared on-demand skill catalog so the planner and `load_skill` can route multilingual requests without literal keyword matching or an extra embedding call.
- Let approved Act plans activate validated skill IDs before execution, with Dev inheriting Act-compatible skills, Ask limited to explicitly compatible skills, and Compact remaining skill-free.
- Added recording and exporting WebBrain versions to new traces, conversation Markdown, trace Markdown, and Traces-page JSON while labeling legacy recording versions unavailable.

### Fixed
- Redirected single-media browser download attempts to an eligible inactive FreeSkillz skill, including exact-permalink discovery on feeds and profiles, while preserving browser fallback only after a real server failure or unavailable skill.
- Prevented the agent path from saving split or unverifiably muxed MSE audio/video buffers or presenting ffmpeg and login advice as a successful result.

### Tests
- Added Chrome and Firefox coverage for intent normalization and catalog isolation, planner activation and rejection, multilingual routing metadata, inactive-skill redirects, strict MSE refusal, and versioned current and legacy exports.

## [23.3.0] - 2026-07-15

### Changed
- Load browser skills on demand

## [23.2.2] - 2026-07-15

### Changed
- Made enabled skills available on demand: Mid/Full Ask, Act, and Dev runs receive a small eligible name/summary catalog, full instructions and compatible tools load only for the current relevant run, and Compact exposes no skill surface.
- Added optional prompt-stripped `webbrain-skill` metadata for capped summaries and explicit Ask/Act compatibility while preserving existing skill storage and `webbrain-tools` manifests.

### Fixed
- Replaced ambiguous Content-Disposition filename matching in Chrome and Firefox public-media downloads with a bounded single-pass parameter parser that preserves RFC 5987 precedence and fails closed on malformed quoted values.

### Tests
- Added mirrored coverage for skill catalog eligibility, activation isolation and reset, strict-secret ordering, recommended-action preactivation, and adversarial Content-Disposition filename parsing.

## [23.2.0] - 2026-07-14

### Added
- Added an opt-in packaged Litterbox temporary file-share skill for Chrome and Firefox, available from Settings with explicit `clarify` confirmation, public-link and absolute-expiry warnings, blocked-file preflight checks, browser-specific upload limits, and visible provider attribution. Uploads go through the Litterbox page with `upload_file`, so no `/allow-api` override is needed and file bytes never reach the LLM provider.
- Added opt-in Open-Meteo weather and Open Library book-search skills for Chrome and Firefox. The read-only, no-key integrations clarify ambiguous locations, keep metric and imperial weather units consistent, limit catalog responses, treat provider data as untrusted, and show visible source attribution.
- Added disabled-by-default Together AI and Fireworks OpenAI-compatible router providers for Chrome and Firefox, including Settings fields, suggested models, configurable endpoints, API-key links, and streaming-usage support.

### Changed
- Classified Together AI and Fireworks consistently as router providers and migrated older saved category values without dropping stored credentials.

### Fixed
- Prevented host-page capture listeners from intercepting keyboard input inside the selection shortcut by loading its containment handler at `document_start` and isolating keydown, keypress, and keyup events.
- Kept the selected text visibly highlighted while the selection menu is open, bounded the overlay to 200 visible rectangles, and cleared highlights when the menu closes or is dismissed.

### Tests
- Added packaged-skill catalog and Litterbox safety, privacy-disclosure, upload-flow, browser-limit, and expiry coverage.
- Added Chrome and Firefox coverage for Open-Meteo units and tool manifests, Open Library search and attribution, Together AI and Fireworks provider defaults and migrations, and selection-shortcut keyboard containment and bounded highlights.

## [23.1.2] - 2026-07-14

### Added
- Added universal `<command> --help` support for slash commands, returning the selected command's usage, description, and available options directly in chat.
- Published the WebMCP integration blog post.

### Fixed
- Made Enter accept highlighted slash-command flag completions such as `/schedule --list` without prematurely executing the parent `/schedule` command.
- Restored intentional localized formatting in trusted composer toasts while keeping dynamic error text escaped.

### Tests
- Added Chrome and Firefox regression coverage for command-specific help, flag autocomplete ordering and completion, invalid mixed help flags, and trusted toast rendering.

## [23.1.0] - 2026-07-14

### Added
- Added `/export --traces` in Chrome and Firefox to download the current conversation's recorded planner turns, assistant prose, and tool calls as privacy-scrubbed Markdown while keeping `/export` messages-only.
- Added safe syntax highlighting for fenced Markdown code blocks in both side panels across JavaScript, CSS, markup, JSON, Python, shell, SQL, YAML, and C-like languages.
- Published the NVIDIA GLM-5.2 planner benchmark blog and complete frozen, Full, Mid, and Compact 100-case result sets.

### Changed
- Consolidated overlapping slash commands around canonical commands and flags, including `/schedule --list`, `/scratchpad --append` / `--clear`, `/memory --add` / `--forget`, `/screenshot --full-page`, `/record --full-screen` / `--transcribe`, and `/export --traces`, with flag-aware help and autocomplete.
- Changed Mail.tm inbox waits to perform one immediate check and use scheduled resumes for later checks instead of polling inside an active run.

### Fixed
- Sequenced and coalesced managed Chrome cloud-run updates while applying size limits, image omission, and sensitive-key redaction to persisted and live text-delta data.
- Guided Chrome and Firefox Gmail draft replacement through one clearing `set_field` call followed by verification, avoiding fragile click-and-keyboard clearing flows.
- Brought non-English Chrome and Firefox slash-command help and permission copy to parity with the English command lists and keyboard shortcuts.
- Corrected the GLM-5.2 benchmark result links.

### Tests
- Expanded regression coverage for trace export privacy and ordering, canonical slash-command flags, Markdown highlighting, scheduled inbox waits, Gmail draft replacement, locale parity, and managed cloud update sequencing and scrubbing.

## [23.0.4] - 2026-07-13

### Added
- Added an opt-in packaged Mail.tm disposable email skill for Chrome and Firefox, available from Settings with explicit confirmation, honest session-retention guidance, automatic account cleanup, and visible provider attribution.
- Added nine Chrome Dev-mode tools for reversible CSS/DOM experiments and page diagnosis: `inject_css`, `remove_injected_css`, `patch_element`, `revert_patch`, CDP-backed `execute_js`, `read_console`, `inspect_network_requests`, `inspect_event_listeners`, and `highlight_element`.

### Fixed
- Stopped Chrome Dev diagnostic handlers, buffers, and their Runtime/Log/Network CDP domains when leaving Dev mode, and enabled the same capture lifecycle for streaming runs.
- Bounded Chrome `execute_js` evaluation to 15 seconds, made CSS undo handles unique and document-bound, and canonicalized structured element patch names before recording reversible state.
- Propagated Chrome CDP callback failures from `chrome.runtime.lastError`, so timed-out or rejected `execute_js` evaluations report failure instead of an empty successful result.
- Redacted common API, subscription, access, auth, and client key header-name variants before Dev network diagnostics enter the in-memory buffer.
- Blocked `javascript:` form actions in structured element patches and permission-gated event-listener inspection and element highlighting because both briefly mutate live DOM.
- Disabled diagnostics on every tracked Dev tab when leaving panel-wide Dev mode, cleaned up exact injected CSS across navigation races, and followed open-shadow hosts when inspecting ancestor event listeners.

### Tests
- Added packaged-skill catalog, opt-in Settings, and Mail.tm safety/API cleanup coverage.
- Added Dev-only exposure, bounded CDP execution, diagnostic lifecycle, sensitive-header redaction, document-safe CSS undo, canonical element patching, permission classification, and state-change coverage for the new Chrome Dev toolkit.

## [23.0.2] - 2026-07-13

### Added
- Added `upload_file` tool support for Firefox WebBrain extension, including sidepanel-based user file picker flow and `downloadId` re-fetch flow with 25MB file size limit.
- Added a selection shortcut for Chrome and Firefox with Summarize, Explain, Quiz me, Proofread, Translate, and custom WebBrain prompts.
- Expanded the native selection context menu with matching preset actions, translation languages, and direct side-panel access.
- Added a persistent setting to hide or restore the floating selection shortcut.
- Added the managed cloud-browser bridge for API-driven run, status, abort, active-tab control, and validated structured results.

### Changed
- Simplified the selection shortcut to a compact purple question-mark icon.
- Added direct Chrome, Firefox, and Edge store links to the English, French, and Chinese README introductions.

### Tests
- Added prompt-safety, browser-specific delivery, duplicate-submission, viewport, keyboard, persistence, translation, and screenshot-suppression coverage.

## [23.0.0] - 2026-07-12

### Added
- Added subscription resume action, including scheduled resume task detection, mode sync before resume, and render subscription actions for restored runs.

### Changed
- Injected trusted runtime clock into agent runs for reliable scheduling.
- Kept runtime context out of planner history and stripped runtime context from derived task state.
- Preserved mode for subscription error resumes.

## [22.4.0] - 2026-07-11

### Changed
- Open Local screenshot PII redaction before vision

## [22.3.0] - 2026-07-10

### Changed
- fast suggested actions

## [22.2.3] - 2026-07-10

### Added
- Added Azure OpenAI and AWS Bedrock (Converse) providers in Chrome and Firefox, including Settings fields, provider manager wiring, docs, and regression coverage.
- Added encrypted profile sync for providers, profile settings, memory, and auxiliary providers, with email auth, local password unlock, merge recovery, reset, and change-password controls.
- Added Hebrew app localization and refreshed localized app and website copy.
- Added GitHub funding metadata and refreshed the WebBrain logo, store listing, banner, favicon, social-card, and website image assets.

### Changed
- Updated local model setup guidance and provider context-window detection for llama.cpp, Ollama, and LM Studio so live runtime windows can replace defaults while respecting manual overrides.
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, architecture docs, and rebuilt Chrome, Edge, and Firefox release archives for 22.2.3.

### Fixed
- Fixed local model context-window detection, including stale detection writes and over-reported windows from loaded local backends.
- Hardened encrypted profile sync around disabled edits, vault KDF reuse, lock and logout flows, legacy sync migration, and remote apply conflicts.

### Tests
- Expanded regression coverage for Azure OpenAI, AWS Bedrock, encrypted profile sync, sync recovery and consent flows, local context-window detection, Hebrew localization, and refreshed logo assets.

## [22.1.2] - 2026-07-10

### Added
- Added search to the providers list.
- Added local user memory for Chrome and Firefox, including `/remember`, `/show-memory`, `/forget-memory`, Settings/Profile management, bounded prompt injection, JSON export/import, and opt-in post-turn auto-learning.

## [21.7.0] - 2026-07-08

### Changed
- remove claude subscription, add huggingface inferencing

## [21.6.0] - 2026-07-08

### Changed
- added history

## [21.5.0] - 2026-07-05

### Changed
- planner ux improved

## [21.4.0] - 2026-07-05

### Changed
- Gate form submissions behind fresh confirmation

## [21.3.0] - 2026-07-05

### Changed
- Add sidepanel slash output retry UX

## [21.2.0] - 2026-07-05

### Changed
- Add in-chat store review prompt (Chrome + Firefox)

## [21.1.0] - 2026-07-05

### Changed
- Suppress duplicate assistant prose during tool calls

## [21.0.0] - 2026-07-05

### Added
- Added Dev Mode.

## [20.7.0] - 2026-07-05

### Changed
- clear convo warning message added

## [20.6.0] - 2026-07-05

### Changed
- Guarded scheduled resumes with the progress ledger so resumed runs can preserve and surface task progress before continuing.

## [20.5.5] - 2026-07-04

### Changed
- UX refinements: shortened the Chrome and Firefox Act-mode warning banner across all app locales to focus on the risk notice.
- Removed the verbose tool-log button from the Chrome and Firefox sidepanel header to reduce clutter; verbose mode remains available from Settings and the `/verbose` slash command.
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 20.5.5.

## [20.5.2] - 2026-07-04

### Changed
- Reduced the Chrome and Firefox sidepanel composer plus and microphone button hit areas from 32px to 28px while keeping the icon size and send button unchanged.
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 20.5.2.

### Fixed
- Completed missing Chrome and Firefox UI locale strings for attachments, microphone controls, queued composer messages, progress-ledger output, recording copy, and voice-input settings.
- Completed localized website share and footer social labels for Mastodon and Bluesky across the generated locale pages.
- Synced localized busy-run slash-command notices so every app locale lists `/check-progress` as an immediate command alongside the other allowed commands.

### Tests
- Updated Chrome and Firefox regression coverage for the busy-run slash-command notice and verified the full test suite plus prompt-injection corpus.

## [20.5.0] - 2026-07-04

### Added
- Added `/check-progress` in Chrome and Firefox so users can show the current tab's progress ledger from the slash-command menu, including session details, row counts, and the ledger rows.

### Changed
- Raised JSON, TXT, and CSV text attachment uploads from 512 KB to 5 MB in Chrome and Firefox while keeping injected file text bounded to the active provider's remaining context.
- Budgeted text attachments against the pruned prompt and reserved overhead, splitting available context across multiple attachments and marking truncated files as partial content when only the beginning can fit.
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 20.5.0.

### Tests
- Updated Chrome and Firefox regression coverage for 5 MB text-attachment caps, provider-context truncation, late text uploads in long chats, and partial-content notices that omit over-budget tail text.

## [20.4.1] - 2026-07-04

### Changed
- Moved the sidepanel pills to the middle of the sidepanel.

## [20.4.0] - 2026-07-03

### Changed
- mastodon hardening, and  broader agent hardening around progress-ledger safety and malformed tool-call arguments

## [20.3.0] - 2026-07-03

### Changed
- new feature: accept text attachments in the sidepanel

## [20.2.0] - 2026-07-03

### Added
- Added `/dangerously-skip-permissions` in Chrome and Firefox so users can disable permission prompts directly from the side panel without opening Settings.
- Kept `/dangerously-skip-permissions` available during active runs and have it resolve any pending permission prompt for the initiating tab with a one-time allow so the blocked run can continue immediately.
- Added the Star History embed to the website so visitors can inspect WebBrain repository star growth from the homepage.

### Changed
- Updated slash-command help, autocomplete, busy-run notices, and localized warning copy for the new permission-skipping command.
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 20.2.0.

### Tests
- Added Chrome and Firefox regression coverage for the new slash command, out-of-band busy-run availability, storage-backed permission gate disabling, active permission prompt resolution, localized busy notices, and website Star History rendering.

## [20.1.0] - 2026-07-03

### Changed
- Raised the built-in WebBrain Cloud provider context window to 1,000,000 tokens in Chrome and Firefox, while migrating stored legacy 256k configs forward without dropping saved API keys.
- Scaled the agent's soft context character and message budgets from the active provider token budget, so 1M-context providers no longer compact at the legacy 80k-character or 50-message limits.
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 20.1.0.

### Tests
- Added Chrome and Firefox regression coverage for the WebBrain Cloud 1M default, legacy context-window migration, adaptive character/message context budgets, and large-window conversations avoiding premature compaction.

## [20.0.0] - 2026-07-03

### Added
- Added Chrome-only `/record-full-screen` as a slash-only screen/window recording flow that uses the offscreen recorder's `getDisplayMedia()` picker and records without the live WebBrain recording banner.
- Added double-Escape recording stop handling on Chrome WebBrain/browser surfaces, with hidden recordings covered by a background-owned 2-hour safety cap.
- Added `--transcribe` for `/record` and `/record-full-screen` so user-driven recordings can still save a Whisper transcript after stop.

### Changed
- Removed model-callable `record_tab` and `stop_recording`; recording is now user-driven through `/record`, `/record-full-screen`, optional `--transcribe`, browser stop controls, or double Escape.
- Reserved retired recording tool names in Chrome and Firefox so custom skills cannot reintroduce them, and updated agent prompts to point users to slash commands instead of tools.
- Changed Plan before Act to default unset storage to `try` while preserving explicit `off`.
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 20.0.0.

### Fixed
- Kept Firefox from advertising `/record-full-screen` while returning a clear unsupported message if the command is typed manually.

### Tests
- Added Chrome and Firefox regression coverage for recording tool removal, retired-name/custom-skill blocking, slash parser ordering, Chrome-only full-screen recording, hidden full-screen recording UI, double-Escape stop routing, and Plan-before-Act default `try`.

## [19.3.0] - 2026-07-02

### Added
- Added Chrome and Firefox side-panel microphone dictation controls with per-browser permission handling, interim transcript cleanup, and clear disabled states when speech recognition is unavailable or turned off.
- Added Chrome and Firefox side-panel file attachments for images, PDFs, JSON, and text files, including attachment preview chips, remove controls, tab-scoped pending attachments, and send-button gating while file reads are still in flight.

### Fixed
- Fixed attachment rejection handling so unsupported attachments are restored to the correct tab without scraping assistant text, while uploaded user attachments carry an explicit untrusted-content boundary before being sent to the model.
- Fixed Chrome microphone denial handling so the mic icon returns to its idle state and permission-denied state does not spam repeated system messages.
- Fixed Anthropic Claude Opus 4.8 requests by omitting unsupported non-default `temperature` parameters while keeping temperature for Claude Sonnet 4.6.

### Tests
- Added Chrome and Firefox regression coverage for tab-scoped attachment state, pending-read send gating, rejected-attachment restoration, text-attachment size limits, uploaded image/document boundaries, microphone icon reset, and Anthropic Opus 4.8 temperature handling.

## [19.2.0] - 2026-07-02

### Added
- Added a Chrome and Firefox side-panel message queue so normal composer messages sent while WebBrain is busy are kept per tab, shown above the composer, and can be edited or deleted before they run.

### Changed
- Kept `/help`, `/show-scratchpad`, `/list-schedules`, `/screenshot`, `/export`, and `/verbose` available as immediate slash commands during active runs while other slash commands show the queued-message busy notice.
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 19.2.0.

### Fixed
- Fixed queued-message editing so pressing ArrowUp in an empty composer pulls the latest queued message back into the composer before it runs.

### Tests
- Added Chrome and Firefox regression coverage for busy-run message queueing, queued-message edit/delete controls, per-tab queue draining, safe busy slash commands, and localized busy notices.

## [19.1.0] - 2026-07-02

### Added
- Added Ollama launch handoff integration for Chrome and Firefox so `webbrain.one/launch/ollama` links can configure the local Ollama provider, activate it, and carry over the selected model, loopback `/v1` base URL, and context window.

### Changed
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 19.1.0.

### Tests
- Added Chrome and Firefox regression coverage for Ollama launch handoff validation, loopback URL restrictions, provider activation, and launch-page content-script behavior.

## [19.0.11] - 2026-07-02

### Changed
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 19.0.11.

### Fixed
- Fixed Settings -> Providers -> Load Models for local providers so loaded models appear in a centered picker dialog without replacing an existing model value until the user chooses one.
- Replaced raw HTML 404 model-list errors with the concise local-server status when a local model server is not running.
- Guarded repeated model-load completions so an already-open loaded-model dialog is not reopened.

### Tests
- Added Chrome and Firefox regression coverage for loaded-model dialog rendering, localized dialog copy, stale option clearing, concise HTML 404 handling, centered dialog styling, and repeated dialog-open handling.

## [19.0.0] - 2026-07-01

### Added
- Added the new Skills infrastructure for Chrome and Firefox: Settings -> Skills can import trusted skill text or HTTPS skill URLs, store enabled skills in browser local storage, append enabled skill instructions to the agent system prompt, and show/remove declared skill tools.
- Added `webbrain-tools` manifest support so enabled skills can declare runtime tools without hard-coding them into the static tool table. Skills can expose read-only HTTPS GET/POST tools and Act-only `httpDownloadJob` tools with create, poll, file, and cleanup endpoints.
- Added a bundled FreeSkillz.xyz skill, enabled by default and removable from Settings -> Skills, with `read_youtube_transcript`, `resolve_public_media`, and `download_public_media` for public YouTube transcripts and public social/media URLs.
- Added skill-aware tool hydration before provider setup and scheduled runs so imported and packaged skill tools are available consistently in normal and resumed agent sessions.

### Changed
- Updated README, adding-a-tool, architecture, privacy/data-flow, prompt-injection, security-model, and browser architecture docs for custom skills, skill tool trust boundaries, bundled FreeSkillz behavior, and the removal of the stale root extension manifest.
- Updated release metadata, Settings subtitle versions, Chrome / Firefox manifests, package versions, and browser architecture docs for 19.0.0.
- Kept skill HTTP requests cookie-free with `credentials: "omit"`, nested provider payloads under untrusted result data, and documented that importing or keeping a skill enabled is the trust decision for its declared HTTPS endpoint.

### Fixed
- Hardened skill imports and skill tool calls against unsafe endpoints, oversized imports, opaque or cross-origin redirects, blocked local/internal destinations, and provider fields such as `done`, `_attachImage`, or `_attachDocument` escaping into internal tool-result control fields.
- Hardened download-job skill tools so they are Act-only by default, stay behind the normal Downloads permission gate, handle pending browser downloads without prematurely deleting provider jobs, clean up provider jobs on early failures, validate file/final URLs, reject file redirects and non-2xx file responses, and support GET-only file endpoints without requiring HEAD.
- Reworked skill media saving to avoid cookie-bearing browser downloads against provider domains by fetching files with omitted credentials, validating the response URL before saving, and capping cookie-free data-URL saves at 25 MiB so large media fails cleanly instead of buffering unbounded data in the service worker.
- Required explicit URLs for read-only public media resolution so broad social-media allowlists do not silently send the active tab URL to FreeSkillz from Ask mode.

### Tests
- Added Chrome and Firefox regression coverage for skill import/storage limits, packaged-skill seeding and refresh, Settings -> Skills UI behavior, scheduled-run skill hydration, runtime skill tool schemas, Ask/Act/Compact mode filtering, untrusted skill result wrapping, endpoint and redirect validation, and skill response trimming.
- Added FreeSkillz transcript/media coverage for supported URL allowlists, public media resolve requirements, download-job lifecycle, pending cleanup, unsafe final URLs, blocked redirects, failed file requests, GET-only file endpoints, cookie-free file fetches, and oversized media rejection.

## [18.3.0] - 2026-06-29

### Changed
- Deleted the stale root `manifest.json` and updated Chrome setup docs, version bumping, and release workflows to use `src/chrome/manifest.json` and `src/firefox/manifest.json` as the only extension manifests.

## [18.2.0] - 2026-06-28

### Changed
- edge store preparations

## [18.1.0] - 2026-06-28

### Changed
- Added: Tune context compaction thresholds

## [18.0.4] - 2026-06-27

### Fixed
- Prevented stale repeated `fetch_url` loop entries from hard-stopping the agent after it switches to a different tool, such as falling back from failed API calls to `click_ax`.
- Collapsed repeated failed mutating API calls in one assistant batch into a single failed API strategy for loop detection, while keeping `/allow-api` as the required opt-in for API mutations.
- Reasserted the active viewport glow after tab reloads during a running task so the visual run indicator comes back when the content script reloads.

### Tests
- Added Chrome and Firefox regression coverage for stale URL-tool loop pivots, failed API mutation batches, and active viewport glow reassertion after reload.

## [18.0.3] - 2026-06-27

### Changed
- Replaced the Plan before Act checkbox with Planner modes: Try planning by default, Strict planning for fail-closed approval, and Off.
- Made Try planning continue into Act mode without a pinned plan when the planner cannot produce valid structured JSON, so the default planner path no longer cancels the task on planner-format failure.
- Preserved legacy planner storage by mapping unset storage to Try planning, legacy `false` to Off, and legacy `true` to Strict planning.

### Tests
- Added Chrome and Firefox regression coverage for planner mode defaults, legacy migration behavior, try-mode fallback, and strict-mode fail-closed cancellation.

## [18.0.2] - 2026-06-27

### Added
- Added bulk API mutation pattern detection for Chrome and Firefox so repeated successful same-action clicks, such as following many GitHub stargazers, can surface matching background API request shapes before the agent spends one LLM turn per button.

### Changed
- Kept mutating `fetch_url` calls behind the `/allow-api` slash command, including a hard fail-closed path for POST, PUT, PATCH, and DELETE when API mutations have not been explicitly enabled for the conversation.

### Tests
- Added Chrome and Firefox regression coverage for bulk API mutation hints, `/allow-api` hint state, and blocking mutating `fetch_url` calls until `/allow-api` is enabled.

## [18.0.0] - 2026-06-27

### Added
- Added `go_back` and `go_forward` tools for Chrome and Firefox so Act mode can use browser history directly instead of relying on CSP-sensitive page JavaScript.
- Added Plan before Act as a default-on planning gate, including structured planner parsing, a side-panel plan review card, approved-plan scratchpad pinning, scheduled-run auto-approval, and planner trace/provider metadata.
- Added a background API request observer for Chrome and Firefox that detects repeated click-triggered XHR/fetch requests and suggests the matching `fetch_url` method when the UI loop is stuck.

### Changed
- Kept API shortcut detection method-aware for GET, POST, PUT, PATCH, DELETE, and other observed methods while leaving mutating replay decisions to the existing `/allow-api` and UI-vs-API policy.
- Updated README, architecture, adding-a-tool, privacy, prompt-injection, and security docs alongside release metadata, Settings subtitle versions, Chrome / Firefox manifests, and package versions for 18.0.0.

### Fixed
- Fixed Chrome history URL normalization so query-string and hash-only history transitions are treated as real back/forward navigation changes, matching Firefox.
- Prevented API shortcut detection from counting one captured request across multiple overlapping click windows.
- Removed unused planner helper/style code left behind during review cleanup.

### Tests
- Added regression coverage for history navigation tool exposure, permission mapping, URL normalization parity, planner parsing/review/scratchpad/scheduling/trace behavior, API shortcut matching, request-reuse prevention, and prompt-injection corpus parity.

## [17.8.0] - 2026-06-27

### Added
- Added completion confetti for successful Chrome and Firefox tasks, with a Settings toggle and localized labels so users can turn off the celebratory finish.

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 17.8.0.

### Fixed
- Fixed side-panel tab race issues by queueing tab-switch updates during restore and preventing stale flushes from writing to the wrong tab conversation.
- Scoped accepted completion and success-confetti updates to the active tab so finished tasks do not trigger stale success UI in another tab.

### Tests
- Added regression coverage for completion confetti settings and rendering, accepted completion gating, and tab-switch restore / flush races.

## [17.7.0] - 2026-06-26

### Added
- Added `/clear-scratchpad` in the Chrome and Firefox side panels so users can clear the current conversation scratchpad from slash-command autocomplete and help.
- Added Cloudflare Workers AI to the provider list with the OpenAI-compatible Workers AI endpoint, default model `@cf/zai-org/glm-5.2`, and a 262k-token context window.

### Changed
- Translated the `/clear-scratchpad` label, help text, and cleared-state message across all supported locales.
- Classified OpenRouter, Cloudflare Workers AI, Nvidia NIM, and Groq under the Router provider bucket in Chrome and Firefox settings.
- Added a dedicated Cloudflare account ID field and URL validation so the Workers AI provider substitutes the account into the API base URL before testing or chatting.
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 17.7.0.

### Fixed
- Migrated saved OpenRouter, Cloudflare Workers AI, Nvidia NIM, and Groq provider categories to Router so upgraded installs do not keep older Cloud filter state.

### Tests
- Added regression coverage for the synchronous scratchpad clear path, locale coverage for `/clear-scratchpad`, Cloudflare defaults, context-window inference, and the Router provider bucket.

## [17.6.0] - 2026-06-26

### Added
- Added a copy button to `/show-scratchpad` output in the Chrome and Firefox side panels so users can copy just the scratchpad contents.
- Added WebBrain blog coverage and benchmark result files for raw LFM 2.5 230M and 350M on the frozen 100-case browser-agent planner harness.

### Changed
- Updated the tiny LFM benchmark conclusion and refreshed release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 17.6.0.

## [17.5.0] - 2026-06-26

### Added
- Added async out-of-band slash-command handling in the Chrome and Firefox side panels, allowing `/help`, `/show-scratchpad`, `/list-schedules`, `/screenshot`, `/export`, and `/verbose` to run while WebBrain is busy.

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 17.5.0.

### Fixed
- Preserved drafts and autocomplete/send-button state when users try slash commands during active runs, with a localized busy notice for commands that need to wait.

## [17.4.0] - 2026-06-25

### Added
- Added `/edit-scratchpad <text>` in the Chrome and Firefox side panels so users can append notes to the current conversation scratchpad from slash-command autocomplete and help.

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 17.4.0.

## [17.3.0] - 2026-06-24

### Fixed
- Replaced the Firefox extension toolbar/sidebar icon PNGs with the Chrome brain artwork and refreshed the packaged Firefox archive so Firefox no longer shows the old purple round icon.

## [17.2.0] - 2026-06-24

### Added
- Added XML-style raw tool-call parsing for Chrome and Firefox so local/chat-template models that emit `<tool_call><function=...><parameter=...>` output can execute tools instead of returning raw markup.
- Added a WebBrain Cloud billing panel in Chrome and Firefox settings with device-bound Stripe account links, localized account copy, and expanded WebBrain Cloud provider notes for subscription, billing, and privacy links.
- Added Polish UI locale support for the Chrome and Firefox settings/payment flows.

### Changed
- Updated WebBrain Cloud `/subscribe` URLs and 402 allowance messages to include the device GUID as Stripe `client_reference_id`, and made the subscribe page require a device-bound link before redirecting to checkout.
- Reworded the subscribe fallback page to tell users with outdated extension links to update the browser plugin.
- Documented the newer slash commands in the English, French, and Chinese README files.
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 17.2.0.

### Fixed
- Purged legacy `auth.webbrain.one` token, email, and default-model storage during settings startup now that WebBrain Cloud billing is device-GUID based.
- Firefox side-panel message bubbles now expose copy buttons on user messages, with styling that remains legible on accent-colored bubbles.
- Suppressed streamed raw tool-call text before rendered tool steps, so fallback tool calls do not linger as assistant text.

### Tests
- Added regression coverage for XML-style tool-call parsing/execution and raw tool-call stream suppression in Chrome and Firefox.

## [17.1.0] - 2026-06-24

### Added
- Introduced a better payment UI for WebBrain Cloud: the quota-exceeded error now surfaces a Subscribe button that links users directly to upgrade their plan, with the button persisting and rebinding across chat restores.

### Changed
- Translated the Subscribe button strings into all supported locales.

## [17.0.0] - 2026-06-23

### Changed
- Updated provider placeholder models in Chrome and Firefox settings to reflect newer model options.
- Marked conversation export as completed in the README roadmap and noted that conversation import is not planned.
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 17.0.0.

### Removed
- Removed Chrome `execute_js` tool dispatch support so Chrome only exposes and dispatches the advertised tool set.

### Fixed
- Hardened Chrome and Firefox side-panel tab state so async slash commands, suggested actions, scheduled actions, restored controls, tab-chat saves, and pending tab switches stay scoped to the initiating tab instead of updating stale panels.
- Made settings and side-panel provider activation/status updates handle async failures, stale checks, invalid stored provider IDs, unsupported stored providers, and persisted preference changes more reliably.
- Improved context-menu prompt persistence and retry handling so prompts survive storage races, pending tab switches, failed tab switches, abort timeouts, and concurrent deferred writes without replaying stale content.
- Stabilized trace rendering, trace export downloads, side-panel export downloads, Chrome offscreen proxy recovery, and Chrome tab-chat persistence after clears.
- Scoped allow-api state to tab conversations and cleared Firefox transient tab state on reset.

### Security
- Escaped dynamic system messages and trace-viewer attribute data, rendered verbose tool names as text, avoided selector interpolation in settings tabs, rejected unknown provider updates, and validated stored provider IDs before use.

### Tests
- Added regression coverage for side-panel tab scoping, settings/provider async status handling, context-menu prompt queuing and retries, scheduled action tab isolation, export/download stability, provider validation, trace rendering, and Chrome advertised-tool dispatch.

## [16.0.0] - 2026-06-23

### Added
- Added Chrome and Firefox context-menu integration: right-click selected page text and choose "Ask WebBrain about this" to open the WebBrain panel and submit the selection as untrusted page content.

### Changed
- Marked keyboard shortcuts and context menu integration as completed in the README roadmap.
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 16.0.0.

### Fixed
- Context-menu prompts now survive service-worker and panel timing races until the chat request is accepted, then clear only after the background receives the request so prompts are neither lost before submission nor replayed after panel reopen.
- Context-menu prompts are now queued while a run is processing or when they target another tab, drain after Continue finishes or the matching tab becomes active, and are discarded on navigation or tab close so stale selections are not submitted against the wrong page.

### Tests
- Added Chrome + Firefox side-panel regression coverage to ensure queued context-menu prompts drain after Continue clears the processing state.

## [15.6.0] - 2026-06-23

### Changed
- Filled 22 missing UI locale keys across all 13 supported non-English locales in both Chrome and Firefox.
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 15.6.0.

### Fixed
- Agent-created scheduled current-tab tasks on HTTP(S) pages now persist as URL targets, so scheduled runs can navigate back to the original page instead of failing after the tab changes.
- Legacy agent-created current-tab scheduled tasks now migrate to URL targets during alarm restoration while preserving their scheduled alarms.

### Tests
- Added Chrome + Firefox scheduler coverage for agent-created current-tab URL target normalization, legacy scheduled-task migration on restore, and navigated scheduled task completion.

## [15.5.0] - 2026-06-23

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 15.5.0.

## [15.4.0] - 2026-06-23

### Added
- Chrome now registers `Alt+Shift+W` as the default extension keyboard shortcut for opening the WebBrain panel.

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 15.4.0.

## [15.3.0] - 2026-06-23

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 15.3.0.
- Scheduled-job busy retries now stagger same-target queued runs so simultaneous alarms do not keep retrying at the same instant.

### Fixed
- Scheduled resume and task creation now dedupes near-identical live jobs within a two-minute window, returning the existing job instead of creating duplicate alarms.
- Startup alarm restoration now coalesces stored near-duplicate scheduled jobs by keeping the earliest matching live job and cancelling later duplicates.

### Tests
- Added Chrome + Firefox scheduler coverage for duplicate resume/task creation, duplicate-window boundaries, staggered busy retries, and restore-time duplicate coalescing.

## [15.2.2] - 2026-06-23

### Fixed
- Scheduled recurring tasks can now start immediately when their first run is due now.

## [15.2.1] - 2026-06-23

### Changed
- Max Agent Steps settings copy now explains that the `∞` slider position means unlimited steps in every supported Chrome and Firefox locale.
- `/schedule` now accepts `0` minutes for standalone scheduled tasks, treating it as "start now" while keeping nonzero future delays at the existing one-minute minimum.

### Fixed
- Max Agent Steps now treats the Settings slider maximum (`200`) as the unlimited sentinel instead of a finite cap, migrates stale stored `200+` values to `maxAgentSteps: 0`, and keeps the continue bar from displaying unlimited (`0`) as the default step count.

### Tests
- Added regression coverage to ensure `0`, `200`, and values above `200` remain unlimited in both browser builds, and that all max-step locale descriptions mention the `∞` setting.
- Added scheduler coverage for zero-delay tasks and the `/schedule` composer accepting an immediate relative delay.

## [15.2.0] - 2026-06-22

### Added
- Jan, vLLM, and SGLang as built-in local providers (Chrome + Firefox). All three use OpenAI-compatible `/v1` endpoints (Jan on port 1337, vLLM on port 8000, SGLang on port 30000), support model listing via `/v1/models`, accept an optional API key for auth-enabled servers, and default to enabled with vision on and a 16 K context window.

### Changed
- Onboarding local-model detection copy now lists Jan, vLLM, and SGLang alongside LM Studio, Ollama, and llama.cpp.
- LLM request-timeout settings description and provider info panel updated to cover all six local backends.
- Updated documentation (README, architecture docs, providers guide) to reflect the expanded local-provider lineup.

### Tests
- Added coverage for `categoryFor` and `listProviderModels` with Jan, vLLM, and SGLang — including auth header forwarding and model-list deduplication — and for `_defaultConfigs` asserting all three new providers are present, enabled, local-categorized, and localhost-defaulted.

## [15.1.1] - 2026-06-22

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 15.1.1.

## [15.1.0] - 2026-06-22

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 15.1.0.
- Updated README and architecture docs to describe WebBrain Cloud 1.0 as the default managed cloud option and document the scheduled-task system.
- Refreshed release artwork and regenerated packaged Chrome / Firefox submission archives.

### Fixed
- Firefox indexed click and typing actions now resolve against the same full interactive-element ordering shown to the agent, keeping click-by-index and type-by-index stable.
- Firefox indexed actions now handle shadow DOM controls, blocking modal/native dialogs, non-modal dialogs, inert or hidden background controls, stale editable focus, and disabled text inputs more reliably.
- Chrome and Firefox side panels now surface a clear error when the background script returns no response, and avoid dereferencing missing response content while rendering assistant messages.

### Tests
- Added regression coverage for Firefox shadow-DOM indexed clicks and typing, modal and non-modal dialog indexing, disabled/stale editable fallbacks, and missing side-panel background responses.

## [15.0.0] - 2026-06-22

### Added
- Added a Chrome `/record` slash command that starts current-tab recording directly from the side panel with video and microphone capture, plus matching Chrome autocomplete and `/help` text.

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 15.0.0.

### Fixed
- Tightened `/record` slash parsing so longer words beginning with `/record` are not treated as recording commands, surfaced recording startup and microphone-capture failures in the Chrome side panel, and made manually typed `/record` in Firefox report that tab recording is unsupported without advertising it in Firefox slash autocomplete or help.

## [14.2.2] - 2026-06-22

### Changed
- Lowered the `schedule_resume` minimum delay from 60 seconds to 30 seconds in Chrome and Firefox, matching the packaged Chrome alarms floor while keeping standalone scheduled tasks at the existing 60-second minimum, and expanded the maximum scheduling window from 1 day to 7 days.
- Completed scheduled-job cards in the side panel now disappear after 15 seconds unless the user clicks the card to keep it visible.
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 14.2.2.

### Tests
- Updated scheduler and side-panel coverage for the shorter 30-second `schedule_resume` delay, seven-day maximum scheduling window, and completed-card auto-hide behavior.

## [14.2.0] - 2026-06-21

### Added
- Slash command autocomplete in the Chrome and Firefox side panels, with keyboard navigation, Tab / Enter completion, Escape dismissal, mouse selection, and accessible listbox metadata for all supported slash commands.

### Changed
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and package versions for 14.2.0.
- Completed missing translations for all 13 supported languages (Arabic, Spanish, French, Indonesian, Japanese, Korean, Malay, Russian, Thai, Tagalog, Turkish, Ukrainian, Chinese Simplified) across Chrome and Firefox locale files, covering scheduled-task UI strings, scratchpad panel, schedule form, permission verb, tool labels, and settings toggles added in 14.1.0.

### Tests
- Added static Chrome + Firefox coverage to keep the slash command parser and autocomplete command list in sync.



## [14.1.0] - 2026-06-21

### Added
- Scheduled agent work for Chrome and Firefox: `schedule_resume` durably pauses a blocked run and resumes it later in the same tab / conversation, while `schedule_task` creates one-shot or recurring future tasks backed by browser alarms and persisted job state.
- Side panel schedule controls, including `/schedule`, `/list-schedules`, `/show-scratchpad`, an active scheduled-job strip, and Run now / Pause / Resume / Cancel / Delete actions for scheduled jobs.
- Settings toggles for enabling scheduled tasks and requiring confirmation before unattended scheduled runs perform consequential actions.

### Security
- Added a `schedule` permission-gate capability so scheduled future work is treated as a consequential action, with unattended scheduled runs defaulting to confirmation before clicks, typing, navigation, downloads, uploads, recording, or other gated actions.

### Changed
- Full and mid Act-mode prompts now describe the scheduling tools and when they may be used; compact Act mode still forbids scheduling and tells the agent to ask the user to re-invoke WebBrain for external waits.
- Updated release metadata, Settings subtitle versions, architecture docs, Chrome / Firefox manifests, and required `alarms` permissions for 14.1.0.

### Fixed
- Anchor clicks now correctly classify same-page anchors, anchors resolved through `<base href>`, and popup-style placeholder / hash anchors, preventing successful in-page jumps or popup triggers from being reported as failed or stale clicks.

### Tests
- Added Chrome + Firefox coverage for scheduler validation, busy-tab queuing, stale resume / task targets, recurring next-run calculation, scheduled clarifications, tool exposure by prompt tier, schedule slash commands, scratchpad reads, and schedule capability gating.

## [14.0.5] - 2026-06-20

### Changed
- Updated Anthropic defaults and context-window inference for `claude-opus-4-8`.
- Updated release metadata, Settings subtitle versions, architecture docs, and Chrome / Firefox submission archives for 14.0.5.

### Fixed
- Provider Settings numeric fields now preserve valid zero cost estimates while continuing to reject invalid or negative numeric values.

## [14.0.4] - 2026-06-19

### Added
- Suggested actions in the side panel can now be minimized and restored in both Chrome and Firefox. The collapsed preference is saved, so users can reclaim chat space once and keep it that way across panel reloads.

### Changed
- Tightened the Suggested actions panel spacing, chevron control, and action chips to reduce vertical space used above the chat input.
- Updated release metadata, Settings subtitle versions, architecture docs, and Chrome / Firefox manifests for 14.0.4.

## [14.0.0] - 2026-06-18

### Changed
- WebBrain Cloud is now the default provider for new WebBrain configurations.
- Updated release metadata, Settings subtitle versions, architecture docs, and Chrome / Firefox manifests for 14.0.0.

### Fixed
- Context compaction now treats screenshots as a bounded vision-token cost and uses a short post-compaction cooldown, preventing screenshot-heavy Chrome and Firefox runs from compacting again on every step.
- Text clicks now ignore hidden ARIA option / menu / tree items and no longer treat editable input values as click labels, preventing collapsed or virtualized options and filter boxes from being selected as false matches.
- Firefox scroll-retry text clicks now reuse the same visibility and editable-value filtering as the primary matcher.

## [13.1.0] - 2026-06-17

### Changed
- Website header GitHub controls now use the star pill as the single repository link, removing the duplicate GitHub CTA across localized website pages.
- Updated release metadata, Settings subtitle versions, architecture docs, and Chrome / Firefox submission archives for 13.1.0.

## [13.0.1] - 2026-06-12

### Fixed
- Screenshot capture now mechanically detects near-blank frames and retries after 500ms, 1000ms, and 1500ms before handing the image to a vision model (Chrome + Firefox). This helps recover from compositor / lazy-load races on media-heavy pages such as Instagram, where the DOM already contains content but the first viewport capture can be all white or all black.

### Changed
- Screenshot probes now include image counts, and screenshot results/traces include `blankFrameRetry` metadata when a blank-frame retry path ran.

### Tests
- Added Chrome + Firefox unit coverage for blank-frame retry gating, successful recovery, and the no-content/no-retry case.

## [13.0.0] - 2026-06-10

### Added
- Downloads now auto-pin to the scratchpad (Chrome + Firefox): every `download_files`, `download_resource_from_page`, `stop_recording` (Chrome), and `download_social_media` success appends a durable `[auto] Downloaded … (downloadId N)` line to the pinned scratchpad, so the file's handle survives context compaction even when the model never calls `scratchpad_write` itself. This closes a failure mode where, on long runs, the saved path fell out of the verbatim context window after older tool results were summarized away and the model invented a wrong upload path (e.g. `/Users/Shared/…`). Pinning is centralized in the tool-execution loop so all download-producing tools are covered uniformly; `download_social_media`, which exposes no per-file id, degrades to a `list_downloads` pointer rather than an invented id.
- `download_files` now resolves and returns each file's local path and completion state in its own result (previously only `list_downloads` carried the path), so the handle is available the moment the download finishes.
- `upload_file` now accepts a `downloadId` as an alternative to `filePath` (Chrome): it resolves the real on-disk path internally, so the model can attach a previously downloaded file by its small integer id without recalling the path. `read_downloaded_file` already accepted a `downloadId`.
- Test coverage (in `test/run.js`) for auto-pin survival across a real context compaction, id-only pinning across the download tools, the `download_social_media` → `list_downloads` fallback, and the `download_files` summary-digest behavior.

### Security
- The auto-pin note is id-only by design: it records the `downloadId` (not attacker-controllable) and no page-derived filename at all, keeping the Content-Disposition-settable basename out of the durable, attended-to scratchpad. This is a prompt-injection boundary — a hostile filename such as `ignore previous instructions and …` must never be persisted as trusted text that outlives the untrusted-content wrapper; the human filename remains recoverable via `list_downloads`. The `download_files` summary digest likewise echoes only the integer `downloadId`s and never the filename, so a malicious `Content-Disposition` header cannot smuggle page text into the trusted trim summary.

### Changed
- Act-mode scratchpad guidance updated: download paths are pinned automatically and files are attached/read by `downloadId`, so the model no longer hand-pins paths or re-downloads to "get the path back".

## [12.0.0] - 2026-06-01

### Added
- "Use your subscription" OAuth (PKCE) sign-in for subscription-backed providers (Chrome + Firefox): OpenAI (ChatGPT) and Google Gemini. OpenAI borrows the Codex CLI's first-party `client_id` (same pattern as the existing Claude flow); Gemini stays honest, requiring the user to register and enter their own Google Cloud OAuth `client_id`. Clients send no headers that impersonate a vendor's first-party CLI, and the settings UI surfaces a disclaimer on every borrowed-client card noting it may be revoked by the vendor at any time.
- Context-aware recommended actions: the agent surfaces actionable recommendations tailored to the current page and runs them directly in Act mode.

### Changed
- Recording recommendation is now hidden on Firefox where it does not apply.

### Fixed
- Social media downloads now focus on the active media: extensionless media URLs get correct video filenames, visible-crop filename extensions are fixed, a visible-media crop fallback was added, main-mode videos are ordered before posters, and focused HTTP / blob video downloads are preferred and preserved.
- Recorder Stop reliably ends stuck or orphaned recordings, with cleared / already-stopped stop results handled and forced-clear stop failures surfaced in the side panel.
- Fixed 6 bugs across the Chrome and Firefox builds.

## [11.0.0] - 2026-05-31

### Added
- Cloud cost allowance controls: per-session spending limits for metered cloud providers. Set a maximum dollar allowance in Settings; spend is estimated from provider-reported token usage (falling back to token counts when usage metadata is absent) multiplied by per-model pricing. Anthropic and Gemini stream usage metadata is now forwarded for accurate accounting, reported zero-cost usage is honored, and local / IPv6 / "cloud-card" local endpoints are treated as unmetered.
- Token-aware automatic context compaction (Chrome + Firefox): the agent now summarizes older turns once the running input-token count crosses ~75% of the active model's context window — not just the legacy 50-message / 80k-char heuristics — and re-checks on every agent-loop iteration so long autonomous runs compact mid-flight. When it compacts, the side panel shows an inline "Context automatically compacted" separator. Providers expose an approximate `contextWindow` (category-aware default: 16k for local backends, 128k for cloud/router; overridable via `config.contextWindow`). Compaction preserves the pinned original user task and never splits an assistant/tool-call pair across the summary boundary; Firefox now digests tool results into the summary at parity with Chrome. Onboarding, README, and the website now recommend a ≥16k context window for local models (8k works with Compact mode).
- `click` progress snapshots now report the affected form control's state (checked / disabled / selected index / `aria-*`) alongside its label and position, so the model and recorded traces can verify the effect of an interaction.
- Test coverage (in `test/run.js`) for trace-driven agent interaction and for untrusted wrapping of `click` / `type_text` results.

### Security
- `click` and `type_text` tool results are now wrapped as untrusted content, so page-derived text returned by an interaction cannot be interpreted as model instructions.

### Changed
- Cloud cost totals are serialized to avoid update races, and stream-usage options are gated by provider support.

### Fixed
- Fixed trace-driven agent interaction issues in the session recorder/replay path (agent loop, tool dispatch, and recorder host).
- Next-prompt size is now projected from reported tokens plus observed conversation growth rather than the model maximum, improving compaction timing.

## [10.0.0] - 2026-05-30

### Added
- Deterministic capability-by-origin permission gate for consequential agent actions, with per-host Allow once / Always / Deny grants.
- Site Permissions settings tab for reviewing and revoking saved capability grants.
- Localized structured permission card across Chrome and Firefox, replacing the previous free-text permission parser.
- Act-mode risk banner that appears when the permission gate is disabled.
- Localized onboarding safety warnings and local-LLM setup flow, including auto-detection for local providers.
- Apple Store site adapter.
- Firefox support for compact Act prompts, including compact tool schema routing and provider opt-in.

### Security
- Wrapped page-derived tool results and model-visible context as untrusted data across page reads, screenshots/OCR, hover/list-download results, PDF passthrough, download-family results, `done` verification fields, and scratchpad-adjacent context.
- Added prompt-injection defense documentation and tests covering the permission gate, untrusted-content registry, and capability classification exhaustiveness.
- Gated outbound GET egress, screenshot-to-disk, `read_pdf({url})`, `record_tab`, resource downloads, iframe actions by frame host, and `set_field({submit})` as both type and click.
- Scoped one-time permission grants to the tab/run and made `/allow-api` waive only mutation egress, not GET-based exfiltration.
- Sanitized page title/URL and PDF title metadata before inserting them into trusted context notes.
- Failed closed when iframe or target hosts cannot be identified for permission checks.

### Changed
- Improved nested-pane scroll targeting, with pane fallback when window scrolling cannot move and editable fields skipped as scroll containers.
- Permission card choices now dismiss immediately, and the Settings permissions list live-refreshes after changes.
- Firefox cached system prompts now refresh on conversation reuse so provider compact/full prompt changes stay aligned with the active tool schema.
- Compact-mode tool allowlists are enforced for both text-parsed and structured tool calls in Firefox.
- Documentation now describes Firefox compact-prompt support and current security/privacy behavior accurately.

### Fixed
- Fixed mobile hero mockup overflow and narrow navbar sizing.
- Fixed Firefox download-card wrapping.
- Fixed permission-option click handling so exact options are checked before negation parsing.
- Fixed legacy scroll fallback guard and stale scroll-origin behavior.
- Fixed docs accuracy issues and updated the maintainer security contact.

## [8.8.0] - 2026-05-28

### Added
- Cream/coffee light theme for the marketing website with a sun/moon toggle in the nav (PR #84). Default follows `prefers-color-scheme`; the choice is persisted in `localStorage`.
- Cream/coffee light theme for the extension's side panel and Settings page in both Chrome and Firefox builds (PR #85). Default follows `prefers-color-scheme`; Settings → General → Appearance offers System / Light / Dark.
- New `src/<browser>/src/ui/theme.js` module owning theme state, with `localStorage` mirroring `(chrome|browser).storage.local` so the FOUC bootstrap can read synchronously and other extension pages stay in sync.
- Self-hosted MP4 of the demo video on the marketing site, replacing the previous external embed.

### Changed
- Demo section label and subtitle restored on the marketing site for consistency with the other sections.
- Theme toggle is hidden on narrow nav layouts (≤375px) to keep the header within its side padding; `prefers-color-scheme` still picks the right theme on mobile.

### Fixed
- Settings appearance picker now stays in sync when the theme is changed from another Settings tab or the side panel. The local `currentThemeMode` closure and the `<select>` value are updated from `storage.onChanged`, so a subsequent OS-theme flip no longer overrides an explicit user choice.
- Theme bootstrap moved out of an inline `<script>` and into `theme-bootstrap.js` (a parser-blocking classic script in `<head>`) so it actually runs under MV3's `script-src 'self'` CSP — the inline version was silently blocked and visitors saw a dark flash on first paint.

## [8.7.0] - 2026-05-28

### Added
- Settings tab "Display" renamed to "General" across all 14 locales to reflect its broader scope.
- Settings subtitle no longer says "display preferences" — translated to "preferences" in every locale.

### Documentation
- README provider table expanded from 4 to 14 entries with default models per provider.
- README "What's New" section replaced with a one-line pointer to CHANGELOG.md to prevent the drift that left it stuck at 6.1.0.
- CHANGELOG backfilled with entries for 8.2.1, 8.2.2, 8.3.0, 8.4.0, and 8.5.0.

## [8.6.0] - 2026-05-28

### Added
- Slash commands beyond `/allow-api`: `/help`, `/compact`, `/reset`, `/screenshot`, `/export`, `/profile`, `/vision` (PR #82). Type `/help` in the side panel to see the list.

### Fixed
- System messages now bypass `formatMarkdown` so HTML (e.g. the `<img>` from `/screenshot`, the `<strong>` in `/allow-api` confirmations) renders instead of showing as escaped text.

### Changed
- Ollama default model placeholder is now empty (matching llama.cpp and LM Studio) instead of hardcoding `llama3.1`.

## [8.5.0] - 2026-05-28

### Fixed
- Comprehensive bug audit covering 65+ fixes across Chrome and Firefox builds.
- Preserved run-guard state on conversation clear so an in-flight agent run can still be stopped cleanly.
- Extended PDF read timeout through the response body phase, not just the connection phase.

## [8.4.0] - 2026-05-27

### Changed
- Merged `download_file` into `download_files` so a single tool handles both single-URL and array cases (max 3 concurrent).
- Compact-mode tool allowlist is now scoped to Act mode only; Ask mode keeps the full tool surface even when compact prompts are enabled.

### Fixed
- Suppressed stale-click warnings on editable targets (e.g. contenteditable Medium editors) where the click is intentional.
- `downloadFiles` now passes the user-supplied filename through to the download instead of falling back to the URL slug.
- Compact-mode allowlist is now enforced on text-parsed tool calls too, not only structured tool calls.
- `solve_captcha` is now part of the compact tool set so it stays available in compact mode.

## [8.3.0] - 2026-05-27

### Changed
- Compact mode is now fully opt-in: it never auto-enables based on model size heuristics. Users must check the box per-provider in Settings.

### Documentation
- Clarified in README and settings copy that compact mode is opt-in only and not auto-enabled.

## [8.2.2] - 2026-05-26

### Fixed
- Restricted deasciifier loading to `lang: "tr-deasciify"` so the ~175KB pattern table isn't pulled in for non-Turkish typing.
- Loaded the deasciifier in the content-script isolated world to avoid leaking globals into page scripts.

## [8.2.1] - 2026-05-26

### Fixed
- Patch release for deasciification edge cases discovered shortly after 8.2.0.

## [8.2.0] - 2026-05-26

### Added
- Added Turkish deasciification support via `lang: "tr-deasciify"` parameter on `type_text`, `type_ax`, and `set_field` tools. Converts ASCII Turkish (e.g. "calisma") to proper characters ("çalışma") before typing. Pattern table (~175KB) lazy-loaded on first use.

### Removed
- Removed `execute_js` from Chrome MV3 tool schema. The tool was already blocked by MV3's CSP (`new Function()` always throws EvalError). The agent now uses fine-grained tools (`read_page`, `click`, `type_text`, `scroll`, etc.) directly. Firefox MV2 retains `execute_js`.

## [8.1.0] - 2026-05-26

### Added
- Added first-launch onboarding wizard: a 3-step walkthrough covering what WebBrain does, Act mode safety warnings, and LLM provider setup.
- Added MiniMax and Alibaba Cloud (Qwen) as new cloud providers.
- Added model suggestion dropdowns for all cloud providers with a "Custom..." option for free-form entry.

### Changed
- Settings page now opens on the Providers tab by default.
- Updated model suggestions and placeholders across all cloud providers to current models.
- Hidden the Claude Pro/Max subscription provider card until OAuth flow is fixed.

## [8.0.0] - 2026-05-25

### Added
- Added `hover`, `drag_drop`, and `wait_for_stable` agent tools.
- Added 27 new site adapters and the initial sheets-mode foundation.
- Added spreadsheet A1-reference handling improvements, including absolute references and quote-aware sheet/range parsing.
- Added a configurable LLM request timeout setting with a 10–600 second range.
- Added Multimodal settings updates, including a renamed Multimodal tab and a new Transcription section.
- Added auto-save behavior for SocialMediaDownloader / MSE captures.

### Changed
- Flipped local-provider defaults: vision is enabled by default and compact prompts are disabled by default.
- Increased the default LLM request timeout to 120 seconds.
- Updated non-English locale labels for compact prompt settings.
- Extracted and reused Firefox `fetchWithTimeout` handling for Anthropic and llama.cpp requests.

### Fixed
- Fixed stale-index failures by surfacing fresh element enumeration.
- Fixed `execute_js` regressions and retained Firefox MV2-compatible `unsafe-eval` CSP behavior.
- Fixed adapter ordering and a `drag_drop` scroll race.
- Fixed `wait_for_stable` MAIN-world network counting.
- Fixed A1 parsing edge cases, including row validation and reversed whole-column / whole-row ranges.

## [7.3.5] - 2026-05-24

### Added
- Added LLM comparison materials, benchmark blog content, and additional scenarios.
- Added project governance documentation.

### Changed
- Increased the default maximum agent steps from 60 to 130.

### Fixed
- Included post-7.3.3 bug fixes and content-index diagnostics.

## [7.3.4] - 2026-05-23

### Fixed
- Included maintenance bug fixes following `v7.3.3`.

## [7.3.3] - 2026-05-23

### Fixed
- Fixed Firefox clarify-flow behavior.

## [7.3.2] - 2026-05-21

### Added
- Added tab recording support: tab capture, microphone capture, Web Audio mixing, and WebM download.
- Added Whisper transcription and agent summarization handoff for recordings.
- Added prompt-driven recording start with screenshot save support.
- Documented tab recorder architecture.

### Changed
- Removed the recorder toolbar Stop button in favor of the existing page banner stop control.

### Fixed
- Fixed corrupted WebM output by stripping codecs from the data URL.
- Fixed OpenAI transcription HTTP 415 errors by tagging blobs as `audio/webm`.
- Added friendlier transcription errors when a picker targets a chat-only server.
- Fixed stuck clarify responses by routing through `sendToBackground`.

## [7.3.1] - 2026-05-21

### Added
- Added local model loading for LM Studio and llama.cpp.
- Added NVIDIA and Groq provider options.
- Regenerated store promotional assets around the brain icon and added marquee artwork.

### Changed
- Updated provider links, website copy, and store iconography.
- Scoped Chrome side panel behavior to opt-in tabs to prevent new-tab leakage.
- Scoped `agent_update` broadcasts to the originating tab.

### Fixed
- Fixed CAPTCHA URL-string sitekey fallback and added friendlier demo-rejection handling.
- Included web and extension bug fixes prior to the `v7.3.1` tag.

## [7.3.0] - 2026-05-20

### Added
- Added provider filters and collapsible provider cards.
- Added four additional cloud providers.
- Added opt-in CapSolver integration for CAPTCHA solving.
- Surfaced CAPTCHA solver and provider constellation updates on the website and localized pages.

### Changed
- Show configured models in collapsed provider headers.
- Preserve unsaved provider edits across filter and collapse re-renders.

### Fixed
- Tightened reCAPTCHA detection and cleaned CAPTCHA balance display strings.

## [7.2.1] - 2026-05-20

### Changed
- Stopped emitting the loose credential note to small models.

## [7.2.0] - 2026-05-20

### Added
- Added credential redaction support.
- Added a clarify tool.
- Added a WordPress site adapter.
- Added opt-in strict credential handling mode.

### Changed
- Made credential handling loose by default, while keeping stricter behavior available by opt-in.

## [7.1.0] - 2026-05-17

### Added
- Added SocialMediaDownloader v4.
- Added release-mode support to the version bump script with release-boundary tagging.
- Added 9 localization languages: Russian, Ukrainian, Arabic, Japanese, Korean, Indonesian, Thai, Malay, and Tagalog.
- Added RTL support and website language navigation updates.

### Fixed
- Fixed current page context handling in chat turns.
- Fixed tool behavior from GPT-4o trace review, including honest counts, gallery filtering, and article extraction.
- Improved scrolling in `overflow:hidden` panes when the document itself is unscrollable.

## [7.0.0] - 2026-05-12

### Added
- Added larger fetch limits, prompt nudges, trace conversation grouping, step-limit summaries, and cost surfacing.
- Added URL-family thrashing detection and empty-output recovery.
- Added multilingual FAQ content for dry-run roadmap status.
- Added an npm-runnable version bump tool.

### Changed
- Removed the mobile app from the main repository.
- Improved AX-tree fallback for composers.
- Rebuilt submission zips for v7.0.0.

### Fixed
- Fixed sidepanel XSS exposure.
- Hardened agent `fetch_url` behavior against SSRF.
- Clarified that the agent cannot schedule, sleep, or check back later.

## [6.1.0] - 2026-05-04

### Added
- Added native PDF reading with `read_pdf` and Claude PDF passthrough.
- Added Claude Pro/Max subscription provider support via OAuth.
- Added OpenAI OAuth subscription provider support.
- Added LM Studio web-fetching tools (`fetch_url` and `research_url`).
- Added LM Studio plugin publishing and related FAQ updates.
- Added mobile-app experiments, including Expo scaffolding, chat/browser tabs, agent loop, OpenAI provider, and AX-tree tools.
- Added blog and documentation updates for vision-model shootouts and PDF support.

### Changed
- Simplified website header navigation.
- Mentioned PDF support in website and README tool documentation.

### Fixed
- Hardened the LM Studio plugin against SSRF and added streaming response caps.
- Fixed PDF reader credentialed fetch and content-type-aware tab detection.
- Restored subscription-provider default merging and CORS opt-in behavior.
- Fixed Chrome side-panel action-click race by keeping the side panel always enabled.
- Preserved intermediate reasoning across steps in verbose mode.

## [6.0.1] - 2026-05-04

### Added
- Added Firefox parity for the agent visual indicator and tab grouping.
- Added cross-platform extension zip build tooling.

### Changed
- Scoped Chrome sidebar visibility to a per-window WebBrain tab group.
- Stopped adopting user-owned tab groups.
- Lowered Act mode temperature.
- Refreshed documentation for the 5.x release line.

### Fixed
- Added an on-page agent visual indicator with border and Stop button.

## [5.1.0] - 2026-04-29

### Added
- Added an Ollama model picker and guidance for 403 origin-block behavior.
- Added press release links and website sharing/footer updates.
- Added additional tests for model reasoning-suppression kwargs.
- Added blog content for vision-model comparisons.

### Changed
- Rebuilt extension zips for v5.1.0.
- Updated README and web assets.

### Fixed
- Fixed NVIDIA NIM integration issues.
- Fixed math visual bugs and improved pagination.
- Fixed web traces issues.

## [5.0.0] - 2026-04-24

### Added
- Added localized landing pages for Spanish, French, Turkish, and Chinese.
- Added language dropdowns across localized web pages.
- Added plugin internationalization.

### Changed
- Improved website presentation.
- Added token-conscious screenshot handling with resizing and iterative JPEG compression.

### Fixed
- Added test coverage for image budget math.

## [4.2.1] - 2026-04-21

### Added
- Added `.one` suffix branding to the web side-panel header.
- Added FAQ guidance for recommended vision models and vLLM configuration.

### Changed
- Updated demo video URLs and documentation around `/allow-api` and v4.2 behavior.

## [4.2.0] - 2026-04-20

### Added
- Added agent scratchpad tooling.
- Added preservation of tool-result digests in summaries.
- Added profile features.

### Fixed
- Fixed vision-model checkbox behavior and settings issues.

## [4.1.0] - 2026-04-20

### Changed
- Improved settings UI.

### Fixed
- Fixed tab grouping issues.
- Fixed screenshot-related bugs.

## [4.0.1] - 2026-04-19

### Fixed
- Fixed overlay-related issues and added tests.

## [4.0.0] - 2026-04-19

### Added
- Added optional dedicated vision model support for screenshot reads.
- Added vision model connection testing.
- Added tab grouping to keep WebBrain tabs near the current context.

### Changed
- Stripped chain-of-thought output from vision model responses.
- Preserved newlines in user bubbles.
- Updated architecture documentation.

## [3.6.8] - 2026-04-15

### Added
- Added test scenarios.
- Added math-related improvements.
- Added Firefox accessibility-tree support.

### Changed
- Improved browser install cards and Chrome Web Store linking.
- Updated Chrome and Firefox Act prompts for form verification and CAPTCHA handoff.
- Improved mobile demo video handling.

## [2.2.0] - 2026-04-12

### Added
- Added agent robustness guardrails.
- Added auto-scroll behavior.
- Added type validation and done verification.

### Fixed
- Fixed click loops.

## [2.0.0] - 2026-04-11

### Changed
- Rebuilt release zips with clean ZipInfo attributes.

## [1.9.2] - 2026-04-11

### Changed
- Made the agent more persistent.

### Fixed
- Fixed deep verbose trigger behavior.

## [1.9.1] - 2026-04-11

### Fixed
- Fixed fallback parsing for `call:toolName{}` format with quote tokens.

## [1.6.2] - 2026-04-08

### Added
- Added `/allow-api` per-conversation override and documentation.

## [1.6.1] - 2026-04-08

### Changed
- Clarified prompting so UI actions and `fetch_url` reading behavior are distinguished.

## [1.6.0] - 2026-04-08

### Added
- Added background fetch support.
- Added hidden-tab research tooling.
- Added download tools.

## [1.5.10] - 2026-04-08

### Added
- Added viewport-filtered interactive elements.
- Added index-instability warnings.

## [1.5.9] - 2026-04-08

### Added
- Added screenshot annotations.
- Added unintended-navigation detection.

## [1.5.8] - 2026-04-08

### Added
- Added click-by-visible-text support to avoid selector guessing for buttons.

## [1.5.7] - 2026-04-08

### Added
- Added `type_text` into the focused element without requiring a selector.

## [1.5.6] - 2026-04-08

### Added
- Added cross-origin iframe support so the agent can act in embedded flows such as Stripe.

## [1.5.5] - 2026-04-08

### Fixed
- Omitted temperature for GPT-5 and o-series models that only support the default value.

## [1.5.4] - 2026-04-08

### Fixed
- Added coordinate-click loop detection.
- Fixed OpenAI `max_completion_tokens` handling.

## [1.5.3] - 2026-04-08

### Added
- Added FAQ entry updates.

### Changed
- Improved header UI cleanup.

### Fixed
- Added active-tab guards.

## [1.5.2] - 2026-04-08

### Changed
- Reverted the Act mode toast back to a one-time-per-install `confirm()` dialog.

## [1.5.1] - 2026-04-08

### Fixed
- Fixed coordinate-click device-pixel-ratio mismatch.
- Preferred selectors where available.

## [1.5.0] - 2026-04-08

### Changed
- Included seven quality improvements.

### Fixed
- Fixed settings bugs.

## [1.4.0] - 2026-04-08

### Added
- Added site adapters.
- Added a non-blocking Act mode hint.

## [1.3.0] - 2026-04-08

### Added
- Added loop detection with a soft nudge followed by hard stop for stuck agents.

## [1.2.2] - 2026-04-08

### Changed
- Taught the agent that it operates inside the user's authenticated browser.

## [1.2.1] - 2026-04-08

### Changed
- Seeded the first prompt with URL and screenshot context.
- Improved Firefox parity.

### Fixed
- Fixed Continue button behavior.

## [1.2.0] - 2026-04-08

### Added
- Added SPA navigation detection.
- Added auto-screenshot mode.
- Added vision support.

## [1.1.6] - 2026-04-08

### Changed
- Increased the default agent maximum steps from 25 to 60.

## [1.1.5] - 2026-04-08

### Changed
- Routed click and type actions through CDP with selector-resolution retries.

## [1.1.4] - 2026-04-08

### Changed
- Updated the default OpenAI model to GPT-5.

## [1.1.3] - 2026-04-08

### Added
- Added LM Studio as a built-in local provider.

## [1.1.2] - 2026-04-08

### Fixed
- Fixed a manifest load error by restoring `side_panel.default_path`.

## [1.1.1] - 2026-04-08

### Fixed
- Persisted agent conversation state across service worker restarts.

## [1.1.0] - 2026-04-08

### Added
- Added robust CDP click/type behavior with shadow DOM support.
- Added per-tab sidebar behavior.
- Added persistent chats.

## [0.9.3] - 2026-04-06

### Changed
- Removed the old Firefox v0.9.0 zip artifact.

## [0.9.0] - 2026-04-06

### Changed
- Removed the website section from the README.

## [0.7.0] - 2026-04-06

### Added
- Added Firefox support documentation to the README.
