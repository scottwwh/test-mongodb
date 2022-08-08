
mongoimport -u root -p example --authenticationDatabase admin \
    --db=test --collection=cats --file=./opt/cats.json

mongoimport -u root -p example --authenticationDatabase admin \
    --db=test --collection=breeders --file=./opt/breeders.json

mongoimport -u root -p example --authenticationDatabase admin \
    --db=test --collection=owners --file=./opt/owners.json
