class CreateDocuments < ActiveRecord::Migration[7.0]
  def change
    create_table :documents do |t|
      t.text :content
      t.text :simplified_content
      t.string :language
      t.references :user, null: false, foreign_key: true
      t.json :pictogram_links, default: {}

      t.timestamps
    end

    add_index :documents, :language
    add_index :documents, :created_at
  end
end
