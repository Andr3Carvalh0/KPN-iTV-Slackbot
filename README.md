# Frits

##### Getting started

Super easy! You just need to clone the repository 🙃.

#### Configuration

In the root project you will find a `configuration` folder. Inside, you will also need to create a `configuration.json`
file. The file must include:

```
{
	"ADMIN_SIGNING_SECRET": "${Token used to authenticate the admin/debug requests. You can pick anything},
	"ANDROID_TV_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"APP_STORE_APPLICATION_ID": "${The app store application id. eg: 453092149}",
	"APPS_TEAM_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"BASE_URL": "${The url to the server location. If running locally it would be: localhost:3000/}",
	"BIG_QUERY_ANDROID_TABLE_ID": "${Table id. eg: com_kpn_epg_ANDROID}",
	"BIG_QUERY_IOS_TABLE_ID": "${Table id. eg: com_kpn_epg_ANDROID}",
	"BIG_QUERY_PROJECT_ID": "${Project id. eg: kpnproposal}",
	"BIG_QUERY_TABLE_SOURCE": "${Table source. eg: firebase_crashlytics}",
	"BUILDS_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"BUILD_COMMAND_TOKEN": "${Token that you can get on slack. eg: XXXXXXXXXXXXXXXXXXXXXXXX}",
	"DISABLE_ANALYTICS_REPORTS": ${true | false},
	"DISABLE_ANDROID_BIG_QUERY": ${true | false},
	"DISABLE_IOS_BIG_QUERY": ${true | false},
	"DISABLE_FIREBASE_REPORTS": ${true | false},
	"DISABLE_FRIDAY_REPORTS": ${true | false},
	"DRY_RUN": ${true | false},
	"ERRORS_FILE": "${Full path to the errors file}",
	"FIREBASE_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"FIREBASE_MESSAGES_CHANNEL": "${Channel id of where the firebase messages are posted. eg: XXXXXXXXXXX}",
	"GITLAB_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"GIPHY_KEY": "${Token to giphy. eg: AB1UjEV3NyHsGaBnH0J7DjG7}",
	"HALO_ENDPOINT": "${Halo url. eg: https://halo-db.com}",
	"HALO_USER": "${User id}",
	"HALO_PASSWORD": "${User token}",
	"HTTP_PROTOCOL": ${"http" | "https"},
	"IOS_RELEASE_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"IOS_REVIEWS_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"IS_PRODUCTION": ${true | false},
	"JENKINS_URL": "${URL that points to Jenkins. eg: https://jenkinscd.itv.local}",
	"JIRA_URL": "${URL that points to Jira. eg: https://jira.kpn.org/browse/}",
	"JIRA_US_PATTERN": "${Regex pattern that would match a Jira ticket. eg: KPN-([0-9])\\d+}",
	"LOGS_FILE": "${Full path to the logs file}",
	"PLAY_STORE_APPLICATION_ID": "${The Android app id. eg: com.kpn.epg}",
	"RELEASE_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"REVIEWS_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"S3_BUCKET_ID": "${S3 Bucket ID. eg: com.kpn.aws.np.tvapps.android}",
	"SIGNING_SECRET": "${Token used to authenticate the normal requests. You can pick anything},
	"SLACK_SIGNING_SECRET": "${Token used to authenticate the slack bot requests.},
	"SLACK_TOKEN": "${Token of the bot that can read the firebase messages. eg: xoxb-XXXXXXXXXXXX-1267677649622-XXXXXXXXXXXXXXXXXXXXXXXX}",
	"TEAMS_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"TESTS_CHANNEL": "${Webhook value or channel id to post messages. eg: T4V9UKUTB/B01A23PGG9E/ABABABABABABABABABABAB or ABABABABABA for a webhook or channel id, respectably}",
	"USE_MACHINE_LEARNING": ${true | false},
	"USE_AMAZON_S3_TO_STORE_DATABASES": ${true | false},
	"USE_GOOGLE_TO_GENERATE_QR": ${true | false},
	"USE_PLAY_STORE_OAUTH_TO_FETCH_REVIEWS": ${true | false}
}
```

This will indicate most of ours configurable variables (dah). Besides the `configuration.json` file you will also need
to add some other files to the `secrets` folder. For the reporting of the `weekly analytics` there is a need of 2 keys,
one of which is optional:

1. Gmail account. To get the friday reports, `DataStudio` doesn't have an API we can use, so to get the information we
   process the weekly PDF that's sent. And to obtain that PDF we just listen for it in a Gmail account. That's why we
   need a Gmail Developer Key. You can obtain one [here](https://developers.google.com/gmail/api) and after that save it
   in `configuration/secrets/gmail_credentials.json`. On 1st launch after that, you will asked to authenticate, just
   follow the instructions and you will be fine 😄
2. [Optional] Big Query. This is the place where we can fetch all the crash related stuff, so we can calculate our
   weekly crash rate. You can find this information via the Firebase console. After you have obtained the credentials,
   save them to `configuration/secrets/big_query_credentials.json`

If you intend to be able to reply to Play Store reviews/have access to all the reviews published, you will need access
to the Play Store Keys.

1. [Optional] You can control to fetch the Play Store reviews either by scrapping the Play Store page, or you can use
   Google's API. You can control it with the flag `USE_PLAY_STORE_OAUTH_TO_FETCH_REVIEWS` in the configuration file. If
   you opt to use Google's API you will need credentials for it, that can be downloaded in the Play Console. After that,
   save them in `configuration/secrets/play_store_credentials.json`

The last secret file, is about emails...

1. [Optional] Release email. When a request is made to the `release` endpoint we will try to send an email about it. To
   configure the sender, to, cc. You can create a file with the following template
   in `configuration/secrets/release_email_secrets.json`:

```
{
	"from": {
		"name": "Test",
		"address": "test@gmail.com"
	},
	"to": [
		"email1@gmail.com",
		"email2@gmail.com"
	],
	"cc": [
		"email3@gmail.com",
		"email4@gmail.com"
	]
}
```

##### Starting up

After you have configures all the keys, you can start up the server by running `npm start`. If not specified the server
will boot up and start listening on port `3000`.

##### Others

Besides a server, on this repository you can find a folder called `others`. In it, you can find a bunch of scripts that
make the life of the developers easier (like the script you used to clone this repo for example).