window.SD = window.SD || {};

SD.progressive = {
  appName: 'QuickBite',
  appDescription: 'A food delivery platform — from a weekend project to a globally distributed system serving millions',
  stages: [
    {
      title: 'Stage 1: The MVP — A Simple Beginning',
      subtitle: 'Getting the product to market with a single server and database',
      conceptsIntroduced: ['Monolith', 'Client-Server Architecture', 'Relational Database'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>QuickBite has just launched. We are serving 100 users per day with a monolithic Node.js application and a single PostgreSQL database.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>Right now, it works fine, but all eggs are in one basket.</li>
      <li>If the server crashes, the whole app goes down.</li>
      <li>If the database goes down, no one can see menus or order food.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Keep it simple. Don't over-engineer until you have to.</p>
  </div>
  <ul class="point-list">
    <li>Single server handling all business logic (auth, menus, orders).</li>
    <li>Single database handling all data persistence.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">MVP Architecture</div>
      <div class="diagram-flow">
        <div class="d-node client">Web/Mobile Client</div>
        <div class="d-arrow">→</div>
        <div class="d-node server">Node.js Server</div>
        <div class="d-arrow">→</div>
        <div class="d-node db">PostgreSQL</div>
      </div>
    </div>
  </div>
</div>

<div class="callout tip"><strong>💡 Key Insight:</strong> In the beginning, speed of development is more important than massive scalability. A simple {{Monolith}} is usually the right choice for an MVP.</div>
      `
    },
    {
      title: 'Stage 2: The First Growth Spurt — Horizontal Scaling & Load Balancing',
      subtitle: 'Scaling out to handle 10,000 daily active users',
      conceptsIntroduced: ['Horizontal Scaling', 'Load Balancer', 'Stateless Architecture', 'Redis'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>Marketing worked! We hit 10,000 users/day, but the app feels sluggish during dinner time.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>CPU usage on the single server is hitting 95%.</li>
      <li>Requests are timing out for users.</li>
      <li>When we restart the server, users are logged out because sessions are stored in memory.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Add more servers ({{Horizontal Scaling}}) and put a {{Load Balancer}} in front of them.</p>
  </div>
  <ul class="point-list">
    <li>Use a {{Load Balancer}} to distribute traffic evenly across multiple servers.</li>
    <li>Move user sessions out of server memory into a shared {{Redis}} instance to achieve a {{Stateless Architecture}}.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Horizontal Scaling</div>
      <div class="diagram-content">
        <div class="d-tier">
          <div class="d-tier-label">ENTRY</div>
          <div class="d-tier-nodes">
            <div class="d-node lb">Load Balancer</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">APPLICATION</div>
          <div class="d-tier-nodes">
            <div class="d-node server">App Server 1</div>
            <div class="d-node server">App Server 2</div>
            <div class="d-node server">App Server 3</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">DATA</div>
          <div class="d-tier-nodes">
            <div class="d-node cache">Redis (Sessions)</div>
            <div class="d-node db">PostgreSQL</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="callout tip"><strong>💡 Key Insight:</strong> Making your servers stateless is crucial for horizontal scaling. Any server should be able to handle any request.</div>
      `
    },
    {
      title: 'Stage 3: Speed Matters — Caching',
      subtitle: 'Offloading read-heavy operations to Redis and a CDN',
      conceptsIntroduced: ['Caching', 'CDN', 'Cache Invalidation', 'TTL'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>The app is stable, but loading restaurant menus takes 2 seconds. The database is groaning under the read load.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>Database is hammered with identical read queries (e.g., everyone fetching the McDonald's menu).</li>
      <li>Serving images directly from our app servers is wasting bandwidth and CPU.</li>
      <li>Users in distant cities experience high latency downloading static assets.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Introduce {{Caching}} to serve frequently accessed data instantly.</p>
  </div>
  <ul class="point-list">
    <li>Add a {{Redis}} cache layer using the Cache-Aside pattern for menus and restaurant lists.</li>
    <li>Use a {{CDN}} to serve static assets (CSS, JS, images) from edge locations close to users.</li>
    <li>Implement a {{Cache Invalidation}} strategy: invalidate menus when a restaurant updates them, or use a {{TTL}} (Time-to-Live).</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Caching & CDN</div>
      <div class="diagram-content">
        <div class="d-tier">
          <div class="d-tier-label">EDGE</div>
          <div class="d-tier-nodes">
            <div class="d-node client">Client</div>
            <div class="d-node cdn">CDN (Images/Assets)</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">ENTRY</div>
          <div class="d-tier-nodes">
            <div class="d-node lb">Load Balancer</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">APPLICATION</div>
          <div class="d-tier-nodes">
            <div class="d-node server">App Servers</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">DATA</div>
          <div class="d-tier-nodes">
            <div class="d-node cache">Redis Cache</div>
            <div class="d-node db">PostgreSQL</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="callout tip"><strong>💡 Key Insight:</strong> "There are only two hard things in Computer Science: cache invalidation and naming things." Always have a clear strategy for stale data!</div>
      `
    },
    {
      title: 'Stage 4: Data at Scale — Database Replication',
      subtitle: 'Separating reads from writes',
      conceptsIntroduced: ['Replication', 'Read Replica', 'Eventual Consistency'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>With 100,000 daily users, the primary database is becoming the bottleneck, despite caching.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>Read:Write ratio is roughly 80:20 (lots of menu browsing, fewer actual orders).</li>
      <li>Heavy analytical queries (e.g., daily sales reports) are slowing down the primary DB, impacting customer orders.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Implement Database {{Replication}} and route read traffic to {{Read Replica}}s.</p>
  </div>
  <ul class="point-list">
    <li>Primary database handles all WRITE operations (orders, profile updates).</li>
    <li>Multiple {{Read Replica}} databases handle READ operations (fetching menus, order history).</li>
    <li>Accept {{Eventual Consistency}}: there might be a slight replication lag. It's okay if a menu update takes 50ms to reflect, but crucial things like "has my order been placed" might need to read from the primary.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Database Replication</div>
      <div class="diagram-content">
        <div class="d-tier">
          <div class="d-tier-label">APPLICATION</div>
          <div class="d-tier-nodes">
            <div class="d-node server">App Servers</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">DATA LAYER</div>
          <div class="d-tier-nodes">
            <div class="d-group">
              <div class="d-group-label">Primary (Writes)</div>
              <div class="d-node db">PostgreSQL</div>
            </div>
            <div class="d-group">
              <div class="d-group-label">Replicas (Reads)</div>
              <div class="d-node db">DB Replica 1</div>
              <div class="d-node db">DB Replica 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="callout warning"><strong>⚠️ Warning:</strong> Beware of Replication Lag! If a user places an order (write to primary) and immediately fetches their active orders (read from replica), they might not see it if the replica hasn't synced yet. Always read critical data from the primary!</div>
      `
    },
    {
      title: 'Stage 5: Breaking Apart — Microservices',
      subtitle: 'Splitting the monolith to improve team velocity and fault isolation',
      conceptsIntroduced: ['Microservices', 'Monolith'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>The engineering team has grown to 50 developers. The monolithic codebase is massive, hard to deploy, and fragile.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>Teams are stepping on each other's toes during deployments.</li>
      <li>A memory leak in the Search feature brings down the entire application (including Checkout).</li>
      <li>Scaling is inefficient: we have to scale the whole monolith even if only the restaurant listing feature is under load.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Split the monolithic application into distinct {{Microservices}} based on business domains.</p>
  </div>
  <ul class="point-list">
    <li>Create separate services: User Service, Restaurant Service, Order Service, Delivery Service.</li>
    <li>Each service gets its own independent database (loose coupling).</li>
    <li>Trade-offs: Increased operational complexity, network latency between services, and distributed transactions.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Microservices Architecture</div>
      <div class="diagram-content">
        <div class="d-tier">
          <div class="d-tier-label">ENTRY</div>
          <div class="d-tier-nodes">
            <div class="d-node lb">Load Balancer</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">SERVICES</div>
          <div class="d-tier-nodes">
            <div class="d-group">
              <div class="d-node service">User Service</div>
              <div class="d-node db">User DB</div>
            </div>
            <div class="d-group">
              <div class="d-node service">Restaurant Svc</div>
              <div class="d-node db">Menu DB</div>
            </div>
            <div class="d-group">
              <div class="d-node service">Order Service</div>
              <div class="d-node db">Order DB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="callout tip"><strong>💡 Key Insight:</strong> "Microservices buy you organizational scaling at the cost of operational complexity." Don't do this until your team size or deployment pains demand it.</div>
      `
    },
    {
      title: 'Stage 6: The Front Door — API Gateway',
      subtitle: 'Centralizing common cross-cutting concerns',
      conceptsIntroduced: ['API Gateway', 'Service Discovery', 'Reverse Proxy'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>We have 15 microservices running. Client apps (iOS, Android, Web) are struggling to talk to them directly.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>Mobile app needs to know the URLs for 15 different services.</li>
      <li>Auth logic (JWT validation) is duplicated in every single microservice.</li>
      <li>Loading the home page requires the client app to make 7 separate HTTP requests to different services.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Introduce an {{API Gateway}} as the single entry point for all client requests.</p>
  </div>
  <ul class="point-list">
    <li>The Gateway acts as a {{Reverse Proxy}}, routing requests to the correct internal service.</li>
    <li>Handles cross-cutting concerns: Authentication, SSL termination, rate limiting.</li>
    <li>Can aggregate requests: Gateway fetches data from Restaurant, Rating, and Promo services in parallel and returns a single JSON to the client.</li>
    <li>Introduce {{Service Discovery}} (e.g., Consul, Eureka) so the Gateway knows where instances of services live dynamically.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">API Gateway</div>
      <div class="diagram-content">
        <div class="d-tier">
          <div class="d-tier-label">CLIENTS</div>
          <div class="d-tier-nodes">
            <div class="d-node client">Mobile App</div>
            <div class="d-node client">Web App</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">EDGE</div>
          <div class="d-tier-nodes">
            <div class="d-node gateway">API Gateway</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">INTERNAL SERVICES</div>
          <div class="d-tier-nodes">
            <div class="d-node service">User</div>
            <div class="d-node service">Order</div>
            <div class="d-node service">Delivery</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="callout note"><strong>📝 Note:</strong> An API Gateway is a specialized form of Load Balancer that understands API traffic and often contains business logic for routing and aggregation.</div>
      `
    },
    {
      title: 'Stage 7: Don\'t Keep Users Waiting — Async Processing & Message Queues',
      subtitle: 'Decoupling heavy workflows with Kafka',
      conceptsIntroduced: ['Message Queue', 'Kafka', 'Asynchronous Processing', 'Idempotency'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>The checkout process is painfully slow. Users wait 5 seconds looking at a spinner.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>Order placement is synchronous: Validate → Charge Card → Notify Restaurant → Assign Driver → Send Email = 5 seconds.</li>
      <li>If the Notification service is down, the entire order fails.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Use a {{Message Queue}} for {{Asynchronous Processing}} of non-critical path tasks.</p>
  </div>
  <ul class="point-list">
    <li>Order Service validates and saves the order, then publishes an "OrderPlaced" event to {{Kafka}}, returning success to the user instantly (< 100ms).</li>
    <li>Payment, Notification, and Delivery services subscribe to this event and do their jobs in the background.</li>
    <li>Must design consumers for {{Idempotency}}: if a message is delivered twice, we shouldn't charge the user twice.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Event-Driven Architecture</div>
      <div class="diagram-flow">
        <div class="d-node service">Order Service</div>
        <div class="d-arrow">publishes</div>
        <div class="d-node queue">Kafka (Message Broker)</div>
        <div class="d-arrow">consumes</div>
        <div class="d-group">
          <div class="d-node service">Payment Svc</div>
          <div class="d-node service">Restaurant Svc</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="callout tip"><strong>💡 Key Insight:</strong> Synchronous communication across multiple microservices is a recipe for cascading failures. Event-driven architectures provide loose coupling and high resilience.</div>
      `
    },
    {
      title: 'Stage 8: Real-time Magic — WebSockets & Live Tracking',
      subtitle: 'Building the live order tracking experience',
      conceptsIntroduced: ['WebSocket', 'Long Polling', 'SSE', 'Pub/Sub'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>Users want to see their delivery driver moving on a map in real-time.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>Users are constantly refreshing the app to check order status, slamming the servers.</li>
      <li>Drivers are sending location updates every 3 seconds via standard HTTP REST calls, which has high overhead.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Implement persistent {{WebSocket}} connections for real-time bi-directional communication.</p>
  </div>
  <ul class="point-list">
    <li>Mobile clients establish a {{WebSocket}} connection to a dedicated Tracking Service.</li>
    <li>Drivers push location updates. The Tracking Service publishes to Redis {{Pub/Sub}}.</li>
    <li>Tracking servers subscribed to that channel push the location to the specific user over their WebSocket.</li>
    <li>Fallback options for older clients: {{SSE}} (Server-Sent Events) or {{Long Polling}}.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Real-time Pub/Sub</div>
      <div class="diagram-content">
        <div class="d-tier">
          <div class="d-tier-label">CLIENTS</div>
          <div class="d-tier-nodes">
            <div class="d-node client">Driver App</div>
            <div class="d-node client">User App</div>
          </div>
        </div>
        <div class="d-connector">▼ WS ▼</div>
        <div class="d-tier">
          <div class="d-tier-label">SERVICES</div>
          <div class="d-tier-nodes">
            <div class="d-node service">Tracking Node 1</div>
            <div class="d-node service">Tracking Node 2</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">MESSAGE BUS</div>
          <div class="d-tier-nodes">
            <div class="d-node cache">Redis Pub/Sub</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="callout tip"><strong>💡 Key Insight:</strong> WebSockets hold connections open permanently. Your Load Balancers need to be configured specifically to handle long-lived connections rather than fast HTTP requests.</div>
      `
    },
    {
      title: 'Stage 9: Going Global — Database Sharding & Multi-Region',
      subtitle: 'Scaling beyond a single massive database cluster',
      conceptsIntroduced: ['Sharding', 'Consistent Hashing', 'CAP Theorem', 'Data Partitioning'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>QuickBite is now operating in 50 cities globally. Our main database cluster is massive and writes are bottlenecking again.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>Even the beefiest AWS RDS instance can't handle the write throughput of 50 cities.</li>
      <li>Users in Tokyo experience 300ms latency because the database is in US-East.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Implement Database {{Sharding}} and deploy in multiple geographical regions.</p>
  </div>
  <ul class="point-list">
    <li>{{Data Partitioning}} (Sharding) by geographic region or City ID. Data for NY is in one database shard, data for Tokyo in another.</li>
    <li>Use {{Consistent Hashing}} to determine which shard an entity belongs to, allowing us to add new database nodes smoothly.</li>
    <li>Deploy app servers and databases in multiple AWS regions (US-East, EU-West, AP-Northeast).</li>
    <li>Consider the {{CAP Theorem}}: During a network partition between regions, do we prioritize Availability or Consistency?</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Multi-Region & Sharding</div>
      <div class="diagram-content">
        <div class="d-tier">
          <div class="d-tier-label">GLOBAL TRAFFIC ROUTING</div>
          <div class="d-tier-nodes">
            <div class="d-node lb">Route53 (Geo DNS)</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">REGIONS</div>
          <div class="d-tier-nodes">
            <div class="d-group">
              <div class="d-group-label">US-East</div>
              <div class="d-node service">App Servers</div>
              <div class="d-node db">Shard 1 (NY/BOS)</div>
            </div>
            <div class="d-group">
              <div class="d-group-label">EU-West</div>
              <div class="d-node service">App Servers</div>
              <div class="d-node db">Shard 2 (LDN/PAR)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="callout tip"><strong>💡 Key Insight:</strong> Sharding is incredibly complex. Join queries across shards are impossible. Only shard when you have absolutely exhausted all vertical scaling and caching options!</div>
      `
    },
    {
      title: 'Stage 10: Staying Alive — Fault Tolerance & Resilience',
      subtitle: 'Preventing localized failures from taking down the system',
      conceptsIntroduced: ['Circuit Breaker', 'Fault Tolerance', 'Redundancy', 'Health Checks', 'Bulkhead Pattern'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>The system is distributed across hundreds of nodes. Something fails every single day.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>If the external Payment Gateway (Stripe) is slow, our Order Service threads pile up waiting, eventually crashing the service.</li>
      <li>A minor outage in the Recommendation engine takes down the Home Page.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Design for failure. Assume dependencies will break and implement {{Fault Tolerance}}.</p>
  </div>
  <ul class="point-list">
    <li>Use the {{Circuit Breaker}} pattern: if calls to Payment Svc fail 5 times, "open" the circuit and fail fast instead of waiting for timeouts.</li>
    <li>Use the {{Bulkhead Pattern}}: limit resources (like thread pools) used for a specific service so one slow dependency doesn't consume everything.</li>
    <li>Implement graceful degradation: if Restaurant Svc is down, serve a cached generic menu rather than an error page.</li>
    <li>Continuous {{Health Checks}} and auto-scaling to replace dead nodes.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Circuit Breaker Pattern</div>
      <div class="diagram-flow">
        <div class="d-node service">Gateway</div>
        <div class="d-arrow">tries call</div>
        <div class="d-node service" style="border: 2px dashed red;">Failing Service</div>
        <div class="d-arrow">circuit open →</div>
        <div class="d-node cache">Fallback (Cache)</div>
      </div>
    </div>
  </div>
</div>

<div class="callout tip"><strong>💡 Key Insight:</strong> In a microservices architecture, you don't prevent failure; you contain it. Graceful degradation is key to a good user experience.</div>
      `
    },
    {
      title: 'Stage 11: Protecting the System — Rate Limiting',
      subtitle: 'Defending against bots and noisy neighbors',
      conceptsIntroduced: ['Rate Limiting', 'Token Bucket', 'Back Pressure'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>We're handling millions of requests, but we're vulnerable to traffic spikes and malicious actors.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Problem</h3>
  <div class="problem-box">
    <ul class="point-list">
      <li>Botnets are scraping our menus, causing a 10x traffic spike.</li>
      <li>A partner restaurant wrote a bad script that sends us 50 API requests per second.</li>
      <li>Our system gets overwhelmed, leading to outages for real users.</li>
    </ul>
  </div>
</div>

<div class="stage-section">
  <h3>💡 The Solution</h3>
  <div class="solution-box">
    <p>Implement {{Rate Limiting}} at the API Gateway to restrict traffic to safe levels.</p>
  </div>
  <ul class="point-list">
    <li>Use the {{Token Bucket}} or Leaky Bucket algorithm to track requests per user/IP using Redis.</li>
    <li>Apply different limits: Free users (100 req/min), Premium Partners (1000 req/min).</li>
    <li>Return HTTP 429 Too Many Requests when limits are hit.</li>
    <li>Internal services apply {{Back Pressure}} to reject work when overloaded, saving themselves from crashing.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Rate Limiting at Edge</div>
      <div class="diagram-content">
        <div class="d-tier">
          <div class="d-tier-label">TRAFFIC</div>
          <div class="d-tier-nodes">
            <div class="d-node client">Valid Users</div>
            <div class="d-node client">Bots/Scrapers</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">API GATEWAY</div>
          <div class="d-tier-nodes">
            <div class="d-group">
              <div class="d-node gateway">Rate Limiter</div>
              <div class="d-node cache">Redis (Counters)</div>
            </div>
          </div>
        </div>
        <div class="d-connector">▼ Allowed Traffic ▼</div>
        <div class="d-tier">
          <div class="d-tier-label">INTERNAL</div>
          <div class="d-tier-nodes">
            <div class="d-node service">App Services</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="callout important"><strong>🔴 Important:</strong> Never trust client inputs or client traffic volumes. Always protect your expensive internal systems at the edge.</div>
      `
    },
    {
      title: 'Stage 12: The Final Architecture — Putting It All Together',
      subtitle: 'The fully matured, globally distributed system',
      conceptsIntroduced: ['Latency', 'Throughput', 'Observability'],
      content: `
<div class="stage-section">
  <h3>📍 Where We Are</h3>
  <p>QuickBite is a global behemoth. We've gone from a weekend monolith to a massively scalable distributed system.</p>
</div>

<div class="stage-section">
  <h3>🔥 The Result</h3>
  <div class="solution-box">
    <p>A resilient, scalable system that can handle regional failures, traffic spikes, and millions of concurrent users.</p>
  </div>
  <ul class="point-list">
    <li>Edge caching and CDN for speed.</li>
    <li>API Gateway for security and routing.</li>
    <li>Microservices for team velocity.</li>
    <li>Kafka for async decoupling.</li>
    <li>Sharded databases for massive scale.</li>
  </ul>
</div>

<div class="stage-section">
  <h3>🏗️ Architecture</h3>
  <div class="diagram-container">
    <div class="diagram">
      <div class="diagram-title">Complete System Architecture</div>
      <div class="diagram-content">
        <div class="d-tier">
          <div class="d-tier-label">EDGE</div>
          <div class="d-tier-nodes">
            <div class="d-node client">Clients</div>
            <div class="d-node cdn">CDN</div>
            <div class="d-node lb">Global LB / DNS</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">ENTRY & REALTIME</div>
          <div class="d-tier-nodes">
            <div class="d-node gateway">API Gateway (Rate Limiter)</div>
            <div class="d-node service">WebSocket Servers</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">MICROSERVICES</div>
          <div class="d-tier-nodes">
            <div class="d-node service">Users</div>
            <div class="d-node service">Restaurants</div>
            <div class="d-node service">Orders</div>
            <div class="d-node service">Delivery</div>
          </div>
        </div>
        <div class="d-connector">▼</div>
        <div class="d-tier">
          <div class="d-tier-label">ASYNC & DATA</div>
          <div class="d-tier-nodes">
            <div class="d-node queue">Kafka</div>
            <div class="d-node cache">Redis Cluster</div>
            <div class="d-node db">Sharded PostgreSQL</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="stage-section">
  <h3>What's Next?</h3>
  <p>As the system scales further, we would look into:</p>
  <ul class="point-list">
    <li><strong>Observability:</strong> Tracing requests across microservices (monitoring {{Latency}} p99 and {{Throughput}}).</li>
    <li><strong>Machine Learning:</strong> Personalized restaurant recommendations and surge pricing engines.</li>
    <li><strong>Data Lake:</strong> Dumping operational DB data to Hadoop/Snowflake for analytical processing.</li>
  </ul>
</div>

<div class="callout tip"><strong>💡 Key Insight:</strong> Architecture is an evolutionary process. You shouldn't build Stage 12 on Day 1. Let the scale dictate the architecture!</div>
      `
    }
  ]
};
