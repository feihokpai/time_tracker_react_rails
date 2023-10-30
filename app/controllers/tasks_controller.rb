class TasksController < ApplicationController
  def start_timer
    if task_active?
      render json: { error: "Task with id '#{params[:id]}' is already active" }
    else
      time_register = TimeRegister.create!(task: @task, start_time: Time.current)
      render json: { start_time: time_register.start_time }
    end
  end

  private

    def task_active?
      @task = Task.find(params[:id])
      @task.start_time.present?
    end
end
