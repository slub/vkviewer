import unittest
 
from vkviewer.python.utils.IdGenerator import createOAI, parseOAI
from vkviewer.python.utils.exceptions import ParsingException
 
class TestIdGenerator(unittest.TestCase):
     
    def test_createOAI(self):
        # simple test id
        result_id = createOAI(70000001, 'id')
        self.assertEqual(result_id, 'oai:de:slub-dresden:vk:id-70000001', 'Response - %s - is not like expected.'%result_id)
         
        # simple test set
        result_set = createOAI(70000001, 'set')
        self.assertEqual(result_set, 'oai:de:slub-dresden:vk:set-70000001', 'Response - %s - is not like expected.'%result_set)
         
        # komplex test id 1
        result_id1 = createOAI(70000001)
        self.assertEqual(result_id1, 'oai:de:slub-dresden:vk:id-70000001', 'Response - %s - is not like expected.'%result_id1)
        
        # komplex test id 2
        result_id2 = createOAI(70000001, 'se')
        self.assertEqual(result_id2, 'oai:de:slub-dresden:vk:id-70000001', 'Response - %s - is not like expected.'%result_id2)
        
    def test_parseOAI(self):
        # simple parsing of id
        result_id = parseOAI('oai:de:slub-dresden:vk:id-70000001')
        self.assertEqual(result_id, 70000001, 'Response - %s - is not like expected.'%result_id)
        
        # simple parsing of set
        result_set = parseOAI('oai:de:slub-dresden:vk:set-70000001')
        self.assertEqual(result_set, 70000001, 'Response - %s - is not like expected.'%result_set)
        
        # test correct assert behavior
        self.assertRaises(ParsingException, parseOAI, 'oai:de:slub-dresden:vk:id-70000001z')
        self.assertRaises(ParsingException, parseOAI, 'oai:de:slub-dresden:id-70000001')
        self.assertRaises(ParsingException, parseOAI, 'oai:de:slub-dresden:vk:iqd-10000003')
