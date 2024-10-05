import json
import re
import logging
from typing import Dict, List, Union, Any, Tuple

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def is_list_item(line: str) -> Union[Tuple[str, str], None]:
    bullet_match = re.match(r'^(•|●|■)\s*(.*)', line.strip())
    number_match = re.match(r'^(\d+\.)\s*(.*)', line.strip())
    if bullet_match:
        return ("bullet", bullet_match.group(2))
    if number_match:
        return ("number", number_match.group(2))
    return None

def is_list_item_continuation(previous_line: str, current_line: str) -> bool:
    return bool(is_list_item(previous_line)) and not is_list_item(current_line) and not current_line[0].isupper()

def is_new_sentence_or_paragraph(previous_line: str, current_line: str) -> bool:
    if not previous_line.strip():
        return True
    if current_line[0].isupper() and previous_line.strip()[-1] in '.!?':
        return True
    return False

def process_sentence(sentence: str) -> Dict[str, str]:
    return {"sentence": sentence.strip()}

def process_list_item(item_type: str, content: str) -> Dict[str, str]:
    return {"type": item_type, "content": content.strip()}

def process_paragraph(content: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    return {"paragraph": [{"content": content}]}

def handle_empty_line(current_paragraph_content: List[Dict[str, Any]], current_list: List[Dict[str, str]], 
                      processed_data: List[Dict[str, Any]], current_sentence: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, str]], str]:
    if current_paragraph_content or current_list or current_sentence:
        if current_sentence:
            current_paragraph_content.append(process_sentence(current_sentence))
        if current_list:
            current_paragraph_content.append({"list": current_list})
        processed_data.append(process_paragraph(current_paragraph_content))
    return [], [], ""

def handle_list_item(line: str, current_sentence: str, current_list_item: Dict[str, str], 
                     current_paragraph_content: List[Dict[str, Any]], current_list: List[Dict[str, str]]) -> Tuple[str, Dict[str, str], List[Dict[str, Any]], List[Dict[str, str]]]:
    list_item = is_list_item(line)
    if current_sentence:
        current_paragraph_content.append(process_sentence(current_sentence))
        current_sentence = ""
    if current_list_item:
        current_list.append(current_list_item)
    current_list_item = process_list_item(list_item[0], list_item[1])
    return current_sentence, current_list_item, current_paragraph_content, current_list

def handle_list_item_continuation(line: str, current_list_item: Dict[str, str]) -> Dict[str, str]:
    current_list_item["content"] += " " + line
    return current_list_item

def handle_regular_text(line: str, previous_line: str, current_sentence: str, 
                        current_list_item: Dict[str, str], current_list: List[Dict[str, str]], 
                        current_paragraph_content: List[Dict[str, Any]]) -> Tuple[str, Dict[str, str], List[Dict[str, str]], List[Dict[str, Any]]]:
    if current_list_item:
        current_list.append(current_list_item)
        current_list_item = None
    if current_list:
        current_paragraph_content.append({"list": current_list})
        current_list = []
    
    if is_new_sentence_or_paragraph(previous_line, line):
        if current_sentence:
            current_paragraph_content.append(process_sentence(current_sentence))
        current_sentence = line
    else:
        current_sentence += " " + line
    
    return current_sentence, current_list_item, current_list, current_paragraph_content

def process_exam_guide(input_text: str) -> List[Dict[str, Any]]:
    processed_data = []
    lines = input_text.split('\n')
    current_paragraph_content = []
    current_list = []
    current_sentence = ""
    current_list_item = None
    previous_line = ""

    for line in lines:
        line = line.strip()
        if not line:
            current_paragraph_content, current_list, current_sentence = handle_empty_line(
                current_paragraph_content, current_list, processed_data, current_sentence
            )
            current_list_item = None
            previous_line = ""
        elif is_list_item(line):
            current_sentence, current_list_item, current_paragraph_content, current_list = handle_list_item(
                line, current_sentence, current_list_item, current_paragraph_content, current_list
            )
        elif is_list_item_continuation(previous_line, line):
            current_list_item = handle_list_item_continuation(line, current_list_item)
        else:
            current_sentence, current_list_item, current_list, current_paragraph_content = handle_regular_text(
                line, previous_line, current_sentence, current_list_item, current_list, current_paragraph_content
            )
        
        previous_line = line

    # Handle any remaining content
    if current_sentence or current_list_item or current_list or current_paragraph_content:
        current_paragraph_content, current_list, _ = handle_empty_line(
            current_paragraph_content, current_list, processed_data, current_sentence
        )

    return processed_data

def main():
    input_file = 'AWS Certified Data Engineer Associate exam guide.txt'
    output_file = 'processed_aws_certified_data_engineer_associate_exam_guide.json'

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            input_text = f.read()
        
        logging.info(f"Successfully read input file: {input_file}")

        processed_data = process_exam_guide(input_text)
        
        logging.info("Successfully processed the exam guide")

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, indent=2, ensure_ascii=False)
        
        logging.info(f"Successfully wrote processed data to: {output_file}")

    except FileNotFoundError as e:
        logging.error(f"File not found: {e.filename}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    main()