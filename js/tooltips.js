(function () {
  'use strict';
  var SD = (window.SD = window.SD || {});

  SD.tooltipData = {

    /* === Scaling === */
    'Load Balancer': {
      title: 'Load Balancer',
      definition: 'A device or software that distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed. Common algorithms include Round Robin, Least Connections, IP Hash, and Weighted Round Robin. Can operate at Layer 4 (TCP/UDP) or Layer 7 (HTTP). Examples: Nginx, HAProxy, AWS ALB/NLB.',
      related: ['Horizontal Scaling', 'Reverse Proxy', 'Health Checks']
    },
    'Horizontal Scaling': {
      title: 'Horizontal Scaling (Scale Out)',
      definition: 'Adding more machines to a pool of resources rather than upgrading a single machine. Preferred for distributed systems because it provides near-linear scalability and better fault tolerance. Requires stateless application design or externalized session storage.',
      related: ['Vertical Scaling', 'Load Balancer', 'Stateless Architecture']
    },
    'Vertical Scaling': {
      title: 'Vertical Scaling (Scale Up)',
      definition: 'Increasing the power (CPU, RAM, disk) of an existing machine. Simpler to implement but has hard upper limits and creates a single point of failure. Often used as a first step before horizontal scaling.',
      related: ['Horizontal Scaling']
    },
    'Auto-scaling': {
      title: 'Auto-scaling',
      definition: 'Automatically adjusting the number of compute instances based on current demand. Policies are typically based on CPU utilization, memory, request count, or custom metrics. Prevents over-provisioning (cost) and under-provisioning (poor UX).',
      related: ['Horizontal Scaling', 'Load Balancer']
    },

    /* === Caching === */
    'Caching': {
      title: 'Caching',
      definition: 'Storing copies of frequently accessed data in a faster storage layer (memory) to reduce latency and database load. Key strategies: Cache-Aside (Lazy), Write-Through, Write-Behind (Write-Back), and Read-Through. Must handle cache invalidation — one of the two hard problems in CS.',
      related: ['Redis', 'CDN', 'Cache Invalidation', 'TTL']
    },
    'Redis': {
      title: 'Redis',
      definition: 'An in-memory key-value data store used as a cache, message broker, and session store. Supports data structures like strings, hashes, lists, sets, sorted sets, and streams. Offers persistence via RDB snapshots and AOF logs. Supports clustering and replication for high availability.',
      related: ['Caching', 'Memcached', 'Pub/Sub']
    },
    'Memcached': {
      title: 'Memcached',
      definition: 'A high-performance, distributed memory caching system. Simpler than Redis — supports only key-value pairs (strings). Uses a slab allocator and LRU eviction. Best for simple caching use cases where you don\'t need persistence or complex data structures.',
      related: ['Caching', 'Redis']
    },
    'CDN': {
      title: 'Content Delivery Network (CDN)',
      definition: 'A geographically distributed network of proxy servers that cache static content (images, CSS, JS, videos) close to end users. Reduces latency, offloads origin servers, and provides DDoS protection. Push CDN vs Pull CDN. Examples: CloudFront, Cloudflare, Akamai.',
      related: ['Caching', 'Edge Computing', 'Latency']
    },
    'Cache Invalidation': {
      title: 'Cache Invalidation',
      definition: 'The process of removing or updating stale data in the cache when the source data changes. Strategies include TTL-based expiry, event-driven invalidation, and versioned keys. Incorrect invalidation leads to serving stale data — a common source of subtle bugs.',
      related: ['Caching', 'TTL', 'Eventual Consistency']
    },
    'TTL': {
      title: 'TTL (Time to Live)',
      definition: 'A mechanism that limits the lifespan of data in a cache, DNS record, or network packet. After the TTL expires, the item is considered stale and is either refreshed or evicted. Setting the right TTL is a trade-off between freshness and performance.',
      related: ['Caching', 'Cache Invalidation', 'DNS']
    },

    /* === Databases === */
    'SQL Database': {
      title: 'SQL (Relational) Database',
      definition: 'A database that organizes data into tables with predefined schemas, supporting ACID transactions and complex joins. Best for structured data with well-defined relationships. Examples: PostgreSQL, MySQL, Oracle. Supports strong consistency but can be harder to scale horizontally.',
      related: ['NoSQL Database', 'ACID', 'Sharding', 'Replication']
    },
    'NoSQL Database': {
      title: 'NoSQL Database',
      definition: 'A non-relational database designed for specific data models: Key-Value (Redis, DynamoDB), Document (MongoDB), Wide-Column (Cassandra, HBase), Graph (Neo4j). Offers flexible schemas, horizontal scalability, and high throughput. Trade-off: eventual consistency and limited join support.',
      related: ['SQL Database', 'CAP Theorem', 'Eventual Consistency']
    },
    'Sharding': {
      title: 'Database Sharding (Partitioning)',
      definition: 'Splitting a large database into smaller, independent pieces called shards, each holding a subset of the data. Sharding key determines data distribution. Types: Range-based, Hash-based, Directory-based. Challenges: cross-shard queries, rebalancing, hotspots.',
      related: ['Consistent Hashing', 'Replication', 'Horizontal Scaling']
    },
    'Replication': {
      title: 'Database Replication',
      definition: 'Maintaining copies of the same data on multiple database servers. Leader-Follower (Primary-Replica): writes go to leader, reads from followers. Leader-Leader: writes go to any leader (conflict resolution needed). Provides read scalability, high availability, and data durability.',
      related: ['Read Replica', 'Consistency', 'Failover']
    },
    'Read Replica': {
      title: 'Read Replica',
      definition: 'A read-only copy of the primary database that handles read queries, reducing load on the primary. Data is asynchronously replicated, which means there can be slight replication lag (eventual consistency for reads). Useful when read:write ratio is high (e.g., 90:10).',
      related: ['Replication', 'Eventual Consistency', 'Sharding']
    },
    'Database Index': {
      title: 'Database Indexing',
      definition: 'A data structure (typically B-Tree or Hash) that improves the speed of data retrieval at the cost of additional storage and slower writes. Creating the right indexes is critical for query performance. Over-indexing hurts write performance; under-indexing hurts read performance.',
      related: ['B-Tree', 'SQL Database', 'Query Optimization']
    },
    'ACID': {
      title: 'ACID Properties',
      definition: 'Atomicity (all-or-nothing), Consistency (valid state transitions), Isolation (concurrent transactions don\'t interfere), Durability (committed data survives crashes). Guarantees reliable transaction processing. Relaxing ACID enables higher throughput (see BASE).',
      related: ['SQL Database', 'BASE', 'Transactions']
    },
    'BASE': {
      title: 'BASE Properties',
      definition: 'Basically Available (system guarantees availability), Soft State (state may change over time without input), Eventually Consistent (system converges to consistent state). The trade-off alternative to ACID, favoring availability and partition tolerance over immediate consistency.',
      related: ['ACID', 'Eventual Consistency', 'CAP Theorem']
    },

    /* === Distributed Systems === */
    'CAP Theorem': {
      title: 'CAP Theorem',
      definition: 'In a distributed system, you can only guarantee two of three properties simultaneously: Consistency (all nodes see the same data), Availability (every request gets a response), Partition Tolerance (system works despite network splits). Since network partitions are inevitable, the real choice is between CP and AP systems.',
      related: ['Consistency', 'Availability', 'Partition Tolerance', 'Eventual Consistency']
    },
    'Consistency': {
      title: 'Consistency (Distributed Systems)',
      definition: 'Every read receives the most recent write or an error. Strong consistency ensures linearizability. Weaker models include sequential consistency, causal consistency, and eventual consistency. Stronger consistency typically means higher latency and lower availability.',
      related: ['CAP Theorem', 'Eventual Consistency', 'Strong Consistency']
    },
    'Availability': {
      title: 'Availability',
      definition: 'Every request receives a non-error response, without guaranteeing it contains the most recent write. Measured in "nines" — 99.9% (8.7h downtime/year), 99.99% (52min/year), 99.999% (5min/year). Achieved through redundancy, replication, and failover mechanisms.',
      related: ['CAP Theorem', 'SLA', 'Fault Tolerance', 'Redundancy']
    },
    'Partition Tolerance': {
      title: 'Partition Tolerance',
      definition: 'The system continues to operate despite arbitrary message loss or failure of part of the network. In real-world distributed systems, network partitions are inevitable, so partition tolerance is non-negotiable. The real design choice is between consistency (CP) and availability (AP).',
      related: ['CAP Theorem', 'Consistency', 'Availability']
    },
    'Eventual Consistency': {
      title: 'Eventual Consistency',
      definition: 'A consistency model where, given enough time without new updates, all replicas will converge to the same value. Reads may return stale data temporarily. Used by systems prioritizing availability (DynamoDB, Cassandra). Acceptable for many use cases like social media feeds or product catalogs.',
      related: ['Strong Consistency', 'CAP Theorem', 'Replication']
    },
    'Strong Consistency': {
      title: 'Strong Consistency',
      definition: 'After a write completes, all subsequent reads reflect that write. Achieved through protocols like Raft, Paxos, or 2PC. Higher latency than eventual consistency but required for financial transactions, inventory management, etc.',
      related: ['Eventual Consistency', 'Consensus Algorithm', 'Two-Phase Commit']
    },
    'Consistent Hashing': {
      title: 'Consistent Hashing',
      definition: 'A hashing technique where adding or removing a node only remaps ~K/N keys (K=keys, N=nodes), unlike traditional hashing which remaps nearly all keys. Uses a hash ring where both nodes and keys are mapped. Virtual nodes ensure even distribution. Used in: DynamoDB, Cassandra, CDNs.',
      related: ['Sharding', 'Hash Ring', 'Load Balancer']
    },
    'Consensus Algorithm': {
      title: 'Consensus Algorithm',
      definition: 'A protocol that ensures all nodes in a distributed system agree on a single value, even in the presence of failures. Raft: leader-based, understandable. Paxos: theoretically proven, complex. ZAB (ZooKeeper). Used for leader election, distributed locks, and replicated state machines.',
      related: ['Leader Election', 'Raft', 'Strong Consistency']
    },
    'Leader Election': {
      title: 'Leader Election',
      definition: 'The process of designating a single node as the leader/coordinator among a group of nodes. The leader handles writes or coordination tasks. If the leader fails, a new election occurs. Implemented via consensus algorithms (Raft, ZAB) or coordination services (ZooKeeper, etcd).',
      related: ['Consensus Algorithm', 'Failover', 'ZooKeeper']
    },

    /* === Messaging === */
    'Message Queue': {
      title: 'Message Queue',
      definition: 'A component that stores messages between producers and consumers, enabling asynchronous communication. Decouples services, absorbs traffic spikes, and ensures reliable delivery. Patterns: Point-to-Point (one consumer), Pub/Sub (multiple consumers). Examples: RabbitMQ, Amazon SQS.',
      related: ['Kafka', 'Pub/Sub', 'Asynchronous Processing', 'Event-Driven Architecture']
    },
    'Kafka': {
      title: 'Apache Kafka',
      definition: 'A distributed event streaming platform for high-throughput, fault-tolerant messaging. Uses topics (split into partitions) with consumer groups for parallel processing. Retains events for configurable periods (log-based). Used for event sourcing, stream processing, and data pipelines.',
      related: ['Message Queue', 'Event-Driven Architecture', 'Pub/Sub']
    },
    'Pub/Sub': {
      title: 'Publish/Subscribe Pattern',
      definition: 'A messaging pattern where publishers send messages to topics without knowing subscribers, and subscribers receive messages from topics they\'re interested in. Enables loose coupling between components. Examples: Google Pub/Sub, Redis Pub/Sub, Kafka topics, SNS.',
      related: ['Message Queue', 'Event-Driven Architecture', 'Kafka']
    },
    'Event-Driven Architecture': {
      title: 'Event-Driven Architecture',
      definition: 'A design pattern where system components communicate through events (state changes). Producers emit events, consumers react to them. Enables loose coupling, scalability, and real-time processing. Patterns include Event Sourcing, CQRS, and Saga for distributed transactions.',
      related: ['Message Queue', 'Kafka', 'CQRS', 'Event Sourcing']
    },
    'Asynchronous Processing': {
      title: 'Asynchronous Processing',
      definition: 'Processing tasks in the background without blocking the main request-response cycle. Used for: email sending, image processing, report generation, payment processing. Implemented via message queues, task queues (Celery), or event streams.',
      related: ['Message Queue', 'Task Queue']
    },

    /* === Architecture Patterns === */
    'Microservices': {
      title: 'Microservices Architecture',
      definition: 'An architectural style where an application is composed of small, independent services that communicate over well-defined APIs. Each service owns its data, can be deployed independently, and can use different tech stacks. Trade-offs: operational complexity, network latency, distributed transactions.',
      related: ['Monolith', 'API Gateway', 'Service Discovery']
    },
    'Monolith': {
      title: 'Monolithic Architecture',
      definition: 'An application built as a single, unified unit. All components share the same codebase, build, and deployment. Advantages: simpler development, easier debugging, no network overhead. Disadvantages: scaling is all-or-nothing, deployment risk, team coupling. Start here, evolve to microservices when needed.',
      related: ['Microservices', 'Modular Monolith']
    },
    'API Gateway': {
      title: 'API Gateway',
      definition: 'A single entry point for all client requests to backend services. Handles: routing, authentication, rate limiting, request/response transformation, load balancing, and SSL termination. Avoids exposing internal service topology to clients. Examples: Kong, AWS API Gateway, Envoy.',
      related: ['Microservices', 'Load Balancer', 'Rate Limiting', 'Reverse Proxy']
    },
    'Service Discovery': {
      title: 'Service Discovery',
      definition: 'A mechanism that allows services to find and communicate with each other dynamically without hard-coded addresses. Client-side discovery (service queries registry directly) vs Server-side discovery (load balancer queries registry). Tools: Consul, Eureka, etcd, Kubernetes DNS.',
      related: ['Microservices', 'API Gateway', 'Load Balancer']
    },
    'Reverse Proxy': {
      title: 'Reverse Proxy',
      definition: 'A server that sits between clients and backend servers, forwarding client requests to the appropriate backend. Benefits: load balancing, SSL termination, caching, compression, security (hides backend topology). Nginx and HAProxy are the most popular choices.',
      related: ['Load Balancer', 'API Gateway', 'Forward Proxy']
    },

    /* === Reliability === */
    'Circuit Breaker': {
      title: 'Circuit Breaker Pattern',
      definition: 'A design pattern that prevents cascading failures by stopping requests to a failing service. States: Closed (normal), Open (service down, fail fast), Half-Open (testing recovery). After a threshold of failures, the circuit "opens" and returns errors immediately instead of waiting for timeouts.',
      related: ['Fault Tolerance', 'Retry Pattern', 'Bulkhead Pattern']
    },
    'Rate Limiting': {
      title: 'Rate Limiting',
      definition: 'Controlling the number of requests a client can make within a time window. Protects against abuse, DDoS, and ensures fair usage. Algorithms: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log, Sliding Window Counter. Implemented at API Gateway or application level.',
      related: ['API Gateway', 'Throttling', 'Token Bucket']
    },
    'Fault Tolerance': {
      title: 'Fault Tolerance',
      definition: 'The ability of a system to continue operating properly in the event of component failures. Techniques: redundancy, replication, failover, circuit breakers, retry with backoff, graceful degradation, health checks. Design for failure — assume every component can and will fail.',
      related: ['Redundancy', 'Failover', 'Circuit Breaker', 'Health Checks']
    },
    'Redundancy': {
      title: 'Redundancy',
      definition: 'Duplication of critical components to increase reliability. Active-Active: all instances handle traffic (no wasted resources). Active-Passive: standby takes over on failure (simpler, wastes resources). Applied at every layer: servers, databases, network paths, data centers.',
      related: ['Fault Tolerance', 'Failover', 'Replication']
    },
    'Failover': {
      title: 'Failover',
      definition: 'The process of switching to a redundant or standby system when the primary system fails. Cold standby (slow, cheap), Warm standby (faster, moderate cost), Hot standby (instant, expensive). DNS failover, database failover (automatic promotion of replica to primary).',
      related: ['Redundancy', 'Fault Tolerance', 'Health Checks']
    },
    'Health Checks': {
      title: 'Health Checks / Heartbeats',
      definition: 'Periodic signals sent between system components to verify they are alive and functioning. Active checks (pinger checks target) vs Passive checks (target sends heartbeats). Used by load balancers to remove unhealthy instances and by orchestrators to restart failed containers.',
      related: ['Fault Tolerance', 'Load Balancer', 'Failover']
    },
    'Idempotency': {
      title: 'Idempotency',
      definition: 'An operation that produces the same result regardless of how many times it is executed. Critical for distributed systems where network issues can cause duplicate requests. Implement using idempotency keys (unique request IDs). Essential for payment processing and order creation.',
      related: ['Distributed Systems', 'Retry Pattern', 'API Design']
    },

    /* === Communication === */
    'WebSocket': {
      title: 'WebSocket',
      definition: 'A protocol providing full-duplex communication over a single TCP connection. Unlike HTTP (request-response), WebSocket allows server-initiated messages. Ideal for: real-time chat, live notifications, collaborative editing, game state, stock tickers. Persistent connection — use judiciously at scale.',
      related: ['Long Polling', 'SSE', 'Real-time Communication']
    },
    'Long Polling': {
      title: 'Long Polling',
      definition: 'A technique where the client makes a request and the server holds it open until new data is available or a timeout occurs. Then the client immediately makes another request. Simpler than WebSocket but higher latency and more overhead. Good fallback when WebSocket isn\'t available.',
      related: ['WebSocket', 'SSE', 'Polling']
    },
    'SSE': {
      title: 'Server-Sent Events (SSE)',
      definition: 'A standard for one-way server-to-client streaming over HTTP. The server pushes updates as they occur. Simpler than WebSocket (no handshake, auto-reconnect, works with HTTP/2). Best for: live feeds, notifications, progress updates. Not suitable for bidirectional communication.',
      related: ['WebSocket', 'Long Polling']
    },
    'REST API': {
      title: 'REST API',
      definition: 'An architectural style for web APIs based on HTTP methods (GET, POST, PUT, DELETE) and resource-oriented URLs. Stateless, cacheable, and uses standard HTTP status codes. The most common API design pattern. Limitations: over-fetching, under-fetching, multiple round trips.',
      related: ['GraphQL', 'gRPC', 'API Gateway']
    },
    'GraphQL': {
      title: 'GraphQL',
      definition: 'A query language for APIs that lets clients request exactly the data they need in a single request. Solves REST\'s over-fetching and under-fetching problems. Features: strongly typed schema, introspection, subscriptions for real-time. Trade-offs: complexity, caching challenges, N+1 query problem.',
      related: ['REST API', 'gRPC']
    },
    'gRPC': {
      title: 'gRPC',
      definition: 'A high-performance RPC framework using Protocol Buffers for serialization and HTTP/2 for transport. Supports unary, server streaming, client streaming, and bidirectional streaming. ~10x faster than REST+JSON. Ideal for internal microservice communication. Not browser-friendly natively.',
      related: ['REST API', 'Microservices', 'Protocol Buffers']
    },

    /* === Data Structures & Algorithms === */
    'Bloom Filter': {
      title: 'Bloom Filter',
      definition: 'A space-efficient probabilistic data structure that tests whether an element is a member of a set. Can have false positives but never false negatives. Uses multiple hash functions mapping to a bit array. Used for: checking if a URL was crawled, username availability, spam filtering.',
      related: ['HyperLogLog', 'Probabilistic Data Structures']
    },
    'B-Tree': {
      title: 'B-Tree / B+ Tree',
      definition: 'A self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in O(log n). B+ Trees store data only in leaf nodes (which are linked), making range queries efficient. The default index structure for most relational databases.',
      related: ['Database Index', 'LSM Tree']
    },
    'Consistent Hashing': {
      title: 'Consistent Hashing',
      definition: 'A hashing technique where adding or removing a node only remaps ~K/N keys (K=keys, N=nodes). Uses a hash ring where both nodes and keys are mapped. Virtual nodes ensure even distribution. Used in: DynamoDB, Cassandra, CDNs, distributed caches.',
      related: ['Sharding', 'Load Balancer']
    },

    /* === Observability === */
    'Latency': {
      title: 'Latency',
      definition: 'The time delay between a request being sent and a response being received. Measured in milliseconds. p50 (median), p99 (99th percentile — worst case for most users), p99.9. Key latency sources: network, serialization, disk I/O, computation, queue wait time.',
      related: ['Throughput', 'SLA']
    },
    'Throughput': {
      title: 'Throughput',
      definition: 'The number of operations or requests a system can handle per unit of time (e.g., requests/second, transactions/second, MB/s). Increasing throughput often trades off with latency. Bottleneck analysis helps identify which component limits overall throughput.',
      related: ['Latency', 'Scalability']
    },
    'SLA': {
      title: 'SLA / SLO / SLI',
      definition: 'SLA (Service Level Agreement): contractual guarantee (e.g., 99.9% uptime). SLO (Service Level Objective): internal target, typically stricter than SLA. SLI (Service Level Indicator): actual metric being measured (e.g., request latency, error rate). Error budgets = 100% minus SLO.',
      related: ['Availability', 'Latency', 'Monitoring']
    },

    /* === Data Processing === */
    'CQRS': {
      title: 'CQRS (Command Query Responsibility Segregation)',
      definition: 'A pattern that separates read and write operations into different models. The write model handles commands (mutations), and the read model is optimized for queries (often denormalized views). Enables independent scaling of reads and writes. Often paired with Event Sourcing.',
      related: ['Event Sourcing', 'Event-Driven Architecture', 'Read Replica']
    },
    'Event Sourcing': {
      title: 'Event Sourcing',
      definition: 'Storing state changes as a sequence of immutable events rather than current state. The current state is derived by replaying events. Benefits: complete audit trail, temporal queries, event replay. Challenges: eventual consistency, event schema evolution, storage growth.',
      related: ['CQRS', 'Event-Driven Architecture', 'Kafka']
    },

    /* === Infrastructure === */
    'DNS': {
      title: 'DNS (Domain Name System)',
      definition: 'The internet\'s phone book — translates domain names (google.com) to IP addresses. Resolution chain: Browser cache → OS cache → Recursive resolver → Root → TLD → Authoritative nameserver. DNS-based load balancing distributes traffic geographically (GeoDNS).',
      related: ['CDN', 'Load Balancer']
    },
    'Proxy': {
      title: 'Proxy',
      definition: 'An intermediary server between a client and the destination server. Forward Proxy: acts on behalf of the client (hides client identity, content filtering). Reverse Proxy: acts on behalf of the server (load balancing, SSL termination, caching). Both add a layer of indirection.',
      related: ['Reverse Proxy', 'Load Balancer', 'API Gateway']
    },
    'Stateless Architecture': {
      title: 'Stateless Architecture',
      definition: 'Designing services that don\'t store session state locally. Each request contains all information needed to process it. Session data is externalized to Redis, databases, or tokens (JWT). Enables horizontal scaling since any server can handle any request.',
      related: ['Horizontal Scaling', 'Load Balancer', 'JWT']
    },

    /* === Patterns === */
    'Token Bucket': {
      title: 'Token Bucket Algorithm',
      definition: 'A rate limiting algorithm where tokens are added to a bucket at a fixed rate. Each request consumes one token. If the bucket is empty, the request is rejected. Allows bursts up to the bucket capacity while maintaining a long-term average rate. Used by AWS, Stripe, and most API rate limiters.',
      related: ['Rate Limiting', 'Leaky Bucket']
    },
    'Two-Phase Commit': {
      title: 'Two-Phase Commit (2PC)',
      definition: 'A distributed algorithm ensuring all nodes commit or abort a transaction together. Phase 1 (Prepare): coordinator asks all participants to prepare. Phase 2 (Commit/Abort): if all agree, commit; otherwise, abort. Blocking protocol — if coordinator fails, participants are stuck. Use Saga pattern for better availability.',
      related: ['Distributed Transactions', 'Saga Pattern', 'Consensus Algorithm']
    },
    'Saga Pattern': {
      title: 'Saga Pattern',
      definition: 'A pattern for managing distributed transactions as a sequence of local transactions. Each step has a compensating transaction for rollback. Two styles: Choreography (event-driven, each service reacts) and Orchestration (central coordinator). Better availability than 2PC.',
      related: ['Two-Phase Commit', 'Microservices', 'Event-Driven Architecture']
    },
    'Bulkhead Pattern': {
      title: 'Bulkhead Pattern',
      definition: 'Isolating elements of an application into pools so that if one fails, the others continue to function. Named after ship bulkheads that prevent a hull breach from sinking the entire ship. Implementation: separate thread pools, connection pools, or service instances per consumer/function.',
      related: ['Circuit Breaker', 'Fault Tolerance']
    },
    'Back Pressure': {
      title: 'Back Pressure',
      definition: 'A mechanism where a system slows down or rejects incoming requests when it\'s overwhelmed, preventing cascading failures. Instead of accepting unbounded work and crashing, the system signals upstream to reduce the rate. Implemented via bounded queues, rate limiting, or flow control protocols.',
      related: ['Rate Limiting', 'Message Queue', 'Circuit Breaker']
    },
    'Data Partitioning': {
      title: 'Data Partitioning',
      definition: 'Dividing data across multiple storage units. Horizontal partitioning (sharding): splitting rows. Vertical partitioning: splitting columns/features. Functional partitioning: splitting by feature/domain. Key decisions: partition key, re-partitioning strategy, handling cross-partition queries.',
      related: ['Sharding', 'Consistent Hashing']
    }
  };
})();
