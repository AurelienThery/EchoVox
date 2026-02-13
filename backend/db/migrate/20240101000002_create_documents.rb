class CreateDocuments < ActiveRecord::Migration[7.0]
  def change
    create_table :documents do |t|
      t.references :user, null: false, foreign_key: true
      t.text :text, null: false
      t.text :simplified
      t.json :pictos_json, default: []

      t.timestamps
    end
    
    add_index :documents, :created_at
  end
end
