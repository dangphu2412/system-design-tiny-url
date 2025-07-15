from locust import HttpUser, task, between, tag
import random
import string

def random_url():
    return "http://localhost" + ''.join(random.choices(string.ascii_letters + string.digits, k=10))

short_codes = []

class NormalUserCreation(HttpUser):
    wait_time = between(0.1, 0.3)# seconds between tasks

    @tag('post_url')
    @task(1)
    def post_url(self):
        response = self.client.post("/urls", json={"url": random_url()})

        if response.status_code == 201:
            short_codes.append(response.json().get("id"))

    @tag('read_url')
    @task(40)  # 2x more read requests
    def read_url(self):
        if not short_codes:
            self.post_url()

        short_code = random.choice(short_codes)
        self.client.get(f"/urls/{short_code}", name="/:shortCode")

