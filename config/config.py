"""Configuration reader with environment-based execution support."""

import os
from pathlib import Path

import yaml
from dotenv import load_dotenv

load_dotenv()

CONFIG_DIR = Path(__file__).parent
PROJECT_ROOT = CONFIG_DIR.parent


def load_config() -> dict:
    """Load configuration based on the ENV environment variable."""
    env = os.getenv("ENV", "default")
    config_path = CONFIG_DIR / "config.yaml"

    with open(config_path, "r") as f:
        all_config = yaml.safe_load(f)

    config = all_config.get(env, all_config["default"])
    # Allow env-var overrides
    config["base_url"] = os.getenv("BASE_URL", config["base_url"])
    config["api_base_url"] = os.getenv("API_BASE_URL", config["api_base_url"])
    config["browser"] = os.getenv("BROWSER", config["browser"])
    config["headless"] = os.getenv("HEADLESS", str(config["headless"])).lower() == "true"
    return config


# Singleton config instance
settings = load_config()
