# Tiny Url

## Level: Easy
## Description: 
> Given a url, design a web API that generates a shorter and unique alias of it

Example
Input(102 characters):

https://phu.com/this-link-is-handsome

Output(28 characters):

https://tinyurl.com/5n6et7uf

The service will create an alias for the original URL with a shorter length. If you click on the shorter URL it should redirect to the longer URL.

## Functional Requirements
- Given a url, generate a shorter and unique alias of it
- When user accesses short link, redirect them to the original url

## Nonfunctional Requirements:
  - [] 99.99% Availability
  - [] 150ms latency on redirection
  - [] Links expire at 5 years by default
  - [] Should perform globally
  - [x] All urls are public
  - [x] Each url is 2Kb
  - [] 20% of URLs can be stored in a cache
  - [x] Cache TTL 24 hrs
  - [] Estimated Usage
  - [x] 100 Reads per Write
  - [x] 500,000 urls created every month
## References:
https://www.geeksforgeeks.org/system-design-url-shortening-service/

## Let's break down the problems:
Based on functional requirements:
- Given a url, generate a shorter and unique alias of it
- When user accesses short link, redirect them to the original url

So, how do we generate the shorter link?
- Hashing: technique of transformation from 1 input to the same output, no way traverse back, took time due to computing resources.
  - MD5 or SHA256 generate **256bits** output, its a long string
- Encoding: technique of transformation from 1 input to the same output, can decode, 1-1 unique generation
  - Base62: from by a-z, A-Z, 0-9 (26+26+10=62), the generation always output a longer one.
- Counter increment: Eventually increase, no duplication.
  - Counter of database can reach a maximum size of number:
    - integer: 4 bytes
    - bigint: 8 bytes

## ID Generation:
500,000 urls/month -> 6mil record/year -> 30mil/5year -> 60mil/10year
So the shorten id should serve at least 60mil variants for 10 years.

Shorten ID length should be 7 characters.

### Auto generation base62 (encoding):
Base62 generate 62 variants -> 7 characters will have 62 pow 7 = 395.747.437.888 (YES)

### Auto generation base64 (encoding):
Base62 generate 64 variants -> 7 characters will have 64 pow 7 = 4.398.046.511.104 (YES)
But character of + / break URL when routing. (NO)

### Counter using number increment:
int 4 bytes: 4,294,967,295
But we need only 7 characters, so result in 4,967,295 (not even fit for 1 year)
-> This approach cannot fit (NO)

### SHA256 (Hashing-256bits):
- Hash based on input will output 256bits length -> 32bytes
- For full string, it is unique, but we need length of 7 only, so the cut **can be duplicated** (NO)

> Possible solution is Base62 generation

## Data Capacity Modeling
For 5 years:
30mil
Average long URL size is 2Kb for 2048 characters (Max browser URL)
1 character = 1 byte -> 2048 characters = 2Kb
30.000.000 * 2 = 30.000.000 Kb ~ 29296 Mb ~ 28 Gb

## Database
> Given a url, generate a shorter and unique alias of it.
- A Key Value database should be the best fit.
- Also offer a scalable read database over the write overhead.

## Cache storage
- 20% of URLs can be stored in a cache
- 28 Gb * 0.2 = 5.6 Gb

## Job for cleaning data over 5 years
- Define a scheduled job run per 5 years to clean up least access data.
- The job to iterate over the database which may causing overhead to the database in the cleaning time. So how do we avoid pressure on the database?
- Also, we need to invalidate the cached url as well?

## Performance testing

## Scale strategy
- Application scale
- Cache server scale
  - Setup redis cluster
- Database scale
