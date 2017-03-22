defmodule Mango.Clients.Todo.Status do
  @behaviour Ecto.Type
  def type, do: :integer

  @statuses [:waiting, :printing, :processing, :completed]

  def cast(str) when is_binary(str), do: str |> String.to_atom |> cast
  def cast(status) when status in @statuses, do: {:ok, status}
  def cast(_), do: :error


  def load("a"), do:  {:ok, :waiting}
  def load("b"), do: {:ok, :printing}
  def load("c"), do: {:ok, :processing}
  def load("d"), do: {:ok, :completed}

  def load("waiting"), do:  {:ok, :waiting}
  def load("printing"), do: {:ok, :printing}
  def load("processing"), do: {:ok, :processing}
  def load("completed"), do: {:ok, :completed}

  def load(_), do: :error


  def dump(:waiting), do: {:ok, "a"}
  def dump(:printing), do: {:ok, "b"}
  def dump(:processing), do: {:ok, "c"}
  def dump(:completed), do: {:ok, "d"}
  def dump(_), do: :error
end

defmodule Mango.Clients.Todo do
  use Ecto.Schema

  schema "clients_todos" do
    field :body, :string
    field :status, Mango.Clients.Todo.Status, default: :waiting
    field :priority, :integer, default: 0
    field :due_date, :utc_datetime
    field :price, :integer, default: 0

    belongs_to :client, Mango.Clients.Client

    timestamps()
  end
end
