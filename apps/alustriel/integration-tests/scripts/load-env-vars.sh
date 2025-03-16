#!/bin/bash

#
# Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
#

# To work correctly, this file should be `source`d instead of executed.

export NODE_ENV="integration-test"

# shellcheck disable=SC2046
export $(sed -e '/^\s*#/d' -e 's/\s*#.*$//' ../../.env | xargs)
