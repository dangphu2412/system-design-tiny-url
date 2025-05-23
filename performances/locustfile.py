from locust import HttpUser, task, between
import random
import string

def random_url():
    return "http://localhost" + ''.join(random.choices(string.ascii_letters + string.digits, k=10))

short_codes = ['0000001', '0000002']

class UrlPostUser(HttpUser):
    wait_time = between(0.1, 0.3)# seconds between tasks

    @task(1)
    def post_url(self):
        response = self.client.post("/urls", json={"url": random_url()})

        if response.status_code == 200:
            short_codes.append(response.json().get("id"))

    @task(99)  # 2x more read requests
    def read_url(self):
        short_code = random.choice(short_codes)
        self.client.get(f"/urls/{short_code}", name="/:shortCode")

