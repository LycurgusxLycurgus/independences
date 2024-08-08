#!/bin/bash

# File to save the tree
OUTPUT_FILE="./context_llm/file_tree.txt"

# Directories to include (adjust as needed)
INCLUDE_DIRS=("src" "public" "context_llm" ".")

# Relevant file extensions and filenames
FILE_EXTENSIONS=("ts" "tsx" "json" "svg" "ico" "css" "local" "sh" "txt" "ts" "mjs" "md")
SPECIAL_FILES=("package.json" "tsconfig.json")

# Function to check if a filename matches relevant criteria
function is_relevant {
    local filename=$1
    for ext in "${FILE_EXTENSIONS[@]}"; do
        if [[ $filename == *.$ext ]]; then
            return 0
        fi
    done
    for special in "${SPECIAL_FILES[@]}"; do
        if [[ $filename == $special ]]; then
            return 0
        fi
    done
    return 1
}

# Generate file tree and save to output file
echo "Project File Tree" > $OUTPUT_FILE
for dir in "${INCLUDE_DIRS[@]}"; do
    echo "$dir/" >> $OUTPUT_FILE
    find $dir \( -path "./node_modules" -prune \) -o -type f | while read file; do
        filename=$(basename "$file")
        if is_relevant "$filename"; then
            echo "  $file" >> $OUTPUT_FILE
        fi
    done
done

echo "File tree saved to $OUTPUT_FILE"