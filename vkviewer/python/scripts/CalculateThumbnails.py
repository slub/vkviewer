'''
Created on Jul 28, 2014

@author: mendt
'''
import os, subprocess

SOURCE_DIR = '/srv/vk/data_archiv/mtb_data/'
TARGET_DIR = '/srv/vk/data_archiv/tms_cache/thumbs/messtischblaetter'

if __name__ == '__main__':
    directory_content = os.listdir(SOURCE_DIR)
    for file in directory_content:
        sourceFile = os.path.join(SOURCE_DIR, file)
        targetFile = os.path.join(TARGET_DIR, os.path.basename(file).split('.')[0] + '.jpg')
        command = 'convert %s -resize 85x85 %s'%(sourceFile, targetFile)
        try:
            print command
            subprocess.check_call(command, shell = True)
        except:
            pass   
    
#     t = os.listdir(TARGET_DIR)
#     for file in t:
#         print os.path.basename(file).split('.')[0]
#         os.rename(os.path.join(TARGET_DIR, file), os.path.join(TARGET_DIR,os.path.basename(file).split('.')[0] + '.jpg'))