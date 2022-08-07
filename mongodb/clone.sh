mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=cats --out=cats.json
mongoimport -u root -p example --authenticationDatabase admin \
    --db=test_indexed --collection=indexed_cats --file=cats.json

mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=breeders --out=breeders.json
mongoimport -u root -p example --authenticationDatabase admin \
    --db=test_indexed --collection=indexed_breeders --file=breeders.json

mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=owners --out=owners.json
mongoimport -u root -p example --authenticationDatabase admin \
    --db=test_indexed --collection=indexed_owners --file=owners.json
