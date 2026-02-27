#!/usr/bin/env bash
# scripts/aws-unset-iam-session.sh
# Usage: ./scripts/aws-unset-iam-session.sh
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
echo "Assumed role unset, identity is now:"
aws sts get-caller-identity
