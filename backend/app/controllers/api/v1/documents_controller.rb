module Api
  module V1
    class DocumentsController < ApplicationController
      before_action :authenticate_user!

      def index
        @documents = current_user.documents.order(created_at: :desc)
        render json: @documents
      end

      def show
        @document = current_user.documents.find(params[:id])
        render json: @document
      end

      def process
        content = params[:content]
        language = params[:language] || 'en'

        # Save the original document
        @document = current_user.documents.new(
          content: content,
          language: language
        )

        if @document.save
          # Process with Python service
          result = IaProcessor.process_text(
            content: content,
            language: language
          )

          # Update document with processed data
          @document.update(
            simplified_content: result[:simplified_text],
            pictogram_links: result[:pictogram_links]
          )

          render json: {
            status: 'success',
            document: {
              id: @document.id,
              content: @document.content,
              simplified_content: @document.simplified_content,
              language: @document.language,
              pictogram_links: @document.pictogram_links
            }
          }, status: :ok
        else
          render json: {
            status: 'error',
            errors: @document.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end
end
