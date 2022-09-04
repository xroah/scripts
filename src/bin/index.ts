#!/usr/bin/env node

import fs from "fs"
import path from "path"
import yargs from "yargs"

/**
 * https://nodejs.org/api/esm.html#mandatory-file-extensions
 * A file extension must be provided when using the import keyword to
 * resolve relative or absolute specifiers. 
 * Directory indexes (e.g. './startup/index.js') must also be fully specified.
 * This behavior matches how import behaves in browser environments, 
 * assuming a typically configured server.
 * 
 * Just import {HelloWorld} from "./HelloWorld.js"; TypeScript is clever enough to
 * figure out what you want is HelloWorld.ts during compilation.
 */
import { NAME } from "../utils/constants.js"


yargs
    .scriptName(NAME)
    .version()