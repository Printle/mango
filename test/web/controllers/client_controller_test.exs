defmodule Mango.Web.ClientControllerTest do
  use Mango.Web.ConnCase

  alias Mango.Clients

  @create_attrs %{email: "some email", name: "some name", note: "some note"}
  @update_attrs %{email: "some updated email", name: "some updated name", note: "some updated note"}
  @invalid_attrs %{email: nil, name: nil, note: nil}

  def fixture(:client) do
    {:ok, client} = Clients.create_client(@create_attrs)
    client
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, client_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing Clients"
  end

  test "renders form for new clients", %{conn: conn} do
    conn = get conn, client_path(conn, :new)
    assert html_response(conn, 200) =~ "New Client"
  end

  test "creates client and redirects to show when data is valid", %{conn: conn} do
    conn = post conn, client_path(conn, :create), client: @create_attrs

    assert %{id: id} = redirected_params(conn)
    assert redirected_to(conn) == client_path(conn, :show, id)

    conn = get conn, client_path(conn, :show, id)
    assert html_response(conn, 200) =~ "Show Client"
  end

  test "does not create client and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, client_path(conn, :create), client: @invalid_attrs
    assert html_response(conn, 200) =~ "New Client"
  end

  test "renders form for editing chosen client", %{conn: conn} do
    client = fixture(:client)
    conn = get conn, client_path(conn, :edit, client)
    assert html_response(conn, 200) =~ "Edit Client"
  end

  test "updates chosen client and redirects when data is valid", %{conn: conn} do
    client = fixture(:client)
    conn = put conn, client_path(conn, :update, client), client: @update_attrs
    assert redirected_to(conn) == client_path(conn, :show, client)

    conn = get conn, client_path(conn, :show, client)
    assert html_response(conn, 200) =~ "some updated email"
  end

  test "does not update chosen client and renders errors when data is invalid", %{conn: conn} do
    client = fixture(:client)
    conn = put conn, client_path(conn, :update, client), client: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit Client"
  end

  test "deletes chosen client", %{conn: conn} do
    client = fixture(:client)
    conn = delete conn, client_path(conn, :delete, client)
    assert redirected_to(conn) == client_path(conn, :index)
    assert_error_sent 404, fn ->
      get conn, client_path(conn, :show, client)
    end
  end
end
