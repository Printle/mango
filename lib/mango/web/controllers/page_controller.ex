defmodule Mango.Web.PageController do
  use Mango.Web, :controller
  alias Mango.Clients

  def index(conn, _params) do
    todos = Clients.list_todos

    render conn, "index.html",
      todos: todos
  end
end
