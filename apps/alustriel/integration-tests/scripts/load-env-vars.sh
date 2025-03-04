#!/bin/bash

#
# Copyright 2023-2024 Phillip Gates-Shannon. All rights reserved.
#

# To work correctly, this file should be `source`d instead of executed.

export NODE_ENV="integration-test"

# shellcheck disable=SC2046
export $(sed -e '/^\s*#/d' -e 's/\s*#.*$//' ../.env | xargs)
