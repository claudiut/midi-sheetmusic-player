#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

cd $DIR && meteor-build-client ../../../CLIENT-ONLY-BUILDS/midi-sheetmusic-player/app  -s ./settings.json -p "" -t ../../../CLIENT-ONLY-BUILDS/midi-sheetmusic-player/template.html
