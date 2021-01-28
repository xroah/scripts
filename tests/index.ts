import path from "path"
import Jasmine from "jasmine"

const jasmine = new Jasmine({})

jasmine.loadConfigFile(path.join(__dirname, "../jasmine.json"))
jasmine.execute()
