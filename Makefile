schema.json:
	./node_modules/.bin/apollo-codegen introspect-schema https://api.graph.cool/simple/v1/$(REACT_APP_SERVICE_ID) --output schema.json

gql.js: src/components/*.js schema.json
	./node_modules/.bin/apollo-codegen generate src/**/*.js --schema schema.json --target flow --output src/gql.js

.DEFAULT_GOAL := gql.js
