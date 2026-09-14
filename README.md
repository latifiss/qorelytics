<div align="center">
  <img src="./app/icon0.svg" alt="Qorelytics logo" width="96" height="96" />

  # Qorelytics

  **AI-powered data analysis for turning raw datasets into useful answers, insights, and visualizations.**

  <p>
    <a href="https://qorelytics-nine.vercel.app">Live App</a> ·
    <a href="https://github.com/latifiss/qorelytics">Repository</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Vercel-black?logo=vercel" alt="Vercel" />
  </p>
</div>

---

## Overview

Qorelytics is an AI data analyst designed to make working with datasets feel closer to having a conversation with an analyst than operating a traditional BI tool.

Users can upload a dataset, let Qorelytics inspect and profile the data, ask questions in natural language, and receive analysis supported by interactive charts and structured insights.

The project is built as a full-stack SaaS application with authentication, persistent datasets, AI analysis, conversational sessions, subscriptions, analytics, content management, and production-oriented infrastructure.

> **Project status:** Qorelytics is an active product project and is not currently positioned as a launched production SaaS.

## Why Qorelytics?

Traditional data analysis often requires a combination of spreadsheets, SQL, notebooks, BI dashboards, and specialist knowledge. Qorelytics explores a simpler workflow:

```text
Upload data → Understand the dataset → Ask a question → Analyze → Visualize → Decide
```

The goal is not simply to put an AI chat interface on top of a file. The application is designed around the complete analysis workflow: dataset ingestion, profiling, analysis state, structured results, visualization, conversation history, and user preferences.

## Core capabilities

### 1. Dataset ingestion

Upload supported business datasets and let the application prepare them for analysis.

- File upload workflow
- Dataset metadata and ownership
- File type and size handling
- Row and column counts
- Dataset profiling
- Processing states: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`
- Persistent dataset history

### 2. AI-powered analysis

Qorelytics connects structured dataset context with configurable AI models to produce analysis.

- Natural-language analysis
- Provider/model selection
- Structured analysis results
- Analysis lifecycle tracking
- Error handling and persisted analysis state
- Support for OpenAI-compatible providers through the AI SDK
- OpenRouter integration for model flexibility

### 3. Conversational data analysis

Analysis can continue beyond a single prompt through dataset-specific chat sessions.

- Persistent chat sessions
- Dataset-aware conversations
- User and assistant messages
- Conversation history
- Structured result payloads attached to messages
- Session titles and timestamps

### 4. Interactive visualizations

Qorelytics is built to turn analysis into visual information rather than returning text alone.

The frontend includes support for:

- Recharts
- D3
- Tabular data views
- Dynamic charts
- Data-driven UI components
- Exportable analysis artifacts

### 5. Multiple analysis modes

The product concept is organized around different ways of approaching a dataset:

- **Investigate**: explore what is happening in the data
- **Strategy**: turn findings into business-oriented recommendations
- **Analyze**: perform focused analytical work on a dataset

### 6. Reports and exports

The application includes tooling for producing portable analysis outputs, including PDF generation and image-based export workflows.

### 7. Authentication and user accounts

Authentication is backed by Better Auth with Prisma persistence.

The data model supports:

- User accounts
- Sessions
- Authentication providers
- User profiles
- Onboarding state
- User preferences
- Dataset ownership
- Notifications

### 8. Subscription infrastructure

Qorelytics includes Paddle billing infrastructure for SaaS monetization.

The application tracks subscription state directly against users and provides API routes for billing and Paddle event handling.

### 9. Product analytics

PostHog is integrated for product analytics, allowing the application to measure how users interact with the product and its analysis workflow.

### 10. Content and product surface

Sanity is used for content management, with routes and components for product content and the blog experience.

---

## Architecture

At a high level, Qorelytics follows a full-stack Next.js architecture:

```text
                              ┌─────────────────────┐
                              │      Qorelytics     │
                              │     Web Client      │
                              └──────────┬──────────┘
                                         │
                                         ▼
                         ┌────────────────────────────┐
                         │       Next.js 16           │
                         │ App Router + API Routes    │
                         └─────────────┬──────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
      ┌────────────────┐      ┌──────────────────┐      ┌────────────────┐
      │ Authentication │      │ Dataset Pipeline │      │ AI Analysis    │
      │  Better Auth   │      │ Upload / Profile │      │ AI SDK         │
      └───────┬────────┘      └────────┬─────────┘      └───────┬────────┘
              │                        │                        │
              │                        │                ┌───────┴────────┐
              │                        │                │ OpenAI /        │
              │                        │                │ OpenRouter      │
              │                        │                └────────────────┘
              │                        │
              └────────────────┬───────┴────────────────────────┐
                               ▼                                │
                     ┌──────────────────┐                       │
                     │ Prisma ORM       │◄──────────────────────┘
                     │ PostgreSQL / Neon│
                     └────────┬─────────┘
                              │
             ┌────────────────┼─────────────────┐
             │                │                 │
             ▼                ▼                 ▼
      ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
      │   Paddle    │  │  PostHog    │  │   Resend     │
      │   Billing   │  │  Analytics  │  │   Email      │
      └─────────────┘  └─────────────┘  └──────────────┘

                ┌─────────────────────────────────┐
                │ Vercel                          │
                │ Hosting / Serverless Runtime    │
                └─────────────────────────────────┘
