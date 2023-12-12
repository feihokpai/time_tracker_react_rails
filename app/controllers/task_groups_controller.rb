class TaskGroupsController < ApplicationController
  before_action :load_model, except: [:index, :create]

  def index    
    current_user ||= User.first
    task_groups = TaskGroup.where(user: current_user)
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

  private

  def load_model
    @task_group = TaskGroup.find(params[:id])
  end
end
