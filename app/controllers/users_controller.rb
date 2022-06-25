class UsersController < ApplicationController
  def index
    @users = User.all
  end

  def edit
    load_user
  end

  def update
    load_user
    update_user_with_params
    redirect_after_saving(edit_user_path)
  end

  private

  def load_user
    @user = User.find(params[:id])
  end

  def update_user_with_params
    @user.update!({ name: params[:name], email: params[:email], admin: params[:admin] })
  rescue StandardError => ex
    show_error_on_console(ex)    
    @error = true
    flash[:error] = "Something went wrong: #{ex.message}"
  end

  def show_error_on_console(exception)
    puts "Exception launched: #{exception.message}"
    puts exception.backtrace[0..10]
  end

  def redirect_after_saving(error_path)
    destiny = @error.present? ? error_path : :index
    flash[:success] = "User was successfully saved" if @error.blank?
    redirect_to destiny
  end
end