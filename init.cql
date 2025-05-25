CREATE KEYSPACE IF NOT EXISTS shortener
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE shortener;

CREATE TABLE IF NOT EXISTS shortener.urls (
    id text PRIMARY KEY,
    long_url text,
    created_at timestamp
);
