class Document < ApplicationRecord
  belongs_to :user

  validates :content, presence: true
  validates :language, presence: true
  validates :language, inclusion: { in: %w[en es fr de it pt] }

  before_validation :set_default_language

  private

  def set_default_language
    self.language ||= 'en'
  end
end
