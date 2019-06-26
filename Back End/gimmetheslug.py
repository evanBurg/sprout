import requests
import json

blantcollection = []
reqstr = "https://trefle.io/api/plants?page_size=30000&token=R0dGTXdVcng3Nk9DRk5DdlRrWWNNdz09&page={}"
pagenum = 1

# Keep retrieving pages of plant info, and add it to blantcollection until there are no more pages
while True:
    r = requests.get(reqstr.format(pagenum))
    pagenum += 1
    blantcollection += r.json()
    if len(r.json()) < 30:
        break

# Database setup to push plant data
from pymongo import MongoClient

client = MongoClient()
client = MongoClient("mongodb://localhost:27017/")
db = client.sprout  # retrieve database
rwd_table = db.raw_plant_data  # retrieve collection/table

for plant in blantcollection:
    post_id = rwd_table.insert_one(plant).inserted_id
