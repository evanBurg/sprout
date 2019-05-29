import requests
import json

blantcollection = []
reqstr = "https://trefle.io/api/plants?page_size=30000&token=R0dGTXdVcng3Nk9DRk5DdlRrWWNNdz09&page={}"
pagenum = 1

while True:
    r = requests.get(reqstr.format(pagenum))
    pagenum += 1
    blantcollection += r.json()
    if len(r.json()) < 30:
        break

with open("blantybois.json", "w") as plantfile:
    json.dump(blantcollection, plantfile)
