import unittest
from main import parse_xml_sitemap
import pandas as pd

class TestParseXmlSitemap(unittest.TestCase):
    def setUp(self):
        self.sample_xml = '''<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>https://www.example.com/page1</loc>
                <lastmod>2023-05-01</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.8</priority>
            </url>
            <url>
                <loc>https://www.example.com/page2</loc>
                <lastmod>2023-05-02</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.6</priority>
            </url>
        </urlset>
        '''

    def test_parse_xml_sitemap(self):
        result = parse_xml_sitemap(self.sample_xml, "https://www.example.com/sitemap.xml")
        
        # Check if the result is a DataFrame
        self.assertIsInstance(result, pd.DataFrame)
        
        # Check if the DataFrame has the correct number of rows
        self.assertEqual(len(result), 2)
        
        # Check if all expected columns are present
        expected_columns = ['xmlns', 'sitemap_type', 'loc', 'lastmod', 'changefreq', 'priority']
        for col in expected_columns:
            self.assertIn(col, result.columns)
        
        # Check if the xmlns attribute is correctly extracted
        self.assertEqual(result['xmlns'].iloc[0], "http://www.sitemaps.org/schemas/sitemap/0.9")
        
        # Check if the sitemap_type is correct
        self.assertEqual(result['sitemap_type'].iloc[0], "XML")
        
        # Check if the loc values are correct
        self.assertEqual(result['loc'].iloc[0], "https://www.example.com/page1")
        self.assertEqual(result['loc'].iloc[1], "https://www.example.com/page2")
        
        # Check if the lastmod values are correct
        self.assertEqual(result['lastmod'].iloc[0], "2023-05-01")
        self.assertEqual(result['lastmod'].iloc[1], "2023-05-02")
        
        # Check if the changefreq values are correct
        self.assertEqual(result['changefreq'].iloc[0], "daily")
        self.assertEqual(result['changefreq'].iloc[1], "weekly")
        
        # Check if the priority values are correct
        self.assertEqual(result['priority'].iloc[0], "0.8")
        self.assertEqual(result['priority'].iloc[1], "0.6")

    def test_parse_xml_sitemap_invalid_xml(self):
        invalid_xml = "<invalid>This is not valid XML</invalid>"
        result = parse_xml_sitemap(invalid_xml, "https://www.example.com/sitemap.xml")
        
        # Check if the result is an empty DataFrame for invalid XML
        self.assertIsInstance(result, pd.DataFrame)
        self.assertTrue(result.empty)

if __name__ == '__main__':
    unittest.main()