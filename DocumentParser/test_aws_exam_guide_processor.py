import unittest
from SitemapCrawler.DocumentParser.aws_exam_guide_processor import (
    is_list_item,
    is_list_item_continuation,
    is_new_sentence_or_paragraph,
    process_sentence,
    process_list_item,
    process_paragraph,
    handle_empty_line,
    handle_list_item,
    handle_list_item_continuation,
    handle_regular_text,
    process_exam_guide
)

class TestAwsExamGuideProcessor(unittest.TestCase):

    def test_is_list_item(self):
        self.assertEqual(is_list_item("• This is a bullet point"), ("bullet", "This is a bullet point"))
        self.assertEqual(is_list_item("1. This is a numbered item"), ("number", "This is a numbered item"))
        self.assertIsNone(is_list_item("This is not a list item"))

    def test_is_list_item_continuation(self):
        self.assertTrue(is_list_item_continuation("• Start of list item", "continuation of list item"))
        self.assertFalse(is_list_item_continuation("• Start of list item", "• New list item"))
        self.assertFalse(is_list_item_continuation("Not a list item", "Also not a list item"))

    def test_is_new_sentence_or_paragraph(self):
        self.assertTrue(is_new_sentence_or_paragraph("End of a sentence.", "Start of a new sentence."))
        self.assertFalse(is_new_sentence_or_paragraph("Not the end", "of a sentence"))
        self.assertTrue(is_new_sentence_or_paragraph("", "Start of a new paragraph"))

    def test_process_sentence(self):
        self.assertEqual(process_sentence("This is a test sentence."), {"sentence": "This is a test sentence."})

    def test_process_list_item(self):
        self.assertEqual(process_list_item("bullet", "Test bullet point"), {"type": "bullet", "content": "Test bullet point"})

    def test_process_paragraph(self):
        content = [{"sentence": "Test sentence."}, {"list": [{"type": "bullet", "content": "Test bullet"}]}]
        expected = {"paragraph": [{"content": content}]}
        self.assertEqual(process_paragraph(content), expected)

    def test_handle_empty_line(self):
        current_paragraph_content = [{"sentence": "Test sentence."}]
        current_list = [{"type": "bullet", "content": "Test bullet"}]
        processed_data = []
        current_sentence = "Unprocessed sentence."

        new_paragraph_content, new_list, new_sentence = handle_empty_line(
            current_paragraph_content, current_list, processed_data, current_sentence
        )

        self.assertEqual(new_paragraph_content, [])
        self.assertEqual(new_list, [])
        self.assertEqual(new_sentence, "")
        self.assertEqual(len(processed_data), 1)
        self.assertEqual(processed_data[0]["paragraph"][0]["content"], [
            {"sentence": "Test sentence."},
            {"sentence": "Unprocessed sentence."},
            {"list": [{"type": "bullet", "content": "Test bullet"}]}
        ])

    def test_handle_list_item(self):
        line = "• New bullet point"
        current_sentence = "Previous sentence."
        current_list_item = {"type": "bullet", "content": "Old bullet point"}
        current_paragraph_content = []
        current_list = []

        new_sentence, new_list_item, new_paragraph_content, new_list = handle_list_item(
            line, current_sentence, current_list_item, current_paragraph_content, current_list
        )

        self.assertEqual(new_sentence, "")
        self.assertEqual(new_list_item, {"type": "bullet", "content": "New bullet point"})
        self.assertEqual(new_paragraph_content, [{"sentence": "Previous sentence."}])
        self.assertEqual(new_list, [{"type": "bullet", "content": "Old bullet point"}])

    def test_handle_list_item_continuation(self):
        line = "continuation of bullet point"
        current_list_item = {"type": "bullet", "content": "Start of bullet point"}

        new_list_item = handle_list_item_continuation(line, current_list_item)

        self.assertEqual(new_list_item, {"type": "bullet", "content": "Start of bullet point continuation of bullet point"})

    def test_handle_regular_text(self):
        line = "New sentence."
        previous_line = "End of previous sentence."
        current_sentence = "Current sentence."
        current_list_item = {"type": "bullet", "content": "Bullet point"}
        current_list = []
        current_paragraph_content = []

        new_sentence, new_list_item, new_list, new_paragraph_content = handle_regular_text(
            line, previous_line, current_sentence, current_list_item, current_list, current_paragraph_content
        )

        self.assertEqual(new_sentence, "New sentence.")
        self.assertIsNone(new_list_item)
        self.assertEqual(new_list, [])
        self.assertEqual(new_paragraph_content, [
            {"sentence": "Current sentence."},
            {"list": [{"type": "bullet", "content": "Bullet point"}]}
        ])

    def test_process_exam_guide(self):
        input_text = """This is a paragraph.
This is part of the same paragraph.

• This is a list item
that continues on the next line.
• This is another list item.

This is a new paragraph."""

        expected_output = [
            {
                "paragraph": [
                    {
                        "content": [
                            {"sentence": "This is a paragraph. This is part of the same paragraph."}
                        ]
                    }
                ]
            },
            {
                "paragraph": [
                    {
                        "content": [
                            {
                                "list": [
                                    {"type": "bullet", "content": "This is a list item that continues on the next line."},
                                    {"type": "bullet", "content": "This is another list item."}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "paragraph": [
                    {
                        "content": [
                            {"sentence": "This is a new paragraph."}
                        ]
                    }
                ]
            }
        ]

        self.assertEqual(process_exam_guide(input_text), expected_output)

if __name__ == '__main__':
    unittest.main()