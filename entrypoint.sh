#!/bin/sh -l

set -e
set -u

echo "Starting jsdoc-builder-action"

ls

JSDOC_INPUT_FILES="$1"
DESTINATION_GITHUB_USERNAME="$2"
DESTINATION_REPOSITORY_NAME="$3"
USER_EMAIL="$4"
USER_NAME="$5"
DESTINATION_REPOSITORY_USERNAME="$6"
TARGET_BRANCH="$7"
COMMIT_MESSAGE="$8"

DOCS_DIRECTORY="out"

if [ -z "$DESTINATION_REPOSITORY_USERNAME" ]
then
  DESTINATION_REPOSITORY_USERNAME="$DESTINATION_GITHUB_USERNAME"
fi

if [ -z "$USER_NAME" ]
then
  USER_NAME="$DESTINATION_GITHUB_USERNAME"
fi

CLONE_DIR=$(mktemp -d)

echo "Cloning destination git repository"
git config --global user.email "$USER_EMAIL"
git config --global user.name "$USER_NAME"
git clone --single-branch --branch "$TARGET_BRANCH" "https://$USER_NAME:$API_TOKEN_GITHUB@github.com/$DESTINATION_REPOSITORY_USERNAME/$DESTINATION_REPOSITORY_NAME.git" "$CLONE_DIR"
ls -la "$CLONE_DIR"

echo "Generating jsdoc.json"
touch jsdoc.json
echo '{"plugins": ["plugins/markdown", "plugins/summarize"],"recurseDepth": 50,"source": {"includePattern": ".+\\.js(doc|x)?$","excludePattern": "(^|\\/|\\\\)_"},"sourceType": "module","tags": {"allowUnknownTags": true,"dictionaries": ["jsdoc", "closure"]},"templates": {"cleverLinks": false,"monospaceLinks": false}}' > jsdoc.json
cat jsdoc.json

echo "Generating documentation"
jsdoc -r $JSDOC_INPUT_FILES -c jsdoc.json -d "$DOCS_DIRECTORY"

echo "Loading index_manager and grabbing path to first html file"
source index_manager.sh
FIRST_HTML_FILE=$(find_first_html_file "$DOCS_DIRECTORY")

echo "Removing DOCS_DIRECTORY from FIRST_HTML_FILE path"
FIRST_HTML_FILE=${FIRST_HTML_FILE/$DOCS_DIRECTORY\//}

echo "Copying documentation to destination git repository"
ls -la "$DOCS_DIRECTORY"
cp -ra "$DOCS_DIRECTORY"/. "$CLONE_DIR"

echo "Copying templates to destination git repository"
cp -ra templates/. "$CLONE_DIR"

echo "Changing directory to destination git repository"
cd "$CLONE_DIR"

echo "Generating or updating index.html"
create_index_html "."
update_index_html "index.html" "<li><a href=\"./$FIRST_HTML_FILE\">$FIRST_HTML_FILE</a></li>"

echo "Deleting templates from destination git repository"
rm -rf templates

echo "Files that will be pushed:"
ls -la

ORIGIN_COMMIT="https://github.com/$GITHUB_REPOSITORY/commit/$GITHUB_SHA"
COMMIT_MESSAGE="${COMMIT_MESSAGE/ORIGIN_COMMIT/$ORIGIN_COMMIT}"
COMMIT_MESSAGE="${COMMIT_MESSAGE/\$GITHUB_REF/$GITHUB_REF}"

echo "git add:"
git add .

echo "git status:"
git status

echo "git diff-index:"
# git diff-index: to avoid git commit from failing if there are no changes to commit
git diff-index --quiet HEAD || git commit --message "$COMMIT_MESSAGE"

echo "git pull --rebase"
# git pull --rebase: to avoid git push from failing if there are new commits in the destination branch from other sources
git pull --rebase

echo "git push origin:"
# -u: sets de branch when pushing to a branch that does not exist
git push "https://$USER_NAME:$API_TOKEN_GITHUB@github.com/$DESTINATION_REPOSITORY_USERNAME/$DESTINATION_REPOSITORY_NAME.git" -u "$TARGET_BRANCH"