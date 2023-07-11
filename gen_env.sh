#!/bin/bash
# This is an automated script to help with creating the .env file

# these lines setup the mongo connection uri
MONGO_PASS=$(echo $RANDOM | md5sum | head -c 20; echo;)
mongoStartLine="mongodb+srv://root:"
mongoEndLine="@localhost:27017/finances?retryWrites=true&w=majority"

# this creates a next-auth secret which secures the authentication of the app
AUTH_SECRET=$(echo $RANDOM | md5sum | head -c 20; echo;)

# allows user input for allow listed emails
read -p "Enter a comma seperated list of emails to allow signup access (example@email.com,another@email.com): " allowList

# print out the written values
printf "\nWriting to .env with below values\n\n"
echo "MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASS"
echo "MONGO_URI=$mongoStartLine$MONGO_PASS$mongoEndLine"
echo "NEXTAUTH_SECRET=$AUTH_SECRET"
echo "ALLOWLISTED_EMAILS=$allowList"
echo "NEXTAUTH_URL=http://localhost:3000"

echo "MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASS"  > .env
echo "MONGO_URI=$mongoStartLine$MONGO_PASS$mongoEndLine"  >> .env
echo "NEXTAUTH_SECRET=$AUTH_SECRET"  >> .env
echo "ALLOWLISTED_EMAILS=$allowList"  >> .env
echo "NEXTAUTH_URL=http://localhost:3000"  >> .env