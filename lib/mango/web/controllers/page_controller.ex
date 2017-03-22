defmodule Mango.Web.PageController do
  use Mango.Web, :controller
  alias Mango.Clients

  def index(conn, opts \\ %{}) do
    opts = %{show_completed: false} |> Map.merge(%{
      show_completed: opts["show_completed"]
    })

    todos = Clients.list_todos opts

    render conn, "index.html",
      todos: todos
  end
end
