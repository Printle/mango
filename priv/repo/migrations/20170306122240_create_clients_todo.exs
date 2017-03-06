defmodule Mango.Repo.Migrations.CreateMango.Clients.Todo do
  use Ecto.Migration

  def change do
    create table(:clients_todos) do
      add :body, :string
      add :status, :string
      add :priority, :integer
      add :due_date, :utc_datetime
      add :price, :integer
      add :client_id, references(:clients_clients, on_delete: :nothing)

      timestamps()
    end
    create index(:clients_todos, [:client_id])

  end
end
