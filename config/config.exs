# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :mango,
  ecto_repos: [Mango.Repo]

# Configures the endpoint
config :mango, Mango.Web.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "BySnnN2TBdci0yHYsek5siwczMlvwHZ3PZpc4WZ/SQ+fezqQ6KvSVK9tdIu0OZ3t",
  render_errors: [view: Mango.Web.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Mango.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
