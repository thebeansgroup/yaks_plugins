BIN = ./node_modules/.bin
SRC = $(wildcard src/*.js.coffee)
LIB = $(SRC:src/%.coffee=lib/%.js)

build:
	@grunt bundle
    
test:
	npm test

docs:
	@$(BIN)/codo

install link: @npm $@
    
release-patch:  build test docs
	@$(call release,patch)

release-minor:  build test docs
	@$(call release,minor)

release-major:  build test docs
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	npm publish

define release
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
  node -e "\
  	var j = require('./package.json');\
  	j.version = \"$$NEXT_VERSION\";\
  	var s = JSON.stringify(j, null, 2);\
  	require('fs').writeFileSync('./package.json', s);" && \
  git commit -m "release $$NEXT_VERSION" -- package.json && \
  git tag "$$NEXT_VERSION" -m "release $$NEXT_VERSION"
endef
