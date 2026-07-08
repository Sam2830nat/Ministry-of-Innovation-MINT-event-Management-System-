import os
import re

# We will apply regex replacements to avoid breaking partial words unnecessarily, 
# but some string replacements are fine.
REPLACEMENTS = {
    # Roles and Emails
    "GUEST": "GUEST",
    "guest@mint.gov.et": "guest@mint.gov.et",
    "guest2@mint.gov.et": "guest2@mint.gov.et",
    "guest3@mint.gov.et": "guest3@mint.gov.et",
    "mint.gov.et": "mint.gov.et",
    "nationalId": "nationalId",
    "national_id": "national_id",
    
    # Capitalized terminology
    "Ministry Guest": "Ministry Guest",
    "Guests": "Guests",
    "Guest": "Guest",
    "guest": "guest",
    
    "Ministry Official": "Ministry Official",
    "Official": "Official",
    "Director": "Director",
    
    "System Administrator": "System Admin",
    "System Administrator": "System Administrator",
    "Ministry": "Ministry",
    "ministry": "ministry",
    
    # Specific MInT events (replacing some MInT specific things)
    "MInT Hackathon 2026": "MInT Hackathon 2026",
    "IEEE Ethiopia": "IEEE Ethiopia",
    "MInT": "MInT"
}

IGNORE_DIRS = {".git", "node_modules", ".next", "dist", "build", "venv", "__pycache__", ".vscode", "playwright-report", "test-results", "migrations"}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for old, new in REPLACEMENTS.items():
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        pass # Skip binaries or unreadable files

def main():
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            filepath = os.path.join(root, file)
            if not file.endswith(('.png', '.jpg', '.jpeg', '.zip', '.pdf', '.woff', '.woff2', '.ttf')):
                replace_in_file(filepath)

if __name__ == "__main__":
    main()
