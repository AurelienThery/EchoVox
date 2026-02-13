class JsonWebToken
  SECRET_KEY = Rails.application.credentials.secret_key_base || ENV['SECRET_KEY_BASE'] || begin
    # Only use fallback in development/test environments
    if Rails.env.production?
      raise 'SECRET_KEY_BASE must be set in production environment'
    end
    'echovox_secret_key_development'
  end
  
  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end
  
  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new decoded
  end
end
