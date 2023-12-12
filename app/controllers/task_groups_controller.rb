class TaskGroupsController < ApplicationController
  before_action :load_model, except: [:index, :create]

  def index    
    current_user ||= User.first
    task_groups = current_user.ordered_task_groups
    task_groups_as_json = task_groups.map(&:json_version)
    render json: task_groups_as_json
  rescue StandardError => ex
    render json: { status: 500, message: ex.message }
  end

  def update
    @task_group.update!(name: params['name'])
    render json: { status: 200, message: "Task group updated successfully" }
  rescue StandardError => ex
    render json: { status: 500, message: ex.message }
  end

  def create
    TaskGroup.create!(user: User.first, name: params['name'])
    render json: { status: 200, message: "Task group saved successfully" }
    rescue StandardError => ex
      render json: { status: 500, message: ex.message }
  end

  def move_order
    @task_group.user.move_up_order(@task_group) if params['order_type'] == "up"
    @task_group.user.move_down_order(@task_group) if params['order_type'] == "down"
    render json: { status: 200, message: "Task Group edited" }
  rescue StandardError => ex
    puts ex.backtrace[0..10].split("\n")
    render json: { status: 500, error: "Error trying to edit the task group: #{ex.message}" }
  end

  private

  def load_model
    @task_group = TaskGroup.find(params[:id])
  end
end
