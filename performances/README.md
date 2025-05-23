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


# Testing with 200 concurrent users with read:write rate 100:1

Thanks for sharing your Locust test result. Let's break it down and analyze the numbers with your goal in mind: **100 reads per 1 write** — which you're following quite well here.

---

### 📊 Summary of Request Results

| Metric                    | `GET /:shortCode` (Read) | `POST /urls` (Write) | Total        |
| ------------------------- | ------------------------ | -------------------- | ------------ |
| **Request Count**         | `309,918`                | `3,083`              | `313,001`    |
| **Failure Count**         | `0`                      | `0`                  | ✅ All passed |
| **RPS (Requests/sec)**    | `840.45`                 | `8.36`               |              |
| **Median Response Time**  | `21 ms`                  | `67 ms`              |              |
| **Average Response Time** | `31.2 ms`                | `99.5 ms`            |              |
| **Max Response Time**     | `~1.2 s`                 | `~1.1 s`             |              |

---

### ✅ What’s Looking Good

* **Zero failures**: That’s a huge win. Your app is stable under load.
* **Proper ratio**: You’re very close to the intended 100:1 read-to-write ratio (`309,918 / 3,083 ≈ 100.5`).
* **Fast reads**: Median read response time is solid at `21ms` and average at `31ms`, which is good for high-QPS APIs.
* **Writes holding up**: While slower than reads (expected), `99ms` avg response is still decent.

---

### ⚠️ Things Worth Noting

1. **Long Tail on Latency (Max/Percentiles)**:

    * Some GETs take **up to 1.2 seconds**, and 99.9th percentile is **\~0.5s**. For a TinyURL-style app, those outliers might impact UX, especially under load.
    * POSTs also spike to **\~1.1s max**, with 95th and 99th percentiles in the **290–540ms** range.

   💡 **Suggestion**: Add a histogram or time series to correlate spikes with request volume or resource limits.

2. **RPS capacity**:

    * You're getting \~840 RPS on GETs and \~8 on POSTs.
    * That implies your infra is handling read-heavy traffic well, but if your write path grows (e.g., due to viral usage), you might need to assess DB/indexing bottlenecks.

# Running concurrent with rate 5:1
Yup — this latest test output shows **your app is getting crushed under write load**. Let's break it down like an engineer 👇

---

## 🧾 Summary Breakdown

### ✅ **GET /\:shortCode (Read)**

* **Requests**: 68,578
* **Failures**: 0 ✅
* **Median Response Time**: 48ms
* **Average**: 64ms
* **P99**: \~320ms
* **Max**: \~2.3s

> **Conclusion**: Your read path is holding strong. Good performance & reliability even at scale.

---

### ❌ **POST /urls (Write)**

* **Requests**: 13,777
* **Failures**: 6,858 (!!! more than 49%) 🔥
* **Median Response Time**: 1100ms
* **P95**: 1600ms
* **Max**: \~3.1s

> **Conclusion**: Your **write endpoint is failing hard**:

* \~**50% of requests are failing**
* **Slow** even when it works (median = 1.1s)

---

## 🧠 Diagnosis & Hypotheses

### 1. **Write throughput is too high**

* You're pushing 13k+ writes — that’s **way heavier** than your app can handle.
* Locust is simulating a **10:1 read/write ratio**, but your backend may not scale for this volume of concurrent `POST /urls`.

---

### 2. **Server-side bottlenecks**

Check for these backend issues:

* **DB contention / locks** (e.g., Cassandra inserts)
* **No connection pooling / reuse**
* **Synchronous I/O** blocking main thread
* **Rate-limiting** or app-level throttling errors
* **Bad retries** or unhandled exceptions

Use logs and monitoring to confirm.

---

### 3. **Cassandra overload or misconfig**

* Cassandra doesn't like lots of small writes unless tuned for it.
* Check if it's:

    * Under heavy write pressure
    * Rejecting connections (timeout / overload)
    * Experiencing GC pauses

---

## ✅ Recommendations

### ✅ 1. Fix backend stability for `POST /urls`

* Log errors → are you getting 5xx, timeouts, DB errors?
* Add retry/backoff on transient failures (e.g., Cassandra)
* Optimize your insert pipeline (batching, async, pool)

### ✅ 3. Monitor your backend

Track:

* CPU/mem usage
* Cassandra connection pool
* Errors thrown
* Garbage collection (if Node.js or JVM involved)

---

### ✅ 4. Bonus: Warm up short code pool

If most reads are failing because they can't find valid `shortCodes`, preload a bunch before the test starts.
