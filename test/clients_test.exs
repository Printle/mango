defmodule Mango.ClientsTest do
  use Mango.DataCase

  alias Mango.Clients
  alias Mango.Clients.Client

  @create_attrs %{email: "some email", name: "some name", note: "some note"}
  @update_attrs %{email: "some updated email", name: "some updated name", note: "some updated note"}
  @invalid_attrs %{email: nil, name: nil, note: nil}

  def fixture(:client, attrs \\ @create_attrs) do
    {:ok, client} = Clients.create_client(attrs)
    client
  end

  test "list_clients/1 returns all clients" do
    client = fixture(:client)
    assert Clients.list_clients() == [client]
  end

  test "get_client! returns the client with given id" do
    client = fixture(:client)
    assert Clients.get_client!(client.id) == client
  end

  test "create_client/1 with valid data creates a client" do
    assert {:ok, %Client{} = client} = Clients.create_client(@create_attrs)
    
    assert client.email == "some email"
    assert client.name == "some name"
    assert client.note == "some note"
  end

  test "create_client/1 with invalid data returns error changeset" do
    assert {:error, %Ecto.Changeset{}} = Clients.create_client(@invalid_attrs)
  end

  test "update_client/2 with valid data updates the client" do
    client = fixture(:client)
    assert {:ok, client} = Clients.update_client(client, @update_attrs)
    assert %Client{} = client
    
    assert client.email == "some updated email"
    assert client.name == "some updated name"
    assert client.note == "some updated note"
  end

  test "update_client/2 with invalid data returns error changeset" do
    client = fixture(:client)
    assert {:error, %Ecto.Changeset{}} = Clients.update_client(client, @invalid_attrs)
    assert client == Clients.get_client!(client.id)
  end

  test "delete_client/1 deletes the client" do
    client = fixture(:client)
    assert {:ok, %Client{}} = Clients.delete_client(client)
    assert_raise Ecto.NoResultsError, fn -> Clients.get_client!(client.id) end
  end

  test "change_client/1 returns a client changeset" do
    client = fixture(:client)
    assert %Ecto.Changeset{} = Clients.change_client(client)
  end
end
