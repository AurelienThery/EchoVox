FROM ruby:3.2.0-alpine

# Install dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    tzdata \
    nodejs \
    yarn

# Set working directory
WORKDIR /app

# Copy Gemfile and install gems
COPY Gemfile Gemfile.lock* ./
RUN bundle config set --local deployment 'false' && \
    bundle config set --local without 'development test' && \
    bundle install

# Copy the rest of the application
COPY . .

# Precompile assets (if needed)
# RUN bundle exec rake assets:precompile

# Expose port
EXPOSE 3000

# Start the server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
