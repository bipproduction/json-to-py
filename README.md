

# json-to-py

Generate Python TypedDict classes from JSON data.

## Installation

To install `json-to-py` globally, use:

```sh
npm install -g json-to-py
```

## Usage

You can use `json-to-py` via the command line. The primary command is `start`, which generates Python classes from a specified JSON file.

### Command Line Options

- `--json` or `-j`: Path to the JSON file (required)
- `--name` or `-n`: Name of the root class (default: "RootInterface")
- `--output` or `-o`: Path to the output Python file (default: "output.py")

### Example

```sh
json-to-py start --json input.json --name MyClass --output my_classes.py
```

This command will read the JSON data from `input.json`, generate Python `TypedDict` classes with the root class named `MyClass`, and write the output to `my_classes.py`.

## Example JSON

Here is an example JSON input:

```json
{
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!",
      "body": "The shortest article. Ever.",
      "created": "2015-05-22T14:56:29.000Z",
      "updated": "2015-05-22T14:56:28.000Z"
    },
    "relationships": {
      "author": {
        "data": {"id": "42", "type": "people"}
      }
    }
  }],
  "included": [
    {
      "type": "people",
      "id": "42",
      "attributes": {
        "name": "John",
        "age": 80,
        "gender": "male"
      }
    }
  ]
}
```

## Example Generated Python

The above JSON would generate the following Python classes:

```python
from typing import TypedDict, List, Any

class Attributes(TypedDict):
    title: str
    body: str
    created: str
    updated: str

class AuthorData(TypedDict):
    id: str
    type: str

class Author(TypedDict):
    data: AuthorData

class Relationships(TypedDict):
    author: Author

class Data(TypedDict):
    type: str
    id: str
    attributes: Attributes
    relationships: Relationships

class IncludedAttributes(TypedDict):
    name: str
    age: int
    gender: str

class Included(TypedDict):
    type: str
    id: str
    attributes: IncludedAttributes

class RootInterface(TypedDict):
    data: List[Data]
    included: List[Included]
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Malik Kurosaki


This `README.md` provides a comprehensive guide for users on how to install and use the `json-to-py` tool, along with an example JSON input and the corresponding generated Python output.