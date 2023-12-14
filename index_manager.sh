#!/bin/sh -l

# This script will add a new line of HTML to the index.html file
# The new line of HTML will be added after the line that contains the comment <!-- @jsdoc-builder-action new-version -->
update_index_html () {
    awk -v line="$2" '
        /<!-- @jsdoc-builder-action new-version -->/ {
            print
            print "      "line""
            next
        }
        {print}
    ' "$1" > tmp_index.html && mv tmp_index.html "$1"
}

# This script will create an index.html file in the specified directory in case it doesn't exist
create_index_html () {
    if [ ! -f "$1/index.html" ]; then
        cp templates/index.html "$1/index.html"
        echo "index.html created in $1"
    else
        echo "index.html exists in $1"
    fi
}

export create_index_html
export update_html_version