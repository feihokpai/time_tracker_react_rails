Rails.application.routes.draw do
  devise_for :users
  
  get "/admin", to: "users#index"
  resources :users, only: [:new, :create, :edit, :update]

  get "/task_groups", to: "task_groups#index"
  post "/task_groups/:id/update", to: "task_groups#update"
  post "/task_groups/create", to: "task_groups#create"
  post "/task_groups/:id/move", to: "task_groups#move_order"
  post "/tasks/:id/start", to: "tasks#start_timer"
  post "/tasks/:id/stop", to: "tasks#stop_timer"
  post "/tasks/:id/update", to: "tasks#update"
  post "/tasks/create", to: "tasks#create"
  post "/tasks/:id/move", to: "tasks#move_order"
  post "/timers/:id/update", to: "time_registers#update"

  root to: "home#index"
end
