from locust import HttpUser, task, between

class UrlPostUser(HttpUser):
    wait_time = between(1, 2)  # seconds between tasks

    @task
    def post_url(self):
        self.client.post("/urls", json={"url": "https://docs.locust.io/en/stable/running-in-docker.html"})
