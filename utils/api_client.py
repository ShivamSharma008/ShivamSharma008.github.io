"""Reusable API client for REST API testing."""

import requests

from config.config import settings
from utils.logger import get_logger

logger = get_logger("api_client")


class APIClient:
    """HTTP client wrapper with logging, headers, and error handling."""

    def __init__(self, base_url: str | None = None):
        self.base_url = base_url or settings["api_base_url"]
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "Accept": "application/json",
        })

    def get(self, endpoint: str, params: dict = None, **kwargs) -> requests.Response:
        url = f"{self.base_url}{endpoint}"
        logger.info("GET %s", url)
        response = self.session.get(url, params=params, **kwargs)
        logger.info("Response [%s]: %s", response.status_code, response.text[:200])
        return response

    def post(self, endpoint: str, json: dict = None, **kwargs) -> requests.Response:
        url = f"{self.base_url}{endpoint}"
        logger.info("POST %s | Body: %s", url, json)
        response = self.session.post(url, json=json, **kwargs)
        logger.info("Response [%s]: %s", response.status_code, response.text[:200])
        return response

    def put(self, endpoint: str, json: dict = None, **kwargs) -> requests.Response:
        url = f"{self.base_url}{endpoint}"
        logger.info("PUT %s | Body: %s", url, json)
        response = self.session.put(url, json=json, **kwargs)
        logger.info("Response [%s]: %s", response.status_code, response.text[:200])
        return response

    def patch(self, endpoint: str, json: dict = None, **kwargs) -> requests.Response:
        url = f"{self.base_url}{endpoint}"
        logger.info("PATCH %s | Body: %s", url, json)
        response = self.session.patch(url, json=json, **kwargs)
        logger.info("Response [%s]: %s", response.status_code, response.text[:200])
        return response

    def delete(self, endpoint: str, **kwargs) -> requests.Response:
        url = f"{self.base_url}{endpoint}"
        logger.info("DELETE %s", url)
        response = self.session.delete(url, **kwargs)
        logger.info("Response [%s]", response.status_code)
        return response

    def close(self):
        self.session.close()
