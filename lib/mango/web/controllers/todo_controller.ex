defmodule Mango.Web.TodoController do
  use Mango.Web, :controller

  alias Mango.Clients

  def index(conn, _params) do
    todos = Clients.list_todos()
    render(conn, "index.html", todos: todos)
  end

  def new(conn, %{"client" => client_id} = _params) do
    client = Clients.get_client! client_id
    changeset = Clients.change_todo(%Mango.Clients.Todo{})
    render(conn, "new.html", changeset: changeset, client: client)
  end

  def create(conn, %{"todo" => todo_params, "client" => client_id}) do
    client = Clients.get_client! client_id
    case Clients.create_todo(client, todo_params) do
      {:ok, todo} ->
        conn
        |> put_flash(:info, "Todo created successfully.")
        |> redirect(to: todo_path(conn, :show, todo))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    todo = Clients.get_todo!(id)
    render(conn, "show.html", todo: todo)
  end

  def edit(conn, %{"id" => id}) do
    todo = Clients.get_todo!(id)
    changeset = Clients.change_todo(todo)
    render(conn, "edit.html", todo: todo, changeset: changeset)
  end

  def update(conn, %{"id" => id, "todo" => todo_params}) do
    todo = Clients.get_todo!(id)

    case Clients.update_todo(todo, todo_params) do
      {:ok, todo} ->
        conn
        |> put_flash(:info, "Todo updated successfully.")
        |> redirect(to: todo_path(conn, :show, todo))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", todo: todo, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    todo = Clients.get_todo!(id)
    {:ok, _todo} = Clients.delete_todo(todo)

    conn
    |> put_flash(:info, "Todo deleted successfully.")
    |> redirect(to: todo_path(conn, :index))
  end
end
