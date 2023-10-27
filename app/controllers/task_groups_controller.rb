class TaskGroupsController < ApplicationController
  def index    
    current_user ||= User.first
    task_groups = TaskGroup.where(user: current_user)
    task_groups_as_json = task_groups.map(&:as_json_with_tasks)
    render json: task_groups_as_json
  end
end