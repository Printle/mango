defmodule Mango.Web.TodoView do
  use Mango.Web, :view
  def format_date(%DateTime{} = date) do
    date |> DateTime.to_string |> String.slice(0..9)
  end
end
