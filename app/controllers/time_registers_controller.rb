class TimeRegistersController < ApplicationController
  before_action :load_timer

  def update    
    start_time = DateTime.parse(params['start_time']) if params['start_time'].present?
    finish_time = DateTime.parse(params['finish_time']) if params['finish_time'].present?
    @time_register.update!(start_time:, finish_time:)
    render json: { message: "Timer with id #{@time_register.id} from task '#{@time_register.task.name}' updated" }
  rescue StandardError => ex
    render json: { error: "Error trying to update the task: #{ex.message}" }    
  end

  private

    def load_timer
      @time_register = TimeRegister.find(params[:id])
    end
end
