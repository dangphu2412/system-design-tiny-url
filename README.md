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
- Nonfunctional Requirements:
  - 99.99% Availability
  - 150ms latency on redirection
  - Links expire at 5 years by default
  - Should perform globally
  - All urls are public
  - Assumptions
  - Each url is 500 bytes
  - 20% of URLs can be stored in a cache
  - Cache TTL 24 hrs
  - Estimated Usage
  - 100 Reads per Write
  - 500,000 urls created every month