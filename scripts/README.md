# Mapanet converter

Convert mapanet JSON dataset to the JSON format we use in Uitdatabank frontend

## The Mapanet file

Drop the `GEO-XX-5-STD.(geo)json` file into the `scripts` directory. Be sure to save the file under encoding `UTF-8`. The file will be probably be in `UTF-8 with BOM`.

## Run the script

```shell
node convert-mapanet-to-udb.mjs INPUT_FILE_NAME OUTPUT_FILE_NAME
```

e.g.

```shell
node convert-mapanet-to-udb.mjs GEO-NL-5-STD.json citiesNL.json
```
