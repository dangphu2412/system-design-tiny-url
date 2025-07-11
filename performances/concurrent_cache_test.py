from locust import HttpUser, task, between
import random
import string

def random_url():
    return "http://localhost" + ''.join(random.choices(string.ascii_letters + string.digits, k=10))

short_code = ''

class UrlPostUser(HttpUser):
    @task()
    def read_url(self):
        global short_code
        if not short_code:
            response = self.client.post("/urls", json={"url": random_url()})

            if response.status_code == 201:
                short_code = response.json().get("id")

        self.client.get(f"/urls/{short_code}", name="/:shortCode")
