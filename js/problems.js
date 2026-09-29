window.SD = window.SD || {};

window.SD.problems = [
  {
    id: 'url-shortener',
    title: 'Design a URL Shortener',
    icon: '🔗',
    difficulty: 'Medium',
    timeEstimate: '45 min',
    companies: 'Google, Amazon, Meta',
    conceptsCovered: ['Hashing', 'NoSQL Database', 'Caching', 'Load Balancer', 'Database Index', 'Replication'],
    description: 'Design a service like TinyURL that takes a long URL and generates a short and unique alias for it.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> Always start by asking questions. It shows maturity and prevents wasted effort on wrong assumptions.</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What is the expected traffic volume?</div>
      <div class="clarification-why">💭 Why ask this: Determines scale, storage requirements, and if we need {{Horizontal Scaling}}.</div>
      <div class="clarification-answer">✅ Assume 100 million new URLs generated per day and 1 billion clicks per day.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ How long should the URLs be kept?</div>
      <div class="clarification-why">💭 Why ask this: Storage estimation and lifecycle management.</div>
      <div class="clarification-answer">✅ Assume they are kept for 10 years.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Can users specify custom short aliases?</div>
      <div class="clarification-why">💭 Why ask this: Impacts the URL generation logic and collision handling.</div>
      <div class="clarification-answer">✅ Yes, custom aliases are supported.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Do we need analytics/tracking?</div>
      <div class="clarification-why">💭 Why ask this: Introduces a read-heavy or write-heavy analytics pipeline.</div>
      <div class="clarification-answer">✅ Yes, basic click counts are required.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Should it be highly available?</div>
      <div class="clarification-why">💭 Why ask this: Understand {{CAP Theorem}} trade-offs.</div>
      <div class="clarification-answer">✅ Yes, highly available for redirection. Redirection failure is unacceptable.</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Given a long URL, generate a unique short URL.</li>
          <li>Given a short URL, redirect to the original URL.</li>
          <li>Users can optionally pick a custom short link.</li>
          <li>Links will expire after a default timespan (10 years).</li>
          <li>Basic analytics on how many times a short link is clicked.</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Highly available system. Redirects must not fail.</li>
          <li>URL redirection should have minimal {{Latency}}.</li>
          <li>Short links should not be predictable.</li>
          <li>High {{Throughput}} (especially for reads/redirects).</li>
          <li>{{Fault Tolerance}} against single points of failure.</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: Estimation -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">Back-of-the-Envelope Estimation</div>
  </div>
  <div class="step-content">
    <table class="est-table">
      <tr><th>Metric</th><th>Calculation</th><th>Result</th></tr>
      <tr><td>Write QPS</td><td>100M / (24 * 3600)</td><td>~1,160 QPS</td></tr>
      <tr><td>Read QPS</td><td>1B / (24 * 3600)</td><td>~11,600 QPS</td></tr>
      <tr><td>New URLs in 10 years</td><td>100M * 365 * 10</td><td>~365 Billion URLs</td></tr>
      <tr><td>Storage</td><td>365B * 500 bytes per record</td><td>~182 TB</td></tr>
      <tr><td>Cache (20% Daily Reads)</td><td>200M * 500 bytes</td><td>~100 GB</td></tr>
    </table>
    <div class="callout tip"><strong>💡 Pro Tip:</strong> A 10:1 Read-to-Write ratio strongly suggests using {{Caching}} to reduce database load.</div>
  </div>
</div>

<!-- Step 4: High-Level Design -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">High-Level Design & API</div>
  </div>
  <div class="step-content">
    <h4>REST API Design</h4>
    <ul class="point-list">
      <li><code>POST /api/v1/data/shorten</code> - Takes <code>{longUrl, customAlias?}</code>, Returns <code>{shortUrl}</code></li>
      <li><code>GET /api/v1/{shortUrl}</code> - Returns 301/302 HTTP redirect.</li>
    </ul>
    
    <div class="callout note"><strong>📝 Design Decision:</strong> 301 (Permanent) vs 302 (Temporary) Redirect. 301 reduces server load as browsers cache it, but 302 allows tracking every click for analytics. Since analytics is a requirement, we use 302.</div>

    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Basic Flow</div>
        <div class="diagram-flow">
          <div class="d-node client">User</div>
          <div class="d-arrow">→</div>
          <div class="d-node lb">Load Balancer</div>
          <div class="d-arrow">→</div>
          <div class="d-node service">Web Servers</div>
          <div class="d-arrow">→</div>
          <div class="d-node db">Database</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Step 5: Data Model -->
<div class="step">
  <div class="step-header">
    <div class="step-number">5</div>
    <div class="step-title">Database Design</div>
  </div>
  <div class="step-content">
    <p>We need to store billions of records. Relational databases might struggle at this scale without {{Sharding}}. A {{NoSQL Database}} like Cassandra or DynamoDB is highly scalable and fits our simple Key-Value needs.</p>
    
    <h4>Schema Structure</h4>
    <table class="est-table">
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
      <tr><td>shortUrl (PK)</td><td>varchar(7)</td><td>Primary key, base62 encoded</td></tr>
      <tr><td>longUrl</td><td>varchar(2048)</td><td>Original URL</td></tr>
      <tr><td>userId</td><td>varchar(50)</td><td>Creator ID (Optional)</td></tr>
      <tr><td>createdAt</td><td>timestamp</td><td>Creation time</td></tr>
      <tr><td>expiresAt</td><td>timestamp</td><td>TTL for automatic cleanup</td></tr>
    </table>
  </div>
</div>

<!-- Step 6: Core Logic (URL Generation) -->
<div class="step">
  <div class="step-header">
    <div class="step-number">6</div>
    <div class="step-title">URL Generation Strategy</div>
  </div>
  <div class="step-content">
    <p>How to generate a 7-character string that is unique across multiple distributed servers?</p>
    
    <h4>Option 1: Base62 Conversion (Chosen)</h4>
    <p>We can use an auto-incrementing ID generator (e.g., Twitter Snowflake or a dedicated Ticket Server) and convert the ID to Base62 (a-z, A-Z, 0-9).</p>
    <ul class="point-list">
      <li>7 Base62 characters can represent 62^7 = ~3.5 Trillion URLs (plenty for our 365B target).</li>
      <li>Highly performant and guarantees uniqueness.</li>
    </ul>
    
    <h4>Option 2: MD5 Hash</h4>
    <p>Hash the long URL and take the first 7 characters. High risk of collisions, requiring complex retry logic.</p>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">7</div>
    <div class="step-title">Final Architecture</div>
  </div>
  <div class="step-content">
    <p>To handle massive scale, we introduce a {{Redis}} cache to serve frequent reads instantly, and {{Message Queue}} for asynchronous analytics processing.</p>
    
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Complete Architecture</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">CLIENTS</div>
            <div class="d-tier-nodes">
              <div class="d-node client">Mobile</div>
              <div class="d-node client">Browser</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">API LAYER</div>
            <div class="d-tier-nodes">
              <div class="d-node lb">Load Balancer</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">SERVICES</div>
            <div class="d-tier-nodes">
              <div class="d-group">
                <div class="d-group-label">Shortener Service</div>
                <div class="d-node service">Read API</div>
                <div class="d-node service">Write API</div>
              </div>
              <div class="d-node service">ID Generator</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">DATA & ASYNC</div>
            <div class="d-tier-nodes">
              <div class="d-node cache">Redis Cache</div>
              <div class="d-node db">NoSQL DB</div>
              <div class="d-node queue">Kafka (Analytics)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for URL Shortener</h3>
  <ul>
    <li>Be ready to explain the math behind Base62 encoding. 62^7 gives 3.5 trillion URLs, which easily fits 10 years of data.</li>
    <li>Always discuss the Trade-off between HTTP 301 and 302 redirects.</li>
    <li>When talking about the ID generator, mention ZooKeeper or a {{SQL Database}} auto-increment feature to prevent distributed collisions.</li>
    <li>For custom aliases, mention that you need a unique index/constraint on the alias column to handle concurrent creation requests safely.</li>
    <li>Suggest {{Cache Invalidation}} strategies (like LRU) since not all URLs will be requested equally (Pareto Principle / 80-20 rule).</li>
  </ul>
</div>
    `
  },
  {
    id: 'rate-limiter',
    title: 'Design a Rate Limiter',
    icon: '🚦',
    difficulty: 'Medium',
    timeEstimate: '45 min',
    companies: 'Stripe, Lyft, Google',
    conceptsCovered: ['Rate Limiting', 'Token Bucket', 'Redis', 'API Gateway', 'Distributed Systems'],
    description: 'Design a system that controls the rate of traffic sent by a client or a service to prevent abuse and ensure fair usage.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> Rate limiters can be client-side or server-side. Clarify where it sits and what rules apply.</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Is this a client-side or server-side rate limiter?</div>
      <div class="clarification-why">💭 Why ask this: Client-side is easily bypassed. Server-side or middleware is standard.</div>
      <div class="clarification-answer">✅ Server-side (ideally at the {{API Gateway}}).</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What are the rate limiting rules based on?</div>
      <div class="clarification-why">💭 Why ask this: Determines the key used for tracking (IP, User ID, API Key).</div>
      <div class="clarification-answer">✅ Combination of IP address and User ID.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Is the system distributed across multiple servers?</div>
      <div class="clarification-why">💭 Why ask this: Local memory won't work; we need a centralized data store.</div>
      <div class="clarification-answer">✅ Yes, it's a large distributed system.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ How should we inform users they are throttled?</div>
      <div class="clarification-why">💭 Why ask this: HTTP standards for rate limiting.</div>
      <div class="clarification-answer">✅ Return HTTP 429 (Too Many Requests).</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Limit requests per entity (User/IP).</li>
          <li>Support custom rules (e.g., 10 req/sec for Free tier, 100 for Pro).</li>
          <li>Return HTTP 429 when the limit is exceeded.</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Low {{Latency}} (must not slow down API requests).</li>
          <li>High {{Throughput}} to handle massive scale.</li>
          <li>{{Fault Tolerance}} (if the rate limiter goes down, APIs should still work).</li>
          <li>High Accuracy (prevent race conditions in distributed environments).</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: High-Level Design -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">High-Level Design & Algorithm Choice</div>
  </div>
  <div class="step-content">
    <p>Rate limiting is typically implemented in middleware or an {{API Gateway}}. We need to choose an algorithm.</p>
    
    <h4>Algorithms Overview</h4>
    <ul class="point-list">
      <li><strong>{{Token Bucket}} (Chosen):</strong> Highly memory efficient, allows burst traffic, easy to understand. Used by Amazon and Stripe.</li>
      <li><strong>Leaking Bucket:</strong> Smooths out traffic, good for strict processing rates.</li>
      <li><strong>Fixed Window:</strong> Simple but suffers from burst traffic at the edges of windows.</li>
      <li><strong>Sliding Window Log:</strong> Very accurate but high memory cost.</li>
    </ul>

    <div class="callout tip"><strong>💡 Pro Tip:</strong> The Token Bucket algorithm is the gold standard for most interview answers due to its flexibility.</div>

    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Request Flow</div>
        <div class="diagram-flow">
          <div class="d-node client">Client</div>
          <div class="d-arrow">→</div>
          <div class="d-node gateway">Rate Limiter Middleware</div>
          <div class="d-arrow">→</div>
          <div class="d-node service">API Servers</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Step 4: Storage & Scale -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">Distributed Storage</div>
  </div>
  <div class="step-content">
    <p>Since we have multiple API servers, keeping rate limit counters in local memory will fail (e.g., a user could hit server A 10 times, and server B 10 times, bypassing the 10 req limit).</p>
    
    <h4>Solution: In-Memory Cache</h4>
    <p>Use {{Redis}} for centralized counter storage because it is incredibly fast (disk-based databases would add too much latency). Redis provides two vital commands:</p>
    <ul class="point-list">
      <li><code>INCR</code>: Increments a counter atomically.</li>
      <li><code>EXPIRE</code>: Sets a timeout ({{TTL}}) for the key.</li>
    </ul>
    
    <div class="callout warning"><strong>⚠️ Warning:</strong> Even with Redis, concurrent requests can cause Race Conditions. We need to handle this.</div>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">5</div>
    <div class="step-title">Final Architecture & Race Condition Fix</div>
  </div>
  <div class="step-content">
    <p>To fix race conditions in Redis without heavy locking, we can use <strong>Lua Scripts</strong>. Redis executes Lua scripts atomically.</p>
    
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Distributed Rate Limiter</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">EXTERNAL</div>
            <div class="d-tier-nodes">
              <div class="d-node client">Clients</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">GATEWAY TIER</div>
            <div class="d-tier-nodes">
              <div class="d-group">
                <div class="d-group-label">API Gateway</div>
                <div class="d-node gateway">Rate Limiter Rule Engine</div>
                <div class="d-node service">Request Router</div>
              </div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">STATE & CONFIG</div>
            <div class="d-tier-nodes">
              <div class="d-node cache">Redis (Counters)</div>
              <div class="d-node db">Rules DB (PostgreSQL)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for Rate Limiter</h3>
  <ul>
    <li>Be sure to mention <strong>Fail-open</strong> vs <strong>Fail-closed</strong>. If Redis dies, the rate limiter should fail-open (allow requests to pass) to ensure {{Availability}} of the core APIs.</li>
    <li>Explain why {{Redis}} is chosen: extremely low latency is crucial so the rate limiter doesn't slow down every single API request.</li>
    <li>Mention HTTP Headers: A good API includes <code>X-Ratelimit-Remaining</code> and <code>X-Ratelimit-Reset</code> headers to help clients gracefully back off.</li>
    <li>If asked about multi-region scaling, discuss replicating rules globally but keeping the counters local to the region for latency purposes.</li>
  </ul>
</div>
    `
  },
  {
    id: 'chat-system',
    title: 'Design a Chat System (WhatsApp/Messenger)',
    icon: '💬',
    difficulty: 'Hard',
    timeEstimate: '60 min',
    companies: 'Meta, Discord, Telegram',
    conceptsCovered: ['WebSocket', 'Message Queue', 'Sharding', 'Pub/Sub', 'Replication', 'Encryption'],
    description: 'Design a highly available and scalable chat system that supports 1-on-1 messaging, group chats, and online presence.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> Chat systems can be vast. Narrow the scope early (e.g., text only? End-to-end encryption? Group size?).</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Do we support 1-on-1 and Group chats?</div>
      <div class="clarification-why">💭 Why ask this: Group chats change the message routing logic drastically.</div>
      <div class="clarification-answer">✅ Yes, both. Group max size is 100.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Do we need to support online presence (status)?</div>
      <div class="clarification-why">💭 Why ask this: Presence is a highly intensive sub-system.</div>
      <div class="clarification-answer">✅ Yes, users should see who is online.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Text only, or media too?</div>
      <div class="clarification-why">💭 Why ask this: Storage requirements change entirely with media.</div>
      <div class="clarification-answer">✅ Text only for now, to keep the scope manageable.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Message retention policy?</div>
      <div class="clarification-why">💭 Why ask this: Storage architecture.</div>
      <div class="clarification-answer">✅ Store forever. Read history across multiple devices.</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li>1-on-1 chatting with low delivery latency.</li>
          <li>Group chatting (max 100 people).</li>
          <li>Online/Offline presence indicator.</li>
          <li>Persistent chat history.</li>
          <li>Multi-device support.</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Real-time experience (low {{Latency}}).</li>
          <li>High {{Availability}} and scale (500M DAU).</li>
          <li>Messages must not be lost ({{Strong Consistency}} for message ordering).</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: Estimation -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">Back-of-the-Envelope Estimation</div>
  </div>
  <div class="step-content">
    <table class="est-table">
      <tr><th>Metric</th><th>Calculation</th><th>Result</th></tr>
      <tr><td>Daily Active Users (DAU)</td><td>Given</td><td>500 Million</td></tr>
      <tr><td>Messages per day</td><td>500M * 40 msgs</td><td>20 Billion msgs/day</td></tr>
      <tr><td>Message Write QPS</td><td>20B / (24 * 3600)</td><td>~230,000 QPS</td></tr>
      <tr><td>Storage per day</td><td>20B * 100 bytes</td><td>~2 TB / day</td></tr>
      <tr><td>Storage for 5 years</td><td>2 TB * 365 * 5</td><td>~3.6 PB</td></tr>
    </table>
  </div>
</div>

<!-- Step 4: Connection Protocol -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">Connection Protocol</div>
  </div>
  <div class="step-content">
    <p>How does a client receive messages? HTTP is request/response, which isn't ideal for server-to-client pushing.</p>
    
    <h4>Options</h4>
    <ul class="point-list">
      <li><strong>Polling:</strong> Client asks server every X seconds. Very wasteful.</li>
      <li><strong>{{Long Polling}}:</strong> Client holds connection open until server has data. Better, but heavy on connections.</li>
      <li><strong>{{WebSocket}} (Chosen):</strong> Persistent, bi-directional connection. Perfect for real-time, low-latency communication.</li>
    </ul>
    
    <div class="callout tip"><strong>💡 Pro Tip:</strong> Always mention that standard API calls (HTTP) are fine for tasks like user login or fetching history, but WebSockets are needed for live messaging.</div>
  </div>
</div>

<!-- Step 5: Data Model -->
<div class="step">
  <div class="step-header">
    <div class="step-number">5</div>
    <div class="step-title">Storage and Data Model</div>
  </div>
  <div class="step-content">
    <p>With 3.6 PB of data and massive write operations, a {{NoSQL Database}} like Cassandra or HBase is preferred due to easy {{Sharding}} and fast write throughput.</p>
    
    <h4>Messages Table</h4>
    <table class="est-table">
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
      <tr><td>chatId (Partition Key)</td><td>String</td><td>ID of 1-1 or Group chat</td></tr>
      <tr><td>messageId (Sort Key)</td><td>TimeUUID</td><td>Ensures chronological ordering</td></tr>
      <tr><td>senderId</td><td>String</td><td>Who sent it</td></tr>
      <tr><td>content</td><td>Text</td><td>The message</td></tr>
    </table>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">6</div>
    <div class="step-title">Final Architecture</div>
  </div>
  <div class="step-content">
    <p>We need a <strong>Chat Server</strong> layer to hold WebSocket connections, and a <strong>Session Server</strong> (like Redis) to track which server a user is connected to.</p>
    
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">System Architecture</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">CLIENTS</div>
            <div class="d-tier-nodes">
              <div class="d-node client">User A</div>
              <div class="d-node client">User B</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">STATEFUL LAYER</div>
            <div class="d-tier-nodes">
              <div class="d-node service">Chat Server 1</div>
              <div class="d-node service">Chat Server 2</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">ROUTING & STATE</div>
            <div class="d-tier-nodes">
              <div class="d-node queue">Message Queue</div>
              <div class="d-node cache">Session Redis</div>
              <div class="d-node service">Presence Svc</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">PERSISTENCE</div>
            <div class="d-tier-nodes">
              <div class="d-node db">Cassandra (Chats)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for Chat System</h3>
  <ul>
    <li>Be explicit about how messages route: User A sends to Chat Server 1. Server 1 checks Session Redis to see User B is on Chat Server 2. Message is routed via {{Message Queue}} to Server 2.</li>
    <li>For <strong>Online Presence</strong>, explain that updating presence on every disconnect is expensive. Use a heartbeat mechanism and a {{Pub/Sub}} model to notify friends of status changes.</li>
    <li>Group chats: Explain that a message to a group of 100 means fanning out the message 100 times to the respective chat servers holding those user connections.</li>
    <li>Highlight the use of <strong>TimeUUID</strong> (or Snowflake) to guarantee correct message ordering on the client side.</li>
  </ul>
</div>
    `
  },
  {
    id: 'news-feed',
    title: 'Design a News Feed (Twitter/Facebook)',
    icon: '📰',
    difficulty: 'Hard',
    timeEstimate: '60 min',
    companies: 'X (Twitter), Meta, LinkedIn',
    conceptsCovered: ['Caching', 'Message Queue', 'Fan-out', 'Sharding', 'CDN', 'Ranking Algorithm'],
    description: 'Design a scalable news feed system where users can publish posts and view an aggregated feed of posts from people they follow.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> Feed generation can be incredibly complex. Determine if the feed is chronological or algorithmic immediately.</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Is the feed sorted chronologically or by an algorithm?</div>
      <div class="clarification-why">💭 Why ask this: Algorithmic requires a complex ML ranking pipeline.</div>
      <div class="clarification-answer">✅ Reverse chronological order to keep it simple.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Does the system support media (images/video)?</div>
      <div class="clarification-why">💭 Why ask this: Need to include a {{CDN}} and media storage.</div>
      <div class="clarification-answer">✅ Yes, images and text.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What is the traffic volume?</div>
      <div class="clarification-why">💭 Why ask this: Determines if we should pre-compute feeds or compute on the fly.</div>
      <div class="clarification-answer">✅ 300M DAU, 2 posts per day per user. High read-to-write ratio.</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Users can publish posts (text/images).</li>
          <li>Users can view a feed of posts from people they follow.</li>
          <li>Reverse chronological ordering.</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Feed generation must be fast (< 200ms {{Latency}}).</li>
          <li>Highly available system.</li>
          <li>{{Eventual Consistency}} is acceptable (if a follower sees a post 2 seconds late, it's fine).</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: High-Level Design -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">High-Level Design (APIs)</div>
  </div>
  <div class="step-content">
    <h4>Core APIs</h4>
    <ul class="point-list">
      <li><code>POST /v1/me/feed</code> - Publish a post.</li>
      <li><code>GET /v1/me/feed</code> - Retrieve the news feed.</li>
    </ul>

    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Basic Flow</div>
        <div class="diagram-flow">
          <div class="d-node client">Mobile App</div>
          <div class="d-arrow">↔</div>
          <div class="d-node lb">Load Balancer</div>
          <div class="d-arrow">↔</div>
          <div class="d-group">
            <div class="d-node service">Post Svc</div>
            <div class="d-node service">Feed Svc</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Step 4: Feed Generation Approaches -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">Feed Generation Approaches</div>
  </div>
  <div class="step-content">
    <p>This is the core of the problem. How do we build the feed?</p>
    
    <h4>Approach 1: Pull Model (Fan-out on Load)</h4>
    <p>When a user opens the app, fetch all friends, fetch their latest posts, merge, and sort.<br>
    <strong>Pros:</strong> Fresh data, cheap for writes.<br>
    <strong>Cons:</strong> Incredibly slow on reads. Very high latency.</p>
    
    <h4>Approach 2: Push Model (Fan-out on Write)</h4>
    <p>When a user publishes a post, push that post into the pre-computed feed cache of every follower.<br>
    <strong>Pros:</strong> Reads are instant (O(1) cache lookup).<br>
    <strong>Cons:</strong> If a celebrity has 50M followers, a single post requires 50M database writes (the "Celebrity Problem").</p>

    <div class="callout important"><strong>🔴 Important:</strong> The best solution is a Hybrid approach. Use Push for normal users, and Pull for celebrities.</div>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">5</div>
    <div class="step-title">Final Architecture</div>
  </div>
  <div class="step-content">
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Hybrid Feed Architecture</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">CLIENT</div>
            <div class="d-tier-nodes">
              <div class="d-node client">User</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">API</div>
            <div class="d-tier-nodes">
              <div class="d-node gateway">API Gateway</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">SERVICES</div>
            <div class="d-tier-nodes">
              <div class="d-node service">Post Service</div>
              <div class="d-node queue">Message Queue</div>
              <div class="d-node service">Fanout Workers</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">DATA</div>
            <div class="d-tier-nodes">
              <div class="d-node cache">Feed Cache (Redis)</div>
              <div class="d-node db">Post DB</div>
              <div class="d-node db">Graph DB (Followers)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for News Feed</h3>
  <ul>
    <li>The <strong>{{Fan-out}} on Write</strong> vs <strong>Fan-out on Load</strong> discussion is the most critical part of this interview. Master it.</li>
    <li>Explain that {{Caching}} is heavily utilized. Feeds are usually cached in a {{Redis}} list.</li>
    <li>Mention that media files are served via a {{CDN}} to reduce latency and server load.</li>
    <li>To optimize storage, keep only the Post IDs in the Feed Cache, and hydrate the actual post data from a separate Post Cache.</li>
  </ul>
</div>
    `
  },
  {
    id: 'notification-system',
    title: 'Design a Notification System',
    icon: '🔔',
    difficulty: 'Medium',
    timeEstimate: '45 min',
    companies: 'Netflix, Uber, Amazon',
    conceptsCovered: ['Message Queue', 'Pub/Sub', 'Rate Limiting', 'Event-Driven Architecture', 'Microservices'],
    description: 'Design a highly reliable system that sends push notifications, SMS, and emails to millions of users.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> Notifications span multiple mediums. Confirm which ones you need to design for.</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What types of notifications are supported?</div>
      <div class="clarification-why">💭 Why ask this: Determines the 3rd party integrations required.</div>
      <div class="clarification-answer">✅ Push notifications (iOS/Android), SMS, and Email.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Is it a real-time system?</div>
      <div class="clarification-why">💭 Why ask this: Impacts latency constraints.</div>
      <div class="clarification-answer">✅ Yes, soft real-time. A few seconds of delay is acceptable.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Do users have opt-out settings?</div>
      <div class="clarification-why">💭 Why ask this: Requires a preferences checking layer.</div>
      <div class="clarification-answer">✅ Yes, users can mute specific channels.</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Send Push, SMS, and Email notifications.</li>
          <li>System triggered by other internal microservices.</li>
          <li>Respect user opt-out preferences.</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>High Reliability: Notifications should not be lost.</li>
          <li>High Volume: 10M pushes, 1M SMS, 5M emails per day.</li>
          <li>Prevent duplicate notifications.</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: High-Level Design -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">High-Level Design</div>
  </div>
  <div class="step-content">
    <p>Other {{Microservices}} (Billing, Shipping, Promos) call our Notification API. We don't want to block their operations while we talk to slow 3rd party providers.</p>
    
    <div class="callout note"><strong>📝 Design Decision:</strong> We must use {{Asynchronous Processing}} via a {{Message Queue}} to decouple internal services from slow external vendors (like Apple APNS or Twilio).</div>

    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Basic Async Flow</div>
        <div class="diagram-flow">
          <div class="d-node service">Internal Svcs</div>
          <div class="d-arrow">→</div>
          <div class="d-node queue">Message Queue</div>
          <div class="d-arrow">→</div>
          <div class="d-node service">Workers</div>
          <div class="d-arrow">→</div>
          <div class="d-node gateway">Vendors (Twilio/APNS)</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">Final Architecture</div>
  </div>
  <div class="step-content">
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Reliable Notification Architecture</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">TRIGGERS</div>
            <div class="d-tier-nodes">
              <div class="d-node service">Billing</div>
              <div class="d-node service">Shipping</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">PRE-PROCESSING</div>
            <div class="d-tier-nodes">
              <div class="d-node gateway">Notification API</div>
              <div class="d-node cache">Preferences Cache</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">QUEUES</div>
            <div class="d-tier-nodes">
              <div class="d-node queue">Push Queue</div>
              <div class="d-node queue">SMS Queue</div>
              <div class="d-node queue">Email Queue</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">WORKERS & SENDERS</div>
            <div class="d-tier-nodes">
              <div class="d-node service">Push Workers</div>
              <div class="d-node service">SMS Workers</div>
              <div class="d-node service">Email Workers</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">EXTERNAL</div>
            <div class="d-tier-nodes">
              <div class="d-node gateway">Apple/Google APNS</div>
              <div class="d-node gateway">Twilio</div>
              <div class="d-node gateway">SendGrid</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for Notification System</h3>
  <ul>
    <li>Separate queues for different types of notifications. If the SMS provider goes down, the Email queue shouldn't be backed up ({{Bulkhead Pattern}}).</li>
    <li>Explain how to prevent duplicates: Generate an <strong>Idempotency Key</strong> (like an event ID) at the source, and check a Redis cache before sending to ensure we haven't sent it recently ({{Idempotency}}).</li>
    <li>Mention retry mechanisms with exponential backoff if a 3rd party vendor is unreachable.</li>
    <li>Address {{Rate Limiting}}: We shouldn't bombard a single user with 10 pushes at once. Add a deduplication/throttling layer.</li>
  </ul>
</div>
    `
  },
  {
    id: 'key-value-store',
    title: 'Design a Distributed Key-Value Store',
    icon: '🗄️',
    difficulty: 'Hard',
    timeEstimate: '60 min',
    companies: 'Amazon, Google, Apple',
    conceptsCovered: ['Consistent Hashing', 'CAP Theorem', 'Replication', 'Consensus Algorithm', 'Sharding', 'Gossip Protocol'],
    description: 'Design a highly available and scalable distributed key-value store, similar to Amazon Dynamo or Apache Cassandra.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> This is a deep infrastructure question. Focus heavily on distributed systems concepts rather than product features.</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What are the size limits of the keys and values?</div>
      <div class="clarification-why">💭 Why ask this: Impacts memory and network bandwidth.</div>
      <div class="clarification-answer">✅ Small sizes. Max 10 KB per value.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Should we favor availability or consistency?</div>
      <div class="clarification-why">💭 Why ask this: The core of the {{CAP Theorem}}.</div>
      <div class="clarification-answer">✅ Favor {{Availability}}. It should remain highly available even under network partitions.</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li><code>put(key, value)</code>: Insert or update a value.</li>
          <li><code>get(key)</code>: Retrieve a value.</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>High Availability (always writable).</li>
          <li>High Scalability (easy to add/remove nodes).</li>
          <li>Low {{Latency}}.</li>
          <li>Configurable {{Consistency}} (tunable).</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: Data Partitioning -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">Data Partitioning</div>
  </div>
  <div class="step-content">
    <p>How do we distribute data evenly across servers while allowing servers to be added or removed dynamically?</p>
    
    <h4>Consistent Hashing</h4>
    <p>We map both data keys and servers to a virtual hash ring (e.g., using SHA-1). To find which server holds a key, we hash the key and walk clockwise on the ring to find the first server.</p>
    <ul class="point-list">
      <li><strong>Benefit:</strong> When adding or removing a node, only <code>1/n</code> of the data needs to be moved, not all of it.</li>
      <li>To handle uneven distribution, we use <strong>Virtual Nodes</strong>—each physical server is mapped to multiple points on the hash ring.</li>
    </ul>

    <div class="callout tip"><strong>💡 Pro Tip:</strong> Understanding {{Consistent Hashing}} is strictly required to pass a distributed systems interview.</div>
  </div>
</div>

<!-- Step 4: Replication & CAP -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">Replication & Consistency</div>
  </div>
  <div class="step-content">
    <p>To ensure high availability and reliability, data must be replicated asynchronously across multiple servers.</p>
    
    <h4>Replication Strategy</h4>
    <p>Data is replicated to the next <code>N</code> distinct nodes on the hash ring. (N is the replication factor, e.g., N=3).</p>
    
    <h4>Quorum Consensus</h4>
    <p>Since we favor Availability (AP in {{CAP Theorem}}), we use a Quorum system to configure consistency.</p>
    <ul class="point-list">
      <li><strong>N:</strong> Replication factor (3)</li>
      <li><strong>W:</strong> Write quorum (nodes that must acknowledge a write)</li>
      <li><strong>R:</strong> Read quorum (nodes that must respond to a read)</li>
    </ul>
    <p>If <code>W + R > N</code>, we have {{Strong Consistency}}. Since we want fast, highly available writes, we might set W=1, R=3 for read-heavy, or W=2, R=2 for balance.</p>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">5</div>
    <div class="step-title">Failure Handling Architecture</div>
  </div>
  <div class="step-content">
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Distributed KV Node Architecture</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">CLIENT ROUTING</div>
            <div class="d-tier-nodes">
              <div class="d-node client">Client Coordinator</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">RING (V-NODES)</div>
            <div class="d-tier-nodes">
              <div class="d-node server">Node A</div>
              <div class="d-node server">Node B</div>
              <div class="d-node server">Node C</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">NODE COMPONENTS</div>
            <div class="d-tier-nodes">
              <div class="d-node cache">MemTable (RAM)</div>
              <div class="d-node db">SSTable (Disk)</div>
              <div class="d-node queue">Commit Log</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for Key-Value Store</h3>
  <ul>
    <li>Be prepared to discuss <strong>Vector Clocks</strong> for resolving version conflicts during network partitions.</li>
    <li>Explain how nodes detect failures using a {{Gossip Protocol}}. It's decentralized and highly scalable compared to a central coordinator.</li>
    <li>Mention <strong>Hinted Handoff</strong>: If a node is temporarily down, a neighboring node accepts the write on its behalf and delivers it when the node recovers.</li>
    <li>For fast anti-entropy (syncing missing data between replicas), mention the use of <strong>Merkle Trees</strong> to quickly identify inconsistent chunks of data without transferring the whole database.</li>
  </ul>
</div>
    `
  },
  {
    id: 'web-crawler',
    title: 'Design a Web Crawler',
    icon: '🕷️',
    difficulty: 'Medium',
    timeEstimate: '45 min',
    companies: 'Google, Amazon, Microsoft',
    conceptsCovered: ['Distributed Systems', 'Message Queue', 'Bloom Filter', 'DNS', 'URL Frontier', 'Politeness'],
    description: 'Design a scalable web crawler to download web pages for search engine indexing.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> Web crawlers have infinite scope. Narrow down the scale and specific use case (e.g., general search vs. specific domain).</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What is the main purpose of the crawler?</div>
      <div class="clarification-why">💭 Why ask this: Determines the architecture and storage requirements.</div>
      <div class="clarification-answer">✅ For search engine indexing.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ How many pages do we need to crawl per month?</div>
      <div class="clarification-why">💭 Why ask this: To estimate throughput and scale.</div>
      <div class="clarification-answer">✅ 1 billion pages per month.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Do we need to parse and store the HTML?</div>
      <div class="clarification-why">💭 Why ask this: Processing overhead and storage scale.</div>
      <div class="clarification-answer">✅ Yes, just the raw HTML.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Do we handle duplicate content?</div>
      <div class="clarification-why">💭 Why ask this: Deduping is a major challenge in crawling.</div>
      <div class="clarification-answer">✅ Yes, we must ignore duplicate URLs and duplicate HTML content.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ How do we handle politeness?</div>
      <div class="clarification-why">💭 Why ask this: Avoid DDOSing target servers.</div>
      <div class="clarification-answer">✅ Standard politeness rules: don't hit the same domain too frequently.</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Crawl 1 billion pages a month starting from seed URLs.</li>
          <li>Extract URLs from downloaded pages and add to the queue.</li>
          <li>Store the HTML content of the crawled pages.</li>
          <li>Handle duplicate URLs (never crawl same URL twice).</li>
          <li>Handle duplicate content (don't store same page from different URLs).</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Politeness: Respect robots.txt and limit requests per domain.</li>
          <li>Scalability: Highly distributed to meet throughput.</li>
          <li>{{Fault Tolerance}}: Nodes will fail, crawling must resume without data loss.</li>
          <li>Extensibility: Easy to add new parsers.</li>
          <li>High {{Throughput}} and efficient network utilization.</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: Estimation -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">Back-of-the-Envelope Estimation</div>
  </div>
  <div class="step-content">
    <table class="est-table">
      <tr><th>Metric</th><th>Calculation</th><th>Result</th></tr>
      <tr><td>Pages to crawl</td><td>Given</td><td>1 Billion/month</td></tr>
      <tr><td>Crawl QPS</td><td>1B / (30 * 24 * 3600)</td><td>~400 pages/sec</td></tr>
      <tr><td>Peak QPS</td><td>400 * 2</td><td>~800 pages/sec</td></tr>
      <tr><td>Storage per page</td><td>Assume avg HTML size is 500KB</td><td>500 KB</td></tr>
      <tr><td>Storage per month</td><td>1B * 500 KB</td><td>~500 TB/month</td></tr>
      <tr><td>Storage for 5 years</td><td>500 TB * 12 * 5</td><td>~30 PB</td></tr>
    </table>
  </div>
</div>

<!-- Step 4: URL Frontier & Politeness -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">URL Frontier & Politeness</div>
  </div>
  <div class="step-content">
    <p>The <strong>URL Frontier</strong> (priority queue) manages what to crawl next. It must enforce politeness and priority.</p>
    
    <h4>Politeness Enforcement</h4>
    <p>We shouldn't send too many requests to a single domain simultaneously. To solve this, we maintain a mapping of domain to worker threads. Each domain gets its own queue in the URL Frontier, and a dedicated worker thread processes it with a delay between requests.</p>
    
    <div class="callout tip"><strong>💡 Pro Tip:</strong> Mentioning a separate queue per host is the classic way to solve the politeness requirement.</div>
  </div>
</div>

<!-- Step 5: Deduplication Strategies -->
<div class="step">
  <div class="step-header">
    <div class="step-number">5</div>
    <div class="step-title">Deduplication (URLs & Content)</div>
  </div>
  <div class="step-content">
    <h4>URL Deduplication</h4>
    <p>We need to check if a URL has already been crawled or is in the queue. With billions of URLs, an in-memory Set is too large.</p>
    <ul class="point-list">
      <li><strong>{{Bloom Filter}}:</strong> Highly memory-efficient probabilistic data structure. May return false positives (saying we crawled a URL when we didn't), but never false negatives.</li>
      <li><strong>Distributed DB:</strong> Back the Bloom Filter with a key-value store (like Redis or Cassandra) for persistence.</li>
    </ul>

    <h4>Content Deduplication</h4>
    <p>Compare hashes (like MD5 or SHA) of the HTML content. If the hash exists in our database, we discard the page.</p>
  </div>
</div>

<!-- Step 6: DNS Resolution & Distributed Workers -->
<div class="step">
  <div class="step-header">
    <div class="step-number">6</div>
    <div class="step-title">DNS Resolution & Architecture</div>
  </div>
  <div class="step-content">
    <p>DNS lookups take time (10ms-200ms). Doing this per page is a huge bottleneck. We must implement a custom {{DNS}} cache.</p>
    <p>The crawl workers need to be distributed. They fetch URLs from the Frontier, download the page, parse links, and send new links back to the Frontier.</p>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">7</div>
    <div class="step-title">Final Architecture</div>
  </div>
  <div class="step-content">
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Distributed Web Crawler</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">QUEUING</div>
            <div class="d-tier-nodes">
              <div class="d-group">
                <div class="d-group-label">URL Frontier</div>
                <div class="d-node queue">Priority Queues</div>
                <div class="d-node queue">Host Queues</div>
              </div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">WORKERS</div>
            <div class="d-tier-nodes">
              <div class="d-node service">Crawl Worker 1</div>
              <div class="d-node service">Crawl Worker 2</div>
              <div class="d-node service">Crawl Worker 3</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">PROCESSING</div>
            <div class="d-tier-nodes">
              <div class="d-node service">Link Extractor</div>
              <div class="d-node cache">DNS Cache</div>
              <div class="d-node service">Dedup Service</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">STORAGE</div>
            <div class="d-tier-nodes">
              <div class="d-node cache">Bloom Filter</div>
              <div class="d-node db">Content DB</div>
              <div class="d-node db">URL DB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for Web Crawler</h3>
  <ul>
    <li>Understand and explain the {{Bloom Filter}}. It is the standard answer for URL deduplication at massive scale.</li>
    <li>Focus heavily on the <strong>URL Frontier</strong>. Explain how to manage politeness by ensuring only one worker accesses a given host at a time.</li>
    <li>Mention that you need to parse <code>robots.txt</code> and cache it per domain.</li>
    <li>Discuss how you handle crawler traps (e.g., endless generated URLs) by setting a maximum depth limit.</li>
    <li>Highlight the bottleneck of {{DNS}} resolution and how a local DNS cache mitigates it.</li>
  </ul>
</div>
    `
  },
  {
    id: 'search-autocomplete',
    title: 'Design a Search Autocomplete / Typeahead System',
    icon: '⌨️',
    difficulty: 'Medium',
    timeEstimate: '45 min',
    companies: 'Google, Amazon, Uber',
    conceptsCovered: ['Trie Data Structure', 'Caching', 'CDN', 'Ranking Algorithm', 'Horizontal Scaling'],
    description: 'Design a system that suggests top search queries as a user types into a search box.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> Clarify if the suggestions are personalized or global, and how they are ranked.</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Is the matching only at the beginning of the query?</div>
      <div class="clarification-why">💭 Why ask this: Prefix matching uses a Trie, substring matching might require Elasticsearch.</div>
      <div class="clarification-answer">✅ Yes, prefix matching only.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ How many suggestions should we return?</div>
      <div class="clarification-why">💭 Why ask this: Helps define the payload size and top-K problem scope.</div>
      <div class="clarification-answer">✅ Top 5 suggestions.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ How are the suggestions ranked?</div>
      <div class="clarification-why">💭 Why ask this: Determines what data to store at each node.</div>
      <div class="clarification-answer">✅ Ranked by historical query frequency/popularity.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Do suggestions need to update in real-time?</div>
      <div class="clarification-why">💭 Why ask this: Real-time vs batch processing trade-offs.</div>
      <div class="clarification-answer">✅ No, they can be updated via batch processing (e.g., daily or hourly).</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What is the scale?</div>
      <div class="clarification-why">💭 Why ask this: To gauge QPS and system footprint.</div>
      <div class="clarification-answer">✅ 10 million DAU, generating billions of queries per day.</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Given a prefix, return top 5 most popular query suggestions.</li>
          <li>System should gather search query frequencies to update suggestions.</li>
          <li>Support English language (can assume ASCII for simplicity).</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Extremely low {{Latency}} (response under 50ms) as the user types.</li>
          <li>High {{Availability}} and ability to handle massive read spikes.</li>
          <li>High {{Throughput}} (many queries per character typed).</li>
          <li>Scalable storage for the prefix tree.</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: Estimation -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">Back-of-the-Envelope Estimation</div>
  </div>
  <div class="step-content">
    <table class="est-table">
      <tr><th>Metric</th><th>Calculation</th><th>Result</th></tr>
      <tr><td>DAU</td><td>Given</td><td>10 Million</td></tr>
      <tr><td>Searches per day</td><td>10M * 10 searches</td><td>100M searches/day</td></tr>
      <tr><td>QPS</td><td>100M / 86400</td><td>~1,160 QPS</td></tr>
      <tr><td>Query QPS (typing)</td><td>1,160 * 20 keystrokes (avg)</td><td>~23,200 QPS</td></tr>
      <tr><td>Peak QPS</td><td>23,200 * 2</td><td>~46,400 QPS</td></tr>
    </table>
    <div class="callout tip"><strong>💡 Pro Tip:</strong> Because requests happen per keystroke, read QPS is extremely high, making {{Caching}} critical.</div>
  </div>
</div>

<!-- Step 4: Data Structure (Trie) -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">Core Data Structure: The Trie</div>
  </div>
  <div class="step-content">
    <p>A <strong>Trie (Prefix Tree)</strong> is the standard data structure for autocomplete. Each node represents a character.</p>
    
    <h4>Optimizing the Trie</h4>
    <p>Normally, finding the top 5 involves traversing all children from the prefix node, which is slow (O(V+E)). To optimize, we <strong>cache the top 5 suggestions at every node</strong>.</p>
    <ul class="point-list">
      <li><strong>Pros:</strong> O(1) time complexity to retrieve top 5 results for any prefix.</li>
      <li><strong>Cons:</strong> Increased memory usage. Since memory is cheap, this trade-off is highly desirable for low latency.</li>
    </ul>
  </div>
</div>

<!-- Step 5: Data Gathering & Processing -->
<div class="step">
  <div class="step-header">
    <div class="step-number">5</div>
    <div class="step-title">Data Pipeline</div>
  </div>
  <div class="step-content">
    <p>Updating the Trie on every query would destroy performance. We use a batch processing pipeline.</p>
    <ul class="point-list">
      <li><strong>Analytics Logs:</strong> Raw queries are dumped into logs.</li>
      <li><strong>Aggregator:</strong> A MapReduce job (e.g., Hadoop or Spark) aggregates query frequencies hourly/weekly.</li>
      <li><strong>Trie Builder:</strong> Takes aggregated data, builds a new Trie, and serializes it.</li>
      <li><strong>Trie Cache:</strong> Replaces the old Trie in memory with the newly built one.</li>
    </ul>
  </div>
</div>

<!-- Step 6: Scaling & Caching -->
<div class="step">
  <div class="step-header">
    <div class="step-number">6</div>
    <div class="step-title">Scaling and Caching Strategy</div>
  </div>
  <div class="step-content">
    <h4>Caching</h4>
    <p>We can cache results in multiple layers:</p>
    <ul class="point-list">
      <li><strong>Browser Cache:</strong> Cache results locally for a short time.</li>
      <li><strong>{{CDN}}:</strong> Store static mappings of popular prefixes (e.g., "a" -> "amazon", "apple") at edge locations.</li>
      <li><strong>Redis:</strong> Cache top 5 results for common prefixes before hitting the Trie service.</li>
    </ul>

    <h4>Sharding the Trie</h4>
    <p>If the Trie exceeds one machine's memory, we shard based on the first character of the prefix (e.g., Server 1: a-m, Server 2: n-z). For better balance, shard based on a hash of the prefix.</p>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">7</div>
    <div class="step-title">Final Architecture</div>
  </div>
  <div class="step-content">
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Autocomplete Architecture</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">CLIENT & EDGE</div>
            <div class="d-tier-nodes">
              <div class="d-node client">Client (Browser)</div>
              <div class="d-node cdn">CDN (Static Cache)</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">QUERY SERVICE</div>
            <div class="d-tier-nodes">
              <div class="d-node lb">Load Balancer</div>
              <div class="d-node service">Query API</div>
              <div class="d-node cache">Redis Cache</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">TRIE CLUSTER</div>
            <div class="d-tier-nodes">
              <div class="d-node service">Trie Node (a-m)</div>
              <div class="d-node service">Trie Node (n-z)</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">DATA PIPELINE</div>
            <div class="d-tier-nodes">
              <div class="d-node db">Query Logs</div>
              <div class="d-node queue">Hadoop / Spark</div>
              <div class="d-node service">Trie Builder Worker</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for Autocomplete</h3>
  <ul>
    <li>The core of this problem is the <strong>Trie data structure</strong> and caching the top K results at every node.</li>
    <li>Make sure you separate the <strong>Query Service</strong> (real-time read path) from the <strong>Data Gathering Service</strong> (offline write path).</li>
    <li>Mention debouncing on the client side (e.g., wait 50ms before sending a request) to reduce backend load.</li>
    <li>For scaling, explain how a {{CDN}} can serve the most popular 20% of prefixes, drastically reducing server load.</li>
    <li>Discuss how you handle cold starts (e.g., using trending queries until enough user data is gathered).</li>
  </ul>
</div>
    `
  },
  {
    id: 'distributed-file-storage',
    title: 'Design a Distributed File Storage System',
    icon: '📁',
    difficulty: 'Hard',
    timeEstimate: '60 min',
    companies: 'Google, Dropbox, Microsoft',
    conceptsCovered: ['Sharding', 'Replication', 'Consistency', 'Chunking', 'Event-Driven Architecture', 'Metadata DB'],
    description: 'Design a cloud file storage and sync service like Google Drive or Dropbox.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> Differentiate between file storage (S3) and file sync (Dropbox). File sync requires handling offline edits and conflict resolution.</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What is the core functionality?</div>
      <div class="clarification-why">💭 Why ask this: Confirms scope.</div>
      <div class="clarification-answer">✅ Upload/download files, sync across devices, share with others.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What types of files are supported and what is the max file size?</div>
      <div class="clarification-why">💭 Why ask this: Large files require chunking.</div>
      <div class="clarification-answer">✅ Any file type. Max size is 10 GB.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Can multiple users edit the same file simultaneously?</div>
      <div class="clarification-why">💭 Why ask this: Real-time collaboration vs simple conflict resolution.</div>
      <div class="clarification-answer">✅ No real-time collaboration. Simple file versioning and sync is enough.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Do we need to support offline editing?</div>
      <div class="clarification-why">💭 Why ask this: Client must queue changes and sync on reconnect.</div>
      <div class="clarification-answer">✅ Yes, sync should happen when the device comes back online.</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Upload and download files up to 10 GB.</li>
          <li>Sync files across multiple devices for a user.</li>
          <li>File versioning (track changes).</li>
          <li>Share files/folders with other users.</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>High Reliability and Durability (no data loss).</li>
          <li>High {{Availability}}.</li>
          <li>Optimized bandwidth usage (sync only what changed).</li>
          <li>Low latency for sync notifications.</li>
          <li>{{Strong Consistency}} for metadata (a file renamed on one device must show correctly everywhere).</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: Estimation -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">Back-of-the-Envelope Estimation</div>
  </div>
  <div class="step-content">
    <table class="est-table">
      <tr><th>Metric</th><th>Calculation</th><th>Result</th></tr>
      <tr><td>Total Users</td><td>Given</td><td>50 Million</td></tr>
      <tr><td>Active Users</td><td>Given</td><td>10 Million DAU</td></tr>
      <tr><td>Free Storage Space</td><td>10 GB per user</td><td>-</td></tr>
      <tr><td>Total Storage Needed</td><td>50M * 10 GB</td><td>500 Petabytes</td></tr>
      <tr><td>QPS (API requests)</td><td>10M * 10 requests / 86400</td><td>~1,200 QPS</td></tr>
    </table>
  </div>
</div>

<!-- Step 4: Core Optimization (Chunking) -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">File Chunking & Storage</div>
  </div>
  <div class="step-content">
    <p>Uploading a 10 GB file in one go is prone to failure and wastes bandwidth if only a small part of the file changes.</p>
    
    <h4>Block Storage Strategy</h4>
    <ul class="point-list">
      <li><strong>Chunking:</strong> Break large files into smaller chunks (e.g., 4 MB blocks).</li>
      <li><strong>Hashing:</strong> Hash each chunk (e.g., SHA-256).</li>
      <li><strong>Deduplication:</strong> Only upload chunks with hashes we don't already have. This saves massive amounts of storage and bandwidth.</li>
      <li><strong>Delta Sync:</strong> If a user changes a 10 GB file, only the modified 4 MB chunk is uploaded.</li>
    </ul>
    
    <div class="callout note"><strong>📝 Design Decision:</strong> Separate Metadata (file names, paths, permissions, chunk list) from Block Storage (the actual chunk data). Metadata goes to a SQL DB; blocks go to Object Storage (like Amazon S3).</div>
  </div>
</div>

<!-- Step 5: Sync Mechanism -->
<div class="step">
  <div class="step-header">
    <div class="step-number">5</div>
    <div class="step-title">Event-Driven Sync Architecture</div>
  </div>
  <div class="step-content">
    <p>How does Device B know that Device A modified a file?</p>
    <ul class="point-list">
      <li>Clients maintain a long-lived connection ({{WebSocket}} or {{Long Polling}}) to a Notification Service.</li>
      <li>When Device A uploads a new chunk and updates metadata, the Metadata service publishes an event to a {{Message Queue}}.</li>
      <li>The Notification Service consumes the event and pushes a notification to Device B.</li>
      <li>Device B then fetches the updated metadata and downloads only the missing chunks.</li>
    </ul>
  </div>
</div>

<!-- Step 6: Consistency & Concurrency -->
<div class="step">
  <div class="step-header">
    <div class="step-number">6</div>
    <div class="step-title">Metadata Consistency & Conflicts</div>
  </div>
  <div class="step-content">
    <p>We need {{Strong Consistency}} for the Metadata DB so users don't see corrupted folder structures. A relational {{SQL Database}} (like PostgreSQL) is ideal because of ACID properties.</p>
    
    <h4>Conflict Resolution</h4>
    <p>If two devices edit offline and come online simultaneously:</p>
    <ul class="point-list">
      <li>Use file versioning. The first upload succeeds (Version 2).</li>
      <li>The second upload is rejected because it expects the base to be Version 1.</li>
      <li>The client must download Version 2, and the system saves the conflicting edit as a separate file (e.g., "file (conflicted copy)").</li>
    </ul>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">7</div>
    <div class="step-title">Final Architecture</div>
  </div>
  <div class="step-content">
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Distributed File Storage System</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">CLIENTS</div>
            <div class="d-tier-nodes">
              <div class="d-node client">Client (App/Web)</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">API LAYER</div>
            <div class="d-tier-nodes">
              <div class="d-node gateway">API Gateway / LB</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">SERVICES</div>
            <div class="d-tier-nodes">
              <div class="d-node service">Block Server</div>
              <div class="d-node service">Metadata Server</div>
              <div class="d-node service">Notification Server</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">STORAGE & QUEUES</div>
            <div class="d-tier-nodes">
              <div class="d-node db">Object Storage (S3)</div>
              <div class="d-node db">SQL DB (Metadata)</div>
              <div class="d-node queue">Message Queue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for File Storage</h3>
  <ul>
    <li>The most crucial concept to demonstrate is the separation of <strong>Metadata</strong> (SQL, strict consistency) and <strong>Block/Chunk Storage</strong> (Object storage, massive scale).</li>
    <li>Explain <strong>Chunking</strong> in detail. It allows delta syncs, deduplication, and parallel uploads.</li>
    <li>Mention how you handle offline changes by queuing operations locally on the client database (like SQLite).</li>
    <li>For scaling the Metadata DB, mention {{Sharding}} based on <code>user_id</code> since users rarely share their entire drive, keeping queries localized to one shard.</li>
    <li>Use {{WebSockets}} or Long Polling for the Notification Service to instantly sync changes across a user's devices.</li>
  </ul>
</div>
    `
  },
  {
    id: 'metrics-monitoring',
    title: 'Design a Metrics Monitoring & Alerting System',
    icon: '📈',
    difficulty: 'Hard',
    timeEstimate: '60 min',
    companies: 'Google, Amazon, Datadog',
    conceptsCovered: ['Time-Series Database', 'Data Partitioning', 'Aggregation Pipeline', 'Pub/Sub', 'Horizontal Scaling', 'Fault Tolerance'],
    description: 'Design a system like Datadog or Prometheus to monitor distributed infrastructure and trigger alerts.',
    content: `
<!-- Step 1: Clarifying Questions -->
<div class="step">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-title">Clarifying Questions</div>
  </div>
  <div class="step-content">
    <div class="interview-note"><strong>🎤 Interview Tip:</strong> Monitoring systems process massive amounts of write-heavy time-series data. Establish the scale and ingestion model early.</div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What are we monitoring? Server metrics or custom business metrics?</div>
      <div class="clarification-why">💭 Why ask this: Determines data cardinality and schema.</div>
      <div class="clarification-answer">✅ Both. CPU, memory, and custom metrics with labels/tags.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Are we using a pull or push model for metrics collection?</div>
      <div class="clarification-why">💭 Why ask this: Fundamental architecture decision (Prometheus vs Datadog).</div>
      <div class="clarification-answer">✅ Let's use a Push model where agents send data to our system.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ What is the data resolution and retention period?</div>
      <div class="clarification-why">💭 Why ask this: Storage estimation and need for downsampling.</div>
      <div class="clarification-answer">✅ 10-second resolution for 7 days. Downsampled to 1-minute for 30 days, 1-hour for 1 year.</div>
    </div>
    
    <div class="clarification">
      <div class="clarification-q">❓ Do we need an alerting system?</div>
      <div class="clarification-why">💭 Why ask this: Adds an event processing pipeline.</div>
      <div class="clarification-answer">✅ Yes, configurable alerts based on thresholds.</div>
    </div>
  </div>
</div>

<!-- Step 2: Requirements -->
<div class="step">
  <div class="step-header">
    <div class="step-number">2</div>
    <div class="step-title">Requirements</div>
  </div>
  <div class="step-content">
    <div class="req-columns">
      <div class="req-column">
        <h4>Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Ingest metrics data from millions of servers/services.</li>
          <li>Query metrics by various dimensions (tags/labels).</li>
          <li>Dashboards for visualization.</li>
          <li>Alerting based on complex rules (e.g., CPU > 80% for 5 mins).</li>
        </ul>
      </div>
      <div class="req-column">
        <h4>Non-Functional Requirements</h4>
        <ul class="point-list checks">
          <li>Extremely high write {{Throughput}} (write-heavy system).</li>
          <li>Low {{Latency}} querying for dashboards.</li>
          <li>Highly scalable and available.</li>
          <li>Graceful degradation (drop metrics rather than crash).</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Step 3: Estimation -->
<div class="step">
  <div class="step-header">
    <div class="step-number">3</div>
    <div class="step-title">Back-of-the-Envelope Estimation</div>
  </div>
  <div class="step-content">
    <table class="est-table">
      <tr><th>Metric</th><th>Calculation</th><th>Result</th></tr>
      <tr><td>Active Servers/Agents</td><td>Given</td><td>100,000</td></tr>
      <tr><td>Metrics per agent</td><td>100 metrics every 10 sec</td><td>10 metrics/sec</td></tr>
      <tr><td>Ingestion QPS</td><td>100,000 * 10</td><td>1,000,000 QPS</td></tr>
      <tr><td>Data point size</td><td>Metric ID, Value, Timestamp, Tags</td><td>~50 bytes</td></tr>
      <tr><td>Daily Ingestion</td><td>1M * 50 bytes * 86400</td><td>~4.3 TB/day</td></tr>
    </table>
    <div class="callout tip"><strong>💡 Pro Tip:</strong> 1 million write QPS is massive. A standard relational DB will fail. We need a specialized database.</div>
  </div>
</div>

<!-- Step 4: Storage Strategy (TSDB) -->
<div class="step">
  <div class="step-header">
    <div class="step-number">4</div>
    <div class="step-title">Time-Series Database (TSDB)</div>
  </div>
  <div class="step-content">
    <p>We need a database optimized for appending time-stamped data and querying time ranges. A <strong>Time-Series Database</strong> like InfluxDB or a column-family store like Cassandra is required.</p>
    
    <h4>Data Model</h4>
    <p>Metrics have <em>Name</em>, <em>Timestamp</em>, <em>Value</em>, and <em>Tags</em> (e.g., <code>region=us-east, service=auth</code>).</p>
    
    <h4>Downsampling Strategy</h4>
    <p>To save space, background jobs periodically aggregate older data (e.g., average 6 ten-second data points into a single 1-minute data point) and delete the raw data.</p>
  </div>
</div>

<!-- Step 5: Ingestion Pipeline & Aggregation -->
<div class="step">
  <div class="step-header">
    <div class="step-number">5</div>
    <div class="step-title">Ingestion & Aggregation Pipeline</div>
  </div>
  <div class="step-content">
    <p>With 1M QPS, directly writing to the database is risky. We need a buffer.</p>
    <ul class="point-list">
      <li><strong>Agents</strong> push metrics to a {{Load Balancer}}.</li>
      <li><strong>Collectors</strong> validate and dump the metrics into a {{Message Queue}} (Kafka). Kafka handles the massive throughput and provides durability.</li>
      <li><strong>Consumers / Aggregators</strong> read from Kafka, batch the data, and write to the TSDB.</li>
    </ul>
  </div>
</div>

<!-- Step 6: Alerting System -->
<div class="step">
  <div class="step-header">
    <div class="step-number">6</div>
    <div class="step-title">Alerting Architecture</div>
  </div>
  <div class="step-content">
    <p>Alerting requires evaluating rules periodically.</p>
    <ul class="point-list">
      <li><strong>Rule Evaluators:</strong> Stream processors (like Flink or Spark Streaming) consume data directly from Kafka (for fast alerting) OR query the TSDB every minute.</li>
      <li>If a rule matches, an event is sent to the <strong>Alert Manager</strong>.</li>
      <li>The Alert Manager handles deduplication, silencing, routing (Email, Slack, PagerDuty), and retries.</li>
    </ul>
  </div>
</div>

<!-- Final Step: Architecture -->
<div class="step">
  <div class="step-header">
    <div class="step-number">7</div>
    <div class="step-title">Final Architecture</div>
  </div>
  <div class="step-content">
    <div class="diagram-container">
      <div class="diagram">
        <div class="diagram-title">Metrics & Alerting Architecture</div>
        <div class="diagram-content">
          <div class="d-tier">
            <div class="d-tier-label">DATA SOURCES</div>
            <div class="d-tier-nodes">
              <div class="d-node client">App Servers (Agents)</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">INGESTION</div>
            <div class="d-tier-nodes">
              <div class="d-node gateway">Load Balancer</div>
              <div class="d-node service">Collectors</div>
              <div class="d-node queue">Kafka</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">PROCESSING</div>
            <div class="d-tier-nodes">
              <div class="d-node service">DB Writers</div>
              <div class="d-node service">Stream Processors (Alerts)</div>
            </div>
          </div>
          <div class="d-connector">▼</div>
          <div class="d-tier">
            <div class="d-tier-label">STORAGE & DELIVERY</div>
            <div class="d-tier-nodes">
              <div class="d-node db">Time-Series DB</div>
              <div class="d-node service">Alert Manager</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Interview Tips -->
<div class="tips-section">
  <h3>🎯 Interview Tips for Monitoring System</h3>
  <ul>
    <li>Identify that this is a <strong>Write-Heavy</strong> system (unlike a news feed, which is read-heavy). Architecture must optimize for ingestion.</li>
    <li>Clearly state the need for a <strong>Time-Series Database (TSDB)</strong> and explain how Downsampling/Rollups save storage over time.</li>
    <li>Use {{Kafka}} or another durable {{Message Queue}} as a buffer to prevent the database from being overwhelmed during traffic spikes.</li>
    <li>Discuss the difference between <strong>Push</strong> (Datadog) and <strong>Pull</strong> (Prometheus). Pull is easier to prevent overload, Push is better for ephemeral containers.</li>
    <li>For alerting, mention deduplication (don't send 100 emails if 100 servers spike simultaneously).</li>
  </ul>
</div>
    `
  }
];
