## Discord + Untappd = ❣️

A friendly neighbourhood bot that allows you to show off your recent beers within your Discord Server. Cheers 🍺

#### Features:

* `!lb` - Latest Beer. Show off your latest check in (Is it a banger?).
* `!profile` - Profile. Bring up your Untappd profile. Show off that badge count!
* `!fb` - Find Beer. Not sure whether to buy that beer? Try searching for it.
* `!fridge` - Fridge. Share your list Untappd list.
* `!beerme` - Struggling to decide what to drink next? Take a chance and let the bot choose for you!

#### Technologies

* Node.js (v.12.16.2)
* DiscordJS (v.12)
* Docker

#### Getting Started

Create a new Discord Application and add it to your server - https://discord.com/developers/applications

The bot will require an access token to authenticate with your server. The token can be found under the applications page within the Discord developer portal.

Build the bot (Docker):
`docker build -t <insert name here> .`

Start the bot:

The -e flag denotes an environment variable for the Discord access token. The image name is the name of the Docker image that was created in the previous example.

`docker run --rm -it -e <token> <image name>`

e.g.

`docker run --rm -it -e TOKEN=1234567890ABCD discord_bot:latest`
