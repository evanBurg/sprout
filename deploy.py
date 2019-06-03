import os, shutil

def removeFolderContents(folder):
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(e)

def copyFolderContents(source, dest):
    for the_file in os.listdir(source):
        file_path = os.path.join(source, the_file)
        try:
            if os.path.isfile(file_path):
                shutil.copy(file_path, dest)
        except Exception as e:
            print(e)


os.chdir(os.path.dirname(os.path.abspath(__file__)))

os.system("git pull")

os.chdir("./Front End")
os.system("npm install")
os.system("npm run build")

removeFolderContents("../../www/sprout/")
copyFolderContents("./build", "../../www/sprout/")

os.chdir("../Back End")
os.system("npm install")
os.system("fuser -k 6969/tcp")
removeFolderContents("../../www/sprout/backend/")
copyFolderContents("./", "../../www/sprout/backend/")