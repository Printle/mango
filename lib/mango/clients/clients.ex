defmodule Mango.Clients do
  @moduledoc """
  The boundary for the Clients system.
  """

  import Ecto.{Query, Changeset}, warn: false
  alias Mango.Repo

  alias Mango.Clients.Client

  @doc """
  Returns the list of clients.

  ## Examples

      iex> list_clients()
      [%Client{}, ...]

  """
  def list_clients do
    Repo.all(Client)
  end

  @doc """
  Gets a single client.

  Raises `Ecto.NoResultsError` if the Client does not exist.

  ## Examples

      iex> get_client!(123)
      %Client{}

      iex> get_client!(456)
      ** (Ecto.NoResultsError)

  """
  def get_client!(id), do: Repo.get!(Client, id)

  @doc """
  Creates a client.

  ## Examples

      iex> create_client(client, %{field: value})
      {:ok, %Client{}}

      iex> create_client(client, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_client(attrs \\ %{}) do
    %Client{}
    |> client_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a client.

  ## Examples

      iex> update_client(client, %{field: new_value})
      {:ok, %Client{}}

      iex> update_client(client, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_client(%Client{} = client, attrs) do
    client
    |> client_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Client.

  ## Examples

      iex> delete_client(client)
      {:ok, %Client{}}

      iex> delete_client(client)
      {:error, %Ecto.Changeset{}}

  """
  def delete_client(%Client{} = client) do
    Repo.delete(client)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking client changes.

  ## Examples

      iex> change_client(client)
      %Ecto.Changeset{source: %Client{}}

  """
  def change_client(%Client{} = client) do
    client_changeset(client, %{})
  end

  defp client_changeset(%Client{} = client, attrs) do
    client
    |> cast(attrs, [:name, :email, :note])
    |> validate_required([:name, :email])
  end

  def get_todos_for(%Client{} = client) do
    Repo.all Ecto.assoc(client, :todos)
  end

  alias Mango.Clients.Todo

  @doc """
  Returns the list of todos.

  ## Examples

      iex> list_todos()
      [%Todo{}, ...]

  """
  def list_todos do
    Repo.all from t in Todo, preload: :client
  end

  @doc """
  Gets a single todo.

  Raises `Ecto.NoResultsError` if the Todo does not exist.

  ## Examples

      iex> get_todo!(123)
      %Todo{}

      iex> get_todo!(456)
      ** (Ecto.NoResultsError)

  """
  def get_todo!(id), do: Repo.get!(Todo, id) |> Repo.preload(:client)

  @doc """
  Creates a todo.

  ## Examples

      iex> create_todo(todo, %{field: value})
      {:ok, %Todo{}}

      iex> create_todo(todo, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_todo(%Client{} = client, attrs \\ %{}) do
    %Todo{}
    |> todo_changeset(attrs)
    |> Ecto.Changeset.put_assoc(:client, client)
    |> Repo.insert()
  end

  @doc """
  Updates a todo.

  ## Examples

      iex> update_todo(todo, %{field: new_value})
      {:ok, %Todo{}}

      iex> update_todo(todo, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_todo(%Todo{} = todo, attrs) do
    todo
    |> todo_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Todo.

  ## Examples

      iex> delete_todo(todo)
      {:ok, %Todo{}}

      iex> delete_todo(todo)
      {:error, %Ecto.Changeset{}}

  """
  def delete_todo(%Todo{} = todo) do
    Repo.delete(todo)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking todo changes.

  ## Examples

      iex> change_todo(todo)
      %Ecto.Changeset{source: %Todo{}}

  """
  def change_todo(%Todo{} = todo) do
    todo_changeset(todo, %{})
  end

  defp todo_changeset(%Todo{} = todo, attrs) do
    todo
    |> cast(attrs, [:body, :status, :priority, :due_date, :price])
    |> validate_required([:body, :status, :priority, :price])
  end
end
