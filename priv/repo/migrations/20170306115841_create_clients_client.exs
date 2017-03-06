defmodule Mango.Repo.Migrations.CreateMango.Clients.Client do
  use Ecto.Migration

  def change do
    create table(:clients_clients) do
      add :name, :string
      add :email, :string
      add :note, :string

      timestamps()
    end

  end
end
