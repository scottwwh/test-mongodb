mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=cats --out=cats.json
mongoimport -u root -p example --authenticationDatabase admin \
    --db=test_indexed --collection=cats_indexed --file=cats.json

mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=breeders --out=breeders.json
mongoimport -u root -p example --authenticationDatabase admin \
    --db=test_indexed --collection=breeders_indexed --file=breeders.json

mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=owners --out=owners.json
mongoimport -u root -p example --authenticationDatabase admin \
    --db=test_indexed --collection=owners_indexed --file=owners.json
