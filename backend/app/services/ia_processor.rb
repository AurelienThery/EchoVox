class IaProcessor
  include HTTParty
  
  base_uri ENV['PYTHON_SERVICE_URL'] || 'http://localhost:8000'
  
  def self.process_text(content:, language:)
    response = post('/process', {
      body: {
        text: content,
        language: language
      }.to_json,
      headers: {
        'Content-Type' => 'application/json'
      },
      timeout: 30
    })
    
    if response.success?
      {
        success: true,
        simplified_text: response.parsed_response['simplified_text'],
        pictogram_links: response.parsed_response['pictogram_links'] || {}
      }
    else
      {
        success: false,
        error: response.message,
        simplified_text: content,
        pictogram_links: {}
      }
    end
  rescue StandardError => e
    {
      success: false,
      error: e.message,
      simplified_text: content,
      pictogram_links: {}
    }
  end
end
