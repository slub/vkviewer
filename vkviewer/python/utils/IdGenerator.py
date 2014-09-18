from vkviewer.python.utils.exceptions import ParsingException

OAI_PATTERN = 'oai:de:slub-dresden:vk'
OCCURRENCE_COLON = 5

def is_number_tryexcept(s):
    """ Returns True is string is a number. """
    try:
        float(s)
        return True
    except ValueError:
        return False
    
def createOAI(id, type=None):
    """
        id {Integer|String} The database identifier of the described object.
        type {String{"id"|"set"}=} If the object is a "id" or a "set". "id" is the default value.
        return {String}
    """
    if type is None or type != 'set':
        type = 'id'
    return "%s:%s-%s"%(OAI_PATTERN, type, id)

def parseOAI(oai):
    """
        oai {String} OAI of type 'oai:de:slub-dresden:vk:id-70000001'
        return {Integer|String}
    """
    # do a small validation
    splitted_oai = str(oai).split(':')
    oai_pattern = oai[0:len(OAI_PATTERN)]
    if len(splitted_oai) != OCCURRENCE_COLON or oai_pattern != OAI_PATTERN:
        raise ParsingException('The given OAI is not valide conforming to the VK rules.')
    
    # parse the oai
    oai = str(splitted_oai[-1]).split('-')[1]
    if is_number_tryexcept(oai):
        return int(oai)
    else:
        raise ParsingException('The given OAI is not valide conforming to the VK rules. The parsed id is not an Integer.')