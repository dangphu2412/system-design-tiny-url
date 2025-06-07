locust -f load_test=http://localhost --headless -u 100 -r 10 --run-time 10m --csv run

locust -f concurrent_cache_test=http://localhost --headless -u 100 -r 10 --run-time 10m --csv run
