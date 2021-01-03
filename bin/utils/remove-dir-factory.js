const rimraf = require("rimraf")

module.exports = function removeDirFactory(appDir) {
    let dirCleaning = false // in case clean dir repetitively

    return function removeAppDir() {
        if (dirCleaning) {
            return
        }

        dirCleaning = true
        
        //may cause error on windows:
        //Error: EBUSY: resource busy or locked
        try {
            rimraf.sync(appDir, {maxBusyTries: 10})
        } catch (error) {
            // do nothing
        }
    }
}