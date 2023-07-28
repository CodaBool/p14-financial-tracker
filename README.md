> Live sample viewable [here](http://p14.codabool.com)
# About
This is a self-host financial tracker. Ideal for single goal tracking with multiple people involved making contributions.
The app is built using Next.js, Mongodb and uses next-auth for authentication.

Open Source and free. Own your own data, and secure it with login based authentication. Deploy it yourself locally or use the Vercel platform combined with MongoDB Atlas.

# Self-host
This project can be self-hosted! Follow the steps below:

## Requirements
- node
- git
- docker

## Clone the project

> `git clone https://github.com/CodaBool/p14-financial-tracker.git`

## Install Dependencies

> `pnpm install`

## Create an .env file and fill all fields

```
# .env
MONGO_URI=
NEXTAUTH_SECRET=
ALLOWLISTED_EMAILS=
NEXTAUTH_URL=
```

## Or use the auto env script
> `./gen_env.sh`

The NEXTAUTH_URL environment variable is used for callbacks and all authentication api calls. If you going to be using outside of localhost this will need to be the full production url e.g. https://mydomain.com

## Create the database
Please keep in mind that this guide sets up a database locally. If you want to instead use a cloud host for the Mongo database, I would recommend Mongo Atlas, they offer a generous free tier. As long as the database is read/wrote to regularly it won't hibernate Make sure to set a strong password, and optionally add the ip of the application to the network allow list.

## Start a MongoDB docker container
This will download the image and start a container of MongoDB on port 27017 using the password of the .env file
skip if you wish to use Mongo Atlas for your database
> `docker-compose up -d`

## Ensure it is running
> `docker ps`

## Start the app
> `npm run build && npm start`

# Use free Tiers
you can deploy this to cloud infrastructure under the free tiers of both Vercel and MongoDB Atlas.
Fork the project and import it into your Vercel account (can use Github Oauth).
Then start a MongoDB cluster and set your connection URI in Vercel as an environment variable.
Set the other three required environment variables of:

```
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://your_vercel_domain.com
MONGO_URI=mongodb+srv://root:password@stat.e1io2.mongodb.net/anythingHere?retryWrites=true&w=majority
ALLOWLISTED_EMAILS=commaSeperated@email.com,another@email.com
```

# Updates
#### 2022
+easy editing of any row data

+new Detailed view for all categories

+short history view by default for main page

+reordered the input row to the top

#### 2023 Q1
+can select year in the detail page

+can see percentage in the doughnut chart

+all packages updated to latest

+removed a couple dependencies in favor of native browser functions (axios, nookies, timeago.js, next-connect)

+added SWR which makes data fetching much nicer

#### 2023 Q3
+completely rewritten in a new styling (goodbye bootstrap!)

+now using tailwind

+now using next.js 13 app directory

+solar tab