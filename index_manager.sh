#!/bin/sh -l

# This script gets the folder and version output of the package's generated docs from jsdoc output
find_first_html_file () {
    find "$1" -name '*.html' | head -n 1
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

# This script will add a new line of HTML to the index.html file
# The new line of HTML will be added after the line that contains the comment <!-- @jsdoc-builder-action new-version -->
update_index_html () {
    # If file already contains the input, skip it
    if grep -q "$2" "$1"; then
        echo "File already contains $2"
        return
    fi

    awk -v line="$2" '
        /<!-- @jsdoc-builder-action new-version -->/ {
            print
            print "      "line""
            next
        }
        {print}
    ' "$1" > tmp_index.html && mv tmp_index.html "$1"
}

export find_first_html_file
export create_index_html
export update_html_version