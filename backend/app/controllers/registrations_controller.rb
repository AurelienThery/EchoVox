class RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # Don't automatically sign in after registration
  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        render json: {
          status: { code: 200, message: 'Signed up successfully.' },
          data: {
            user: {
              id: resource.id,
              email: resource.email
            }
          }
        }, status: :ok
      else
        expire_data_after_sign_in!
        render json: {
          status: { code: 200, message: 'Signed up successfully.' },
          data: {
            user: {
              id: resource.id,
              email: resource.email
            }
          }
        }, status: :ok
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      render json: {
        status: { message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Signed up successfully.' },
        data: {
          user: {
            id: resource.id,
            email: resource.email
          }
        }
      }, status: :ok
    else
      render json: {
        status: { message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end
end
