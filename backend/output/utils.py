import os
import re
import unittest

from uuid import uuid4
from backend.exceptions import InternalServerError


def generate_files(base_dir: str, contents: [str], suffixes: [str]):
    try:
        filenames = []
        for idx, content in enumerate(contents):
            if suffixes is None or suffixes[idx] is None:
                filename = str(uuid4())
            else:
                filename = ''.join([str(uuid4()), suffixes[idx]])

            with open(base_dir + filename, 'w') as file:
                file.write(content)

            filenames.append(filename)
        return filenames
    except Exception as e:
        raise InternalServerError(detail=e)


def delete_files(full_filenames: [str]):
    for full_filename in full_filenames:
        if os.path.isfile(full_filename):
            os.remove(full_filename)


def string_compare_considered_type(s1: str = '', s2: str = ''):
    try:
        unittest.TestCase().assertEqual(
            decompose_string_by_number(s1),
            decompose_string_by_number(s2),
        )
        return True
    except Exception:
        return False


def decompose_string_by_number(s: str = ''):
    try:
        items = re.split(r'[,\s]+', s)
        for idx, item in enumerate(items):
            items[idx] = type_cast_if_number(item)
        return items
    except Exception:
        return s


def type_cast_if_number(s: str = ''):
    try:
        return int(s)
    except Exception:
        pass

    try:
        return float(s)
    except Exception:
        pass

    try:
        return complex(s)
    except Exception:
        pass

    return s
