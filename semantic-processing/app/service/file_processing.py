from typing import Union
from re import sub

import os
import pandas as pd
import re

from fastapi import UploadFile
from pandas import Series, DataFrame
from pandas.core.generic import NDFrame
from pandas.io.parsers import TextFileReader


def check_file_structure(uploaded_file: UploadFile, sep: str, title_line: int, first_line: int, last_line: int):
    """
    Transform the csv file content into a DataFrame
    :param uploaded_file: UploadFile
    :param sep: the separator of the CSV
    :param title_line: the title line of the CSV
    :param first_line: the first line of values
    :param last_line: the last line of values
    :return: a panda DataFrame from the CSV file
    """

    # To remove blank rows if the firstLine is different to 1
    # The rows to skip are in a array from the title line to the first line
    rows_to_skip = None if first_line == 1 else [x for x in range(title_line, first_line - 1)]

    # Specified the number of line if the last line is specified by the user
    number_rows = None if last_line is None else last_line - first_line + 1

    # Specify the title line
    title_line = None if title_line == 0 else title_line - 1

    # Put the csv file content in a dataframe thanks to pandas library
    pd_file = pd.read_csv(uploaded_file.file,
                          encoding="utf-8",
                          skip_blank_lines=False,
                          sep=sep,
                          header=title_line,
                          skiprows=rows_to_skip,
                          nrows=number_rows)

    # If there is no title, we add titles in this format: pred1, pred2, etc.
    if title_line is None:
        columns_name = ["pred"+str(i+1) for i in range(len(pd_file.columns))]
        pd_file.columns = columns_name

    return pd_file


# Write the turtle file from a data frame
def write_turtle_file(data: Union[TextFileReader, Series, DataFrame, None, NDFrame],
                      file_name: str,
                      prefix_predicate: str,
                      prefix_data: str):

    # Define the new file path
    path_to_directory = "app/resources/"
    file_path = path_to_directory + file_name + ".ttl"

    # Write the turtle file
    with open(file_path, "w", encoding='utf-8') as f:
        # Write prefix
        f.write("@prefix pred: {} .\n".format(prefix_predicate))
        f.write("@prefix row: {} .\n\n".format(prefix_data))

        # get column titles
        columns = data.columns

        # Iterate through all rows from the CSV
        for index, row in data.iterrows():

            # Write subject
            f.write("row:{}\t".format(index + 1))

            # Iterate through the columns of the row
            for index_col, column in enumerate(columns):
                # Add indentation when it's not the first predicate/object
                if index_col != 0:
                    f.write("\t")

                # Write the predicate in camel case with the value formatted (with quote for string and without for a number)
                f.write("\tpred:{} {}".format(to_camel_case(column), format_value_according_type(row[column])))

                # Add a dot or a semi column according to the index of the column
                f.write(" .\n") if index_col == len(columns) - 1 else f.write(" ;\n")

            # Jump a line between each row
            f.write("\n")
    return file_path


def format_value_according_type(value):
    """
    Add quotes to the value if it's a string type or not for a numerical value
    :param value
    :return: formatted value: str
    """
    value = str(value)
    # Regex pattern to check if it's a number or not
    numeric_pattern = "^-?\d+((.|,)\d+)?$"
    # In case of a string type
    if re.match(numeric_pattern, value) is None:
        return "\"{}\"".format(value)
    # In case of a numeric type
    else:
        return value


def to_camel_case(value):
    """
    Transform a value with camel case syntax
    :param value: str
    :return: value in camel case: str
    """
    value = str(value)
    # 1: Add space before capital letter, ex: memberNumber -> member Number
    # 2: Then, replace characters - and _ by space
    # 3: Add a capital letter at the beginning of each word
    # 4: Remove all spaces
    string = sub(r"(_|-)+", " ", sub(r"(\w)([A-Z])", r"\1 \2", value)).title().replace(" ", "")
    return string[0].lower() + string[1:]


def remove_file(file_path: str):
    """
    Remove a file
    :param file_path: str
    :return: None
    """
    os.remove(file_path)
