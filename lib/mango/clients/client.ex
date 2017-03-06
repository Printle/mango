defmodule Mango.Clients.Client do
  use Ecto.Schema

  schema "clients_clients" do
    field :name, :string
    field :email, :string
    field :note, :string, default: ""

    has_many :todos, Mango.Clients.Todo

    timestamps()
  end
end
