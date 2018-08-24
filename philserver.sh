#!/bin/bash

rsync -vrc * phildo@phildogames.com:/var/www/html/phildogames/scratch/usda --exclude-from rsync-exclude

