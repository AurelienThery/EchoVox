# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create sample user
user = User.create!(
  name: 'Demo User',
  email: 'demo@echovox.com',
  password: 'password123',
  password_confirmation: 'password123'
)

puts "Created user: #{user.email}"

# Create sample documents
Document.create!(
  user: user,
  text: "La Constitution française garantit les droits fondamentaux des citoyens.",
  simplified: "La Constitution est la loi la plus importante de France. Elle protège les droits de tous les citoyens.",
  pictos_json: []
)

Document.create!(
  user: user,
  text: "L'accessibilité numérique permet à tous d'utiliser les services en ligne.",
  simplified: "L'accessibilité numérique aide tout le monde à utiliser Internet.",
  pictos_json: []
)

puts "Created #{Document.count} sample documents"
