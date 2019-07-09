import os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.system("rm -rf ../public_html/sprout/*")

if not os.path.isdir("../public_html/sprout"):
    os.system("mkdir ../public_html/sprout")

if not os.path.isdir("../public_html/sprout/backend"):
    os.system("mkdir ../public_html/sprout/backend")
    os.system("mkdir ../public_html/sprout/backend/node_modules")

os.system("git pull")

def buildFrontEnd():
    os.chdir("./Front End")
    os.system("npm install")
    os.system("npm run build")
    os.chdir("../")
    os.system("cp -r ./Front\ End/build/* ../public_html/sprout/")

def buildBackEnd(): 
    os.chdir("./Back End")
    os.system("npm install")
    os.chdir("../")
    os.system("cp -r ./Back\ End/* ../public_html/sprout/backend/")
    os.system("cp -r ./Back\ End/node_modules/* ../public_html/sprout/backend/node_modules/")
    os.system("pm2 restart sprout-backend")

if "-f" or "--front-end" in sys.argv:
    buildFrontEnd()
elif len(sys.argv) is 1:
    buildFrontEnd()

if "-b" or "--back-end" in sys.argv:
    buildBackEnd()
elif len(sys.argv) is 1:
    buildBackEnd()
