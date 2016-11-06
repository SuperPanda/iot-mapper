#!/usr/bin/env python
import os
import zipfile
# Code based on: http://stackoverflow.com/questions/1855095/how-to-create-a-zip-archive-of-a-directoryhttp://stackoverflow.com/questions/1855095/how-to-create-a-zip-archive-of-a-directory
def zipdir(path, ziph, ignoreParentPathLength):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            filePathName = os.path.join(root, file)
            ziph.write(filePathName,filePathName[ignoreParentPathLength:])
            #ziph.write(os.path.join(file, os.path.relpath(file,root))

if __name__ == '__main__':
    for currentDirectoryName, functionDirectories, files in os.walk('.'):
        for functionDirectory in functionDirectories:
            # Each folder to be zipped are in this directory...
            # Therefore don't zip subdirectories on walk 
            # (ie. count '/' in './path/subpath/file')
            if os.path.join(currentDirectoryName,functionDirectory).count(os.path.sep) == 1:
              zipf = zipfile.ZipFile(functionDirectory+'.zip', 'w', zipfile.ZIP_DEFLATED)
              targetDirectory = functionDirectory+'/'
              zipdir(targetDirectory, zipf, len(targetDirectory))
              zipf.close()
