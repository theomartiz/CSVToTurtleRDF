from configparser import ConfigParser
from typing import Any

from pydantic import BaseModel

# Path to the configuration file
from pydantic.class_validators import Optional


# Class that contains all informations inside the configuration file
class Configuration(BaseModel):
    title_line: Optional[int]
    first_line: Optional[int]
    sep: Optional[str]
    prefix_predicate: Optional[str]
    prefix_data: Optional[str]

    # Constructor: We read all informations from the configuration file
    def __init__(self, **data: Any):
        super().__init__(**data)
        config_init = ConfigParser()
        config_init.read("config.ini")
        config = config_init["DEFAULT"]
        self.title_line = int(config["title_line"])
        self.first_line = int(config["first_line"])
        self.sep = config["sep"]
        self.prefix_predicate = config["prefix_predicate"]
        self.prefix_data = config["prefix_data"]
