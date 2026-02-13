Rails.application.routes.draw do
  # Health check
  get '/health', to: 'application#health'
  
  # Authentication
  post '/auth/register', to: 'authentication#register'
  post '/auth/login', to: 'authentication#login'
  
  # Documents
  resources :documents do
    member do
      post :simplify
    end
  end
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  
  # Defines the root path route ("/")
  # root "articles#index"
end
