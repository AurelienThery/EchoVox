class DocumentsController < ApplicationController
  before_action :set_document, only: [:show, :update, :destroy]
  
  # GET /documents
  def index
    @documents = current_user.documents.order(created_at: :desc)
    render json: @documents
  end
  
  # GET /documents/:id
  def show
    render json: @document
  end
  
  # POST /documents
  def create
    @document = current_user.documents.build(document_params)
    
    # Call Python microservice to simplify text and get pictograms
    if params[:auto_simplify]
      simplification_result = simplify_text(@document.text, params[:locale] || 'en')
      @document.simplified = simplification_result[:simplified_text] if simplification_result
      @document.pictos_json = simplification_result[:pictograms] if simplification_result
    end
    
    if @document.save
      render json: @document, status: :created
    else
      render json: { errors: @document.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PATCH/PUT /documents/:id
  def update
    if @document.update(document_params)
      render json: @document
    else
      render json: { errors: @document.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /documents/:id
  def destroy
    @document.destroy
    head :no_content
  end
  
  # POST /documents/:id/simplify
  def simplify
    set_document
    result = simplify_text(@document.text, params[:locale] || 'en')
    
    if result
      @document.update(simplified: result[:simplified_text], pictos_json: result[:pictograms])
      render json: @document
    else
      render json: { errors: 'Failed to simplify text' }, status: :unprocessable_entity
    end
  end
  
  private
  
  def set_document
    @document = current_user.documents.find(params[:id])
  end
  
  def document_params
    params.require(:document).permit(:text, :simplified, pictos_json: [])
  end
  
  def simplify_text(text, locale)
    python_service_url = ENV['PYTHON_SERVICE_URL'] || 'http://python-service:8000'
    
    begin
      response = HTTParty.post(
        "#{python_service_url}/simplify",
        body: { text: text, locale: locale }.to_json,
        headers: { 'Content-Type' => 'application/json' },
        timeout: 30
      )
      
      if response.success?
        JSON.parse(response.body, symbolize_names: true)
      else
        Rails.logger.error("Python service error: #{response.code} - #{response.body}")
        nil
      end
    rescue => e
      Rails.logger.error("Error calling Python service: #{e.message}")
      nil
    end
  end
end
