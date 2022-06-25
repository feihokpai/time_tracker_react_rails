Rails.application.routes.draw do
  devise_for :users
  
  get "/admin", to: "users#index"
  resources :users, only: [:new, :create, :edit, :update]

  root to: "home#index"
end