```

### Analysis lifecycle

```text
1. User uploads a dataset
          │
          ▼
2. Validate file + create Dataset record
          │
          ▼
3. Parse and profile the dataset
          │
          ▼
4. Persist metadata and profiling information
          │
          ▼
5. Create an Analysis record
          │
          ▼
6. Select configured AI provider/model
          │
          ▼
7. Send structured dataset context to the model
          │
          ▼
8. Receive structured analytical output
          │
          ▼
9. Persist analysis result
          │
          ▼
10. Render insights + tables + visualizations
          │
          ▼
11. Continue analysis through dataset chat
```

This separation makes the analysis lifecycle observable and persistent instead of treating every AI request as an isolated chat completion.

---

## Data model

The Prisma schema is organized around users, datasets, analysis, and conversations.

| Model | Responsibility |
| --- | --- |
| `User` | Identity, account tier, Paddle subscription state |
| `Session` | Authenticated user sessions |
| `Account` | Authentication provider credentials and tokens |
| `Verification` | Verification records |
| `Profile` | User role, industry, company size, onboarding state |
| `Dataset` | Uploaded data, metadata, profiling, processing status |
| `Analysis` | AI provider/model, prompt, result, execution state |
| `ChatSession` | Dataset-specific analysis conversations |
| `Message` | User and assistant conversation messages |
| `UserPreference` | Preferred AI provider and model |
| `Notification` | User notifications and read state |
| `PaddleEvent` | Idempotent Paddle webhook/event tracking |

The schema also uses indexes around user ownership, dataset history, analysis history, conversations, and notifications to support common application queries. fileciteturn15file0

---

## Technology stack

### Frontend

- **Next.js 16** with App Router
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Styled Components**
- **Framer Motion** for interaction and animation
- **Zustand** for client-side state
- **React Hook Form** for form handling
- **React Dropzone** for file uploads
- **TanStack React Table** for data-heavy interfaces
- **Lucide React / React Icons** for interface icons
- **Sonner** for notifications

### AI and application intelligence

- **Vercel AI SDK**
- **OpenAI AI SDK provider**
- **OpenRouter AI SDK provider**
- Configurable AI provider/model preferences
- **Zod** for schema validation and structured data handling

### Backend and data

- **Next.js Route Handlers**
- **Prisma 7**
- **PostgreSQL**
- **Neon Prisma adapter**
- **Better Auth**
- Server-side data access and API workflows

### Data processing

- **Papa Parse** for CSV parsing
- **XLSX** for spreadsheet processing
- **PDF Parse** for PDF extraction
- **Mammoth** for document extraction
- **AWS S3 SDK** for object-storage integration

### Visualization and reporting

- **D3**
- **Recharts**
- **React PDF Renderer**
- **jsPDF**
- **html2canvas**
- **html-to-image**
- **html2pdf.js**

### Product infrastructure

- **Vercel** for deployment
- **Paddle** for subscriptions and billing
- **PostHog** for product analytics
- **Resend** for transactional email
- **Upstash Redis** integration
- **Inngest** for background/event-driven workflows
- **Sanity** for content management

### UI and experience

- **Three.js**
- **React Three Fiber**
- **React Three Drei**
- **Next Themes**
- Responsive, data-dense product interfaces

The dependency set in the repository includes the technologies above, alongside the supporting libraries used throughout the application. fileciteturn13file0

---

## Repository structure

```text
qorelytics/
├── .agents/                  # Agent/development skills and references
├── .claude/                  # Claude-related project configuration
├── .windsurf/                # Windsurf project configuration
├── app/
│   ├── api/
│   │   ├── analyses/         # Analysis collection operations
│   │   ├── analysis/         # Analysis execution workflows
│   │   ├── analytics/        # Product analytics endpoints
│   │   ├── auth/             # Authentication endpoints
│   │   ├── billing/          # Billing operations
│   │   ├── chat/             # AI chat operations
│   │   ├── chats/            # Chat persistence
│   │   ├── conversations/    # Conversation workflows
│   │   ├── datasets/         # Dataset operations
│   │   ├── onboarding/       # User onboarding
│   │   ├── paddle/           # Paddle event handling
│   │   └── test/             # Development/test endpoints
│   ├── auth/                 # Authentication UI
│   ├── dashboard/            # Main product workspace
│   ├── about/                # Product information
│   ├── blog/                 # Blog listing
│   ├── blog-detail/          # Blog detail experience
│   ├── intro/                # Intro/onboarding experience
│   ├── home-client.tsx       # Client-side landing experience
│   ├── layout.tsx            # Root application layout
│   ├── globals.css           # Global styles
│   └── icon0.svg             # Qorelytics brand icon
├── components/               # Reusable UI components
├── context/                  # React/application context
├── data/                     # Application data and supporting content
├── hooks/                    # Reusable React hooks
├── lib/                      # Server utilities and shared logic
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
└── README.md
```

The repository is structured around the Next.js App Router while keeping reusable components, hooks, application utilities, and database concerns separated into their own directories. fileciteturn17file0

---

## Getting started

### Prerequisites

Make sure you have the following installed:

- Node.js 20+
- npm
- PostgreSQL-compatible database, preferably Neon for the current Prisma setup
- Credentials for the external services you want to enable

### 1. Clone the repository

```bash
git clone https://github.com/latifiss/qorelytics.git
cd qorelytics
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

