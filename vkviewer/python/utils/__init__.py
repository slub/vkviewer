
def fileToString(file):
    with open(file, 'r') as myFile:
        data = myFile.read().replace('\n', '')
        return data
    