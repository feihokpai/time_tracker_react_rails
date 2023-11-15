class TasksController < ApplicationController
  before_action :load_task

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
    render json: { error: "Error trying to stop the task: #{ex.message}" }
  end

  def update
    @task.update!(name: params['name'], description: params['description'])
    render json: { message: "Task edited" }
  rescue StandardError => ex
    render json: { error: "Error trying to edit the task: #{ex.message}" }
  end

  private

    def load_task
      @task = Task.find(params[:id])
    end

    def task_active?
      @task.start_time.present?
    end
end
