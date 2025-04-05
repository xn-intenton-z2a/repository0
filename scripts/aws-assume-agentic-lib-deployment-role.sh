#!/usr/bin/env bash
# scripts/aws-assume-agentic-lib-deployment-role.sh
# Usage: . ./scripts/aws-assume-agentic-lib-deployment-role.sh
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
roleArn="arn:aws:iam::541134664601:role/agentic-lib-deployment-role"
sessionName="agentic-lib-deployment-session-local"
assumeRoleOutput=$(aws sts assume-role --role-arn "${roleArn?}" --role-session-name "${sessionName?}" --output json)
if [ $? -ne 0 ]; then
  echo "Error: Failed to assume role."
  exit 1
fi
export AWS_ACCESS_KEY_ID=$(echo "${assumeRoleOutput?}" | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "${assumeRoleOutput?}" | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "${assumeRoleOutput?}" | jq -r '.Credentials.SessionToken')
expirationTimestamp=$(echo "${assumeRoleOutput?}" | jq -r '.Credentials.Expiration')
echo "Assumed ${roleArn?} successfully, expires: ${expirationTimestamp?}. Identity is now:"
aws sts get-caller-identity
