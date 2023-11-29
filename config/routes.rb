Rails.application.routes.draw do
  devise_for :users
  
  get "/admin", to: "users#index"
  resources :users, only: [:new, :create, :edit, :update]

  get "/task_groups", to: "task_groups#index"
  post "/task_groups/:id/update", to: "task_groups#update"
  post "/tasks/:id/start", to: "tasks#start_timer"
  post "/tasks/:id/stop", to: "tasks#stop_timer"
  post "/tasks/:id/update", to: "tasks#update"
  post "/tasks/create", to: "tasks#create"
  post "/timers/:id/update", to: "time_registers#update"

  root to: "home#index"
end
