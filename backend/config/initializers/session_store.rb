Rails.application.config.session_store :cookie_store, key: '_echovox_session'
Rails.application.config.middleware.use ActionDispatch::Cookies
Rails.application.config.middleware.use Rails.application.config.session_store, Rails.application.config.session_options
