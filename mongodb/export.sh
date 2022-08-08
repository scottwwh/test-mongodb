
mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=cats --out=./opt/cats.json

mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=breeders --out=./opt/breeders.json

mongoexport -u root -p example --authenticationDatabase admin --jsonFormat=canonical \
    --db=test --collection=owners --out=./opt/owners.json
