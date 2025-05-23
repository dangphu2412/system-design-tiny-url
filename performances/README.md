## ⚙️ **Overall Performance Summary**

Simulating both **short URL creation** (`POST /urls`) and **short URL resolution** (`GET /:shortCode`). The test ran for about 2 minutes and handled:

* ✅ **8,130 total requests**
* ✅ **0 failures**
* ✅ Sustained **\~62 requests/sec** combined (GET + POST)

---

## 🚀 **GET /\:shortCode (Read flow)**

This simulates users accessing shortened URLs.

| Metric            | Value         |
| ----------------- | ------------- |
| Total Requests    | 5,422         |
| Avg Response Time | **5.68ms** ⚡️ |
| Max Response Time | 170ms         |
| 99%ile            | **28ms**      |
| RPS               | 41.13         |

### 🧠 Takeaways:

* Reads are fast and stable. Sub-10ms for the vast majority (P95 = 10ms).
* Zero failures ✅
* Cassandra/DB reads and redirect logic are solid.

---

## ✍️ **POST /urls (Write flow)**

This simulates users creating shortened URLs.

| Metric            | Value         |
| ----------------- | ------------- |
| Total Requests    | 2,708         |
| Avg Response Time | **18.33ms** ✅ |
| Max Response Time | 573ms 😬      |
| 95%ile            | 68ms          |
| 99%ile            | 160ms         |
| RPS               | 20.54         |

### 🧠 Takeaways:

* Writes are **slower than reads**, which is expected (hash generation, DB write, maybe duplication check).
* Still fast! P95 is 68ms.
* That 573ms max could mean some outlier spikes — maybe Cassandra write latency or container autoscaling?

---

## 📊 Aggregate Insights

| Percentile | Response Time (ms) |
| ---------- | ------------------ |
| P50        | 6                  |
| P95        | 19                 |
| P99        | 110                |
| Max        | 570                |

### 🧠 Overall Health:

* **Excellent performance baseline.**
* **99% of your requests complete in <110ms**, which is **really good for a real-time public-facing API**.
* No errors at all = 👌 config and infra are stable.

---

## 🧩 Engineering Suggestions

1. **Monitor spikes on POST**:

    * That 573ms max isn't wild, but worth watching.
    * Check if it's due to Cassandra, app logic, or container cold starts.

2. **Scale test**:

    * Try 5–10x the load you just did and see how it trends.
    * Monitor CPU/mem on your app pods and Cassandra.

3. **Latency SLOs**:

    * Define and enforce an SLO like: *“99% of reads under 30ms, 99% of writes under 100ms”* — you’re already hitting that.

4. **Batch pre-generating short codes** (optional):

    * If you want to make POSTs faster at scale, consider having a pool of pre-generated codes to avoid runtime generation bottlenecks.
