defmodule Mango.Web.PageController do
  use Mango.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
