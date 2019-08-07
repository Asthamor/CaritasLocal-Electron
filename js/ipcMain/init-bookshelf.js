/* jshint esversion: 8*/
"use strict";
const path = require("path");

const dbConfig = {
    client: "sqlite3",
    connection: {
        filename: path.join(__dirname, "../../caritas.db")
    },
    useNullAsDefault: true
};

var knex = require("knex")(dbConfig);

var bookshelf = require("bookshelf")(knex);

bookshelf.plugin('registry');

module.exports = bookshelf;