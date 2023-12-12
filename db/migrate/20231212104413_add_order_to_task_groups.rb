class AddOrderToTaskGroups < ActiveRecord::Migration[7.1]
  def change
    add_column :task_groups, :order, :integer, default: 1
  end
end