If the repository does not contain a complete `.env.example` for your current branch, create `.env.local` manually and configure the variables required by the application integrations you intend to run.

Typical configuration areas include:

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

OPENAI_API_KEY=
OPENROUTER_API_KEY=

PADDLE_API_KEY=
PADDLE_CLIENT_TOKEN=
PADDLE_WEBHOOK_SECRET=

POSTHOG_KEY=
POSTHOG_HOST=

RESEND_API_KEY=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_VERSION=

S3_ENDPOINT=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
```

Use the exact variable names expected by the corresponding modules in your checkout. Never commit real credentials to the repository.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Apply the database schema

For local development, use your preferred Prisma migration workflow. For example:

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Generate Prisma Client and build the application |
| `npm run start` | Start the production Next.js server |
| `npm run lint` | Run ESLint |

The build script explicitly runs `prisma generate` before `next build`, ensuring the generated Prisma client is available during deployment. fileciteturn13file0

---

## AI provider architecture

Qorelytics intentionally separates AI provider selection from the rest of the product workflow.

A user preference can specify:

```text
preferredProvider
preferredModel
```

The application can therefore evolve its model strategy without coupling the product to a single AI vendor.

Conceptually:

```text
                  ┌─────────────────────┐
                  │ User AI Preferences  │
                  │ Provider + Model     │
                  └──────────┬──────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ AI SDK Layer    │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
        ┌───────────────┐         ┌────────────────┐
        │ OpenAI        │         │ OpenRouter     │
        │ Provider      │         │ Provider       │
        └───────────────┘         └────────────────┘
```

This creates a foundation for model routing, experimentation, cost control, and future provider expansion.

---

## Data processing pipeline

Qorelytics treats uploaded data as a first-class product object.

```text
File
 │
 ├── Validate
 │
 ├── Store metadata
 │
 ├── Parse
 │
 ├── Profile
 │      ├── Row count
 │      ├── Column count
 │      └── Dataset profile
 │
 └── Ready for analysis
          │
          ▼
     AI analysis
          │
          ├── Provider
          ├── Model
          ├── Prompt/context
          └── Structured result
          │
          ▼
      Visualization
          │
          ▼
       AI chat
