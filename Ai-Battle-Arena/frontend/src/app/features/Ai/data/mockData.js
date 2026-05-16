const pool = [
  {
    model1: {
      name: 'GPT-4o',
      provider: 'OpenAI',
      text: `Machine learning is a branch of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.

The process works in three stages: training data is fed to an algorithm, the algorithm identifies patterns and builds a mathematical model, then that model makes predictions on new data it hasn't seen before.

Three main paradigms define the field. Supervised learning uses labeled examples to train models for classification and prediction tasks. Unsupervised learning finds hidden structure in unlabeled data. Reinforcement learning trains agents through reward and penalty feedback loops.

Real-world applications span image recognition, natural language processing, recommendation systems, fraud detection, and medical diagnosis. The field has accelerated dramatically with the rise of deep learning and large-scale compute.`,
      latency: '1.3s',
    },
    model2: {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      text: `Machine learning is teaching computers to learn from examples rather than rules.

The core intuition: instead of writing "if four legs and barks → dog," you show a system thousands of labeled dog photos and let it discover the pattern. It adjusts internal parameters until its predictions are accurate, then generalizes that knowledge to new examples it's never seen.

Generalization is the key insight — a model that only memorizes training data is useless. A good model learns the underlying structure of a problem.

The field breaks into three paradigms: supervised learning (labeled data, known answers), unsupervised learning (finding hidden structure), and reinforcement learning (trial-and-error with rewards). Modern deep learning sits within supervised learning and has driven virtually every recent breakthrough — from image classifiers to large language models.`,
      latency: '1.1s',
    },
    judge: {
      winner: 2,
      summary: "Both responses accurately cover machine learning fundamentals. GPT-4o is precise and well-organized, while Claude 3.5 Sonnet leads with a stronger intuitive analogy and explains the critical concept of generalization — making it more memorable and pedagogically effective for most readers.",
      model1Score: 7.9,
      model2Score: 8.7,
      confidence: 78,
      model1Strengths: ['Precise technical definitions', 'Clean three-stage breakdown', 'Mentions application breadth'],
      model1Weaknesses: ['Opens abstractly without anchoring example', 'Less memorable without a concrete hook'],
      model2Strengths: ['Strong opening analogy grounds the concept immediately', 'Explains generalization explicitly', 'Progressive complexity works well'],
      model2Weaknesses: ['Slightly longer than necessary', 'Final sentence feels appended'],
    },
  },
  {
    model1: {
      name: 'GPT-4o',
      provider: 'OpenAI',
      text: `React is a JavaScript library for building user interfaces, developed by Meta. It uses a component-based architecture where UIs are composed of reusable, self-contained building blocks.

The key technical innovation is the virtual DOM — React maintains an in-memory representation of the UI and computes a minimal diff before applying changes to the actual DOM, making updates efficient even in complex applications.

Core concepts include components (functional or class-based), JSX syntax, props for passing data between components, state for managing internal component data, and hooks for adding lifecycle and state functionality to functional components.

React is typically paired with Vite or Create React App for bundling, React Router for client-side navigation, and state libraries like Redux, Zustand, or Jotai.`,
      latency: '1.4s',
    },
    model2: {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      text: `React is a UI library built around one core idea: your interface is a function of your application's state.

When state changes, React figures out the minimum set of DOM updates required — this is the virtual DOM diffing. You describe what the UI should look like, React handles making it so.

The component model is what makes React scale. You break your UI into isolated, composable pieces. A search bar doesn't need to know about your user avatar. This encapsulation works for a solo project and for a team of 50 engineers.

Hooks transformed React's ergonomics. useState for local state, useEffect for side effects, useContext for shared data — functional components with hooks are cleaner than the class component equivalent.

The ecosystem is React's greatest strength and complexity: React Router, Redux or Zustand, React Query, Next.js. The library itself is small; the ecosystem you choose defines your stack.`,
      latency: '1.0s',
    },
    judge: {
      winner: 2,
      summary: "Claude's answer better serves a developer trying to understand why React was designed the way it was. The 'UI as a function of state' mental model is the single most important concept for thinking in React, and Claude leads with it. GPT-4o's response reads more like documentation than explanation.",
      model1Score: 8.1,
      model2Score: 8.9,
      confidence: 82,
      model1Strengths: ['Complete coverage of core concepts', 'Mentions ecosystem tools specifically', 'Accurate technical detail on virtual DOM'],
      model1Weaknesses: ['Feels like reference documentation', 'No clear mental model to orient around'],
      model2Strengths: ["Opens with the right mental model", 'Explains composability benefits concretely', 'Practical ecosystem framing'],
      model2Weaknesses: ['Slightly opinionated on class vs functional', 'Could mention JSX explicitly'],
    },
  },
  {
    model1: {
      name: 'GPT-4o',
      provider: 'OpenAI',
      text: `REST API design best practices center on clarity, consistency, and correct use of HTTP semantics.

Use nouns for resource names, not verbs. /users and /orders are correct; /getUsers and /createOrder are not. HTTP methods carry the action: GET retrieves, POST creates, PUT replaces, PATCH partially updates, DELETE removes.

Return appropriate HTTP status codes consistently: 200 for success, 201 when a resource is created, 400 for malformed requests, 401 for unauthenticated requests, 403 for unauthorized requests, 404 for missing resources, 422 for validation failures, 500 for server errors.

Version your API from day one using path prefixes like /api/v1/ or via request headers. Paginate large collections. Use consistent JSON response shapes across all endpoints. Document with OpenAPI/Swagger. Implement rate limiting.`,
      latency: '1.5s',
    },
    model2: {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      text: `Good REST API design has one goal: make your API intuitive enough that developers can use basic endpoints without reading the documentation.

Start with resource naming. Use plural nouns that map to your domain model: /users, /orders, /products. Never encode verbs into URLs — HTTP methods are the verbs. GET /users reads, POST /users creates, DELETE /users/123 removes.

Status codes are a communication protocol with your clients. Use them precisely. Return 201 (not 200) when you create something — include a Location header pointing to the new resource. Return 400 for malformed requests with an error body explaining what's wrong. Return 422 specifically for validation failures. Clients need to distinguish these.

Version from day one. /api/v1/ is minor friction now; it's the difference between a smooth upgrade path and a breaking change that affects every client.

The most common mistake I see: inconsistent response envelopes. Agree on your error format, success format, and pagination format before writing the first endpoint, and never deviate.`,
      latency: '1.2s',
    },
    judge: {
      winner: 2,
      summary: "Claude's response edges ahead by framing best practices around a developer experience goal, not just a list of rules. The opening principle — 'intuitive enough that basic endpoints don't need documentation' — gives developers the right north star for every decision that follows.",
      model1Score: 8.3,
      model2Score: 8.8,
      confidence: 71,
      model1Strengths: ['Comprehensive point coverage', 'Correct HTTP method and status code mapping', 'Mentions OpenAPI documentation'],
      model1Weaknesses: ["List of rules without explaining why they matter", "Doesn't address the most common mistake"],
      model2Strengths: ['Clear guiding principle upfront', 'Distinguishes 422 from 400 with rationale', 'Identifies the most common design mistake explicitly'],
      model2Weaknesses: ['Slightly longer', 'Could mention pagination and rate limiting'],
    },
  },
  {
    model1: {
      name: 'GPT-4o',
      provider: 'OpenAI',
      text: `Promises and async/await are both ways to handle asynchronous operations in JavaScript, but they differ significantly in syntax and readability.

Promises use a chain-based approach. You call .then() to handle resolved values, .catch() for errors, and .finally() for cleanup. While powerful, deeply nested promise chains — often called "promise hell" — can become hard to follow.

Async/await is syntactic sugar built on top of Promises. An async function always returns a Promise, and the await keyword pauses execution inside that function until the awaited Promise settles. This allows you to write asynchronous code that reads like synchronous code.

Both approaches handle the same underlying operations. Choose async/await for linear flows and readability. Use raw Promises when working with concurrency patterns like Promise.all(), Promise.race(), or Promise.allSettled(), or when working with streams and event-based APIs.`,
      latency: '1.6s',
    },
    model2: {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      text: `Async/await is syntactic sugar over Promises. They're not alternatives — they're the same mechanism with different syntax.

A Promise is an object representing a value that isn't available yet. You handle it with .then()/.catch() chains. This is powerful but gets hard to read when you have sequential async operations — you end up nesting or chaining .then() calls that follow the logic horizontally instead of vertically.

Async/await lets you write the same logic as if it were synchronous. An await expression pauses the async function's execution until the Promise resolves, then returns the value. Errors are handled with try/catch, which most developers already have mental models for.

In practice: use async/await for sequential operations and most everyday code — it's dramatically more readable. Reach for Promise.all() when you need to run things in parallel (await Promise.all([fetch(a), fetch(b)]) fires both concurrently). Use .then() chains when you're building reusable utility functions that return Promises without consuming them.`,
      latency: '1.1s',
    },
    judge: {
      winner: 2,
      summary: "Claude's response is stronger because it immediately corrects the framing: these aren't alternatives, they're the same thing with different syntax. This reorientation helps readers build an accurate mental model. The practical guidance on when to use each pattern is also more actionable.",
      model1Score: 8.0,
      model2Score: 9.0,
      confidence: 85,
      model1Strengths: ['Covers both patterns thoroughly', 'Mentions concurrency patterns like Promise.all', 'Clean structure'],
      model1Weaknesses: ['Frames them as alternatives, which is misleading', 'Missing the key insight that async/await is built on Promises'],
      model2Strengths: ['Correctly frames the relationship upfront', 'Concrete parallel fetch example', 'Actionable when-to-use guidance'],
      model2Weaknesses: ['Could mention Promise.race and Promise.allSettled', 'Slightly dense in the middle'],
    },
  },
];

export function getMockResponse() {
  return pool[Math.floor(Math.random() * pool.length)];
}

export const SAMPLE_QUERIES = [
  'Explain machine learning to a beginner',
  'How does React work under the hood?',
  'What are REST API design best practices?',
  'Async/await vs Promises in JavaScript',
];
