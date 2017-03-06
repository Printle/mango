defmodule Mango.Clients.Todo do
  use Ecto.Schema

  schema "clients_todos" do
    field :body, :string
    field :status, :string, default: "waiting"
    field :priority, :integer, default: 0
    field :due_date, :utc_datetime
    field :price, :integer, default: 0

    belongs_to :client, Mango.Clients.Client

    timestamps()
  end
end
