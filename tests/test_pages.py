from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import unittest

ROOT = Path(__file__).resolve().parents[1]

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.tags=[]; self.links=[]; self.viewport=False; self.ids=[]
    def handle_starttag(self, tag, attrs):
        self.tags.append(tag); attributes=dict(attrs)
        if 'id' in attributes: self.ids.append(attributes['id'])
        if tag == 'meta' and attributes.get('name') == 'viewport': self.viewport=True
        for key in ['href','src']:
            if key in attributes: self.links.append(attributes[key])

class PagesTest(unittest.TestCase):
    def test_pages_and_links(self):
        for path in ROOT.glob('*.html'):
            with self.subTest(page=path.name):
                parser=Parser(); text=path.read_text(); parser.feed(text)
                self.assertTrue(text.lower().startswith('<!doctype html>'))
                for tag in ['html','head','body','title']:
                    self.assertEqual(parser.tags.count(tag),1,(path.name,tag))
                self.assertTrue(parser.viewport)
                self.assertEqual(len(parser.ids),len(set(parser.ids)))
                for link in parser.links:
                    url=urlsplit(link)
                    if not url.scheme and not url.netloc and url.path:
                        self.assertTrue((path.parent/url.path).is_file(),link)

if __name__ == '__main__': unittest.main()
