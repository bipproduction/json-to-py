#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const _ = require("lodash");
const jsonToTypeDict = require("./src/jsonToTypeDict");

yargs
    .command(
        "start",
        "Generate Python classes from JSON",
        yargs => {
            yargs.options({
                "json": {
                    alias: "j",
                    demandOption: true,
                    type: "string",
                    description: "Path to JSON file"
                },
                "name": {
                    alias: "n",
                    default: "RootInterface",
                    type: "string",
                    description: "Name of the class"
                },
                "output": {
                    alias: "o",
                    default: "output.py",
                    type: "string",
                    description: "Path to output file"
                }
            });
        },
        argv => {
            const json = JSON.parse(fs.readFileSync(argv.json, "utf8"));
            const text_string = jsonToTypeDict(json, argv.name);
            const fileName = argv.output.includes(".py") ? argv.output : argv.output + ".py";
            fs.writeFileSync(fileName, text_string);
            console.log("Done writing to " + fileName);
        }
    )
    .demandCommand(1)
    .recommendCommands()
    .help()
    .version()
    .parse(process.argv.slice(2));