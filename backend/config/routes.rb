Rails.application.routes.draw do
  devise_for :users,
    path: '',
    path_names: {
      sign_in: 'login',
      sign_out: 'logout',
      registration: 'signup'
    },
    controllers: {
      sessions: 'sessions',
      registrations: 'registrations'
    }

  namespace :api do
    namespace :v1 do
      resources :documents, only: [:index, :show, :create] do
        collection do
          post :process
        end
      end
    end
  end
end
