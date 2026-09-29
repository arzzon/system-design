window.SD = window.SD || {};

SD.concepts = [
  {
    id: 'scalability',
    title: 'Scalability (Vertical & Horizontal)',
    icon: '📈',
    tagline: 'Handling increasing load by adding more power or more machines.',
    description: '<p>Scalability is the property of a system to handle a growing amount of work by adding resources to the system. It is fundamental to designing systems that can grow with the user base without degrading performance.</p><p>There are two main approaches: {{Vertical Scaling}} (scaling up) which means adding more power (CPU, RAM) to an existing machine, and {{Horizontal Scaling}} (scaling out) which means adding more machines into your pool of resources.</p>',
    whyNeeded: [
      'Accommodate growing user base and increasing traffic without service degradation.',
      'Maintain acceptable {{Latency}} and {{Throughput}} under high load.',
      'Provide a path for future business expansion.'
    ],
    problemsSolved: [
      'Prevents system crashes during peak traffic events (e.g., Black Friday, viral moments).',
      'Removes the single machine resource limit inherent in non-distributed systems.'
    ],
    howItWorks: '<h4>Vertical Scaling</h4><p>Involves upgrading the hardware of a single server. This is often the simplest approach initially as it requires no code changes.</p><h4>Horizontal Scaling</h4><p>Involves distributing the workload across multiple servers. This usually requires a {{Load Balancer}} and a {{Stateless Architecture}} to function efficiently.</p><div class="callout tip"><strong>💡 Pro Tip:</strong> Modern systems almost always favor {{Horizontal Scaling}} combined with {{Auto-scaling}} to dynamically adjust capacity based on demand.</div>',
    diagram: '<div class="diagram"><div class="diagram-title">Horizontal vs Vertical Scaling</div><div class="diagram-content"><div class="d-tier"><div class="d-tier-label">VERTICAL (Scale Up)</div><div class="d-tier-nodes"><div class="d-node server" style="transform: scale(1.2);">Large Server</div></div></div><div class="d-connector">OR</div><div class="d-tier"><div class="d-tier-label">HORIZONTAL (Scale Out)</div><div class="d-tier-nodes"><div class="d-node server">Server 1</div><div class="d-node server">Server 2</div><div class="d-node server">Server 3</div></div></div></div></div>',
    limitations: [
      '{{Vertical Scaling}} has a hard hardware limit and introduces a single point of failure.',
      '{{Horizontal Scaling}} adds significant architectural complexity (network overhead, data consistency).',
      'Requires managing distributed state and sessions.'
    ],
    realWorldExamples: [
      '<strong>Amazon:</strong> Uses {{Horizontal Scaling}} across AWS to handle massive retail traffic.',
      '<strong>Stack Overflow:</strong> Historically used intense {{Vertical Scaling}} (massive SQL servers) before expanding horizontally.'
    ]
  },
  {
    id: 'load-balancing',
    title: 'Load Balancing',
    icon: '⚖️',
    tagline: 'Distributing incoming network traffic across multiple servers.',
    description: '<p>A {{Load Balancer}} acts as the "traffic cop" sitting in front of your servers and routing client requests across all servers capable of fulfilling those requests in a manner that maximizes speed and capacity utilization and ensures that no one server is overworked.</p><p>If a single server goes down, the load balancer redirects traffic to the remaining online servers. When a new server is added, the load balancer automatically starts to send requests to it.</p>',
    whyNeeded: [
      'Enable {{Horizontal Scaling}} by distributing traffic.',
      'Improve system {{Availability}} and reliability through {{Redundancy}}.',
      'Prevent any single server from becoming a bottleneck.'
    ],
    problemsSolved: [
      'Solves the problem of single-server overload.',
      'Provides seamless {{Failover}} if a server crashes.',
      'Abstracts multiple backend servers into a single endpoint for clients.'
    ],
    howItWorks: '<h4>Routing Algorithms</h4><p>Load balancers use algorithms like Round Robin, Least Connections, or IP Hash to determine which server should receive a request.</p><h4>Health Checks</h4><p>They continuously perform {{Health Checks}} on backend servers to ensure they are responsive before forwarding traffic.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">Load Balancing Architecture</div><div class="diagram-flow"><div class="d-node client">Clients</div><div class="d-arrow">→</div><div class="d-node lb">Load Balancer</div><div class="d-arrow">→</div><div class="d-group"><div class="d-group-label">Backend Pool</div><div class="d-node server">Server A</div><div class="d-node server">Server B</div><div class="d-node server">Server C</div></div></div></div>',
    limitations: [
      'The {{Load Balancer}} itself can become a single point of failure (requires redundancy).',
      'Can introduce slight {{Latency}} due to the extra network hop.',
      'Complex to configure correctly for sticky sessions or stateful applications.'
    ],
    realWorldExamples: [
      '<strong>Netflix:</strong> Uses Amazon Elastic Load Balancing (ELB) to handle millions of concurrent video streams.',
      '<strong>Uber:</strong> Custom load balancers handle enormous volumes of real-time location data and dispatch requests.'
    ]
  },
  {
    id: 'caching',
    title: 'Caching',
    icon: '⚡',
    tagline: 'Storing copies of frequently accessed data in fast, temporary storage.',
    description: '<p>{{Caching}} takes advantage of the locality of reference principle: recently requested data is likely to be requested again. By storing this data in high-speed storage layers (like RAM) such as {{Redis}} or {{Memcached}}, subsequent requests can be served much faster than querying the primary {{SQL Database}} or recomputing results.</p><p>Effective caching strategies are critical for reducing {{Latency}} and protecting backend systems from excessive load.</p>',
    whyNeeded: [
      'Drastically reduce read {{Latency}}.',
      'Decrease load on the primary databases or downstream microservices.',
      'Improve overall system {{Throughput}}.'
    ],
    problemsSolved: [
      'Prevents database meltdowns during traffic spikes.',
      'Solves performance bottlenecks for read-heavy workloads.',
      'Reduces compute costs by avoiding redundant processing.'
    ],
    howItWorks: '<h4>Cache Read Strategies</h4><p>Strategies like Cache-Aside (application checks cache, then DB) or Read-Through (cache manages DB fetching) dictate how data is read.</p><h4>Cache Write Strategies</h4><p>Write-Through (write to cache and DB simultaneously) or Write-Behind (write to cache, asynchronously sync to DB) manage data updates.</p><h4>Eviction and Expiration</h4><p>Uses algorithms like LRU (Least Recently Used) and time-to-live ({{TTL}}) to manage limited cache size and {{Cache Invalidation}}.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">Cache-Aside Pattern</div><div class="diagram-content"><div class="d-tier"><div class="d-tier-nodes"><div class="d-node client">Application</div></div></div><div class="d-connector">1. Check Cache ↙️ ↗️ 4. Return Data</div><div class="d-tier"><div class="d-tier-nodes"><div class="d-node cache">Redis Cache</div><div class="d-node db">Database</div></div></div><div class="d-connector">2. Cache Miss (Read DB) ↘️ ↖️ 3. Write to Cache</div></div></div>',
    limitations: [
      '{{Cache Invalidation}} is notoriously difficult to get right, risking serving stale data.',
      'Adds complexity to the architecture and deployment process.',
      'Cache nodes can experience sudden failure, leading to a "thundering herd" problem on the DB.'
    ],
    realWorldExamples: [
      '<strong>Twitter:</strong> Heavily relies on {{Redis}} clusters to cache timelines and user data for instant rendering.',
      '<strong>Facebook:</strong> Developed and uses {{Memcached}} extensively to reduce database load for social graph queries.'
    ]
  },
  {
    id: 'cdn',
    title: 'Content Delivery Network (CDN)',
    icon: '🌍',
    tagline: 'Distributed network of servers delivering content based on user location.',
    description: '<p>A {{CDN}} is a geographically distributed network of proxy servers and their data centers. The goal is to provide high {{Availability}} and high performance by distributing the service spatially relative to end-users.</p><p>CDNs are primarily used to serve static assets (images, videos, HTML, CSS, JavaScript) from edge servers located physically closer to the user, drastically reducing {{Latency}}.</p>',
    whyNeeded: [
      'Reduce perceived {{Latency}} for global users by serving content from edge nodes.',
      'Offload static asset traffic from origin servers.',
      'Improve website load times and user experience globally.'
    ],
    problemsSolved: [
      'Solves the physical distance limitation between users and origin servers.',
      'Absorbs massive traffic spikes and provides DDOS protection.',
      'Reduces bandwidth costs on the origin infrastructure.'
    ],
    howItWorks: '<h4>Edge Locations</h4><p>CDNs deploy Points of Presence (PoPs) globally. When a user requests a file, the request is routed to the nearest PoP.</p><h4>Caching at the Edge</h4><p>If the PoP has a cached copy, it serves it immediately. If not, it fetches it from the origin server, caches it, and serves it.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">CDN Request Flow</div><div class="diagram-flow"><div class="d-node client">User (Japan)</div><div class="d-arrow">→</div><div class="d-node cdn">CDN Edge (Tokyo)</div><div class="d-arrow">→</div><div class="d-node server">Origin (US-East)</div></div></div>',
    limitations: [
      'Costly for very high bandwidth usage or complex dynamic content routing.',
      '{{Cache Invalidation}} across global edge nodes can take time, leading to temporary stale content.',
      'Adds a dependency on a third-party provider for critical asset delivery.'
    ],
    realWorldExamples: [
      '<strong>Netflix:</strong> Built its own custom CDN called Open Connect to deliver terabytes of video content efficiently.',
      '<strong>Cloudflare/Akamai:</strong> Major CDN providers used by millions of websites for caching and security.'
    ]
  },
  {
    id: 'database-fundamentals',
    title: 'Database Fundamentals (SQL vs NoSQL)',
    icon: '🗄️',
    tagline: 'Choosing the right storage paradigm for your data model.',
    description: '<p>Choosing between a {{SQL Database}} (Relational) and a {{NoSQL Database}} (Non-relational) is a fundamental architectural decision. SQL databases use structured tables, enforce schemas, and typically guarantee {{ACID}} properties. NoSQL databases offer flexible schemas, scale out easily, and often prioritize {{Availability}} and {{Partition Tolerance}} (following {{BASE}} semantics).</p>',
    whyNeeded: [
      'Store and retrieve application state reliably.',
      'Ensure data integrity and consistency where required.',
      'Provide query capabilities tailored to the data access patterns.'
    ],
    problemsSolved: [
      'Provides persistent storage beyond application memory.',
      'Allows complex data relationships to be modeled and queried (SQL).',
      'Handles unstructured or rapidly changing data at high volume (NoSQL).'
    ],
    howItWorks: '<h4>SQL (Relational)</h4><p>Organizes data into rows and columns with strict schemas. Uses joins for relationships. Best for structured data and complex queries.</p><h4>NoSQL (Non-Relational)</h4><p>Uses documents (JSON), key-value pairs, wide-column stores, or graphs. Excellent for rapid development, unstructured data, and massive {{Horizontal Scaling}}.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">SQL vs NoSQL Structures</div><div class="diagram-content"><div class="d-tier"><div class="d-tier-label">SQL (Relational)</div><div class="d-tier-nodes"><div class="d-node db">Table: Users<br>(id, name, age)</div><div class="d-connector">-Joins-</div><div class="d-node db">Table: Orders<br>(id, user_id, total)</div></div></div><div class="d-connector">VS</div><div class="d-tier"><div class="d-tier-label">NoSQL (Document)</div><div class="d-tier-nodes"><div class="d-node db">Collection: Users<br>{id, name, orders: [...]}</div></div></div></div></div>',
    limitations: [
      '<strong>SQL:</strong> Harder to scale horizontally; rigid schemas require migrations.',
      '<strong>NoSQL:</strong> Weaker consistency guarantees (often {{Eventual Consistency}}); lacks standard complex query languages (like joins).'
    ],
    realWorldExamples: [
      '<strong>Financial Systems:</strong> Prefer SQL (PostgreSQL, MySQL) for strict {{ACID}} compliance in transactions.',
      '<strong>E-commerce Catalogs:</strong> Often use NoSQL (MongoDB, DynamoDB) for flexible product attributes.'
    ]
  },
  {
    id: 'db-replication',
    title: 'Database Replication',
    icon: '👯',
    tagline: 'Maintaining copies of data across multiple servers for reliability and read scaling.',
    description: '<p>{{Replication}} involves keeping duplicate copies of your database on multiple servers. The most common pattern is Primary-Replica (Master-Slave), where one node handles all writes, and replicates those changes to one or more {{Read Replica}} nodes.</p><p>This is crucial for {{Fault Tolerance}} and allows you to scale read-heavy workloads by routing read queries to the replicas.</p>',
    whyNeeded: [
      'Provide high {{Availability}} and {{Redundancy}} in case the primary database fails.',
      'Scale read capacity by distributing read queries across replicas.',
      'Enable geographic data distribution for lower {{Latency}}.'
    ],
    problemsSolved: [
      'Prevents data loss if a single database hardware node fails.',
      'Alleviates read bottlenecks on the primary database.',
      'Allows for heavy analytical queries on replicas without impacting production writes.'
    ],
    howItWorks: '<h4>Synchronous vs Asynchronous</h4><p>Replication can be synchronous (slower writes, strong consistency) or asynchronous (faster writes, {{Eventual Consistency}}). Most read replicas use asynchronous replication.</p><h4>Failover</h4><p>If the primary node goes down, a replica can be promoted to become the new primary, minimizing downtime.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">Primary-Replica Architecture</div><div class="diagram-content"><div class="d-tier"><div class="d-tier-nodes"><div class="d-node client">App (Writes)</div><div class="d-node client">App (Reads)</div></div></div><div class="d-connector">Write ↓ &nbsp;&nbsp;&nbsp;&nbsp; Read ↓</div><div class="d-tier"><div class="d-tier-nodes"><div class="d-node db">Primary DB</div><div class="d-connector">--Replicate→</div><div class="d-node db">Read Replica</div></div></div></div></div>',
    limitations: [
      'Asynchronous replication introduces replication lag (reading stale data).',
      'Promoting a replica to primary during a {{Failover}} can be complex and risky.',
      'Does not scale write capacity (all writes still hit one primary node).'
    ],
    realWorldExamples: [
      '<strong>Instagram:</strong> Uses massive PostgreSQL replication setups to serve millions of photo read requests while handling writes on primaries.',
      '<strong>Medium:</strong> Utilizes {{Read Replica}} databases to serve high volumes of blog post reads.'
    ]
  },
  {
    id: 'db-sharding',
    title: 'Database Sharding & Partitioning',
    icon: '🧩',
    tagline: 'Splitting large databases across multiple machines to scale writes and storage.',
    description: '<p>{{Sharding}} (or {{Data Partitioning}}) is a type of horizontal database partitioning that separates very large databases into smaller, faster, more easily managed parts called data shards. Unlike replication, which duplicates data, sharding distributes different rows of data across multiple nodes.</p><p>This is essential when a dataset becomes too large to store on a single machine or when write {{Throughput}} exceeds a single server\'s capability.</p>',
    whyNeeded: [
      'Scale write operations linearly by distributing them across nodes.',
      'Overcome storage limits of a single physical machine.',
      'Improve query response times by reducing the index size on each node.'
    ],
    problemsSolved: [
      'Solves the write bottleneck of Primary-Replica architectures.',
      'Handles datasets in the terabyte or petabyte range efficiently.',
      'Reduces the impact of an outage (only one shard goes down, not the whole DB).'
    ],
    howItWorks: '<h4>Shard Keys</h4><p>Data is partitioned based on a shard key (e.g., user_id). A routing layer determines which shard holds the data for a given key.</p><h4>Partitioning Strategies</h4><p>Common strategies include Range-based (e.g., IDs 1-1000 on Shard A), Hash-based (using {{Consistent Hashing}}), or Directory-based.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">Database Sharding</div><div class="diagram-flow"><div class="d-node client">App</div><div class="d-arrow">→</div><div class="d-node service">Router / Proxy</div><div class="d-arrow">→</div><div class="d-group"><div class="d-group-label">Shards</div><div class="d-node db">Shard 1 (A-M)</div><div class="d-node db">Shard 2 (N-Z)</div></div></div></div>',
    limitations: [
      'Drastically increases architectural complexity (routing, rebalancing).',
      'Performing cross-shard joins or transactions is extremely difficult and slow.',
      'Choosing the wrong shard key leads to "hotspots" (uneven data/traffic distribution).'
    ],
    realWorldExamples: [
      '<strong>Slack:</strong> Shards its massive messaging database by workspace/team to isolate load and scale.',
      '<strong>Discord:</strong> Uses Cassandra heavily for sharding billions of chat messages across clusters.'
    ]
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing',
    icon: '⭕',
    tagline: 'A distributed hashing scheme that minimizes data movement when nodes change.',
    description: '<p>{{Consistent Hashing}} is an algorithm used in distributed systems to distribute data across multiple nodes (like cache servers or DB shards) in a way that minimizes reorganization when nodes are added or removed.</p><p>Standard hashing (`hash(key) % N`) breaks down when `N` changes, forcing a massive reshuffling of data. Consistent hashing solves this by mapping both data and nodes to a conceptual circle (hash ring).</p>',
    whyNeeded: [
      'Minimize cache misses or data movement during scale-up/scale-down events.',
      'Evenly distribute load across a dynamic cluster of nodes.',
      'Enable highly available distributed caching and storage systems.'
    ],
    problemsSolved: [
      'Solves the "rehash storm" problem of simple modulo hashing.',
      'Allows dynamic addition and removal of nodes without system disruption.'
    ],
    howItWorks: '<h4>The Hash Ring</h4><p>Both node identifiers and data keys are hashed to produce a value on a fixed circular range (e.g., 0 to 2^32-1). To find the node for a key, you move clockwise on the ring until you find a node.</p><h4>Virtual Nodes</h4><p>To ensure even distribution, physical nodes are represented by multiple "virtual nodes" placed randomly around the ring.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">Consistent Hash Ring</div><div class="diagram-flow"><div class="d-node client">Key1</div><div class="d-arrow">→</div><div class="d-node cache" style="border-radius: 50%;">Node A</div><div class="d-arrow">→</div><div class="d-node client">Key2</div><div class="d-arrow">→</div><div class="d-node cache" style="border-radius: 50%;">Node B</div></div></div>',
    limitations: [
      'Implementation complexity is higher than simple hashing.',
      'Requires careful tuning of virtual nodes to achieve truly balanced load distribution.',
      'Not natively supported by all data stores out-of-the-box.'
    ],
    realWorldExamples: [
      '<strong>DynamoDB:</strong> Amazon uses consistent hashing extensively for internal data partitioning.',
      '<strong>Memcached clients:</strong> Often implement consistent hashing to distribute keys across a Memcached cluster.'
    ]
  },
  {
    id: 'cap-theorem',
    title: 'CAP Theorem & Consistency Models',
    icon: '📐',
    tagline: 'You can only have two: Consistency, Availability, or Partition Tolerance.',
    description: '<p>The {{CAP Theorem}} states that a distributed data store cannot simultaneously guarantee more than two out of three characteristics: {{Consistency}} (every read receives the most recent write), {{Availability}} (every request receives a response), and {{Partition Tolerance}} (the system continues to operate despite network failures dropping messages between nodes).</p><p>Since network partitions are inevitable in distributed systems, architects must trade off between Consistency (CP systems) and Availability (AP systems) during a partition.</p>',
    whyNeeded: [
      'Provides a theoretical framework for designing distributed databases.',
      'Forces architects to make explicit trade-offs based on business requirements.',
      'Helps manage expectations regarding data accuracy during network failures.'
    ],
    problemsSolved: [
      'Prevents impossible architectural goals (designing a perfect distributed system).',
      'Guides the choice of database technology (e.g., Cassandra for AP, HBase for CP).'
    ],
    howItWorks: '<h4>CP (Consistency + Partition Tolerance)</h4><p>During a network failure, the system refuses requests rather than return stale data (e.g., traditional RDBMS, MongoDB).</p><h4>AP (Availability + Partition Tolerance)</h4><p>The system returns the most recent available version of the data, which might be stale (e.g., Cassandra, DynamoDB). This implies {{Eventual Consistency}}.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">CAP Theorem Triangle</div><div class="diagram-content"><div class="d-tier"><div class="d-tier-nodes"><div class="d-node db">Consistency (C)</div></div></div><div class="d-connector">↗️ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↖️</div><div class="d-tier"><div class="d-tier-nodes"><div class="d-node db">Availability (A)</div><div class="d-connector">↔️</div><div class="d-node db">Partition (P)</div></div></div></div></div>',
    limitations: [
      'CAP is a simplified model; modern systems often offer tunable consistency (e.g., PACELC theorem).',
      '100% Availability or Consistency is rarely achieved; it operates on a spectrum.',
      '"Partition Tolerance" is not a choice on the internet; it is a necessity.'
    ],
    realWorldExamples: [
      '<strong>Banking Systems:</strong> Favor CP for ledgers; you cannot withdraw money if balance consistency cannot be guaranteed.',
      '<strong>Social Media Feeds:</strong> Favor AP; it\'s okay if you see a stale comment ({{Eventual Consistency}}) as long as the app loads.'
    ]
  },
  {
    id: 'message-queues',
    title: 'Message Queues & Asynchronous Processing',
    icon: '📨',
    tagline: 'Decoupling services by passing messages through a reliable queue.',
    description: '<p>A {{Message Queue}} (like {{Kafka}} or RabbitMQ) facilitates {{Asynchronous Processing}} by acting as a buffer between a producer (who generates a message) and a consumer (who processes it). This enables an {{Event-Driven Architecture}}.</p><p>Instead of Service A calling Service B synchronously (and waiting for a response), Service A drops a message in the queue and immediately returns. Service B processes the message at its own pace.</p>',
    whyNeeded: [
      'Decouple microservices, preventing tight dependencies.',
      'Provide {{Back Pressure}} to protect downstream services from traffic spikes.',
      'Improve user-perceived {{Latency}} by offloading heavy tasks to the background.'
    ],
    problemsSolved: [
      'Prevents synchronous cascade failures (if Service B is down, Service A still works).',
      'Smooths out bursty traffic by queueing requests.',
      'Enables reliable retries and dead-letter queues for failed processing.'
    ],
    howItWorks: '<h4>Producers and Consumers</h4><p>Producers publish messages to topics/queues. Consumers subscribe to these topics and process messages asynchronously.</p><h4>Pub/Sub vs Point-to-Point</h4><p>{{Pub/Sub}} allows multiple consumers to receive the same message, while point-to-point ensures a message is processed exactly once by one worker.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">Asynchronous Queue Flow</div><div class="diagram-flow"><div class="d-node service">Producer App</div><div class="d-arrow">→</div><div class="d-node queue">Message Queue (Kafka)</div><div class="d-arrow">→</div><div class="d-node service">Consumer Worker</div></div></div>',
    limitations: [
      'Introduces architectural complexity and operational overhead to manage the queue infrastructure.',
      'Tracing bugs and requests across asynchronous boundaries is difficult.',
      'Requires handling message ordering, duplicates, and {{Idempotency}} in consumers.'
    ],
    realWorldExamples: [
      '<strong>LinkedIn:</strong> Created {{Kafka}} to handle massive streams of activity data and metrics asynchronously.',
      '<strong>Uber:</strong> Uses message queues to decouple the ride-request API from the complex matching and dispatch algorithms.'
    ]
  },
  {
    id: 'microservices',
    title: 'Microservices vs Monolith',
    icon: '🏗️',
    tagline: 'Architectural styles for organizing code and deployments.',
    description: '<p>A {{Monolith}} is a single, unified unit where all application logic (UI, business logic, data access) is packaged and deployed together. {{Microservices}} architecture structures an application as a collection of loosely coupled, independently deployable services organized around business capabilities.</p><p>Microservices solve organizational and scaling bottlenecks of large monoliths but introduce significant distributed systems complexity.</p>',
    whyNeeded: [
      'Enable large engineering teams to work independently on different services.',
      'Allow different parts of the application to scale independently ({{Horizontal Scaling}}).',
      'Permit using different technologies/languages for different services.'
    ],
    problemsSolved: [
      'Solves the "big ball of mud" problem in massive, legacy codebases.',
      'Reduces deployment risk (deploying one service instead of the whole app).',
      'Isolates failures (one service crashing doesn\'t take down the whole system).'
    ],
    howItWorks: '<h4>Monolith</h4><p>All modules share the same memory space and database. Function calls are fast, in-process executions.</p><h4>Microservices</h4><p>Services communicate over the network (e.g., {{REST API}}, {{gRPC}}). Each service usually manages its own isolated database to ensure loose coupling.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">Monolith vs Microservices</div><div class="diagram-content"><div class="d-tier"><div class="d-tier-label">MONOLITH</div><div class="d-tier-nodes"><div class="d-node server">UI + Auth + Billing + DB</div></div></div><div class="d-connector">VS</div><div class="d-tier"><div class="d-tier-label">MICROSERVICES</div><div class="d-tier-nodes"><div class="d-node service">Auth Service</div><div class="d-node service">Billing Service</div><div class="d-node service">UI Service</div></div></div></div></div>',
    limitations: [
      'Microservices introduce network latency and require handling partial failures.',
      'Distributed data management is hard (requires patterns like {{Saga Pattern}} instead of local ACID transactions).',
      'Operational complexity (monitoring, CI/CD, orchestration) increases dramatically.'
    ],
    realWorldExamples: [
      '<strong>Amazon & Netflix:</strong> Pioneers of microservices, transitioning from monolithic architectures to enable rapid global scale and team velocity.',
      '<strong>Shopify:</strong> Famously maintains a highly modularized Monolith ("Modular Monolith"), proving microservices aren\'t always mandatory.'
    ]
  },
  {
    id: 'api-gateway',
    title: 'API Gateway & Service Discovery',
    icon: '🚪',
    tagline: 'The single entry point for microservices and how they find each other.',
    description: '<p>An {{API Gateway}} is a server that acts as an API front-end, receiving API requests, enforcing policies, and routing them to the appropriate backend {{Microservices}}. It abstracts the internal architecture from the clients.</p><p>{{Service Discovery}} is the mechanism that allows these microservices to find each other dynamically on the network without hardcoding IP addresses, which change frequently in auto-scaled environments.</p>',
    whyNeeded: [
      'Provide a unified entry point for clients (web, mobile).',
      'Centralize cross-cutting concerns (authentication, logging, {{Rate Limiting}}).',
      'Enable dynamic scaling and container orchestration.'
    ],
    problemsSolved: [
      'Prevents clients from having to know the addresses of dozens of internal services.',
      'Solves the problem of routing traffic to dynamic, ephemeral containers (Kubernetes pods).',
      'Reduces duplicated code across services for security and monitoring.'
    ],
    howItWorks: '<h4>Gateway Routing</h4><p>The Gateway inspects the request path (e.g., `/api/users`) and proxies it to the Users service.</p><h4>Service Registry</h4><p>Services register themselves with a registry (like Consul or Eureka) on startup. The Gateway or other services query the registry to discover current IP addresses.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">API Gateway Architecture</div><div class="diagram-content"><div class="d-tier"><div class="d-tier-nodes"><div class="d-node client">Mobile/Web App</div></div></div><div class="d-connector">↓ Requests</div><div class="d-tier"><div class="d-tier-nodes"><div class="d-node gateway">API Gateway</div></div></div><div class="d-connector">↙️ &nbsp;&nbsp; ↓ &nbsp;&nbsp; ↘️</div><div class="d-tier"><div class="d-tier-nodes"><div class="d-node service">Auth API</div><div class="d-node service">User API</div><div class="d-node service">Order API</div></div></div></div></div>',
    limitations: [
      'The {{API Gateway}} can become a performance bottleneck if not scaled properly.',
      'Introduces an additional network hop, increasing {{Latency}}.',
      'Gateway configuration can become complex and difficult to manage.'
    ],
    realWorldExamples: [
      '<strong>Netflix:</strong> Created Zuul (and later Envoy integrations) as their massive edge API gateway.',
      '<strong>AWS:</strong> Offers API Gateway as a managed service to route traffic to Lambda functions and microservices.'
    ]
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting & Throttling',
    icon: '🚦',
    tagline: 'Controlling the rate of traffic sent or received by a network interface.',
    description: '<p>{{Rate Limiting}} restricts the number of requests a client can make to an API within a specific time window. Throttling is similar but often refers to slowing down responses rather than outright rejecting them.</p><p>These mechanisms are vital defensive engineering practices to protect services from abuse, prevent DDoS attacks, and enforce usage quotas or pricing tiers.</p>',
    whyNeeded: [
      'Protect backend systems from being overwhelmed by spikes or malicious traffic.',
      'Enforce API monetization tiers (e.g., 100 requests/min for free tier).',
      'Ensure fair usage among all clients (preventing noisy neighbors).'
    ],
    problemsSolved: [
      'Mitigates Brute-force and Denial of Service (DoS) attacks.',
      'Prevents cascading failures caused by unexpected traffic surges.',
      'Controls infrastructure costs by capping resource consumption.'
    ],
    howItWorks: '<h4>Algorithms</h4><p>Common algorithms include the {{Token Bucket}} (allows bursts), Leaky Bucket (smooths out traffic), and Fixed/Sliding Window counters.</p><h4>Implementation</h4><p>Usually implemented at the edge ({{CDN}} or {{API Gateway}}) utilizing fast, atomic data stores like {{Redis}} to track request counts across distributed nodes.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">Rate Limiting Flow</div><div class="diagram-flow"><div class="d-node client">Client</div><div class="d-arrow">→</div><div class="d-node gateway">API Gateway<br>(Rate Limiter)</div><div class="d-arrow">→</div><div class="d-node service">Backend Service</div></div></div><div class="callout tip"><strong>💡 Pro Tip:</strong> Rejected requests should return HTTP 429 Too Many Requests.</div>',
    limitations: [
      'Distributed rate limiting requires shared state (e.g., Redis), which adds latency and a point of failure.',
      'Identifying legitimate users behind shared IPs (NAT) can lead to accidental blocking.',
      'Complex to tune correctly between strict protection and good user experience.'
    ],
    realWorldExamples: [
      '<strong>Stripe:</strong> Uses sophisticated {{Token Bucket}} rate limiting to protect its payment APIs and enforce concurrency limits.',
      '<strong>Twitter API:</strong> Strictly rate-limits endpoints based on user authentication tokens to manage load.'
    ]
  },
  {
    id: 'fault-tolerance',
    title: 'Fault Tolerance & Redundancy',
    icon: '🛡️',
    tagline: 'Designing systems to continue operating properly in the event of component failures.',
    description: '<p>{{Fault Tolerance}} is the property that enables a system to continue operating properly in the event of the failure of some of its components. This is achieved primarily through {{Redundancy}}—having backup components ready to take over.</p><p>In distributed systems, failures (network drops, disk crashes, software bugs) are guaranteed. Systems must be engineered to anticipate and gracefully handle these failures using patterns like the {{Circuit Breaker}}.</p>',
    whyNeeded: [
      'Maintain high {{Availability}} (e.g., chasing "five nines" or 99.999% uptime).',
      'Ensure critical business operations (like payments) survive hardware failures.',
      'Provide a seamless user experience despite backend chaos.'
    ],
    problemsSolved: [
      'Prevents single points of failure from taking down the entire application.',
      'Stops cascading failures where one slow service causes all other dependent services to crash.',
      'Enables non-disruptive disaster recovery.'
    ],
    howItWorks: '<h4>Circuit Breaker Pattern</h4><p>If a downstream service is failing, the {{Circuit Breaker}} "trips" and stops sending requests, returning a cached or default response immediately to prevent resource exhaustion.</p><h4>Redundancy & Failover</h4><p>Deploying multiple instances of databases and services across different Availability Zones (datacenters), with automatic {{Failover}} mechanisms.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">Circuit Breaker Pattern</div><div class="diagram-flow"><div class="d-node service">Service A</div><div class="d-arrow">❌</div><div class="d-node service" style="border-color: red;">Service B (Failing)</div></div><div class="diagram-flow" style="margin-top: 10px;"><div class="d-node service">Service A</div><div class="d-arrow">⚡</div><div class="d-node cache">Fallback / Cache</div></div></div>',
    limitations: [
      'Redundancy is expensive (paying for idle backup hardware).',
      'Testing fault tolerance (Chaos Engineering) is complex and requires specialized tooling.',
      'Implementing graceful degradation requires significant defensive coding.'
    ],
    realWorldExamples: [
      '<strong>Netflix:</strong> Created Chaos Monkey to randomly terminate instances in production to enforce {{Fault Tolerance}}.',
      '<strong>AWS:</strong> Architects services across multiple isolated Availability Zones to survive datacenter-level failures.'
    ]
  },
  {
    id: 'real-time-comm',
    title: 'Real-time Communication',
    icon: '⚡',
    tagline: 'Technologies for pushing data from server to client instantly.',
    description: '<p>Standard HTTP is request-response: the client must ask for data. For features like chat, live scores, or collaborative editing, we need real-time, bi-directional communication or server-push capabilities.</p><p>Key technologies include {{WebSocket}} (persistent, bi-directional), {{SSE}} (Server-Sent Events; persistent, server-to-client only), and {{Long Polling}} (client holds request open until server responds).</p>',
    whyNeeded: [
      'Deliver instant updates without the client needing to refresh or poll constantly.',
      'Reduce the network overhead and {{Latency}} of establishing new HTTP connections continuously.',
      'Enable highly interactive, collaborative user interfaces.'
    ],
    problemsSolved: [
      'Solves the inefficiency and high latency of traditional HTTP polling.',
      'Allows servers to initiate communication with clients.'
    ],
    howItWorks: '<h4>WebSockets</h4><p>Starts as an HTTP request, then "upgrades" to a persistent TCP connection allowing low-latency, two-way message passing.</p><h4>Server-Sent Events (SSE)</h4><p>A unidirectional HTTP connection where the server streams data down to the client. Great for live feeds.</p><h4>Long Polling</h4><p>A fallback mechanism where the server holds a standard HTTP request open until new data is available, then responds.</p>',
    diagram: '<div class="diagram"><div class="diagram-title">WebSocket Connection</div><div class="diagram-flow"><div class="d-node client">Browser</div><div class="d-arrow">↔️</div><div class="d-node service">WebSocket Server</div><div class="d-arrow">↔️</div><div class="d-node cache">Redis Pub/Sub</div></div></div><div class="callout note"><strong>📝 Note:</strong> Redis is often used to route messages between multiple WebSocket servers.</div>',
    limitations: [
      'Maintaining millions of persistent concurrent connections requires heavy server tuning and memory.',
      'Load balancing WebSockets requires sticky sessions or complex message routing architectures.',
      'Stateful connections complicate zero-downtime deployments.'
    ],
    realWorldExamples: [
      '<strong>WhatsApp/Discord:</strong> Rely heavily on persistent {{WebSocket}} connections for real-time messaging presence.',
      '<strong>Robinhood:</strong> Uses {{SSE}} or WebSockets to stream live stock price ticks to trading dashboards.'
    ]
  }
];
