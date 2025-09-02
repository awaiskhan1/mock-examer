#!/usr/bin/env python3
import json
import sys

def clean_json_file(input_file, output_file):
    """Remove questions with empty options from JSON file"""
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Filter out questions with empty options
        cleaned_questions = []
        removed_count = 0
        
        for question in data:
            # Check if options exist and are not empty
            if 'options' in question:
                # Check if any option is just a letter followed by period and space
                has_empty_options = any(
                    option.strip() in ['A.', 'B.', 'C.', 'D.'] or 
                    option.strip().endswith('. ') and len(option.strip()) <= 3
                    for option in question['options']
                )
                
                if not has_empty_options:
                    cleaned_questions.append(question)
                else:
                    removed_count += 1
                    print(f"Removed question {question.get('question_number', 'unknown')}: empty options")
            else:
                cleaned_questions.append(question)
        
        # Write cleaned data
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(cleaned_questions, f, indent=2, ensure_ascii=False)
        
        print(f"Cleaning complete. Removed {removed_count} questions with empty options.")
        print(f"Original: {len(data)} questions, Cleaned: {len(cleaned_questions)} questions")
        
    except Exception as e:
        print(f"Error cleaning JSON file: {e}")
        return False
    
    return True

if __name__ == "__main__":
    input_file = "/Users/awaiskhan/work/personal/aws-tester/examJSOFILEEXAMPLE/aws_questions_part_latest.json"
    output_file = "/Users/awaiskhan/work/personal/aws-tester/examJSOFILEEXAMPLE/aws_questions_part_latest_cleaned.json"
    
    if clean_json_file(input_file, output_file):
        print(f"Cleaned file saved as: {output_file}")
    else:
        print("Failed to clean the file")
        sys.exit(1)