## 📊 **Summary of Output**

Running a **POST** load test to `/urls` with **5027 requests**.

### ✅ **Good Signs**

* **0 Failures** — all requests succeeded, so your service held up under the pressure 💪.
* **Requests/s**: \~58.4 — steady throughput.
* **Median (P50)** response time: **9ms** — very fast.
* **Average** response time: **32ms** — good, but let’s keep reading.
* **P95**: 160ms
* **P99**: 290ms
* **P100 (max)**: 670ms — now we’re talking about tail latency.

---

## 🔍 **Architectural Insights**

### 1. **Response Time Distribution**

| Percentile | Value (ms) | Interpretation                    |
| ---------- | ---------- | --------------------------------- |
| P50        | 9          | Half requests returned in <10ms ✅ |
| P75        | 15         | 3/4 of requests <15ms ✅           |
| P90        | 78         | Slight climb — still acceptable   |
| P95        | 160        | Starting to see longer latency 🟡 |
| P99        | 290        | Some significant outliers 🟠      |
| P100       | 670        | Worst-case is much slower 🔴      |

### 2. **Tail Latency**

* There’s **a growing tail past P90**, and by P99 you hit **\~300ms**, with a **worst case of 670ms**.
* Possible causes:

    * **Resource contention** under load (CPU, DB).
    * **GC pauses** if using Node.js.
    * **Locking or queuing** in DB/cache layer.
    * **Batch processing / retries** in the service code.

---

## 🧠 **Architecture Deep Dive: Where to Investigate**

| Layer                 | What to Check                                                            |
| --------------------- | ------------------------------------------------------------------------ |
| **App Code**          | Check for blocking code, unnecessary awaits, sync logic inside loop      |
| **DB Layer**          | Slow queries? Missing indexes? Are all requests writing or some reading? |
| **Infra**             | CPU/memory saturation, container throttling, network latency?            |
| **Load Distribution** | One instance handling too many requests?                                 |

