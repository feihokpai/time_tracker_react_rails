class AddOrderToTask < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :order, :integer, default: 1
  end
end
