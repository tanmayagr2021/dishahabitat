#!/bin/sh
# Downloads the OpenStreetMap data the atlas is drawn from (© OpenStreetMap contributors, ODbL).
# Usage: sh scripts/fetch-osm.sh <cache-dir>     then: python3 scripts/build-atlas.py <cache-dir> .
set -e
DIR="${1:-.osm-cache}"; mkdir -p "$DIR"
API=https://overpass-api.de/api/interpreter
UA="DishaHabitatAtlas/0.1"
BBOX="12.86,77.55,13.11,77.87"
get() { curl -s -m 300 -A "$UA" "$API" --data-urlencode "data=$2" -o "$DIR/$1"; head -c 1 "$DIR/$1" | grep -q '{' || { echo "Overpass busy for $1; retry later"; exit 1; }; }
get roads.json "[out:json][timeout:180];(way[\"highway\"~\"^(motorway|motorway_link|trunk|trunk_link|primary|primary_link|secondary|secondary_link|tertiary|tertiary_link|residential|unclassified|living_street)$\"]($BBOX););out geom qt;"
get water.json "[out:json][timeout:180];(way[\"natural\"=\"water\"]($BBOX);relation[\"natural\"=\"water\"]($BBOX);way[\"railway\"~\"^(rail|subway|light_rail)$\"]($BBOX);way[\"leisure\"=\"park\"]($BBOX););out geom qt;"
get places.json "[out:json][timeout:90];(node[\"place\"~\"^(suburb|neighbourhood|village|town|quarter|hamlet)$\"]($BBOX););out;"
get plots.json "[out:json][timeout:60];(way(702716215);way(768730167);way(773145599);way(1186548889);way(1190134154););out tags geom;"
get buildings.json "[out:json][timeout:180];(way[\"building\"](around:1700,12.9372,77.7129);way[\"building\"](around:1700,12.9391,77.7226);way[\"building\"](around:1700,12.9741,77.7571);way[\"building\"](around:2100,12.9205,77.7548);way[\"building\"](around:1700,13.0666,77.7366););out geom qt;"
echo "Saved to $DIR"