```

The `Dataset` and `Analysis` models explicitly track processing and execution state, making it possible to represent successful, running, pending, and failed operations rather than assuming every request completes synchronously. fileciteturn15file0

---

## Billing architecture

Paddle is integrated as the billing provider.

The user record stores subscription-related state including:

- Customer ID
- Subscription ID
- Subscription status
- Price ID
- Current billing period end
- Account tier

Paddle events are persisted using a unique event ID so webhook processing can be made idempotent. fileciteturn15file0

---

## Analytics architecture

PostHog is used for product analytics and application behavior measurement.

This enables the product to understand important events such as:

- Product activation
- Dataset uploads
- Analysis usage
- Chat engagement
- Feature adoption
- Conversion and subscription behavior

Analytics should remain separate from core data processing so the product can continue operating even when analytics services are unavailable.

---

## Performance and deployment

Qorelytics is designed for deployment on Vercel.

The current Next.js configuration includes special handling for PDF parsing dependencies that rely on native Node packages, keeping those packages external so they can be loaded correctly at runtime. It also configures long-lived immutable caching for texture assets and supports remote image sources used by authentication providers. fileciteturn16file0

A typical production flow is:

```text
Git push
   │
   ▼
Vercel build
   │
   ├── Prisma generate
   ├── Next.js build
   └── Deployment
         │
         ├── Web application
         ├── API routes
         └── Server-side workloads

External services
   ├── Neon / PostgreSQL
   ├── AI provider
   ├── Object storage
   ├── Paddle
   ├── PostHog
   ├── Resend
   ├── Upstash
   └── Sanity
```

---

## Security considerations

Because Qorelytics handles user accounts, uploaded data, AI requests, and billing information, production deployments should treat every integration as a security boundary.

Recommended practices include:

- Keep all API keys server-side.
- Never commit `.env.local` or production secrets.
- Validate uploaded files before processing them.
- Enforce dataset ownership on every dataset-scoped operation.
- Validate and sanitize structured AI output before rendering it.
- Verify Paddle webhook authenticity before applying subscription changes.
- Use HTTPS in production.
- Apply appropriate upload size and rate limits.
- Avoid exposing internal provider credentials to the browser.
- Keep development/test endpoints out of public production workflows.

---

## Design philosophy

Qorelytics is intentionally positioned between a traditional analytics tool and an AI assistant.

The product experience emphasizes:

**Clarity**

Complex datasets should be understandable without requiring the user to translate every question into SQL or spreadsheet formulas.

**Conversation**

Users should be able to investigate a result, ask a follow-up question, and continue from the same analytical context.

**Visual reasoning**

Charts, tables, and structured outputs should complement natural-language explanations rather than compete with them.

**Progressive complexity**

The interface should remain approachable for a non-technical user while providing enough depth for users who want to inspect their data more closely.

**Production-minded architecture**

Authentication, persistence, billing, analytics, background processing, and provider abstraction are treated as part of the product rather than afterthoughts.

---

## Roadmap

Potential areas for continued development include:

- Stronger dataset grounding and source-aware analysis
- More robust statistical analysis
- Improved automatic chart selection
- Adaptive visualization recommendations
- Advanced filtering and segmentation
- Saved analysis reports
- More export formats
- Scheduled analysis
- Background processing for larger datasets
- More AI providers and model routing
- Analysis cost and token tracking
- Team workspaces
- Dataset sharing and collaboration
- Data connectors beyond file uploads
- Advanced permissions and workspace roles
- Deeper product analytics
- More sophisticated caching strategies

---

## Development notes

### PDF parsing

The project uses `pdf-parse`, which depends on native Node packages. The Next.js configuration keeps the relevant packages external to avoid bundling issues with Turbopack and server-side runtime loading. fileciteturn16file0

### Prisma

The project uses Prisma 7 with the Neon adapter and generates its Prisma client into the repository's generated Prisma directory. fileciteturn15file0

### Background processing

Inngest is included in the application stack to support event-driven and background workflows as the product's analysis workload grows.

### Caching

Upstash Redis is part of the application's infrastructure dependencies and provides a foundation for caching and fast-access workloads. Caching strategies can be expanded as analysis volume and dataset size increase.

---

## Contributing

Qorelytics is currently a personal product project. If you want to experiment with the codebase:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run linting and a production build.
5. Open a pull request with a clear description of the change.

```bash
git checkout -b feature/your-feature
npm install
npm run lint
npm run build
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

---

## License

No open-source license is currently declared for this repository. Unless a license is added, do not assume that the source code can be redistributed, modified, or used commercially.

---

## Author

**Latif Issaka**

Senior Product Engineer and SaaS founder building products across product design, frontend engineering, full-stack development, and AI-powered applications.

- Portfolio: https://latifissaka-seven.vercel.app/
- GitHub: https://github.com/latifiss
- Qorelytics: https://qorelytics-nine.vercel.app

---

<div align="center">

  **Qorelytics**

  *From raw data to useful answers.*

</div>
