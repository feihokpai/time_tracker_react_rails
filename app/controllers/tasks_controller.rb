class TasksController < ApplicationController
  before_action :load_task

  def create
    Task.create!(task_group_id: params['task_group_id'], name: params['name'], description: params['description'])
    render json: { status: 200, message: "Task created successfully" }
  rescue StandardError => ex
    puts "error: #{ex.message}"
    render json: { status: 500, message: ex.message }
  end

  def start_timer
    if task_active?
      render json: { error: "Task with id '#{params[:id]}' is already active" }
    else
      time_register = TimeRegister.create!(task: @task, start_time: Time.current)
      render json: { start_time: time_register.start_time }
    end
  rescue StandardError => ex
    render json: { status: 500, message: ex.message }
  end

  def stop_timer
    @task.stop if task_active?
    render json: { message: "Timer stopped" }
  rescue StandardError => ex
    render json: { status: 500, message: "Error trying to stop the task: #{ex.message}" }
  end

  def update
    @task.update!(name: params['name'], description: params['description'], task_group_id: params['task_group_id'])
    render json: { message: "Task edited" }
  rescue StandardError => ex
    puts ex.backtrace[0..10].split("\n")
    render json: { status: 500, message: "Error trying to edit the task: #{ex.message}" }
  end

  def move_order
    @task.task_group.move_up_order(@task) if params['order_type'] == "up"
    @task.task_group.move_down_order(@task) if params['order_type'] == "down"
    render json: { status: 200, message: "Task edited" }
  rescue StandardError => ex
    puts ex.backtrace[0..10].split("\n")
    render json: { status: 500, error: "Error trying to edit the task: #{ex.message}" }
  end

  private

    def load_task
      @task = Task.find(params[:id]) if params[:id].present?
    end

    def task_active?
      @task.start_time.present?
    end
end
