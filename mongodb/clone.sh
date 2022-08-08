mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=cats --out=./opt/cats.json
# mongoimport -u root -p example --authenticationDatabase admin \
#     --db=test_indexed --collection=indexed_cats --file=cats.json

mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=breeders --out=./opt/breeders.json
# mongoimport -u root -p example --authenticationDatabase admin \
#     --db=test_indexed --collection=indexed_breeders --file=breeders.json

mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=owners --out=./opt/owners.json
# mongoimport -u root -p example --authenticationDatabase admin \
#     --db=test_indexed --collection=indexed_owners --file=owners.json
