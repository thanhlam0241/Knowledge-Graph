SCHEMA_LOCATION = {
    "type": ["object", "null"],
    "properties": {
        "lat": {
            "type": "number"
        },
        "lon": {
            "type": "number"
        }
    }
}
SCHEMA_ADDRESS = {
    "type": "object",
    "properties": {
        "country": {
            "type": "string"
        },
        "displayed": {
            "type": "string"
        },
        "country_names": {
            "type": "object"
        },
        "country_synonyms": {
            "type": "array",
        },
        "country_code": {
            "type": "string",
            "pattern": "^[A-Z]{2}$"
        },
        "location": SCHEMA_LOCATION
    },
}


SCHEMA_CONTACTS = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string"
            },
            "value": {
                "type": "string"
            }
        }
    }
}

SCHEMA_IMAGES = {
    "type": "array",
    "items": {
        "type": "string"
    }
}

MULTI_LANGS = {
    "type": "object",
    "properties": {
        "en": {
            "type": "string"
        },
        "vi": {
            "type": "string"
        },
        "fr": {
            "type": "string"
        },
        "de": {
            "type": "string"
        }
    },
    "required": [
        "en"
    ],
    "additionalProperties": False
}

MULTI_LANGS_ARRAY = {
    "type": "object",
    "properties": {
        "en": {
            "type": "array"
        },
        "vi": {
            "type": "array"
        },
        "fr": {
            "type": "array"
        },
        "de": {
            "type": "array"
        }
    },
    "required": [
        "en"
    ],
    "additionalProperties": False
}

CATEGORY = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "pattern": "[a-z0-9_]"
        },
        "name": {"type": "string"},
        "names": MULTI_LANGS,
        "synonyms": MULTI_LANGS_ARRAY,
        "parent_id": {"type": ["string", "null"]},
        "types": {"type": "array"},
        "source": {"type": "string"},
        "source_id": {"type": "string"},
        "source_parent_id": {"type": "string"},
        "source_url": {"type": "string"},
        "level": {"type": "integer"},
        "weight": {"type": "number"},
        "last_updated": {"type": "string"}
    },
    "required": [
        "id",
        "name",
        "source",
        "types"
    ],
    "additionalProperties": False
}
ORGANIZATION = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "pattern": "[a-z0-9_]"
        },
        "name": {"type": "string"},
        "names": MULTI_LANGS,
        "synonyms": MULTI_LANGS_ARRAY,
        "types": {"type": "array"},
        "source": {"type": "string"},
        "source_id": {"type": "string"},
        "source_url": {"type": "string"},
        "country": {
            "type": "string",
            "pattern": "^[A-Z]{2}$"
        },
        "industries": {"type": "array"},
        "ranks": {"type": "array"},
        "website": {"type": "string"},
        "last_updated": {"type": "string"}
    },
    "required": [
        "id",
        "name",
        "source",
        "types"
    ],
    "additionalProperties": False
}

PROFESSION = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "pattern": "[a-z0-9_]"
        },
        "name": {"type": "string"},
        "names": MULTI_LANGS,
        "synonyms": MULTI_LANGS_ARRAY,
        "types": {"type": "array"},
        "source": {"type": "string"},
        "source_id": {"type": "string"},
        "source_url": {"type": "string"},
        "weight": {"type": "number"},
        "last_updated": {"type": "string"}
    },
    "required": [
        "id",
        "name",
        "source",
        "types"
    ],
    "additionalProperties": False
}

CRAWLED_PERSON = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "owner": {"type": "string"},
        "source": {"type": "string"},
        "source_id": {"type": "string"},
        "source_url": {"type": "string"},
        "metadata": {"type": "object"}
    },
    "required": [
        "id",
        "name",
        "source",
        "source_id",
        "source_url",
        "metadata"
    ]
}
