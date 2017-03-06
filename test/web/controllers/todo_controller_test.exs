defmodule Mango.Web.TodoControllerTest do
  use Mango.Web.ConnCase

  alias Mango.Clients

  @create_attrs %{body: "some body", due_date: %{day: 17, hour: 14, minute: 0, month: 4, second: 0, year: 2010}, price: 42, priority: 42, status: "some status"}
  @update_attrs %{body: "some updated body", due_date: %{day: 18, hour: 15, minute: 1, month: 5, second: 1, year: 2011}, price: 43, priority: 43, status: "some updated status"}
  @invalid_attrs %{body: nil, due_date: nil, price: nil, priority: nil, status: nil}

  def fixture(:todo) do
    {:ok, todo} = Clients.create_todo(@create_attrs)
    todo
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, todo_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing Todos"
  end

  test "renders form for new todos", %{conn: conn} do
    conn = get conn, todo_path(conn, :new)
    assert html_response(conn, 200) =~ "New Todo"
  end

  test "creates todo and redirects to show when data is valid", %{conn: conn} do
    conn = post conn, todo_path(conn, :create), todo: @create_attrs

    assert %{id: id} = redirected_params(conn)
    assert redirected_to(conn) == todo_path(conn, :show, id)

    conn = get conn, todo_path(conn, :show, id)
    assert html_response(conn, 200) =~ "Show Todo"
  end

  test "does not create todo and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, todo_path(conn, :create), todo: @invalid_attrs
    assert html_response(conn, 200) =~ "New Todo"
  end

  test "renders form for editing chosen todo", %{conn: conn} do
    todo = fixture(:todo)
    conn = get conn, todo_path(conn, :edit, todo)
    assert html_response(conn, 200) =~ "Edit Todo"
  end

  test "updates chosen todo and redirects when data is valid", %{conn: conn} do
    todo = fixture(:todo)
    conn = put conn, todo_path(conn, :update, todo), todo: @update_attrs
    assert redirected_to(conn) == todo_path(conn, :show, todo)

    conn = get conn, todo_path(conn, :show, todo)
    assert html_response(conn, 200) =~ "some updated body"
  end

  test "does not update chosen todo and renders errors when data is invalid", %{conn: conn} do
    todo = fixture(:todo)
    conn = put conn, todo_path(conn, :update, todo), todo: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit Todo"
  end

  test "deletes chosen todo", %{conn: conn} do
    todo = fixture(:todo)
    conn = delete conn, todo_path(conn, :delete, todo)
    assert redirected_to(conn) == todo_path(conn, :index)
    assert_error_sent 404, fn ->
      get conn, todo_path(conn, :show, todo)
    end
  end
end
