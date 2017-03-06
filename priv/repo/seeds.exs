# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Mango.Repo.insert!(%Mango.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Mango.Clients

{:ok, bob} = Clients.create_client(%{
  name: "Oliver Bøving",
  email: "oliverboving@gmail.com",
  note: "",
})

{:ok, todo1} =
  bob
  |> Clients.create_todo(%{
    body: "Print en cykel"
  })
