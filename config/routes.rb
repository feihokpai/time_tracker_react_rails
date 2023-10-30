Rails.application.routes.draw do
  devise_for :users
  
  get "/admin", to: "users#index"
  resources :users, only: [:new, :create, :edit, :update]

  get "/task_groups", to: "task_groups#index"
  post "/tasks/:id/start", to: "tasks#start_timer"

  root to: "home#index"
end
